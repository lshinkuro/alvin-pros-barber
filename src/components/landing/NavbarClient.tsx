"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { signOutAction } from "@/lib/auth/actions";

const links = [
  { href: "/", label: "Home" },
  { href: "/#courses", label: "Courses" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#faq", label: "FAQ" },
];

interface NavbarClientProps {
  isAuthenticated: boolean;
  dashboardHref: string;
}

export function NavbarClient({ isAuthenticated, dashboardHref }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled
            ? "border-white/10 bg-black/50 shadow-glass backdrop-blur-2xl"
            : "border-white/5 bg-white/[0.02] backdrop-blur-xl"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 text-white shadow-soft">
            <Scissors className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Alvin Barber Academy
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Link href={dashboardHref} className="btn-ghost">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="btn-primary">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[68px] z-40 rounded-3xl border border-white/10 bg-black/70 p-3 backdrop-blur-2xl md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="btn-secondary w-full"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <form action={signOutAction}>
                    <button type="submit" className="btn-primary w-full">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-secondary w-full"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary w-full"
                    onClick={() => setOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
