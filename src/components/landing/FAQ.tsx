"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

const faqs = [
  {
    q: "How do I receive my course?",
    a: "After your payment is confirmed by our team, we automatically email you a secure download link and a unique password to open your PDF — usually within minutes.",
  },
  {
    q: "Is the PDF really password protected?",
    a: "Yes. Every order generates a unique, strong password tied to your account. The PDF cannot be opened without it, so your copy stays your copy.",
  },
  {
    q: "Do I need any prior experience?",
    a: "No. The curriculum starts from the absolute fundamentals and gradually builds up to advanced fading, scissor work, color, and business.",
  },
  {
    q: "Can I print the PDF?",
    a: "Yes — printing for personal use is fully supported. Sharing or redistributing copies is not permitted under the license.",
  },
  {
    q: "What if I have problems opening the file?",
    a: "Reply to your delivery email or contact us on WhatsApp. We respond within a few hours, every day.",
  },
  {
    q: "Will online payment be available?",
    a: "Yes — we are integrating Midtrans, Xendit and Stripe. For now, purchases are confirmed manually via WhatsApp so you always speak to a real human first.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip">FAQ</span>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-white/90">Everything you</span>{" "}
              <span className="gradient-text">need to know.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          <Reveal>
            <div className="glass overflow-hidden rounded-3xl">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={f.q}
                    className={`border-b border-white/10 last:border-b-0 ${
                      isOpen ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/[0.02]"
                    >
                      <span className="text-base font-medium text-white sm:text-lg">
                        {f.q}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition ${
                          isOpen ? "rotate-45 bg-white/10" : ""
                        }`}
                      >
                        <Plus className="h-4 w-4 text-white" strokeWidth={2} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pr-16 text-sm leading-relaxed text-white/65 sm:text-base">
                            {f.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
