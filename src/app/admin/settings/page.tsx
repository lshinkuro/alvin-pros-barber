import { Settings, CreditCard, Mail, Database } from "lucide-react";

export default function AdminSettingsPage() {
  const sections = [
    {
      icon: CreditCard,
      title: "Payment provider",
      body: "Currently using WhatsApp (manual confirmation). Add MIDTRANS, XENDIT, or STRIPE provider implementations under src/lib/payments and switch via NEXT_PUBLIC_PAYMENT_PROVIDER.",
      env: "NEXT_PUBLIC_PAYMENT_PROVIDER=whatsapp",
    },
    {
      icon: Mail,
      title: "Email (Resend)",
      body: "Course delivery emails are sent via Resend. Configure your API key and verified sender domain.",
      env: "RESEND_API_KEY=…\nEMAIL_FROM=AlfinSquare Academy <courses@yourdomain.com>",
    },
    {
      icon: Database,
      title: "Supabase",
      body: "Database, auth, and PDF storage. Run supabase/schema.sql once on a new project to create tables, policies, and seed the catalog.",
      env: "NEXT_PUBLIC_SUPABASE_URL=…\nNEXT_PUBLIC_SUPABASE_ANON_KEY=…\nSUPABASE_SERVICE_ROLE_KEY=…\nSUPABASE_PDF_BUCKET=course-pdfs",
    },
    {
      icon: Settings,
      title: "Admin access",
      body: "Users with profiles.role = 'admin' (or whose email is in ADMIN_EMAILS) can access this dashboard.",
      env: "ADMIN_EMAILS=admin@yourdomain.com",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">
        Settings
      </h1>
      <p className="mt-2 text-white/60">
        Read-only overview of the moving parts. Configure these via your
        environment variables.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Icon className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-semibold">
                  {s.title}
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/65">
                {s.body}
              </p>
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-[12px] leading-relaxed text-white/80">
                {s.env}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
