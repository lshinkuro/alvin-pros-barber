import Link from "next/link";
import { ArrowUpRight, BookOpen, ListOrdered } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderSummaryRow } from "@/types/rows";

export default async function DashboardHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ordersData } = await supabase
    .from("orders")
    .select("id, status, created_at, course:courses(id, title, slug)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(4);
  const orders = (ordersData ?? []) as unknown as OrderSummaryRow[];

  const total = orders?.length ?? 0;
  const completed = orders?.filter((o) => o.status === "completed").length ?? 0;
  const waiting = orders?.filter((o) => o.status === "waiting").length ?? 0;

  const name =
    (user?.user_metadata?.name as string) || user?.email?.split("@")[0] || "there";

  return (
    <div>
      <div>
        <span className="chip">Welcome back</span>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          <span className="gradient-text">Hello, {name}.</span>
        </h1>
        <p className="mt-3 max-w-xl text-white/60">
          Pick up where you left off, view your orders, or browse new modules.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Stat label="Total orders" value={total} />
        <Stat label="Completed" value={completed} />
        <Stat label="Waiting payment" value={waiting} />
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.22em] text-white/55">
              <ListOrdered className="h-4 w-4" /> Recent orders
            </div>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 divide-y divide-white/5">
            {(orders ?? []).length === 0 && (
              <p className="py-6 text-sm text-white/55">
                You haven't placed any orders yet.{" "}
                <Link
                  href="/courses"
                  className="text-white underline-offset-4 hover:underline"
                >
                  Browse courses
                </Link>
                .
              </p>
            )}
            {(orders ?? []).map((o) => {
              const course = Array.isArray(o.course) ? o.course[0] : o.course;
              return (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <div className="font-medium text-white">
                      {course?.title ?? "Course"}
                    </div>
                    <div className="text-xs text-white/45">Order #{o.id.slice(0, 8)}</div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side,#ff6b34,#ff4a8a 50%,transparent 80%)",
            }}
          />
          <div className="text-sm font-medium uppercase tracking-[0.22em] text-white/55">
            <BookOpen className="mr-2 inline h-4 w-4" /> Continue learning
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight">
            Pick your next module.
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Every PDF is yours for life. Add to your library as you grow.
          </p>
          <Link href="/courses" className="btn-primary mt-6">
            Browse the catalog
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="text-xs uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    waiting: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    completed: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    rejected: "border-rose-300/30 bg-rose-300/10 text-rose-200",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
        map[status] ?? "border-white/10 bg-white/5 text-white/60"
      }`}
    >
      {status}
    </span>
  );
}
