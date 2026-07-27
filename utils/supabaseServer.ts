import { createClient } from "@supabase/supabase-js";

// Server-only client — never import this in client components
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix so it's never exposed to the browser
export function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
