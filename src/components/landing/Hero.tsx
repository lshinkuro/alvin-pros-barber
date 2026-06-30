"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { PDFMockup } from "@/components/ui/PDFMockup";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 -z-20 grid-bg" />
      <GradientBlob className="-top-32 right-[-10%]" size={620} delay={0} />
      <GradientBlob
        className="bottom-[-20%] left-[-10%]"
        size={560}
        from="#785aff"
        via="#ff4a8a"
        to="#ff6b34"
        delay={0.4}
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5 text-accent-300" />
                Premium barber training, delivered as a PDF
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-balance sm:text-[3.4rem] lg:text-[4.4rem]"
            >
              <span className="gradient-text">Become a Professional Barber</span>
              <br />
              <span className="text-white/90">From Anywhere.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg"
            >
              A complete, editorial-quality barber curriculum — fades, scissor
              work, beard styling, color, and the business of barbering. Each
              module arrives as a premium, password-protected PDF, delivered
              straight to your inbox.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link href="/courses" className="btn-primary group">
                Buy Now
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link href="/#courses" className="btn-secondary">
                View Modules
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-4"
            >
              {[
                { k: "12k+", v: "Students" },
                { k: "7", v: "Modules" },
                { k: "4.9★", v: "Rating" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {s.k}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-white/50">
                    {s.v}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
            className="relative"
          >
            <PDFMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
