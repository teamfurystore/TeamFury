# Implementation Plan: JWT Authentication

## Overview

Migrate the Team Fury admin panel to a consistent, fully JWT-backed authentication system. The work consolidates duplicated auth helpers into a shared `utils/adminAuth.ts` utility, removes all legacy code, wires the middleware and API routes to that utility, and adds a test suite (Vitest + fast-check) covering all six correctness properties from the design.

## Tasks

- [x] 1. Install test dependencies and configure Vitest
  - Install `vitest`, `@vitest/coverage-v8`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as dev dependencies
  - Create `vitest.config.ts` at the project root with `jsdom` environment, globals, and `@` path alias pointing to the project root
  - Create `vitest.setup.ts` importing `@testing-library/jest-dom`
  - Add `"test": "vitest --run"` and `"test:watch": "vitest"` scripts to `package.json`
  - Create the `__tests__/` directory with placeholder files: `adminAuth.test.ts`, `middleware.test.ts`, `useAdminAuth.test.ts`, `adminLoginPage.test.tsx`
  - _Requirements: (test infrastructure — prerequisite for all test sub-tasks)_

- [x] 2. Create `utils/adminAuth.ts` — shared server-side auth helpers
  - [x] 2.1 Implement `extractToken(cookieHeader: string | null): string | null`
    - Handle plain JWT cookie shape: `sb-access-token=<jwt>`
    - Handle JSON blob cookie shape: `sb-<ref>-auth-token=<url-encoded-JSON>` (newer `@supabase/ssr`)
    - Return `null` when the cookie header is absent or neither pattern matches
    - _Requirements: 3.1, 8.1_

  - [ ]* 2.2 Write property test for `extractToken` (Property 2)
    - **Property 2: Token extraction handles any well-formed cookie header**
    - **Validates: Requirements 3.1, 8.1**
    - Use `fc.string({ minLength: 10 })` for arbitrary token values and `fc.array(fc.tuple(...))` for surrounding cookies; assert `extractToken(header) === token`
    - Run with `numRuns: 100`

  - [ ]* 2.3 Write unit tests for `extractToken` edge cases
    - `null` input → `null`
    - Cookie header with no `sb-access-token` segment → `null`
    - Malformed JSON blob → `null`
    - _Requirements: 3.1_

  - [x] 2.4 Implement `dbClient(req: Request): SupabaseClient`
    - Call `extractToken` on `req.headers.get("cookie")`
    - When a token is present, construct the Supabase client with `Authorization: Bearer <token>` in global headers
    - When no token is present, construct the client without an `Authorization` header
    - Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables; never use a service-role key
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 2.5 Write property test for `dbClient` JWT forwarding (Property 3)
    - **Property 3: dbClient always forwards the JWT when one is present**
    - **Validates: Requirements 8.1**
    - Use `fc.string({ minLength: 10 })` for arbitrary token values; construct a mock `Request` with the token in `cookie` header; capture the `Authorization` header passed to `createClient` and assert it equals `Bearer <token>`
    - Run with `numRuns: 100`

  - [ ]* 2.6 Write unit tests for `dbClient` with no token
    - When no `sb-access-token` cookie is present, the constructed client must have no `Authorization` header
    - _Requirements: 8.2_

  - [x] 2.7 Implement `requireAdmin(req: Request): Promise<{ ok: boolean }>`
    - Return `{ ok: false }` immediately when `extractToken` returns `null` (no Supabase call)
    - Call `supabase.auth.getUser()` via `dbClient(req)`; return `{ ok: false }` on error or no user
    - Query `profiles` table for `role` where `id` equals `userData.user.id`; return `{ ok: false }` on query error or missing row
    - Return `{ ok: true }` only when `profile.role === "admin"` exactly
    - Never throw — all error cases return `{ ok: false }`
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 6.2_

  - [ ]* 2.8 Write property test for non-admin role denial (Property 4)
    - **Property 4: Non-admin role always denied**
    - **Validates: Requirements 2.6, 3.6**
    - Use `fc.string().filter(role => role !== "admin")` for arbitrary non-admin role strings; mock `getUser` to return a valid user and `profiles` query to return the generated role; assert `requireAdmin` returns `{ ok: false }`
    - Run with `numRuns: 100`

  - [ ]* 2.9 Write unit tests for `requireAdmin` additional cases
    - Absent cookie → `{ ok: false }` without calling Supabase
    - `getUser` error → `{ ok: false }`
    - Missing `profiles` row → `{ ok: false }`
    - Valid user + `role === "admin"` → `{ ok: true }`
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Checkpoint — Ensure all `utils/adminAuth.ts` tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Refactor `app/api/admin/products/route.ts` to use shared auth helpers
  - [x] 4.1 Replace local `extractToken`, `dbClient`, and `requireAdmin` implementations with imports from `utils/adminAuth.ts`
    - Remove the three locally defined functions at the top of the file
    - Remove the commented-out legacy `requireAdmin` block (old API-key remnant)
    - Add `import { requireAdmin, dbClient } from "@/utils/adminAuth";`
    - Verify all route handlers (`GET`, `PUT`, `DELETE`) still call `requireAdmin(req)` and `dbClient(req)` — no functional change to route logic
    - _Requirements: 3.1, 3.7, 7.1, 7.3, 8.1, 8.5_

