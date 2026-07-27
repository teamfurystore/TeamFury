# Requirements Document

## Introduction

This feature migrates the Team Fury Next.js admin authentication system from legacy API keys to JWT-based authentication using Supabase Auth. Currently the system issues a `sb-access-token` cookie after a successful password login and passes it as a `Bearer` token to Supabase on every API call. The goal is to ensure the entire session lifecycle — login, middleware protection, API route guards, client-side 401 handling, and logout — is consistently backed by Supabase-issued JWTs, with legacy API key paths removed entirely.

## Glossary

- **JWT**: JSON Web Token — a signed, self-contained token issued by Supabase Auth after a successful sign-in, containing the user identity and expiry claim.
- **Supabase_Auth**: The Supabase authentication service that issues, validates, and refreshes JWTs.
- **Admin_Login_Page**: The `/admin` page where admins submit email and password credentials.
- **Middleware**: The Next.js Edge middleware (`middleware.ts`) that protects `/admin/dashboard/*` routes.
- **Auth_Cookie**: The HTTP cookie named `sb-access-token` that stores the JWT in the browser.
- **Admin_API**: The set of Next.js API routes under `/api/admin/*` that require an authenticated admin caller.
- **requireAdmin**: The server-side helper function present in Admin_API routes that extracts the JWT from the request cookie and verifies admin role via Supabase.
- **useAdminAuth**: The client-side React hook mounted in the dashboard layout that intercepts fetch responses and redirects to `/admin` on a 401.
- **Session**: The authenticated state created after login, represented by a JWT and its associated refresh token.
- **Role**: The `role` field on the `profiles` Supabase table; must equal `"admin"` to access protected resources.
- **Legacy_API_Key**: Any static, pre-shared API key or non-JWT authentication mechanism that was previously used. Legacy API keys are disabled and must not appear in any new or existing code path.
- **Token_Expiry**: The point in time after which a JWT is no longer valid.

---

## Requirements

### Requirement 1: Admin Login Issues a JWT

**User Story:** As an admin, I want to log in with my email and password so that I receive a valid JWT to access the dashboard.

#### Acceptance Criteria

1. WHEN an admin submits valid credentials on the Admin_Login_Page, THE Supabase_Auth SHALL return a session containing an `access_token` JWT and a `refresh_token`.
2. WHEN a session is successfully returned, THE Admin_Login_Page SHALL store the `access_token` in the Auth_Cookie with `path=/`, `max-age=3600`, and `SameSite=Lax` attributes.
3. WHEN the Auth_Cookie is set, THE Admin_Login_Page SHALL redirect the admin to `/admin/dashboard`.
4. IF the credentials are invalid or Supabase_Auth returns an error, THEN THE Admin_Login_Page SHALL display the error message returned by Supabase_Auth without redirecting.
5. IF the submitted password does not satisfy the minimum complexity rules (at least 8 characters, 1 letter, 1 digit, 1 special character from `!@#$%^&*`), THEN THE Admin_Login_Page SHALL display a descriptive validation error before submitting to Supabase_Auth.
6. THE Admin_Login_Page SHALL NOT accept or process any Legacy_API_Key as a login credential.

---

### Requirement 2: Middleware Validates the JWT on Every Protected Request

**User Story:** As a system operator, I want the Next.js middleware to verify the JWT on every request to the admin dashboard so that unauthenticated or unauthorized users cannot access protected pages.

#### Acceptance Criteria

1. WHILE a request targets a path matching `/admin/dashboard/:path*`, THE Middleware SHALL extract the JWT from the `sb-access-token` cookie.
2. IF the `sb-access-token` cookie is absent, THEN THE Middleware SHALL redirect the request to `/admin`.
3. WHEN a JWT is present, THE Middleware SHALL call `Supabase_Auth.getUser()` with the token to verify its validity and expiry.
4. IF `Supabase_Auth.getUser()` returns an error or no user, THEN THE Middleware SHALL redirect the request to `/admin`.
5. WHEN the user identity is confirmed, THE Middleware SHALL query the `profiles` table and verify the user's Role equals `"admin"`.
6. IF the Role does not equal `"admin"`, THEN THE Middleware SHALL redirect the request to `/admin`.
7. WHEN all checks pass, THE Middleware SHALL forward the request to the Next.js route handler without modification.
8. THE Middleware SHALL NOT recognize or forward requests authenticated via any Legacy_API_Key.

---

### Requirement 3: Admin API Routes Enforce JWT Authentication and Admin Role

**User Story:** As a system operator, I want every Admin_API route to independently verify the caller's JWT and admin role so that API endpoints cannot be accessed without a valid session.

#### Acceptance Criteria

