import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

/**
 * Guarantee that a `public.profiles` row exists for the current auth user.
 *
 * The DB trigger `handle_new_user` (see supabase/schema.sql) is supposed to
 * do this automatically. When the trigger is missing (schema not run yet,
 * legacy users, or the trigger errored silently) we upsert defensively so
 * every downstream check (`orders.user_id` FK, admin role gating, sidebar
 * display name) has something to work with.
 *
 * Also promotes a user to `role='admin'` when their email is listed in
 * `ADMIN_EMAILS`, so the DB becomes the single source of truth for admin
 * access instead of the env var alone.
 */
export async function ensureProfile(user: User): Promise<Profile | null> {
  const supabase = await createClient();

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const shouldBeAdmin = adminEmails.includes((user.email || "").toLowerCase());

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, name, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle();
  const current = existing as Profile | null;

  if (current) {
    // Promote to admin if the env now lists this email but the DB says 'user'.
    if (shouldBeAdmin && current.role !== "admin") {
      const { data: updated } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.id)
        .select("id, name, email, role, created_at")
        .maybeSingle();
      return (updated as Profile | null) ?? current;
    }
    return current;
  }

  const displayName =
    (user.user_metadata?.name as string) ||
    (user.email ? user.email.split("@")[0] : "Student");

  const { data: inserted, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        name: displayName,
        email: user.email || "",
        role: shouldBeAdmin ? "admin" : "user",
      },
      { onConflict: "id" },
    )
    .select("id, name, email, role, created_at")
    .single();

  if (error) {
    // RLS lets a user insert their own row, so this only fails for genuinely
    // broken setups. Return null and let callers decide (redirect / block).
    console.error("ensureProfile failed", error.message);
    return null;
  }
  return inserted as Profile;
}
