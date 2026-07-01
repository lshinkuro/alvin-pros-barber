import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./NavbarClient";

/**
 * Server wrapper: resolves auth state (and admin role) once per request,
 * so the client Navbar can show Dashboard/Log-out when the visitor is
 * already signed in, instead of Login/Register.
 */
export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const profile = data as { role: string } | null;
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    isAdmin =
      profile?.role === "admin" ||
      adminEmails.includes((user.email || "").toLowerCase());
  }

  return (
    <NavbarClient
      isAuthenticated={!!user}
      dashboardHref={isAdmin ? "/admin" : "/dashboard"}
    />
  );
}

