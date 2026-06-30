import Link from "next/link";
import { CheckCircle2, Clock4, XCircle, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { OrderListRow } from "@/types/rows";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ordersData } = await supabase
    .from("orders")
    .select("id, status, created_at, delivered_at, course:courses(id, title, slug, price)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  const orders = (ordersData ?? []) as unknown as OrderListRow[];

  return (
    <div>
      <span className="chip">Orders</span>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Your orders
      </h1>
      <p className="mt-2 text-white/60">
        Track the status of each purchase and revisit completed deliveries.
      </p>

      <div className="mt-10 space-y-4">
        {(orders ?? []).length === 0 && (
          <div className="glass rounded-3xl p-8 text-center">
            <p className="text-white/65">You have no orders yet.</p>
            <Link href="/courses" className="btn-primary mt-5">
              Browse courses
            </Link>
          </div>
        )}

        {(orders ?? []).map((o) => {
          const course = Array.isArray(o.course) ? o.course[0] : o.course;
          return (
            <article
              key={o.id}
              className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <span>Order #{o.id.slice(0, 8)}</span>
                  <span>·</span>
                  <span>{formatDate(o.created_at)}</span>
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-white">
                  {course?.title ?? "Course"}
                </h2>
                {o.status === "completed" ? (
                  <p className="mt-2 flex items-center gap-2 text-sm text-emerald-200">
                    <Mail className="h-4 w-4" />
                    The course has been sent to your email.
                  </p>
                ) : o.status === "waiting" ? (
                  <p className="mt-2 text-sm text-white/55">
                    Once payment is confirmed, your PDF and password will be
                    emailed to you.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-rose-200">
                    This order was not approved. Please contact support.
                  </p>
                )}
              </div>
              <OrderBadge status={o.status} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function OrderBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 sm:self-auto">
        <CheckCircle2 className="h-3.5 w-3.5" /> Completed
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 self-start rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200 sm:self-auto">
        <XCircle className="h-3.5 w-3.5" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:self-auto">
      <Clock4 className="h-3.5 w-3.5" /> Waiting Payment
    </span>
  );
}
