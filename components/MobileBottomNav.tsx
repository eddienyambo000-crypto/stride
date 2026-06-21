"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Sparkles, Phone } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/shop", label: "Shop", icon: ShoppingBag, match: (p: string) => p.startsWith("/shop") },
  { href: "/shop?c=limited", label: "Drops", icon: Sparkles, match: () => false },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p === "/cart", cart: true },
  { href: "/contact", label: "Contact", icon: Phone, match: (p: string) => p === "/contact" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();

  // Hide on admin + checkout (focused flows).
  if (pathname.startsWith("/admin") || pathname === "/checkout") return null;

  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-3 mb-3 rounded-full glass shadow-[var(--shadow-float)] flex items-center justify-around px-1.5 py-1.5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 min-w-12 transition-colors",
                active ? "text-accent-deep" : "text-ink-soft",
              )}
            >
              <span className="relative">
                <Icon
                  size={21}
                  strokeWidth={active ? 2.4 : 1.9}
                  className={cn(
                    "transition-transform duration-200",
                    active && "scale-110 -translate-y-px",
                  )}
                />
                {item.cart && hydrated && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 grid place-items-center rounded-full bg-accent text-white text-[10px] font-bold tabular-nums">
                    {count}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
