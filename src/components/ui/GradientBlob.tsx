"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBlobProps {
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  size?: number;
  delay?: number;
}

export function GradientBlob({
  className,
  from = "#ff6b34",
  via = "#ff4a8a",
  to = "#a06bff",
  size = 480,
  delay = 0,
}: GradientBlobProps) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 0.55, scale: 1 }}
      transition={{ duration: 1.6, ease: "easeOut", delay }}
      className={cn("pointer-events-none absolute -z-10 rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(closest-side, ${from}, ${via} 45%, ${to} 75%, transparent 80%)`,
        filter: "blur(60px)",
      }}
    >
      <motion.div
        className="h-full w-full rounded-full"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -25, 30, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      />
    </motion.div>
  );
}
