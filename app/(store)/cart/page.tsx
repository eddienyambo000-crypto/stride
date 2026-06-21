"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { ButtonLink } from "@/components/ui/Button";
import { rwfLabel } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, count, hydrated } = useCart();

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)]">Your cart is empty</h1>
        <p className="mt-3 text-ink-soft">
          Find something worth conquering for.
        </p>
        <div className="mt-7">
          <ButtonLink href="/shop" size="lg">
            Shop the collection
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] mb-8">
        Cart{hydrated ? ` (${count})` : ""}
      </h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.key} className="py-5 flex gap-4">
              <Link
                href={`/shop/${line.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-canvas-soft border border-line"
              >
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <Link
                    href={`/shop/${line.slug}`}
                    className="font-semibold leading-snug hover:text-accent transition-colors"
                  >
                    {line.name}
                  </Link>
                  <span className="font-bold tabular-nums whitespace-nowrap">
                    {rwfLabel(line.unitPrice * line.qty)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {[line.size, line.color].filter(Boolean).join(" · ") || "—"}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-[var(--radius-md)] border border-line">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(line.key, line.qty - 1)}
                      className="h-9 w-9 grid place-items-center text-lg text-ink-soft hover:text-ink hover:bg-ink/[0.04] transition-colors cursor-pointer"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(line.key, line.qty + 1)}
                      className="h-9 w-9 grid place-items-center text-lg text-ink-soft hover:text-ink hover:bg-ink/[0.04] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="text-sm font-medium text-muted hover:text-danger transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-6">
          <h2 className="font-display text-xl mb-4">Summary</h2>
          <div className="flex justify-between text-sm py-2">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-semibold tabular-nums">{rwfLabel(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-line">
            <span className="text-ink-soft">Delivery</span>
            <span className="text-muted">Calculated at checkout</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Total</span>
            <span className="font-bold tabular-nums">{rwfLabel(subtotal)}+</span>
          </div>
          <ButtonLink href="/checkout" size="lg" className="w-full mt-2">
            Checkout
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-muted">
            Pay on delivery · Inspect before you pay
          </p>
          <Link
            href="/shop"
            className="mt-4 block text-center text-sm font-medium text-ink-soft hover:text-accent transition-colors"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
