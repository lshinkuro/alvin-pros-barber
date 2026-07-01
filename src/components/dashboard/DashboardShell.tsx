"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  ListOrdered,
  User,
  LogOut,
  Scissors,
  ShieldCheck,
  Users as UsersIcon,
  Settings as SettingsIcon,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  variant: "user" | "admin";
  user: { name: string; email: string };
  children: React.ReactNode;
}

const userLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/orders", label: "Orders", icon: ListOrdered },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardShell({
  variant,
  user,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const links = variant === "admin" ? adminLinks : userLinks;

  return (
    <div className="relative min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-white/10 bg-black/30 backdrop-blur-2xl lg:flex">
        <div className="flex items-center gap-2.5 px-7 py-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 text-white">
            <Scissors className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div>
            <div className="font-display text-sm font-semibold tracking-tight">
              AlfinSquare Academy
            </div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              {variant === "admin" ? "Admin" : "Student"}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-1">
            {links.map((l) => {
              const active =
                pathname === l.href ||
                (l.href !== "/dashboard" &&
                  l.href !== "/admin" &&
                  pathname.startsWith(l.href));
              const Icon = l.icon;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition",
                      active
                        ? "bg-white/[0.06] text-white"
                        : "text-white/65 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`active-${variant}`}
                        className="absolute inset-0 -z-10 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="h-4 w-4" />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-pink-500 text-xs font-semibold text-white">
              {user.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">
                {user.name}
              </div>
              <div className="truncate text-[11px] text-white/50">
                {user.email}
              </div>
            </div>
          </div>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.04] hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/50 px-5 py-3 backdrop-blur-2xl lg:hidden">
        <Link href={variant === "admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 text-white">
            <Scissors className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-sm font-semibold">
            AlfinSquare Academy
          </span>
        </Link>
        <form action={signOutAction}>
          <button
            type="submit"
            aria-label="Log out"
            className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </header>

      <main className="relative min-h-screen px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {/* Mobile sub-nav */}
        <div className="-mx-1 mb-8 flex gap-1 overflow-x-auto no-scrollbar lg:hidden">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/dashboard" &&
                l.href !== "/admin" &&
                pathname.startsWith(l.href));
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition",
                  active
                    ? "border-white/15 bg-white/[0.06] text-white"
                    : "border-white/10 bg-white/[0.02] text-white/65",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            );
          })}
        </div>

        {variant === "admin" && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin mode
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
