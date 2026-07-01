"use client";

import {
  BookOpenCheck,
  Infinity as InfinityIcon,
  Mail,
  Lock,
  Sparkles,
  Scissors,
} from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

const items = [
  {
    icon: BookOpenCheck,
    title: "Professional Material",
    body: "Editorial layouts, high-resolution diagrams, and step-by-step photo references built like a magazine.",
  },
  {
    icon: InfinityIcon,
    title: "Lifetime Learning",
    body: "Pay once. Re-read forever. Updates and revisions are always included for existing students.",
  },
  {
    icon: Mail,
    title: "Email Delivery",
    body: "Your course is dispatched to your inbox within minutes of payment confirmation.",
  },
  {
    icon: Lock,
    title: "Password Protected PDF",
    body: "Every PDF is encrypted with a unique password — only you can open your copy.",
  },
  {
    icon: Sparkles,
    title: "Beginner Friendly",
    body: "Starts with the absolute fundamentals, then builds up to advanced styling and business.",
  },
  {
    icon: Scissors,
    title: "Created by a Professional Barber",
    body: "Written by a working master barber — every page reflects real chair time, not theory.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip">Why AlfinSquare Academy</span>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="gradient-text">Crafted for ambitious</span>{" "}
              <span className="text-white/90">barbers.</span>
            </h2>
            <p className="mt-4 text-pretty text-white/60">
              Six reasons our students keep coming back — and why studios
              recommend us to their apprentices.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="card-glass group h-full">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/90 transition group-hover:border-white/20 group-hover:bg-white/[0.1]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
