import type { Profile, Course, Order, OrderStatus } from "@/types/database";

/**
 * Shapes returned by our common Supabase joined selects.
 * Used together with `.returns<T>()` so the queries stay strongly typed
 * even though we keep the generated Database type minimal.
 */

export type ProfileRow = Pick<Profile, "id" | "name" | "email" | "role" | "created_at">;

export type CourseRow = Course;

export interface OrderListRow {
  id: string;
  status: OrderStatus;
  created_at: string;
  delivered_at?: string | null;
  course: Pick<Course, "id" | "title" | "slug" | "price"> | null;
  profile?: Pick<Profile, "name" | "email"> | null;
}

export interface OrderSummaryRow {
  id: string;
  status: OrderStatus;
  created_at: string;
  course: Pick<Course, "id" | "title" | "slug"> | null;
  profile?: Pick<Profile, "name" | "email"> | null;
}

export interface OrderInternalRow {
  id: string;
  status: OrderStatus;
  user_id: string;
  course_id: string;
}

export type CourseAdminRow = Pick<Course, "id" | "title" | "pdf_path">;
