"use client";

import { motion } from "framer-motion";

/**
 * A floating glassmorphic mockup of an open course PDF — used in the hero.
 */
export function PDFMockup() {
  return (
    <div className="relative mx-auto flex h-[480px] w-full max-w-[460px] items-center justify-center sm:h-[560px]">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[44px] opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 40%, rgba(255,107,52,0.45), transparent 70%), radial-gradient(50% 50% at 30% 70%, rgba(160,107,255,0.35), transparent 70%)",
        }}
      />

      {/* Back card */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute right-2 top-10 h-[78%] w-[72%] origin-bottom-left rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl"
        style={{ boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)" }}
      />

      {/* Floating main PDF */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative z-10 h-[88%] w-[78%]"
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-3, -1.5, -3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="glass-strong relative h-full w-full overflow-hidden rounded-[28px]"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
              fade-techniques.pdf
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
              PRO
            </div>
          </div>

          {/* Body */}
          <div className="space-y-5 p-7">
            <div className="space-y-2">
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
                Module 02
              </div>
              <div className="font-display text-2xl font-semibold leading-tight tracking-tight text-white">
                Fade Techniques
              </div>
              <div className="text-xs text-white/50">
                Low · Mid · High · Skin · Burst
              </div>
            </div>

            {/* "image" preview */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg,#ff6b34 0%,#ff4a8a 45%,#a06bff 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_50%)]" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
                  Step-by-step
                </div>
                <div className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                  42 pages
                </div>
              </div>
            </div>

            {/* Text lines */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-white/10" />
              <div className="h-2 w-11/12 rounded-full bg-white/10" />
              <div className="h-2 w-9/12 rounded-full bg-white/10" />
              <div className="h-2 w-10/12 rounded-full bg-white/10" />
            </div>
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                Password protected
              </div>
              <div className="font-mono text-xs text-white/80">
                BARBER-•••• -••••
              </div>
            </div>
            <div className="h-8 w-8 rounded-full border border-white/15 bg-gradient-to-br from-accent-400 to-pink-500" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute -left-2 top-12 z-20 rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white backdrop-blur-xl sm:-left-6"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-white/80">Delivered to your inbox</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute -right-2 bottom-10 z-20 rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white backdrop-blur-xl sm:-right-6"
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
          Module 03
        </div>
        <div className="text-sm font-medium">Scissor Cutting</div>
      </motion.div>
    </div>
  );
}
