# Design Document — JWT Authentication

## Overview

This document describes the technical design for migrating the Team Fury admin panel to a consistent, fully JWT-backed authentication system using Supabase Auth.

The codebase already has the basic shape of the desired system — `sb-access-token` cookie, `requireAdmin` helper, middleware, `useAdminAuth` hook — but the implementation is fragmented: `extractToken` and `dbClient` are duplicated in every API route file, one remnant of the old API-key pattern survives in a commented block inside `app/api/admin/products/route.ts`, and the `requireAdmin` function is not extracted into a shared utility. This design codifies the authoritative, deduplicated implementation that all components must converge to.

### Goals

- Single shared `extractToken`, `dbClient`, and `requireAdmin` utility in `utils/adminAuth.ts`
- Edge middleware (`middleware.ts`) validates JWT + admin role on every `/admin/dashboard/*` request
- All Admin API routes use the shared `requireAdmin` from the new utility
- `useAdminAuth` hook intercepts 401s from admin-related API paths and clears cookie + redirects
- Logout calls `signOut()`, clears cookie, redirects
- Token expiry is handled gracefully by existing error paths (no separate refresh flow)
- No legacy API-key code in any file

---

## Architecture

The system is a standard Next.js 16 application deployed on Vercel. Authentication is handled entirely by **Supabase Auth** — no custom JWT signing or validation occurs inside the app. The app's responsibility is to:

1. Initiate login via `supabase.auth.signInWithPassword` and persist the returned JWT in a cookie
2. Read that cookie on the server edge (middleware) and on API routes, pass it to Supabase for verification, and check the user's `profiles.role`
3. Detect expired/revoked tokens on the client via 401 interception

```
Browser                     Next.js Edge                  Supabase
──────────                  ───────────                   ────────
Login form ──POST creds──▶  (admin page)
                            supabase.auth.signInWithPassword
                                                    ◀──── session {access_token, refresh_token}
           ◀── cookie ─────
           
/admin/dashboard/...  ────▶ middleware.ts
                            extractToken(cookie)
                            supabase.auth.getUser(token) ▶
                                                    ◀──── user | error
                            profiles.select(role)  ──────▶
                                                    ◀──── role
                            pass | redirect /admin
                            
fetch /api/admin/*   ─────▶ API route
                            requireAdmin(req)
                            extractToken(cookie)
                            supabase.auth.getUser(token) ▶
                                                    ◀──── user | error
                            profiles.select(role)  ──────▶
                                                    ◀──── role
                            { ok: true } | 401

(client) 401 response ────▶ useAdminAuth hook
                            clear cookie, router.replace(/admin)
```

---

## Components and Interfaces

### `utils/adminAuth.ts` — shared server-side auth helpers

This is the primary new file introduced by this feature. It consolidates the duplicated `extractToken`, `dbClient`, and `requireAdmin` functions that currently exist separately in `app/api/admin/products/route.ts` and `app/api/admin/reviews/route.ts`.

```typescript
import { createClient } from "@supabase/supabase-js";

/**
 * Extracts the Supabase access token from the Cookie header.
 * Handles two cookie shapes:
 *   1. Plain JWT:  sb-access-token=<jwt>
 *   2. JSON blob:  sb-<ref>-auth-token=<url-encoded-JSON>  (newer @supabase/ssr)
 */
export function extractToken(cookieHeader: string | null): string | null

/**
 * Creates an authenticated Supabase client that forwards the caller's JWT
 * as an Authorization: Bearer header, enabling RLS enforcement.
 * Falls back to an unauthenticated client when no token is present.
 */
export function dbClient(req: Request) /* SupabaseClient */

/**
 * Returns { ok: true } only when:
 *   - a valid JWT is present in the request cookies
 *   - Supabase confirms the token is not expired/revoked
 *   - the user's profiles.role === "admin"
 * Returns { ok: false } in all other cases without throwing.
 */
export async function requireAdmin(req: Request): Promise<{ ok: boolean }>
```

### `middleware.ts` — Edge route protection

Runs on Vercel's Edge Runtime for every request matching `/admin/dashboard/:path*`. Uses `extractToken` inline (cannot import from `utils/adminAuth.ts` without confirming Edge compatibility) or replicates the same logic. Redirects to `/admin` on any failure.

**Key constraint**: `middleware.ts` runs on the Edge Runtime. `createClient` from `@supabase/supabase-js` is compatible with the Edge, but no Node.js-only imports are allowed.

### `app/admin/page.tsx` — Admin Login Page

Client component. After a successful `signInWithPassword` call:

- Sets `document.cookie = "sb-access-token=<token>; path=/; max-age=3600; SameSite=Lax"`
- Calls `router.push("/admin/dashboard")`

Password complexity validation runs client-side before the Supabase call (existing logic — unchanged).

### `app/admin/dashboard/layout.tsx` — Dashboard Layout

Client component. On mount it calls `useAdminAuth()`. The "Sign out" button calls `handleLogout`:

```typescript
async function handleLogout() {
  await supabase.auth.signOut();
  document.cookie = "sb-access-token=; path=/; max-age=0";
  router.push("/admin");
}
```

