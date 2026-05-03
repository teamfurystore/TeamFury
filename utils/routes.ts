// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every API route in the app.
// All internal routes use relative paths so they work in any environment.
// External API routes use full URLs.
// ─────────────────────────────────────────────────────────────────────────────

// ── Public (internal Next.js API routes) ─────────────────────────────────────

/** POST — submit a contact message */
export const ROUTE_CONTACT_SUBMIT = "/api/contact";

/** GET — fetch all active (approved) reviews for the public review page */
export const ROUTE_REVIEWS_PUBLIC = "/api/reviews";

/** POST — submit a new review (lands as active=false, pending approval) */
export const ROUTE_REVIEW_SUBMIT = "/api/reviews";

// ── Admin (require auth cookie) ───────────────────────────────────────────────

/** GET — fetch ALL contact submissions */
export const ROUTE_ADMIN_CONTACTS = "/api/contact";

/** DELETE /api/contact?id= */
export const ROUTE_ADMIN_CONTACT_DELETE = (id: string) => `/api/contact?id=${id}`;

/** GET — fetch ALL reviews including pending */
export const ROUTE_ADMIN_REVIEWS = "/api/admin/reviews";

/**
 * PATCH /api/admin/reviews?id=  — update / toggle a review
 * DELETE /api/admin/reviews?id= — hard delete a review
 */
export const ROUTE_ADMIN_REVIEW = (id: string) => `/api/admin/reviews?id=${id}`;

/** GET (with skins) / PUT / DELETE — admin product management */
export const ROUTE_ADMIN_PRODUCTS = "/api/admin/products";

/** DELETE /api/admin/products?id= */
export const ROUTE_ADMIN_PRODUCT_DELETE = (id: string) => `/api/admin/products?id=${id}`;

/** PATCH /api/products — toggle active on a product */
export const ROUTE_ADMIN_PRODUCT_TOGGLE = "/api/products";

/** POST /api/products/skins — save skin selection for a product */
export const ROUTE_ADMIN_PRODUCT_SKINS = "/api/products/skins";

/** GET /api/products/skins?parent_product_id= — fetch skins for a product */
export const ROUTE_ADMIN_PRODUCT_SKINS_GET = (id: string) =>
  `/api/products/skins?parent_product_id=${id}`;
// ── External APIs ─────────────────────────────────────────────────────────────

/** GET — Valorant weapon skins */
export const ROUTE_VALORANT_SKINS = "https://valorant-api.com/v1/weapons/skins";

/** GET — Valorant weapons list (for gun-type filter) */
export const ROUTE_VALORANT_WEAPONS = "https://valorant-api.com/v1/weapons";
