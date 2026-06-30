import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { gradientFor } from "@/lib/courses/seed";
import type { Course } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const admin = createAdminClient();
  const { data } = await admin
  .from("courses")
  .select("*")
  .order("created_at", { ascending: true });
  const courses = (data ?? []) as Course[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Courses
          </h1>
          <p className="mt-2 text-white/60">
            Manage your published catalog. Run the seed SQL to populate the
            initial seven modules.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {(courses ?? []).length === 0 && (
          <div className="glass col-span-full rounded-3xl p-8 text-center text-white/60">
            No courses in the database yet. Run{" "}
            <span className="text-white">supabase/schema.sql</span> to seed the
            initial catalog.
          </div>
        )}
        {(courses ?? []).map((c) => (
          <div key={c.id} className="card-glass overflow-hidden p-0">
            <div
              className="relative aspect-[16/10] w-full"
              style={{ background: gradientFor(c.slug) }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_55%)]" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div className="font-display text-xl font-semibold leading-tight">
                  {c.title}
                </div>
                <div className="rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[10px] backdrop-blur">
                  {c.is_published ? "Published" : "Draft"}
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-white/60 line-clamp-3">
                {c.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                <span className="text-white/55">Slug · {c.slug}</span>
                <span className="font-display text-base font-semibold">
                  {formatCurrency(c.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
