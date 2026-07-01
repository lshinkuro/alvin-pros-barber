import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, FileText, Lock, Mail } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { BuyButton } from "@/components/courses/BuyButton";
import { getCourseBySlug } from "@/lib/courses/queries";
import { gradientFor } from "@/lib/courses/seed";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const previews = course.preview_images?.length
    ? course.preview_images
    : [0, 1, 2].map(() => null);

  return (
    <main className="relative min-h-screen">
      <Navbar />

      <div className="relative pb-24 pt-36 sm:pt-44">
        <div aria-hidden className="absolute inset-0 -z-20 grid-bg" />
        <GradientBlob className="-top-20 right-[-15%]" size={520} />
        <GradientBlob
          className="-bottom-40 left-[-10%]"
          size={520}
          from="#785aff"
          via="#ff4a8a"
          to="#ff6b34"
          delay={0.3}
        />

        <div className="container-page">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/50 hover:text-white/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All courses
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <span className="chip">PDF · Lifetime access</span>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                <span className="gradient-text">{course.title}</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/65">
                {course.description}
              </p>

              {course.modules && course.modules.length > 0 && (
                <div className="mt-10">
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                    What's inside
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {course.modules.map((m) => (
                      <li
                        key={m}
                        className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <FeaturePill icon={FileText} label="Premium PDF" />
                <FeaturePill icon={Lock} label="Password protected" />
                <FeaturePill icon={Mail} label="Email delivery" />
              </div>
            </div>

            {/* Right buy card */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="glass-strong overflow-hidden rounded-3xl">
                {/* Cover */}
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden"
                  style={{ background: gradientFor(course.slug) }}
                >
                  {course.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
                  <div className="absolute bottom-5 left-5 right-5 font-display text-2xl font-semibold tracking-tight text-white">
                    {course.title}
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                        Price
                      </div>
                      <div className="mt-1 font-display text-4xl font-semibold tracking-tight">
                        {formatCurrency(course.price)}
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/55">
                      One-time
                      <br />
                      Lifetime access
                    </div>
                  </div>

                  <BuyButton
                    courseSlug={course.slug}
                    isAuthenticated={!!user}
                  />

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/55">
                    Click <span className="text-white">Buy via WhatsApp</span>{" "}
                    to message our team with your details. We confirm payment
                    manually, then your PDF is emailed within minutes.
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Previews */}
          <div className="mt-24">
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
              Preview
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              {previews.map((p, i) => (
                <div
                  key={i}
                  className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10"
                  style={{ background: gradientFor(course.slug) }}
                >
                  {typeof p === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p}
                      alt={`${course.title} preview ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_60%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
                      <div className="absolute inset-0 flex items-end p-5 text-white">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                            Sample page {i + 1}
                          </div>
                          <div className="mt-1 font-display text-lg font-semibold leading-tight">
                            {course.title}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: typeof FileText;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/85">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium text-white/85">{label}</span>
    </div>
  );
}
