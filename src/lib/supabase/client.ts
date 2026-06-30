import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. We intentionally do not pass a Database generic \u2014
 * see `lib/supabase/admin.ts` for the explanation.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
