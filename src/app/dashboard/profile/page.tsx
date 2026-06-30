import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .maybeSingle();

  const initial = {
    name:
      profile?.name ||
      (user!.user_metadata?.name as string) ||
      "",
    email: profile?.email || user!.email || "",
  };

  return (
    <div>
      <span className="chip">Account</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        My profile
      </h1>
      <p className="mt-2 text-white/60">
        Update your name or change your password.
      </p>

      <div className="mt-10 max-w-2xl">
        <ProfileForm initial={initial} />
      </div>
    </div>
  );
}
