"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";

interface BuyButtonProps {
  courseSlug: string;
  isAuthenticated: boolean;
  className?: string;
}

export function BuyButton({ courseSlug, isAuthenticated, className }: BuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setError(null);
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseSlug}`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ course_slug: courseSlug }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      if (json.type === "redirect" && json.url) {
        window.location.href = json.url;
      } else {
        router.push("/dashboard/orders");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="btn-primary w-full sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <MessageCircle className="h-4 w-4" />
            Buy via WhatsApp
          </>
        )}
      </button>
      {error && (
        <div className="mt-3 text-sm text-red-300">{error}</div>
      )}
    </div>
  );
}
