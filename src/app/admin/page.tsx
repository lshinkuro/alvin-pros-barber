import Link from "next/link";
import { ArrowUpRight, Clock4, CheckCircle2, BookOpen, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [waiting, completed, totalCourses, totalUsers] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "waiting"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Waiting orders", value: waiting.count ?? 0, icon: Clock4, accent: "from-amber-400 to-orange-500" },
    { label: "Completed orders", value: completed.count ?? 0, icon: CheckCircle2, accent: "from-emerald-400 to-cyan-500" },
    { label: "Total courses", value: totalCourses.count ?? 0, icon: BookOpen, accent: "from-pink-500 to-purple-500" },
    { label: "Total users", value: totalUsers.count ?? 0, icon: Users, accent: "from-accent-400 to-pink-500" },
  ];

  const { data: recent } = await supabase
    .from("orders")
    .select("id, status, created_at, course:courses(title), profile:profiles(name, email)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Overview
      </h1>
      <p className="mt-2 text-white/60">
        Snapshot of orders, courses, and students.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass relative overflow-hidden rounded-3xl p-5">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.accent} opacity-30 blur-2xl`} />
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
                <Icon className="h-4 w-4" /> {s.label}
              </div>
              <div className="mt-3 font-display text-3xl font-semibold tracking-tight">
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-10 glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 divide-y divide-white/5">
          {(recent ?? []).length === 0 && (
            <p className="py-6 text-sm text-white/55">No orders yet.</p>
          )}
          {(recent ?? []).map((o) => {
            const course = Array.isArray(o.course) ? o.course[0] : o.course;
            const profile = Array.isArray(o.profile) ? o.profile[0] : o.profile;
            return (
              <div key={o.id} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-medium text-white">
                    {profile?.name ?? "—"}
                  </div>
                  <div className="text-xs text-white/45">
                    {profile?.email ?? ""} · {course?.title ?? "Course"}
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.18em] text-white/55">
                  {o.status}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
