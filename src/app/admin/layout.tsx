import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, role")
    .eq("id", user.id)
    .maybeSingle();

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    profile?.role === "admin" ||
    adminEmails.includes((user.email || "").toLowerCase());

  if (!isAdmin) redirect("/dashboard");

  const display = {
    name: profile?.name || (user.user_metadata?.name as string) || user.email || "Admin",
    email: profile?.email || user.email || "",
  };

  return (
    <DashboardShell variant="admin" user={display}>
      {children}
    </DashboardShell>
  );
}
