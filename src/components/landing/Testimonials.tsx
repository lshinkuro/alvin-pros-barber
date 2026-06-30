"use client";

import { Star } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

const testimonials = [
  {
    name: "Marcus T.",
    role: "Apprentice → Master Barber",
    quote:
      "The fades module changed my entire approach. Two weeks in, my chair was fully booked. This is the only resource I recommend to my apprentices.",
    avatar: "MT",
    gradient: "from-accent-400 to-pink-500",
  },
  {
    name: "Diego R.",
    role: "Owner, Hilo Cuts",
    quote:
      "It reads like a magazine and teaches like a master. I bought a copy for every chair in my shop — best $ I have spent on training.",
    avatar: "DR",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    name: "Ahmed K.",
    role: "Self-taught Barber, Dubai",
    quote:
      "I do not have access to a barber school. These PDFs are my school. The photo references alone are worth ten times the price.",
    avatar: "AK",
    gradient: "from-emerald-400 to-cyan-500",
  },
  {
    name: "Jasmine L.",
    role: "Salon → Barbershop",
    quote:
      "The customer service and business chapters are gold. My retention jumped overnight. Beautifully designed too.",
    avatar: "JL",
    gradient: "from-orange-400 to-rose-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip">Testimonials</span>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="text-white/90">Loved by</span>{" "}
              <span className="gradient-text">barbers everywhere.</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="card-glass h-full">
                <div className="flex items-center gap-1 text-accent-300">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-current"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <blockquote className="mt-5 text-pretty text-lg leading-relaxed text-white/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-semibold text-white`}
                  >
                    {t.avatar}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-white">
                      {t.name}
                    </span>
                    <span className="block text-xs text-white/50">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
