import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only. Do NOT import in client components.
 *
 * NOTE: We intentionally do NOT pass a Database generic here. Our hand-written
 * `Database` type in `@/types/database` is a convenience shape for our own code
 * and does not satisfy supabase-js's strict `GenericSchema` constraint, which
 * would otherwise collapse every query's row type to `never`. Use `.returns<T>()`
 * on each query to type the result.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase admin env vars");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
