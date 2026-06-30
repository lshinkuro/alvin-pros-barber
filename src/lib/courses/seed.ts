import type { Course } from "@/types/database";

/**
 * Fallback course catalog used when the database is empty or unreachable.
 * After running the seed SQL these are also present in Supabase, but the
 * landing pages work even with zero configuration.
 */
export const seedCourses: Course[] = [
  {
    id: "seed-haircut-fundamentals",
    slug: "haircut-fundamentals",
    title: "Haircut Fundamentals",
    description:
      "The foundation of every great barber. Master your tools, posture, sectioning, guide lines, and the universal language every haircut starts from. Built for absolute beginners but loved by working barbers brushing up.",
    price: 49,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Tools & sanitation",
      "Posture & ergonomics",
      "Sectioning & guide lines",
      "Universal cutting language",
      "First haircut walkthrough",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-fade-techniques",
    slug: "fade-techniques",
    title: "Fade Techniques",
    description:
      "Low, mid, high, skin and burst fades — clipper-over-comb, lever control, and seamless blending. Step-by-step photography on light, dark, curly, and straight hair.",
    price: 69,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Clipper anatomy & lever control",
      "Low / mid / high fades",
      "Skin & burst fades",
      "Blending on every hair type",
      "Fixing common fade mistakes",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-scissor-cutting",
    slug: "scissor-cutting",
    title: "Scissor Cutting",
    description:
      "Point cutting, slide cutting, texturizing, and the editorial scissor-only haircut. The module that separates good barbers from great ones.",
    price: 59,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Scissor anatomy & grip",
      "Point & slide cutting",
      "Texturizing & weight removal",
      "Scissor-only haircut",
      "Editorial finishing",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-beard-styling",
    slug: "beard-styling",
    title: "Beard Styling",
    description:
      "Face shape mapping, line work, the perfect hot-towel shave routine, and ongoing beard maintenance plans for clients.",
    price: 49,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Face shape mapping",
      "Outline & line work",
      "Hot-towel shave routine",
      "Beard maintenance plans",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-hair-coloring",
    slug: "hair-coloring",
    title: "Hair Coloring",
    description:
      "Color theory, foundation tones, lifts, toners, and the safest path from natural shades into fashion color.",
    price: 79,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Color theory",
      "Foundation tones & lifts",
      "Toners & glosses",
      "Fashion color safely",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-barber-business",
    slug: "barber-business",
    title: "Barber Business",
    description:
      "Pricing, booking, retention, social content and turning your chair into a real brand with predictable income.",
    price: 89,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Pricing & packaging",
      "Booking & no-show defense",
      "Retention systems",
      "Social content engine",
      "Brand & shop economics",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-customer-service",
    slug: "customer-service",
    title: "Customer Service",
    description:
      "Consultations, difficult conversations, recovery from mistakes, and turning first-time clients into lifetime clients.",
    price: 39,
    cover_image: null,
    preview_images: null,
    pdf_path: null,
    modules: [
      "Consultation framework",
      "Handling difficult conversations",
      "Recovering from mistakes",
      "Lifetime client systems",
    ],
    is_published: true,
    created_at: new Date().toISOString(),
  },
];

const gradients: Record<string, string> = {
  "haircut-fundamentals": "linear-gradient(135deg,#ff6b34 0%,#ff4a8a 60%,#a06bff 100%)",
  "fade-techniques": "linear-gradient(135deg,#785aff 0%,#4ab8ff 50%,#21d4a0 100%)",
  "scissor-cutting": "linear-gradient(135deg,#ffb45e 0%,#ff6b34 50%,#ff4a8a 100%)",
  "beard-styling": "linear-gradient(135deg,#21d4a0 0%,#4ab8ff 60%,#785aff 100%)",
  "hair-coloring": "linear-gradient(135deg,#ff4a8a 0%,#a06bff 50%,#4ab8ff 100%)",
  "barber-business": "linear-gradient(135deg,#0e0e12 0%,#2f2f38 60%,#ff6b34 100%)",
  "customer-service": "linear-gradient(135deg,#4ab8ff 0%,#785aff 50%,#ff4a8a 100%)",
};

export function gradientFor(slug: string) {
  return (
    gradients[slug] || "linear-gradient(135deg,#ff6b34 0%,#ff4a8a 60%,#a06bff 100%)"
  );
}
