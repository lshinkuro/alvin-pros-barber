import Link from "next/link";
import { Scissors, Mail, MessageCircle, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 pt-20">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 text-white">
                <Scissors className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="font-display text-base font-semibold tracking-tight">
                Barber Academy
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Premium barber training, delivered as beautifully crafted PDFs.
              Built by a working master barber, for the next generation.
            </p>
          </div>

          <FooterCol
            title="Learn"
            links={[
              { href: "/#courses", label: "Courses" },
              { href: "/#testimonials", label: "Testimonials" },
              { href: "/#faq", label: "FAQ" },
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              { href: "/login", label: "Login" },
              { href: "/register", label: "Register" },
              { href: "/dashboard", label: "Dashboard" },
            ]}
          />
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
              Contact
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/40" />
                hello@barberacademy.io
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-white/40" />
                WhatsApp · 24/7
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-white/40" />
                @barberacademy
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 py-8 text-xs text-white/45 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Barber Academy. All rights reserved.</span>
          <span className="flex items-center gap-5">
            <Link href="#" className="hover:text-white/80">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white/80">
              Terms
            </Link>
            <Link href="#" className="hover:text-white/80">
              License
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
        {title}
      </div>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-white/70 transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
