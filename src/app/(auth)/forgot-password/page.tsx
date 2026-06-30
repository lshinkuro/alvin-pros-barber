"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        (process.env.NEXT_PUBLIC_APP_URL || "") + "/auth/callback?next=/dashboard/profile",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href="/login"
        className="text-xs uppercase tracking-[0.22em] text-white/50 hover:text-white/80"
      >
        ← Back to login
      </Link>

      {sent ? (
        <div className="mt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
            <MailCheck className="h-6 w-6 text-emerald-300" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
            Check your inbox.
          </h1>
          <p className="mt-2 text-white/60">
            We sent a password reset link to <span className="text-white">{email}</span>.
          </p>
        </div>
      ) : (
        <>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="mt-2 text-white/60">
            No worries — we will email you a reset link.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@studio.com"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}
