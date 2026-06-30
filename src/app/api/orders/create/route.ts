import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveProvider } from "@/lib/payments";
import { seedCourses } from "@/lib/courses/seed";

/**
 * Create (or reuse) a "waiting" order for the authenticated user and return
 * the active payment provider's checkout payload (today: WhatsApp link).
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    course_slug?: string;
    course_id?: string;
  };

  if (!body.course_slug && !body.course_id) {
    return NextResponse.json(
      { error: "course_slug or course_id required" },
      { status: 400 },
    );
  }

  // Resolve course (DB first, seed fallback)
  let course = null as Awaited<ReturnType<typeof loadCourse>> | null;
  course = await loadCourse(supabase, body);
  if (!course) {
    return NextResponse.json({ error: "course_not_found" }, { status: 404 });
  }

  // Load / upsert profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const userProfile = profile ?? {
    id: user.id,
    name: (user.user_metadata?.name as string) || user.email || "Student",
    email: user.email || "",
    role: "user" as const,
    created_at: new Date().toISOString(),
  };

  // Reuse a still-waiting order for the same course, otherwise create one
  let orderId: string | undefined;
  if (!course.id.startsWith("seed-")) {
    const { data: existing } = await supabase
      .from("orders")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .eq("status", "waiting")
      .maybeSingle();

    if (existing) {
      orderId = existing.id;
    } else {
      const { data: created, error: createError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          course_id: course.id,
          status: "waiting",
        })
        .select("id")
        .single();
      if (createError) {
        return NextResponse.json(
          { error: "order_create_failed", detail: createError.message },
          { status: 500 },
        );
      }
      orderId = created.id;
    }
  }

  const provider = getActiveProvider();
  const checkout = await provider.checkout({
    course,
    user: userProfile,
    orderId,
  });

  return NextResponse.json({ ...checkout, orderId, provider: provider.id });
}

async function loadCourse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  body: { course_slug?: string; course_id?: string },
) {
  try {
    const query = supabase.from("courses").select("*").limit(1);
    const { data } = body.course_id
      ? await query.eq("id", body.course_id).maybeSingle()
      : await query.eq("slug", body.course_slug!).maybeSingle();
    if (data) return data;
  } catch {
    /* fall through */
  }
  // Seed fallback
  return (
    seedCourses.find(
      (c) => c.slug === body.course_slug || c.id === body.course_id,
    ) ?? null
  );
}