### `hooks/useAdminAuth.ts` — Client-side 401 interceptor

Patches `window.fetch` for the lifetime of the layout. Intercepts 401 responses from the following URL prefixes and triggers session cleanup + redirect:

- `/api/admin`
- `/api/products`
- `/api/contact`
- `/api/reviews`

Restores the original `window.fetch` on unmount.

### `app/api/admin/products/route.ts` and `app/api/admin/reviews/route.ts` — Admin API Routes

Both routes import `requireAdmin` and `dbClient` from `utils/adminAuth.ts`. All locally duplicated `extractToken`, `dbClient`, and `requireAdmin` functions are removed. All commented-out legacy API-key branches are deleted.

---

## Data Models

No new database tables or schema changes are required.

### Supabase `profiles` table (existing)

| Column | Type   | Notes                                  |
|--------|--------|----------------------------------------|
| `id`   | `uuid` | FK to `auth.users.id`                  |
| `role` | `text` | Must equal `"admin"` for admin access  |

### Auth Cookie

| Attribute   | Value                       |
|-------------|---------------------------  |
| Name        | `sb-access-token`           |
| Value       | Supabase JWT (`access_token`) |
| `path`      | `/`                         |
| `max-age`   | `3600` (seconds)            |
| `SameSite`  | `Lax`                       |
| `Secure`    | Recommended for production (not currently set — not in scope for this feature) |

### Token Expiry Flow

Supabase-issued JWTs carry a standard `exp` claim. When a token expires:

- Middleware: `supabase.auth.getUser()` returns an error → redirect to `/admin`
- API routes: `requireAdmin` returns `{ ok: false }` → 401 response
- Client: `useAdminAuth` catches the 401 → clears cookie → redirects to `/admin`

No silent refresh is implemented. Re-authentication is required after expiry.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Password complexity gate always fires before any network call

*For any* password string that violates at least one complexity rule (fewer than 8 characters, no letter, no digit, or no special character from `!@#$%^&*`), submitting the login form SHALL reject the input and SHALL NOT invoke `supabase.auth.signInWithPassword`.

**Validates: Requirements 1.5**

---

### Property 2: Token extraction handles any well-formed cookie header

*For any* cookie header string that contains a `sb-access-token=<value>` segment, `extractToken` SHALL return exactly `<value>` and SHALL NOT return `null`.

**Validates: Requirements 3.1, 8.1**

---

### Property 3: dbClient always forwards the JWT when one is present

*For any* HTTP request that has an `sb-access-token` cookie, `dbClient(req)` SHALL construct a Supabase client whose global headers include `Authorization: Bearer <token>` where `<token>` is the value extracted from the cookie.

**Validates: Requirements 8.1**

---

### Property 4: Non-admin role always denied

*For any* role string stored in `profiles.role` that is not exactly `"admin"`, `requireAdmin` SHALL return `{ ok: false }` even when the JWT is valid and the user exists.

**Validates: Requirements 2.6, 3.6**

---

### Property 5: useAdminAuth intercepts 401s for every monitored API namespace

*For any* URL path that begins with `/api/admin`, `/api/products`, `/api/contact`, or `/api/reviews`, a fetch response with status 401 SHALL cause `useAdminAuth` to clear the `sb-access-token` cookie and call `router.replace("/admin")`.

**Validates: Requirements 4.1, 4.2, 4.3**

---

### Property 6: useAdminAuth restores original fetch after unmount

*For any* `window.fetch` reference that exists before the dashboard layout mounts, unmounting the layout SHALL restore `window.fetch` to that exact original reference.

**Validates: Requirements 4.4**

---

## Error Handling

| Scenario | Location | Behaviour |
|---|---|---|
| Missing `sb-access-token` cookie | Middleware | Redirect to `/admin` |
| Missing `sb-access-token` cookie | `requireAdmin` | Return `{ ok: false }` immediately, no Supabase call |
| `getUser()` returns error (expired, revoked, malformed) | Middleware / `requireAdmin` | Middleware redirects; API returns 401 |
| `profiles` row missing or query error | Middleware / `requireAdmin` | Treated as non-admin; redirect / 401 |
| Role ≠ `"admin"` | Middleware / `requireAdmin` | Redirect / 401 |
| Network error calling Supabase from middleware | Middleware | Redirect to `/admin` (fail-closed) |
| Client receives 401 from any monitored API path | `useAdminAuth` | Clear cookie, redirect to `/admin` |
| Login with wrong credentials | `app/admin/page.tsx` | Display error from Supabase, no redirect |
| Login with password failing complexity | `app/admin/page.tsx` | Display descriptive client-side error, no Supabase call |
| `signOut()` call fails | `app/admin/dashboard/layout.tsx` | Cookie is still cleared and redirect still occurs (best-effort) |

**Fail-closed design**: every ambiguous error case (network failure, missing profile, unexpected role) results in denying access. There is no code path that grants access on error.

---

## Testing Strategy

