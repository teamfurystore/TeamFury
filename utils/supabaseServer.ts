import { createClient } from "@supabase/supabase-js";

// Server-side anon client for public data reads (shop pages, metadata, etc.)
// Uses the public anon key — RLS policies on Supabase control row visibility.
// No service role key — never bypasses RLS.
export function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Alias used by server components (e.g. app/shop/[slug]/page.tsx)
export const createServerClient = serviceClient;
