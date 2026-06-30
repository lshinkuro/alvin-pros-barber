import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { OrderActions } from "./OrderActions";
import type { OrderSummaryRow } from "@/types/rows";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("orders")
    .select("id, status, created_at, course:courses(title), profile:profiles(name, email)")
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as OrderSummaryRow[];

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Orders
      </h1>
      <p className="mt-2 text-white/60">
        Verify payment via WhatsApp, then click <span className="text-white">Send Course</span> to
        generate a PDF password and email the customer.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="hidden grid-cols-[1.2fr_1fr_1.2fr_0.8fr_0.8fr_1.4fr] gap-4 border-b border-white/10 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 md:grid">
          <div>Customer</div>
          <div>Email</div>
          <div>Course</div>
          <div>Status</div>
          <div>Created</div>
          <div className="text-right">Actions</div>
        </div>

        {(orders ?? []).length === 0 && (
          <div className="p-8 text-center text-white/55">No orders yet.</div>
        )}

        <ul className="divide-y divide-white/5">
          {(orders ?? []).map((o) => {
            const course = Array.isArray(o.course) ? o.course[0] : o.course;
            const profile = Array.isArray(o.profile) ? o.profile[0] : o.profile;
            const row = {
              id: o.id,
              status: o.status,
              created_at: o.created_at,
              course: course ? { title: course.title } : null,
              profile: profile
                ? { name: profile.name, email: profile.email }
                : null,
            };
            return (
              <li
                key={o.id}
                className="grid gap-3 px-6 py-5 md:grid-cols-[1.2fr_1fr_1.2fr_0.8fr_0.8fr_1.4fr] md:items-center md:gap-4"
              >
                <div className="font-medium text-white">
                  {profile?.name ?? "—"}
                </div>
                <div className="text-sm text-white/65">
                  {profile?.email ?? "—"}
                </div>
                <div className="text-sm text-white/85">
                  {course?.title ?? "—"}
                </div>
                <div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="text-xs text-white/55">
                  {formatDate(o.created_at)}
                </div>
                <div>
                  <OrderActions order={row} />
                </div>
              </li>
            );
          })}
        </ul>
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
      className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
        map[status] ?? "border-white/10 bg-white/5 text-white/60"
      }`}
    >
      {status}
    </span>
  );
}
