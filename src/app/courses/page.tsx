import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { getCourses } from "@/lib/courses/queries";
import { gradientFor } from "@/lib/courses/seed";
import { formatCurrency } from "@/lib/utils";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <div className="relative pb-24 pt-36 sm:pt-44">
        <div aria-hidden className="absolute inset-0 -z-20 grid-bg" />
        <GradientBlob className="-top-20 right-[-10%]" size={520} />
        <GradientBlob
          className="-bottom-40 left-[-10%]"
          size={520}
          from="#785aff"
          via="#ff4a8a"
          to="#ff6b34"
          delay={0.3}
        />

        <div className="container-page">
          <div className="max-w-3xl">
            <span className="chip">Catalog</span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              <span className="gradient-text">All courses.</span>{" "}
              <span className="text-white/90">One curriculum.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-white/65">
              Every module is its own premium PDF — buy individually or take
              the whole path. Lifetime access, password protected, delivered to
              your inbox.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="card-glass group flex h-full flex-col overflow-hidden p-0"
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden"
                  style={{ background: gradientFor(c.slug) }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div className="font-display text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
                      {c.title}
                    </div>
                    <div className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                      PDF
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                  <p className="text-sm leading-relaxed text-white/65 line-clamp-3">
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                    <span className="font-display text-lg font-semibold text-white">
                      {formatCurrency(c.price)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-white/90 transition group-hover:text-accent-200">
                      View course
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
