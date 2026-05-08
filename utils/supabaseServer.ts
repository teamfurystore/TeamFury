import { createClient } from "@supabase/supabase-js";

// Server-side client using service role key (never exposed to browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Server-side Supabase client using the anon key.
 * Safe to use in Server Components and API routes for public data.
 * Does NOT require the service role key.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
