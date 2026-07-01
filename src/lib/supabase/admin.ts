import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only. Do NOT import in client components.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY (never expose to the browser) so it can bypass
 * Row Level Security — required for admin listing of every user's orders /
 * profiles from /admin/*.
 *
 * We intentionally do NOT pass a Database generic here. Our hand-written
 * `Database` type in `@/types/database` is a convenience shape for our own code
 * and does not satisfy supabase-js's strict `GenericSchema` constraint, which
 * would otherwise collapse every query's row type to `never`. Use `.returns<T>()`
 * on each query to type the result.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local — required for admin queries that must bypass RLS.",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
