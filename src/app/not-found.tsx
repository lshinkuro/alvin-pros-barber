import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center">
      <Navbar />
      <div className="container-page text-center">
        <div className="font-display text-[12rem] font-semibold leading-none gradient-text">
          404
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Page not found.
        </h1>
        <p className="mt-3 text-white/60">
          The page you're looking for has either moved or never existed.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </main>
  );
}
