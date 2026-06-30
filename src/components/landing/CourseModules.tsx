"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";

export interface ModuleCardData {
  slug: string;
  title: string;
  tag: string;
  description: string;
  pages: number;
  gradient: string;
}

const modules: ModuleCardData[] = [
  {
    slug: "haircut-fundamentals",
    title: "Haircut Fundamentals",
    tag: "Module 01",
    description:
      "Tools, posture, sectioning, guide lines, and the universal language every cut starts from.",
    pages: 48,
    gradient: "linear-gradient(135deg,#ff6b34 0%,#ff4a8a 60%,#a06bff 100%)",
  },
  {
    slug: "fade-techniques",
    title: "Fade Techniques",
    tag: "Module 02",
    description:
      "Low, mid, high, skin and burst fades — clipper-over-comb and seamless blending.",
    pages: 42,
    gradient: "linear-gradient(135deg,#785aff 0%,#4ab8ff 50%,#21d4a0 100%)",
  },
  {
    slug: "scissor-cutting",
    title: "Scissor Cutting",
    tag: "Module 03",
    description:
      "Point cutting, slide cutting, texturizing, and the editorial scissor-only haircut.",
    pages: 38,
    gradient: "linear-gradient(135deg,#ffb45e 0%,#ff6b34 50%,#ff4a8a 100%)",
  },
  {
    slug: "beard-styling",
    title: "Beard Styling",
    tag: "Module 04",
    description:
      "Face shape mapping, line work, hot-towel shave routine, and beard maintenance plans.",
    pages: 34,
    gradient: "linear-gradient(135deg,#21d4a0 0%,#4ab8ff 60%,#785aff 100%)",
  },
  {
    slug: "hair-coloring",
    title: "Hair Coloring",
    tag: "Module 05",
    description:
      "Color theory, lifts, toners, and the safest path from foundation tones to fashion shades.",
    pages: 44,
    gradient: "linear-gradient(135deg,#ff4a8a 0%,#a06bff 50%,#4ab8ff 100%)",
  },
  {
    slug: "barber-business",
    title: "Barber Business",
    tag: "Module 06",
    description:
      "Pricing, booking, retention, social content and turning your chair into a real brand.",
    pages: 56,
    gradient: "linear-gradient(135deg,#0e0e12 0%,#2f2f38 60%,#ff6b34 100%)",
  },
  {
    slug: "customer-service",
    title: "Customer Service",
    tag: "Module 07",
    description:
      "Consultations, difficult conversations, recovery from mistakes, and lifetime clients.",
    pages: 30,
    gradient: "linear-gradient(135deg,#4ab8ff 0%,#785aff 50%,#ff4a8a 100%)",
  },
];

export function CourseModules() {
  return (
    <section id="courses" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <div className="max-w-2xl">
              <span className="chip">Curriculum</span>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-white/90">Seven modules.</span>{" "}
                <span className="gradient-text-warm">One complete barber.</span>
              </h2>
              <p className="mt-4 text-pretty text-white/60">
                Buy individually or take the full path. Each module is its own
                premium PDF — read in any order.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/courses" className="btn-secondary">
              See all courses
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => (
            <Reveal key={m.slug} delay={i * 0.05}>
              <Link
                href={`/courses/${m.slug}`}
                className="card-glass group flex h-full flex-col overflow-hidden p-0"
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden"
                  style={{ background: m.gradient }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                      {m.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="font-display text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
                      {m.title}
                    </div>
                    <div className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                      {m.pages} pages
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                  <p className="text-sm leading-relaxed text-white/65">
                    {m.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                    <span className="text-white/55">PDF · Lifetime access</span>
                    <span className="inline-flex items-center gap-1 text-white/90 transition group-hover:text-accent-200">
                      Open
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { modules as landingModules };
