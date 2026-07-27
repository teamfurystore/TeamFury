import { createClient } from "@supabase/supabase-js";

/**
 * Extracts the Supabase access token from a Cookie header string.
 *
 * Handles two cookie shapes:
 *   1. Plain JWT:   sb-access-token=<jwt>
 *   2. JSON blob:   sb-<ref>-auth-token=<url-encoded-JSON>  (newer @supabase/ssr)
 */
export function extractToken(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    // 1. Plain JWT cookie (older / manual pattern)
    const plain = cookieHeader.match(/sb-access-token=([^;]+)/)?.[1];
    if (plain) return plain;

    // 2. JSON blob cookie (newer @supabase/ssr pattern)
    //    Cookie name: sb-<project-ref>-auth-token=<url-encoded-JSON>
    const jsonRaw = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)?.[1];
    if (jsonRaw) {
        try {
            const decoded = decodeURIComponent(jsonRaw);
            const parsed = JSON.parse(decoded);
            const session = Array.isArray(parsed) ? parsed[0] : parsed;
            return session?.access_token ?? null;
        } catch {
            return null;
        }
    }

    return null;
}

/**
 * Creates an authenticated Supabase client that forwards the caller's JWT
 * as an Authorization: Bearer header, enabling RLS enforcement.
 * Falls back to an unauthenticated anon client when no token is present.
 */
export function dbClient(req: Request) {
    const token = extractToken(req.headers.get("cookie"));
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}
    );
}

/**
 * Returns { ok: true } only when:
 *   - a valid JWT is present in the request cookies
 *   - Supabase confirms the token is not expired / revoked
 *   - the user's profiles.role === "admin"
 *
 * Returns { ok: false } in all other cases without throwing.
 */
export async function requireAdmin(req: Request): Promise<{ ok: boolean }> {
    const token = extractToken(req.headers.get("cookie"));
    if (!token) return { ok: false };

    const supabase = dbClient(req);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return { ok: false };

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

    if (profileError || !profile) return { ok: false };

    return { ok: profile.role === "admin" };
}
