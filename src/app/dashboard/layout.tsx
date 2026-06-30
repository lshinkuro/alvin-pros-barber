import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard");

  const { data } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .maybeSingle();
  const profile = data as Pick<Profile, "name" | "email"> | null;

  const display = {
    name:
      profile?.name ||
      (user.user_metadata?.name as string) ||
      user.email ||
      "Student",
    email: profile?.email || user.email || "",
  };

  return (
    <DashboardShell variant="user" user={display}>
      {children}
    </DashboardShell>
  );
}