1. WHEN an Admin_API route receives a request, THE requireAdmin helper SHALL extract the JWT from the `cookie` request header using the `sb-access-token=<value>` pattern.
2. IF the `sb-access-token` cookie is absent, THEN THE requireAdmin helper SHALL return `{ ok: false }` without calling Supabase_Auth.
3. WHEN a JWT is extracted, THE requireAdmin helper SHALL call `Supabase_Auth.getUser()` to validate the token.
4. IF `Supabase_Auth.getUser()` returns an error or no user, THEN THE requireAdmin helper SHALL return `{ ok: false }`.
5. WHEN the user is confirmed, THE requireAdmin helper SHALL query the `profiles` table for the user's Role.
6. IF the Role is not `"admin"`, THEN THE requireAdmin helper SHALL return `{ ok: false }`.
7. WHEN `requireAdmin` returns `{ ok: false }`, THE Admin_API route SHALL respond with HTTP 401 and a JSON body `{ "error": "Unauthorized" }`.
8. THE Admin_API routes SHALL NOT accept requests authenticated via any Legacy_API_Key.

---

### Requirement 4: Client-Side 401 Interception Clears the JWT and Redirects

**User Story:** As an admin, I want to be automatically redirected to the login page when my session expires so that I do not remain on the dashboard with a stale token.

#### Acceptance Criteria

1. WHILE the dashboard layout is mounted, THE useAdminAuth hook SHALL intercept all `fetch` responses originating from `/api/admin/*`, `/api/products*`, `/api/contact*`, and `/api/reviews*`.
2. WHEN a fetch response from one of those paths returns HTTP 401, THE useAdminAuth hook SHALL delete the Auth_Cookie by setting `sb-access-token=; path=/; max-age=0`.
3. WHEN the Auth_Cookie is deleted, THE useAdminAuth hook SHALL redirect the admin to `/admin` using `router.replace`.
4. WHEN the dashboard layout unmounts, THE useAdminAuth hook SHALL restore the original `window.fetch` implementation.
5. THE useAdminAuth hook SHALL NOT clear any Legacy_API_Key credentials, as none exist.

---

### Requirement 5: Logout Terminates the Session and Clears the JWT

**User Story:** As an admin, I want to sign out so that my JWT is revoked and removed from the browser.

#### Acceptance Criteria

1. WHEN an admin clicks "Sign out" in the dashboard header, THE DashboardLayout SHALL call `Supabase_Auth.signOut()`.
2. WHEN `Supabase_Auth.signOut()` completes, THE DashboardLayout SHALL delete the Auth_Cookie by setting `sb-access-token=; path=/; max-age=0`.
3. WHEN the Auth_Cookie is deleted, THE DashboardLayout SHALL redirect the admin to `/admin`.
4. THE DashboardLayout SHALL NOT attempt to revoke any Legacy_API_Key during logout.

---

### Requirement 6: Token Expiry Handling

**User Story:** As an admin, I want expired JWTs to be rejected gracefully so that I am prompted to log in again rather than experiencing silent failures.

#### Acceptance Criteria

1. WHEN a JWT has passed its Token_Expiry, THE Middleware SHALL treat `Supabase_Auth.getUser()` returning an error as an invalid session and redirect to `/admin`.
2. WHEN a JWT has passed its Token_Expiry and an Admin_API route is called, THE requireAdmin helper SHALL return `{ ok: false }` and the route SHALL respond with HTTP 401.
3. WHEN the client-side useAdminAuth hook receives HTTP 401 (caused by an expired JWT), THE useAdminAuth hook SHALL clear the Auth_Cookie and redirect to `/admin` as per Requirement 4.
4. THE system SHALL NOT silently extend or re-issue a JWT without the admin re-authenticating, as no refresh token rotation is implemented client-side.

---

### Requirement 7: Removal of Legacy API Key Code Paths

**User Story:** As a system operator, I want all legacy API key authentication code removed so that there are no dead code paths or security risks from disabled credential types.

#### Acceptance Criteria

1. THE codebase SHALL NOT contain any route handler, middleware branch, or utility function that reads, validates, or forwards a Legacy_API_Key.
2. THE codebase SHALL NOT contain any environment variable referencing a Legacy_API_Key (e.g., `API_KEY`, `ADMIN_API_KEY`, `SECRET_KEY` used for request authentication).
3. WHEN a code review is performed, THE codebase SHALL contain only JWT-based authentication paths in all admin-protected routes and middleware.

---

### Requirement 8: Supabase Client Is Initialized with the JWT on Server-Side Requests

**User Story:** As a developer, I want a consistent pattern for creating authenticated Supabase clients in API routes so that Supabase RLS policies are correctly enforced using the caller's JWT.

#### Acceptance Criteria

1. WHEN an Admin_API route constructs a Supabase client to execute database queries, THE dbClient factory SHALL pass the extracted JWT as the `Authorization: Bearer <token>` header in the client options.
2. IF no JWT is available when constructing the client, THE dbClient factory SHALL construct the client without an `Authorization` header.
3. THE dbClient factory SHALL use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables.
4. THE dbClient factory SHALL NOT use a service-role key or any Legacy_API_Key.
5. WHEN the Supabase client is used for storage operations (e.g., image upload to the `Thumbnails` bucket), THE same authenticated client instance SHALL be reused so that RLS policies apply consistently.
