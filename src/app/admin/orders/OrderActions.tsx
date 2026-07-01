"use client";

import { useState, useTransition } from "react";
import {
  Loader2,
  Send,
  X,
  Eye,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  rejectOrderAction,
  sendCourseAction,
  setOrderStatusAction,
} from "./actions";

interface OrderRow {
  id: string;
  status: string;
  created_at: string;
  course: { title: string } | null;
  profile: { name: string; email: string } | null;
}

export function OrderActions({ order }: { order: OrderRow }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const isDone = order.status === "completed";
  const isRejected = order.status === "rejected";
  const isWaiting = order.status === "waiting";

  function handleSend() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await sendCourseAction(order.id);
      if (!res.ok) setError(res.error);
      else setMessage("Course sent.");
    });
  }
  function handleReject() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await rejectOrderAction(order.id);
      if (!res.ok) setError(res.error);
      else setMessage("Order rejected.");
    });
  }
  function handleSetStatus(status: "waiting" | "completed" | "rejected") {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await setOrderStatusAction(order.id, status);
      if (!res.ok) setError(res.error);
      else
        setMessage(
          status === "completed"
            ? "Marked as paid."
            : status === "rejected"
              ? "Order cancelled."
              : "Reopened to waiting.",
        );
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowDetail(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/[0.08]"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>

        {/* Primary: send course email (only while waiting). */}
        {isWaiting && (
          <button
            type="button"
            disabled={pending}
            onClick={handleSend}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 px-3 py-1.5 text-xs font-medium text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Send Course
          </button>
        )}

        {/* Mark paid without sending email — for orders paid offline. */}
        {!isDone && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleSetStatus("completed")}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Paid
          </button>
        )}

        {/* Cancel = set to rejected. */}
        {!isRejected && (
          <button
            type="button"
            disabled={pending}
            onClick={isWaiting ? handleReject : () => handleSetStatus("rejected")}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        )}

        {/* Reopen a completed/rejected order back to waiting. */}
        {!isWaiting && (
          <button
            type="button"
            disabled={pending}
            onClick={() => handleSetStatus("waiting")}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reopen
          </button>
        )}
      </div>
      {(error || message) && (
        <div
          className={`mt-2 text-right text-[11px] ${
            error ? "text-rose-300" : "text-emerald-300"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur"
            onClick={() => setShowDetail(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="glass-strong w-full max-w-lg rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">
                  Order details
                </h3>
                <button
                  type="button"
                  onClick={() => setShowDetail(false)}
                  className="rounded-full border border-white/10 bg-white/[0.04] p-1.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm">
                <Row label="Order ID" value={order.id} />
                <Row label="Customer" value={order.profile?.name ?? "—"} />
                <Row label="Email" value={order.profile?.email ?? "—"} />
                <Row label="Course" value={order.course?.title ?? "—"} />
                <Row label="Status" value={order.status} />
                <Row label="Created" value={new Date(order.created_at).toLocaleString()} />
              </dl>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-b-0">
      <dt className="text-xs uppercase tracking-[0.18em] text-white/45">
        {label}
      </dt>
      <dd className="truncate text-right text-white/85">{value}</dd>
    </div>
  );
}
