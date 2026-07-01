import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Motion";
import { getCourses } from "@/lib/courses/queries";
import { gradientFor } from "@/lib/courses/seed";

/**
 * Landing "#courses" section — renders live data from Supabase
 * (falls back to `seedCourses` when the DB is empty / unreachable, see
 * `getCourses()`).
 */
export async function CourseModules() {
  const courses = await getCourses();

  return (
    <section id="courses" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <div className="max-w-2xl">
              <span className="chip">Curriculum</span>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-white/90">
                  {courses.length} module{courses.length === 1 ? "" : "s"}.
                </span>{" "}
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
          {courses.map((c, i) => {
            const chapters = c.modules?.length ?? 0;
            const tag = `Module ${String(i + 1).padStart(2, "0")}`;
            return (
              <Reveal key={c.id} delay={i * 0.05}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="card-glass group flex h-full flex-col overflow-hidden p-0"
                >
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden"
                    style={{ background: gradientFor(c.slug) }}
                  >
                    {c.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.cover_image}
                        alt={c.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.45)_100%)]" />
                    <div className="absolute left-5 top-5">
                      <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                        {tag}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div className="font-display text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
                        {c.title}
                      </div>
                      {chapters > 0 && (
                        <div className="rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                          {chapters} chapter{chapters === 1 ? "" : "s"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                    <p className="text-sm leading-relaxed text-white/65 line-clamp-3">
                      {c.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                      <span className="text-white/55">
                        PDF · Lifetime access
                      </span>
                      <span className="inline-flex items-center gap-1 text-white/90 transition group-hover:text-accent-200">
                        Open
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
