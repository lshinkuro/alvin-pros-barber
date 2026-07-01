import { createAdminClient } from "@/lib/supabase/admin";
import { CourseManager } from "./CourseManager";
import type { Course } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });
  const courses = (data ?? []) as Course[];

  return <CourseManager courses={courses} />;
}
