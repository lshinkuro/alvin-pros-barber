# Barber Academy

A premium, editorial-quality website for selling barber training PDF courses.
Built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase**, and **Resend**.

> Design inspired by Gradient World, Linear, Apple, and Stripe — glassmorphism, large typography, beautiful gradients, smooth animations, and full mobile responsiveness.

---

## Features

- **Landing page** with sticky glass navbar, hero w/ floating PDF mockup, animated gradient blobs, why-choose-us cards, course modules, testimonials, FAQ accordion, and footer.
- **Authentication** with Supabase: email/password, forgot password, profile page, server-action logout.
- **Course catalog** + course detail page with cover, description, modules, preview tiles, and a **Buy via WhatsApp** flow.
- **User dashboard**: home, orders (Waiting Payment / Completed), profile (name + password).
- **Admin dashboard**: overview KPIs, orders table with `View / Send Course / Reject`, courses, users, settings.
- **Send Course** automation: generates a unique PDF password, creates a 7-day signed Supabase Storage URL, emails the customer via Resend, and flips the order to `completed`.
- **Future-ready payment abstraction** — `src/lib/payments/provider.ts` defines a `PaymentProvider` interface. Today: `whatsapp`. Tomorrow: drop in `midtrans`, `xendit`, or `stripe` without touching the rest of the code.
- **Mobile-first**, fully responsive, dark premium aesthetic.

---

## Project structure

```
src/
├─ app/
│  ├─ (auth)/login | register | forgot-password
│  ├─ admin/   (dashboard, orders, courses, users, settings)
│  ├─ api/orders/create        # creates order + returns checkout payload
│  ├─ auth/callback             # Supabase email confirmation handler
│  ├─ courses/[slug]            # course detail + Buy via WhatsApp
│  ├─ dashboard/ (home, orders, profile)
│  ├─ globals.css               # design system
│  ├─ layout.tsx                # fonts + metadata
│  └─ page.tsx                  # landing
├─ components/
│  ├─ courses/BuyButton.tsx
│  ├─ dashboard/DashboardShell.tsx
│  ├─ landing/ (Navbar, Hero, WhyChooseUs, CourseModules, Testimonials, FAQ, Footer)
│  └─ ui/ (GradientBlob, Motion, PDFMockup)
├─ lib/
│  ├─ auth/actions.ts           # signOut server action
│  ├─ courses/ (queries, seed)
│  ├─ email/ (resend, templates/course-delivery)
│  ├─ payments/ (provider, whatsapp, index)  # 👈 plug new providers here
│  ├─ pdf/password.ts
│  ├─ supabase/ (client, server, admin)
│  └─ utils.ts
├─ middleware.ts                # auth guard for /dashboard and /admin
└─ types/database.ts
supabase/schema.sql             # tables, RLS, triggers, storage bucket, seed
```

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in:

```ini
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RESEND_API_KEY=
EMAIL_FROM="Barber Academy <courses@yourdomain.com>"

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=15551234567
ADMIN_EMAILS=admin@yourdomain.com
SUPABASE_PDF_BUCKET=course-pdfs
```

### 3. Supabase setup

1. Create a Supabase project.
2. Open the **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**.
   This creates the `profiles`, `courses`, `orders` tables, RLS policies, the auto-profile trigger,
   the private `course-pdfs` storage bucket, and seeds the seven module catalog.
3. Upload your real course PDFs into the `course-pdfs` bucket and set the `pdf_path` column on each course to the matching object path (e.g. `fades.pdf`).
4. Make yourself an admin: either set `profiles.role = 'admin'` for your row, or add your email to `ADMIN_EMAILS`.

### 4. Resend setup

1. Sign up at [resend.com](https://resend.com), create an API key, and verify your sending domain.
2. Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Purchase flow (today: WhatsApp)

```
User logs in
   ↓
Opens a course
   ↓
Clicks "Buy via WhatsApp"
   ↓
POST /api/orders/create
   • creates a "waiting" order row
   • asks the active PaymentProvider for a checkout payload
   • whatsapp provider → returns a wa.me/<number> URL with a pre-filled message
   ↓
User sends the message → admin verifies payment manually
   ↓
Admin → /admin/orders → "Send Course"
   • generates a strong BARBER-XXXX-XXXX-XXXX PDF password
   • signs a 7-day Supabase Storage URL for the PDF
   • emails the buyer via Resend (premium HTML template)
   • flips order.status to "completed"
   ↓
User sees "The course has been sent to your email." in /dashboard/orders
```

## Adding a real payment gateway later

Everything is already wired through `PaymentProvider` (`src/lib/payments/provider.ts`).

1. Create `src/lib/payments/midtrans.ts` (or xendit / stripe) exporting an object that satisfies `PaymentProvider`.
2. Register it inside `src/lib/payments/index.ts`.
3. Set `NEXT_PUBLIC_PAYMENT_PROVIDER=midtrans` (or whichever).

The Buy button, `/api/orders/create`, the dashboards, and the email flow do not need to change.

---

## Animations

Built on Framer Motion:

- Fade-in + slide-up reveals (`Reveal` in `src/components/ui/Motion.tsx`)
- Floating hero (`animate y/rotate`)
- Animated gradient blobs (`GradientBlob`)
- Smooth hover + transform on cards
- Page transitions via Next.js App Router
- Scroll reveal with `whileInView`

---

## License

Internal project scaffolding. Replace this section with your real license before publishing.
