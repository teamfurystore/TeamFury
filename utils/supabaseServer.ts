import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the anon key.
 * Safe to use in Server Components and API routes for public data.
 * Creates a fresh instance per call — no singleton, no browser APIs.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side Supabase client using the service role key.
 * Bypasses RLS — only use in trusted server-side code.
 * Lazy: only created when called so a missing key doesn't crash at import time.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || key === "your_service_role_key_here") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local to use admin operations."
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key);
}
