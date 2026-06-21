import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * STRIDE wordmark. Uses the script flourish for "Stride" with a small
 * uppercase "to conquer" lockup — echoing the signature logo.
 * Swap for the real logo PNG/SVG in /public once the client sends it.
 */
export function Logo({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "canvas";
}) {
  const color = tone === "canvas" ? "text-canvas" : "text-ink";
  return (
    <Link
      href="/"
      aria-label="STRIDE — home"
      className={cn("group inline-flex items-end leading-none", color, className)}
    >
      <span className="font-script text-3xl sm:text-4xl pr-2 -mb-1 transition-transform duration-300 group-hover:-rotate-2">
        Stride
      </span>
      <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-[0.32em] pb-1 text-accent">
        to&nbsp;conquer
      </span>
    </Link>
  );
}
