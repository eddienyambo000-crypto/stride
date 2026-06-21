"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const soldOut = product.stock_status === "sold_out";

  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null,
  );
  const [color, setColor] = useState<string | null>(
    product.colors.length === 1 ? product.colors[0] : null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsSize = product.sizes.length > 1;
  const needsColor = product.colors.length > 1;

  function validate(): boolean {
    if (needsSize && !size) {
      setError("Please select a size.");
      return false;
    }
    if (needsColor && !color) {
      setError("Please select a colour.");
      return false;
    }
    setError(null);
    return true;
  }

  function doAdd(): boolean {
    if (soldOut || !validate()) return false;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url ?? "",
        size: size ?? null,
        color: color ?? null,
        unitPrice: product.price_rwf,
      },
      qty,
    );
    return true;
  }

  function handleAdd() {
    if (doAdd()) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }
  }

  function handleBuyNow() {
    if (doAdd()) router.push("/checkout");
  }

  return (
    <div className="mt-7">
      {needsSize && (
        <Selector
          label="Size"
          options={product.sizes}
          value={size}
          onChange={(v) => {
            setSize(v);
            setError(null);
          }}
        />
      )}
      {needsColor && (
        <Selector
          label="Colour"
          options={product.colors}
          value={color}
          onChange={(v) => {
            setColor(v);
            setError(null);
          }}
        />
      )}

      {/* Quantity */}
      <div className="mt-5">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-2">
          Quantity
        </span>
        <div className="inline-flex items-center rounded-[var(--radius-md)] border border-line">
          <QtyBtn ariaLabel="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </QtyBtn>
          <span className="w-12 text-center font-semibold tabular-nums">{qty}</span>
          <QtyBtn ariaLabel="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
            +
          </QtyBtn>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAdd}
          variant="secondary"
          size="lg"
          disabled={soldOut}
          className="flex-1"
        >
          {soldOut ? "Sold out" : added ? "Added ✓" : "Add to cart"}
        </Button>
        <Button onClick={handleBuyNow} size="lg" disabled={soldOut} className="flex-1">
          Buy now
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted">
        Cash or MoMo on delivery · Inspect before you pay
      </p>
    </div>
  );
}

function Selector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-5">
      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-2">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
            className={cn(
              "min-w-11 h-11 px-4 rounded-[var(--radius-md)] text-sm font-semibold border transition-colors cursor-pointer",
              value === opt
                ? "bg-ink text-canvas border-ink"
                : "bg-transparent text-ink border-line hover:border-ink",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function QtyBtn({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="h-11 w-11 grid place-items-center text-xl font-semibold text-ink-soft hover:text-ink hover:bg-ink/[0.04] transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
