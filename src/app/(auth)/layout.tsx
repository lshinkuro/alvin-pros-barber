import Link from "next/link";
import { Scissors } from "lucide-react";
import { GradientBlob } from "@/components/ui/GradientBlob";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left: marketing pane */}
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden className="absolute inset-0 -z-10 grid-bg" />
        <GradientBlob className="-left-40 top-10" size={520} />
        <GradientBlob
          className="-bottom-40 -right-20"
          size={520}
          from="#785aff"
          via="#ff4a8a"
          to="#ff6b34"
          delay={0.3}
        />

        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 via-pink-500 to-purple-500 text-white">
            <Scissors className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            AlfinSquare Academy
          </span>
        </Link>

        <div className="max-w-md">
          <h2 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            <span className="gradient-text">Sharpen the craft.</span>
            <br />
            <span className="text-white/90">Build the career.</span>
          </h2>
          <p className="mt-5 text-pretty text-white/60">
            Join thousands of barbers using our premium PDF curriculum to level
            up their fades, their scissor work, and their business.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["MT", "DR", "AK", "JL"].map((a, i) => (
                <span
                  key={a}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink-950 bg-gradient-to-br text-[10px] font-semibold text-white ${
                    [
                      "from-accent-400 to-pink-500",
                      "from-purple-500 to-blue-500",
                      "from-emerald-400 to-cyan-500",
                      "from-orange-400 to-rose-500",
                    ][i]
                  }`}
                >
                  {a}
                </span>
              ))}
            </div>
            <div className="text-sm text-white/60">
              <span className="font-semibold text-white">12,000+</span> barbers
              are learning with us.
            </div>
          </div>
        </div>

        <div className="text-xs text-white/40">
          © {new Date().getFullYear()} AlfinSquare Academy
        </div>
      </section>

      {/* Right: form */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div aria-hidden className="absolute inset-0 -z-10 lg:hidden">
          <GradientBlob className="-top-20 -right-20" size={420} />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
