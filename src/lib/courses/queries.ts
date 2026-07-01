import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types/database";
import { seedCourses } from "./seed";

/**
 * Fetch all published courses. Falls back to seed data if DB is empty / not configured.
 */
export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as Course[];
  } catch {
    /* fall through */
  }
  return seedCourses;
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return data as Course;
  } catch {
    /* fall through */
    console.warn(`Failed to fetch course with slug "${slug}" from database, falling back to seed data.`);
    console.log(`Seed courses: ${JSON.stringify(seedCourses)}`)
  }
  return seedCourses.find((c) => c.slug === slug) ?? null;
}