No test framework is currently present in the project (`package.json` has no test runner). The testing strategy below specifies **Vitest** as the test runner (standard for Next.js / TypeScript projects, compatible with the ESM module graph) and **fast-check** as the property-based testing library.

### Setup

```bash
npm install --save-dev vitest @vitest/coverage-v8 fast-check @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest --run",
  "test:watch": "vitest"
}
```

Add `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

### Test File Layout

```
__tests__/
  adminAuth.test.ts         # unit + property tests for utils/adminAuth.ts
  middleware.test.ts        # unit tests for middleware logic
  useAdminAuth.test.ts      # unit + property tests for the hook
  adminLoginPage.test.tsx   # unit + property tests for login form
```

### Property-Based Tests

Each property test uses fast-check with a minimum of **100 iterations**. Each test is tagged with a comment referencing the design property.

**Property 1 — Password complexity gate (Feature: jwt-authentication, Property 1)**

```typescript
// Feature: jwt-authentication, Property 1: Password complexity gate always fires before any network call
fc.assert(
  fc.property(
    fc.string().filter(s => !meetsComplexity(s)),
    async (badPassword) => {
      // render login form, fill in bad password, submit
      // verify signInWithPassword was NOT called
    }
  ),
  { numRuns: 100 }
);
```

**Property 2 — Token extraction (Feature: jwt-authentication, Property 2)**

```typescript
// Feature: jwt-authentication, Property 2: Token extraction handles any well-formed cookie header
fc.assert(
  fc.property(
    fc.string({ minLength: 10 }), // arbitrary JWT value
    fc.array(fc.tuple(fc.string(), fc.string())), // other cookies
    (token, otherCookies) => {
      const header = [...otherCookies.map(([k, v]) => `${k}=${v}`), `sb-access-token=${token}`].join("; ");
      expect(extractToken(header)).toBe(token);
    }
  ),
  { numRuns: 100 }
);
```

**Property 3 — dbClient JWT forwarding (Feature: jwt-authentication, Property 3)**

```typescript
// Feature: jwt-authentication, Property 3: dbClient always forwards the JWT when one is present
fc.assert(
  fc.property(
    fc.string({ minLength: 10 }),
    (token) => {
      const mockReq = { headers: { get: () => `sb-access-token=${token}` } } as unknown as Request;
      const client = dbClient(mockReq);
      // inspect the internal headers via the client's fetch options
      expect(capturedAuthHeader).toBe(`Bearer ${token}`);
    }
  ),
  { numRuns: 100 }
);
```

**Property 4 — Non-admin role denied (Feature: jwt-authentication, Property 4)**

```typescript
// Feature: jwt-authentication, Property 4: Non-admin role always denied
fc.assert(
  fc.property(
    fc.string().filter(role => role !== "admin"),
    async (role) => {
      // mock getUser → valid user; mock profiles query → { role }
      const result = await requireAdmin(mockReq);
      expect(result.ok).toBe(false);
    }
  ),
  { numRuns: 100 }
);
```

**Property 5 — useAdminAuth intercepts monitored namespaces (Feature: jwt-authentication, Property 5)**

```typescript
// Feature: jwt-authentication, Property 5: useAdminAuth intercepts 401s for every monitored API namespace
fc.assert(
  fc.property(
    fc.oneof(
      fc.string().map(s => `/api/admin/${s}`),
      fc.string().map(s => `/api/products${s}`),
      fc.string().map(s => `/api/contact${s}`),
      fc.string().map(s => `/api/reviews${s}`),
    ),
    async (path) => {
      // set up hook, simulate fetch to path returning 401
      // verify cookie cleared and router.replace('/admin') called
    }
  ),
  { numRuns: 100 }
);
```

**Property 6 — Fetch restoration after unmount (Feature: jwt-authentication, Property 6)**

```typescript
// Feature: jwt-authentication, Property 6: useAdminAuth restores original fetch after unmount
// This is an example-based test (the original fetch ref is a single value, no variation needed)
it("restores original window.fetch after unmount", () => {
  const originalFetch = window.fetch;
  const { unmount } = renderHook(() => useAdminAuth());
  unmount();
  expect(window.fetch).toBe(originalFetch);
});
```

### Unit Tests (example-based)

- **`adminAuth.test.ts`**: `extractToken` with absent cookie → `null`; `dbClient` with no token → no Authorization header; `requireAdmin` with absent cookie → `{ ok: false }` without calling Supabase; `requireAdmin` with `getUser` error → `{ ok: false }`; `requireAdmin` with valid user + admin role → `{ ok: true }`
- **`middleware.test.ts`**: absent cookie → redirect; valid token + admin → `NextResponse.next()`; valid token + non-admin role → redirect; `getUser` error → redirect
- **`adminLoginPage.test.tsx`**: successful login sets cookie and calls `router.push`; Supabase error shows error message; valid credentials call `signInWithPassword`
- **`useAdminAuth.test.ts`**: non-monitored paths do NOT trigger redirect on 401; unmount restores fetch

### Integration Tests

Not required for this feature. All Supabase interactions are tested with mocks. End-to-end session flows (real Supabase call → real cookie → real middleware) are verified manually during deployment.
