"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const profile = data as Pick<Profile, "role"> | null;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    profile?.role === "admin" ||
    adminEmails.includes((user.email || "").toLowerCase());
  if (!isAdmin) throw new Error("forbidden");

  return supabase;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseModules(raw: string): string[] {
  if (!raw) return [];
  // Accept comma OR newline separated list.
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePreviewImages(raw: string): string[] {
  if (!raw) return [];
  // One URL per line — commas can appear inside Unsplash / Supabase URLs.
  return raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePrice(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}

export interface CourseActionResult {
  ok: boolean;
  error?: string;
}

export async function createCourseAction(
  _prev: CourseActionResult | null,
  formData: FormData,
): Promise<CourseActionResult> {
  try {
    const supabase = await assertAdmin();
    const title = String(formData.get("title") || "").trim();
    if (!title) return { ok: false, error: "Title is required" };

    const providedSlug = String(formData.get("slug") || "").trim();
    const slug = providedSlug ? slugify(providedSlug) : slugify(title);
    if (!slug) return { ok: false, error: "Slug could not be generated" };

    const description = String(formData.get("description") || "").trim();
    const price = parsePrice(String(formData.get("price") || "0"));
    const cover_image =
      String(formData.get("cover_image") || "").trim() || null;
    const pdf_path = String(formData.get("pdf_path") || "").trim() || null;
    const modules = parseModules(String(formData.get("modules") || ""));
    const preview_images = parsePreviewImages(
      String(formData.get("preview_images") || ""),
    );
    const is_published = formData.get("is_published") === "on";

    const { error } = await supabase.from("courses").insert({
      slug,
      title,
      description,
      price,
      cover_image,
      pdf_path,
      modules,
      preview_images,
      is_published,
    });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

export async function updateCourseAction(
  _prev: CourseActionResult | null,
  formData: FormData,
): Promise<CourseActionResult> {
  try {
    const supabase = await assertAdmin();
    const id = String(formData.get("id") || "");
    if (!id) return { ok: false, error: "Missing course id" };

    const title = String(formData.get("title") || "").trim();
    if (!title) return { ok: false, error: "Title is required" };

    const slug = slugify(String(formData.get("slug") || title));
    if (!slug) return { ok: false, error: "Slug could not be generated" };

    const description = String(formData.get("description") || "").trim();
    const price = parsePrice(String(formData.get("price") || "0"));
    const cover_image =
      String(formData.get("cover_image") || "").trim() || null;
    const pdf_path = String(formData.get("pdf_path") || "").trim() || null;
    const modules = parseModules(String(formData.get("modules") || ""));
    const preview_images = parsePreviewImages(
      String(formData.get("preview_images") || ""),
    );
    const is_published = formData.get("is_published") === "on";

    const { error } = await supabase
      .from("courses")
      .update({
        slug,
        title,
        description,
        price,
        cover_image,
        pdf_path,
        modules,
        preview_images,
        is_published,
      })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin/courses");
    revalidatePath(`/courses/${slug}`);
    revalidatePath("/courses");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

export async function toggleCoursePublishedAction(
  id: string,
  next: boolean,
): Promise<CourseActionResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase
      .from("courses")
      .update({ is_published: next })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}

export async function deleteCourseAction(
  id: string,
): Promise<CourseActionResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unexpected error",
    };
  }
}
