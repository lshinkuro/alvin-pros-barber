"use client";

import { useState, useTransition, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Pencil, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";
import type { Course } from "@/types/database";
import { formatCurrency } from "@/lib/utils";
import { gradientFor } from "@/lib/courses/seed";
import {
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
  toggleCoursePublishedAction,
  type CourseActionResult,
} from "./actions";

interface CourseManagerProps {
  courses: Course[];
}

type Mode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; course: Course };

export function CourseManager({ courses }: CourseManagerProps) {
  const [mode, setMode] = useState<Mode>({ kind: "closed" });
  const [flash, setFlash] = useState<{
    text: string;
    tone: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Courses
          </h1>
          <p className="mt-2 text-white/60">
            Add, edit, publish or delete PDF courses. Changes go live on the
            public catalog immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode({ kind: "create" })}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          New course
        </button>
      </div>

      {flash && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
            flash.tone === "success"
              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
              : "border-rose-300/30 bg-rose-300/10 text-rose-200"
          }`}
        >
          {flash.text}
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.length === 0 && (
          <div className="glass col-span-full rounded-3xl p-8 text-center text-white/60">
            No courses yet. Click{" "}
            <span className="text-white">New course</span> to add your first
            one.
          </div>
        )}
        {courses.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            onEdit={() => setMode({ kind: "edit", course: c })}
            onFlash={setFlash}
          />
        ))}
      </div>

      <AnimatePresence>
        {mode.kind !== "closed" && (
          <CourseEditorModal
            mode={mode}
            onClose={() => setMode({ kind: "closed" })}
            onFlash={setFlash}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseCard({
  course,
  onEdit,
  onFlash,
}: {
  course: Course;
  onEdit: () => void;
  onFlash: (f: { text: string; tone: "success" | "error" }) => void;
}) {
  const [pending, startTransition] = useTransition();

  function togglePublish() {
    startTransition(async () => {
      const res = await toggleCoursePublishedAction(
        course.id,
        !course.is_published,
      );
      onFlash(
        res.ok
          ? {
              text: !course.is_published
                ? "Course published."
                : "Course moved to draft.",
              tone: "success",
            }
          : { text: res.error || "Failed to update", tone: "error" },
      );
    });
  }

  function remove() {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteCourseAction(course.id);
      onFlash(
        res.ok
          ? { text: "Course deleted.", tone: "success" }
          : { text: res.error || "Failed to delete", tone: "error" },
      );
    });
  }

  return (
    <div className="card-glass overflow-hidden p-0">
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.35)_100%)]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div className="font-display text-xl font-semibold leading-tight">
            {course.title}
          </div>
          <div
            className={`rounded-full border px-2 py-0.5 text-[10px] backdrop-blur ${
              course.is_published
                ? "border-emerald-300/40 bg-emerald-300/20 text-white"
                : "border-white/30 bg-white/15 text-white/85"
            }`}
          >
            {course.is_published ? "Published" : "Draft"}
          </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-white/60 line-clamp-3">
          {course.description || "No description yet."}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
          <span className="text-white/55">Slug · {course.slug}</span>
          <span className="font-display text-base font-semibold">
            {formatCurrency(course.price)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/[0.08]"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={togglePublish}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/85 transition hover:bg-white/[0.08] disabled:opacity-50"
          >
            {course.is_published ? (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Unpublish
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Publish
              </>
            )}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={remove}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-rose-300/30 bg-rose-300/10 px-3 py-1.5 text-xs font-medium text-rose-200 transition hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseEditorModal({
  mode,
  onClose,
  onFlash,
}: {
  mode: Exclude<Mode, { kind: "closed" }>;
  onClose: () => void;
  onFlash: (f: { text: string; tone: "success" | "error" }) => void;
}) {
  const isEdit = mode.kind === "edit";
  const initial = isEdit ? mode.course : null;

  const action = isEdit ? updateCourseAction : createCourseAction;
  const [state, formAction, pending] = useActionState<
    CourseActionResult | null,
    FormData
  >(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      onFlash({
        text: isEdit ? "Course updated." : "Course created.",
        tone: "success",
      });
      onClose();
    } else if (state.error) {
      onFlash({ text: state.error, tone: "error" });
    }
  }, [state, isEdit, onFlash, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="glass-strong my-8 w-full max-w-2xl rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold">
            {isEdit ? "Edit course" : "New course"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/[0.04] p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={formAction} className="mt-6 space-y-5">
          {isEdit && <input type="hidden" name="id" value={initial!.id} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={initial?.title ?? ""}
                className="input"
                placeholder="Fade Techniques"
              />
            </div>
            <div>
              <label className="label" htmlFor="slug">
                Slug{" "}
                <span className="text-white/40">
                  (auto if empty)
                </span>
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={initial?.slug ?? ""}
                className="input"
                placeholder="fade-techniques"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initial?.description ?? ""}
              className="input min-h-[110px]"
              placeholder="What buyers will learn…"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="price">
                Price (IDR)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step="1"
                defaultValue={initial?.price ?? 0}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="cover_image">
                Cover image URL
              </label>
              <input
                id="cover_image"
                name="cover_image"
                defaultValue={initial?.cover_image ?? ""}
                className="input"
                placeholder="https://…"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="pdf_path">
              PDF path{" "}
              <span className="text-white/40">
                (Supabase storage object key)
              </span>
            </label>
            <input
              id="pdf_path"
              name="pdf_path"
              defaultValue={initial?.pdf_path ?? ""}
              className="input"
              placeholder="fade-techniques/fade-techniques.pdf"
            />
          </div>

          <div>
            <label className="label" htmlFor="modules">
              Modules{" "}
              <span className="text-white/40">
                (one per line or comma-separated)
              </span>
            </label>
            <textarea
              id="modules"
              name="modules"
              rows={5}
              defaultValue={(initial?.modules ?? []).join("\n")}
              className="input min-h-[130px] font-mono text-xs"
              placeholder={"Clipper anatomy\nLow / mid / high fades\nBlending"}
            />
          </div>

          <div>
            <label className="label" htmlFor="preview_images">
              PDF preview images{" "}
              <span className="text-white/40">
                (one URL per line — shown on the course detail page)
              </span>
            </label>
            <textarea
              id="preview_images"
              name="preview_images"
              rows={4}
              defaultValue={(initial?.preview_images ?? []).join("\n")}
              className="input min-h-[110px] font-mono text-xs"
              placeholder={"https://images.unsplash.com/photo-…\nhttps://images.unsplash.com/photo-…"}
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={initial?.is_published ?? true}
              className="h-4 w-4 accent-pink-500"
            />
            <span>Published (visible on the public catalog)</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={pending}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={pending}>
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Create course"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
