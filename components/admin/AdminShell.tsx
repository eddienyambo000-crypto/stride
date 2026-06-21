"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/admin", label: "Orders" },
  { href: "/admin/products", label: "Products" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-script text-3xl leading-none">
              Stride
            </Link>
            <nav className="flex items-center gap-1" aria-label="Admin sections">
              {TABS.map((tab) => {
                const active =
                  tab.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(tab.href);
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "rounded-[var(--radius-md)] px-3.5 py-2 text-sm font-semibold transition-colors",
                      active
                        ? "bg-ink text-canvas"
                        : "text-ink-soft hover:bg-ink/[0.05]",
                    )}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-medium text-ink-soft hover:text-ink hidden sm:block"
            >
              View store ↗
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-sm font-semibold text-ink-soft hover:text-danger transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
    </>
  );
}
