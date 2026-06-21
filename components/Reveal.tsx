import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal — CSS-only. Content is visible by default and animates in via
 * native scroll-driven animations where supported (graceful degradation, no JS,
 * fast on low-data). See `.reveal` in globals.css.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number; // accepted for call-site compatibility; not needed with CSS
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
