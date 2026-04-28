// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every API route in the app.
// Import from here — never hardcode paths in components or slices.
// ─────────────────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_FURY_API_BASE_URL || "";

// ── Public ────────────────────────────────────────────────────────────────────

/** POST  — submit a contact message */
export const ROUTE_CONTACT_SUBMIT   = `${BASE}/api/contact`;

/** GET   — fetch all active (approved) reviews for the public review page */
export const ROUTE_REVIEWS_PUBLIC   = `${BASE}/api/reviews`;

/** POST  — submit a new review (lands as active=false, pending approval) */
export const ROUTE_REVIEW_SUBMIT    = `${BASE}/api/reviews`;

// ── Admin ─────────────────────────────────────────────────────────────────────

/** GET   — fetch ALL contact submissions (requires auth cookie) */
export const ROUTE_ADMIN_CONTACTS   = `${BASE}/api/contact`;

/** DELETE /api/contact?id= — delete a contact submission */
export const ROUTE_ADMIN_CONTACT_DELETE = (id: string) => `${BASE}/api/contact?id=${id}`;

/** GET   — fetch ALL reviews including pending (requires auth cookie) */
export const ROUTE_ADMIN_REVIEWS    = `${BASE}/api/admin/reviews`;

/** PATCH /api/admin/reviews?id= — update / toggle a review */
export const ROUTE_ADMIN_REVIEW_UPDATE = (id: string) => `${BASE}/api/admin/reviews?id=${id}`;

/** DELETE /api/admin/reviews?id= — hard delete a review */
export const ROUTE_ADMIN_REVIEW_DELETE = (id: string) => `${BASE}/api/admin/reviews?id=${id}`;
