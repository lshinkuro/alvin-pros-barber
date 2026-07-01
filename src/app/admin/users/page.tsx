import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate, initials } from "@/lib/utils";
import type { ProfileRow } from "@/types/rows";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });
  const users = (data ?? []) as ProfileRow[];

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Users
      </h1>
      <p className="mt-2 text-white/60">
        Everyone who has signed up for AlfinSquare Academy.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="hidden grid-cols-[1.4fr_1.4fr_0.8fr_0.8fr] gap-4 border-b border-white/10 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 md:grid">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Joined</div>
        </div>
        {(users ?? []).length === 0 && (
          <div className="p-8 text-center text-white/55">No users yet.</div>
        )}
        <ul className="divide-y divide-white/5">
          {(users ?? []).map((u) => (
            <li
              key={u.id}
              className="grid gap-3 px-6 py-5 md:grid-cols-[1.4fr_1.4fr_0.8fr_0.8fr] md:items-center md:gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-pink-500 text-xs font-semibold text-white">
                  {initials(u.name || u.email || "U")}
                </span>
                <span className="font-medium text-white">{u.name}</span>
              </div>
              <div className="text-sm text-white/70">{u.email}</div>
              <div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    u.role === "admin"
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                      : "border-white/10 bg-white/5 text-white/60"
                  }`}
                >
                  {u.role}
                </span>
              </div>
              <div className="text-xs text-white/55">
                {formatDate(u.created_at)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
