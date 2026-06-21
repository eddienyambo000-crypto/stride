import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-full overflow-hidden " +
  "transition-[transform,box-shadow,color] duration-200 ease-out " +
  "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

const variants: Record<Variant, string> = {
  // Glass-sky CTA: deep sky base with inset light + sky glow (scaled stardust)
  primary:
    "text-white bg-[linear-gradient(180deg,#1aa0dd,#0a5e89)] " +
    "shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-2px_6px_rgba(8,40,60,0.6),0_10px_28px_-10px_rgba(56,189,248,0.65)] " +
    "hover:-translate-y-0.5 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-2px_8px_rgba(8,40,60,0.55),0_16px_34px_-10px_rgba(56,189,248,0.8)]",
  secondary:
    "bg-ink text-canvas hover:bg-ink-soft hover:-translate-y-0.5 shadow-[var(--shadow-soft)]",
  ghost:
    "bg-transparent text-ink border border-line hover:border-ink hover:bg-ink/[0.03]",
  dark: "glass-ink text-canvas hover:bg-ink/70",
};

const sizes: Record<Size, string> = {
  sm: "text-sm h-9 px-4",
  md: "text-[15px] h-11 px-6",
  lg: "text-base h-14 px-8",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

function Sheen({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)] transition-transform duration-700 ease-out group-hover/btn:translate-x-full"
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Sheen show={variant === "primary"} />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  const external = href.startsWith("http") || href.startsWith("tel:");
  const cls = cn(base, variants[variant], sizes[size], className);
  const inner = (
    <>
      <Sheen show={variant === "primary"} />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} {...props}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...props}>
      {inner}
    </Link>
  );
}
