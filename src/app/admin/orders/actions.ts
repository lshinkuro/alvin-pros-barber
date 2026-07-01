"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateDownloadToken, generatePdfPassword } from "@/lib/pdf/password";
import { courseDeliveryEmail } from "@/lib/email/templates/course-delivery";
import { EMAIL_FROM, getResend } from "@/lib/email/resend";
import type { Profile } from "@/types/database";
import type { OrderInternalRow, CourseAdminRow } from "@/types/rows";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("unauthorized");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const profile = profileData as Pick<Profile, "role"> | null;

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin =
    profile?.role === "admin" ||
    adminEmails.includes((user.email || "").toLowerCase());
  if (!isAdmin) throw new Error("forbidden");
}

/**
 * Mark an order as completed:
 *   - generate strong PDF password + download token
 *   - create a 7-day signed URL for the course PDF in Supabase Storage
 *   - email the buyer via Resend
 *   - update the order row
 */
export async function sendCourseAction(orderId: string) {
  await assertAdmin();
  const admin = createAdminClient();

  const { data: orderData, error: orderError } = await admin
    .from("orders")
    .select("id, status, user_id, course_id")
    .eq("id", orderId)
    .single();
  if (orderError || !orderData) {
    return { ok: false as const, error: "Order not found" };
  }
  const order = orderData as OrderInternalRow;
  if (order.status === "completed") {
    return { ok: false as const, error: "Order is already completed" };
  }

  const [courseRes, profileRes] = await Promise.all([
    admin
      .from("courses")
      .select("id, title, pdf_path")
      .eq("id", order.course_id)
      .single(),
    admin
      .from("profiles")
      .select("id, name, email")
      .eq("id", order.user_id)
      .single(),
  ]);
  const course = courseRes.data as CourseAdminRow | null;
  const buyerProfile = profileRes.data as
    | Pick<Profile, "id" | "name" | "email">
    | null;

  if (!course || !buyerProfile) {
    return { ok: false as const, error: "Course or user record missing" };
  }

  const password = generatePdfPassword();
  const token = generateDownloadToken();

  // Try to create a signed URL from Supabase Storage if a pdf_path exists.
  let downloadUrl: string | null = null;
  const bucket = process.env.SUPABASE_PDF_BUCKET || "course-pdfs";
  if (course.pdf_path) {
    const { data: signed } = await admin.storage
      .from(bucket)
      .createSignedUrl(course.pdf_path, 60 * 60 * 24 * 7); // 7 days
    if (signed?.signedUrl) downloadUrl = signed.signedUrl;
  }
  // Fallback so the email is always actionable
  if (!downloadUrl) {
    downloadUrl =
      (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") +
      `/dashboard/orders`;
  }

  // Send the email
  let emailId: string | null = null;
  try {
    const { subject, html, text } = courseDeliveryEmail({
      name: buyerProfile.name,
      course: course.title,
      password,
      downloadUrl,
    });
    const resend = getResend();
    const { data: sent, error: emailError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: buyerProfile.email,
      subject,
      html,
      text,
    });
    if (emailError) {
      return { ok: false as const, error: emailError.message };
    }
    emailId = sent?.id ?? null;
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Failed to send email",
    };
  }

  // Mark order completed
  const { error: updateError } = await admin
    .from("orders")
    .update({
      status: "completed",
      pdf_password: password,
      download_token: token,
      delivered_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    return { ok: false as const, error: updateError.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
  return { ok: true as const, emailId };
}

export async function rejectOrderAction(orderId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ status: "rejected" })
    .eq("id", orderId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
  return { ok: true as const };
}

/**
 * Manually set an order's status without triggering the email flow.
 * Useful for correcting mistakes ("mark as paid" without re-sending the PDF,
 * "cancel" an order, or reopening one back to waiting).
 */
export async function setOrderStatusAction(
  orderId: string,
  status: "waiting" | "completed" | "rejected",
) {
  await assertAdmin();
  const admin = createAdminClient();
  const patch: Record<string, unknown> = { status };
  if (status === "completed") {
    // Stamp delivery time so /dashboard/orders reflects a paid order even
    // when the admin skips the "Send Course" email flow.
    patch.delivered_at = new Date().toISOString();
  }
  const { error } = await admin.from("orders").update(patch).eq("id", orderId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard/orders");
  return { ok: true as const };
}