- [x] 5. Refactor `app/api/admin/reviews/route.ts` to use shared auth helpers
  - [x] 5.1 Replace local `extractToken`, `dbClient`, and `requireAdmin` implementations with imports from `utils/adminAuth.ts`
    - Remove the three locally defined functions at the top of the file
    - Add `import { requireAdmin, dbClient } from "@/utils/adminAuth";`
    - Verify all route handlers (`GET`, `POST`, `PATCH`, `DELETE`) still call `requireAdmin(req)` and `dbClient(req)` — no functional change to route logic
    - _Requirements: 3.1, 3.7, 7.1, 7.3, 8.1_

- [x] 6. Update `middleware.ts` to use consistent JWT validation
  - [x] 6.1 Replace inline duplicated auth logic with calls aligned to the shared pattern
    - Note: `middleware.ts` runs on the Edge Runtime — it cannot import from `utils/adminAuth.ts` unless verified Edge-compatible; replicate the `extractToken` logic inline or confirm compatibility
    - Ensure the middleware calls `supabase.auth.getUser(token)` and queries `profiles.role`, redirecting to `/admin` on any failure (fail-closed)
    - Remove any code that references or checks for a Legacy API key
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 6.2 Write unit tests for middleware logic
    - Absent cookie → redirect to `/admin`
    - Valid token + `role === "admin"` → `NextResponse.next()`
    - Valid token + non-admin role → redirect to `/admin`
    - `getUser` error → redirect to `/admin`
    - _Requirements: 2.2, 2.4, 2.6_

- [x] 7. Verify `app/admin/page.tsx` (Admin Login Page)
  - [x] 7.1 Confirm the login page correctly sets the `sb-access-token` cookie and redirects on success
    - The cookie must have `path=/`, `max-age=3600`, `SameSite=Lax`
    - If any of these attributes are missing or incorrect, fix them
    - Confirm no Legacy API key logic is present
    - _Requirements: 1.2, 1.3, 1.6_

  - [ ]* 7.2 Write property test for password complexity gate (Property 1)
    - **Property 1: Password complexity gate always fires before any network call**
    - **Validates: Requirements 1.5**
    - Use `fc.string().filter(s => !meetsComplexity(s))` for arbitrary failing passwords; render the login form, fill in the bad password, submit, and assert `signInWithPassword` was NOT called
    - Extract or inline a `meetsComplexity` helper that mirrors the four rules (≥8 chars, ≥1 letter, ≥1 digit, ≥1 special char from `!@#$%^&*`)
    - Run with `numRuns: 100`

  - [ ]* 7.3 Write unit tests for admin login page behaviour
    - Successful login sets cookie with correct attributes and calls `router.push("/admin/dashboard")`
    - Supabase error displays error message without redirecting
    - Valid credentials do call `signInWithPassword`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 8. Verify `hooks/useAdminAuth.ts` (Client-side 401 interceptor)
  - [x] 8.1 Confirm the hook intercepts 401s for all four monitored URL prefixes and clears the cookie + redirects
    - Monitored prefixes: `/api/admin`, `/api/products`, `/api/contact`, `/api/reviews`
    - Cookie must be cleared by setting `sb-access-token=; path=/; max-age=0`
    - Redirect must use `router.replace("/admin")`
    - Confirm cleanup effect restores original `window.fetch` on unmount
    - Fix any discrepancies with Requirements 4.1–4.4; no Legacy API key credentials to clear
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 8.2 Write property test for 401 interception across all monitored namespaces (Property 5)
    - **Property 5: useAdminAuth intercepts 401s for every monitored API namespace**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Use `fc.oneof` to generate arbitrary paths under `/api/admin/`, `/api/products`, `/api/contact`, `/api/reviews`; render the hook, simulate a fetch to that path returning 401, assert cookie is cleared and `router.replace("/admin")` is called
    - Run with `numRuns: 100`

  - [ ]* 8.3 Write example-based test for fetch restoration after unmount (Property 6)
    - **Property 6: useAdminAuth restores original fetch after unmount**
    - **Validates: Requirements 4.4**
    - Save `window.fetch` before rendering, unmount the hook, assert `window.fetch === originalFetch`

  - [ ]* 8.4 Write unit tests for `useAdminAuth` non-monitored paths
    - A 401 response from a URL not in the monitored prefixes (e.g., `/api/shop/products`) must NOT trigger cookie clearing or redirect
    - _Requirements: 4.1_

- [x] 9. Verify `app/admin/dashboard/layout.tsx` (Logout)
  - [x] 9.1 Confirm the `handleLogout` function calls `supabase.auth.signOut()`, clears the cookie, and redirects
    - Cookie cleared with `sb-access-token=; path=/; max-age=0`
    - Redirect to `/admin` via `router.push`
    - Logout must proceed even if `signOut()` errors (best-effort: cookie is still cleared and redirect still fires)
    - Confirm no Legacy API key credentials are referenced
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 10. Final checkpoint — Ensure all tests pass
  - Run `npm test` and confirm all tests pass with zero failures
  - Ensure all TypeScript diagnostics are clean (`tsc --noEmit`)
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (Properties 1–6 from design)
- Unit tests validate specific examples and edge cases
- `middleware.ts` runs on the Edge Runtime — verify `@supabase/supabase-js` Edge compatibility before importing shared utilities there
