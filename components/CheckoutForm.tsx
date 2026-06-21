"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Button, ButtonLink } from "@/components/ui/Button";
import { rwfLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { DeliveryZone } from "@/lib/types";

export function CheckoutForm({ zones }: { zones: DeliveryZone[] }) {
  const { lines, subtotal, clear, hydrated } = useCart();
  const router = useRouter();

  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  function captureLocation() {
    if (!("geolocation" in navigator)) {
      setLocError("Location isn't supported on this device.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: +pos.coords.latitude.toFixed(6),
          lng: +pos.coords.longitude.toFixed(6),
        });
        setLocating(false);
      },
      () => {
        setLocError("Couldn't get your location. You can still type your address.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const zone = useMemo(() => zones.find((z) => z.id === zoneId), [zones, zoneId]);
  const deliveryFee = zone?.fee_rwf ?? 0;
  const total = subtotal + deliveryFee;

  if (hydrated && lines.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-12 text-center">
        <h2 className="font-display text-2xl">Your cart is empty</h2>
        <p className="mt-2 text-ink-soft">Add a piece before checking out.</p>
        <div className="mt-6">
          <ButtonLink href="/shop" size="lg">Shop now</ButtonLink>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      customer_name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      zone_id: zoneId,
      delivery_address: String(form.get("address") ?? ""),
      notes: String(form.get("notes") ?? ""),
      company: String(form.get("company") ?? ""), // honeypot
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      items: lines.map((l) => ({
        product_id: l.productId,
        size: l.size,
        color: l.color,
        qty: l.qty,
      })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not place your order. Please try again.");
        setSubmitting(false);
        return;
      }
      // Cache the order so the confirmation page renders instantly + reliably,
      // even before Supabase persistence is enabled.
      try {
        if (data.order) {
          sessionStorage.setItem(
            `stride-order-${data.order_number}`,
            JSON.stringify(data.order),
          );
        }
      } catch {
        /* ignore storage errors */
      }
      clear();
      router.push(`/order/${data.order_number}`);
    } catch {
      setError("Network error. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_360px] gap-8">
      {/* Honeypot — hidden from users, catches bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {/* ── Details ── */}
      <div className="space-y-6">
        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-canvas p-6">
          <legend className="px-2 font-display text-xl">Your details</legend>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <Field name="name" label="Full name" required autoComplete="name" />
            <Field
              name="phone"
              label="Phone number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="07XX XXX XXX"
            />
          </div>
          <Field
            name="whatsapp"
            label="WhatsApp (optional)"
            type="tel"
            inputMode="tel"
            placeholder="If different from phone"
            className="mt-4"
          />
        </fieldset>

        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-canvas p-6">
          <legend className="px-2 font-display text-xl">Delivery</legend>
          <div className="grid sm:grid-cols-3 gap-3 mt-2">
            {zones.map((z) => (
              <label
                key={z.id}
                className={cn(
                  "cursor-pointer rounded-[var(--radius-md)] border p-4 transition-colors",
                  zoneId === z.id
                    ? "border-accent bg-accent-soft/40 ring-1 ring-accent"
                    : "border-line hover:border-ink",
                )}
              >
                <input
                  type="radio"
                  name="zone"
                  value={z.id}
                  checked={zoneId === z.id}
                  onChange={() => setZoneId(z.id)}
                  className="sr-only"
                />
                <span className="block font-semibold">{z.name}</span>
                <span className="block text-sm text-ink-soft">
                  {z.fee_rwf === 0 ? "Free" : rwfLabel(z.fee_rwf)}
                </span>
                <span className="block text-xs text-muted mt-1">{z.eta}</span>
              </label>
            ))}
          </div>

          {/* Live location — pins the customer's exact spot for the rider */}
          <div className="mt-4 rounded-[var(--radius-md)] glass-sky p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  <PinIcon /> Pin your exact location
                </p>
                <p className="text-xs text-ink-soft mt-0.5">
                  Tap to share your live GPS — riders find you fast, no confusing
                  directions. Sent straight to our delivery team.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={captureLocation}
              disabled={locating}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink text-canvas text-sm font-semibold px-4 py-2 hover:bg-ink-soft transition-colors disabled:opacity-60 cursor-pointer"
            >
              {locating
                ? "Locating…"
                : coords
                  ? "Location captured ✓"
                  : "Use my current location"}
            </button>
            {coords && (
              <p className="mt-2 text-xs text-success font-medium">
                Pinned: {coords.lat}, {coords.lng}
              </p>
            )}
            {locError && <p className="mt-2 text-xs text-warning">{locError}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="block text-sm font-semibold mb-1.5">
              Delivery address <span className="text-accent">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              placeholder="Neighbourhood, street, landmark, house/apartment — anything that helps our rider find you."
              className="w-full rounded-[var(--radius-md)] border border-line bg-canvas px-4 py-3 text-[15px] outline-none focus:border-accent transition-colors resize-y"
            />
            <p className="mt-1.5 text-xs text-muted">
              A nearby landmark helps a lot in Kigali.
            </p>
          </div>

          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-semibold mb-1.5">
              Order notes (optional)
            </label>
            <input
              id="notes"
              name="notes"
              placeholder="Anything we should know"
              className="w-full h-11 rounded-[var(--radius-md)] border border-line bg-canvas px-4 text-[15px] outline-none focus:border-accent transition-colors"
            />
          </div>
        </fieldset>

        <fieldset className="rounded-[var(--radius-lg)] border border-line bg-canvas p-6">
          <legend className="px-2 font-display text-xl">Payment</legend>
          <div className="mt-2 rounded-[var(--radius-md)] border border-accent bg-accent-soft/40 p-4 flex gap-3">
            <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-white text-xs">
              ✓
            </span>
            <div>
              <p className="font-semibold">Cash or MoMo on delivery</p>
              <p className="text-sm text-ink-soft mt-0.5">
                Pay our rider when your order arrives — after you&apos;ve inspected it.
                No upfront payment, no risk.
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-[var(--radius-md)] border border-dashed border-line p-4 opacity-70">
            <p className="text-sm font-medium text-muted">
              Pay online (MoMo / card) — coming soon
            </p>
          </div>
        </fieldset>
      </div>

      {/* ── Summary ── */}
      <aside className="lg:sticky lg:top-24 h-fit rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-6">
        <h2 className="font-display text-xl mb-4">Your order</h2>
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-3">
              <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-canvas border border-line">
                {l.image && (
                  <Image src={l.image} alt={l.name} fill sizes="48px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug truncate">{l.name}</p>
                <p className="text-xs text-muted">
                  {[l.size, l.color].filter(Boolean).join(" · ")} · ×{l.qty}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
                {rwfLabel(l.unitPrice * l.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-line space-y-2 text-sm">
          <Row label="Subtotal" value={rwfLabel(subtotal)} />
          <Row
            label="Delivery"
            value={deliveryFee === 0 ? "Free" : rwfLabel(deliveryFee)}
          />
          <div className="flex justify-between pt-2 border-t border-line">
            <span className="font-bold">Total</span>
            <span className="font-bold tabular-nums">{rwfLabel(total)}</span>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full mt-5" disabled={submitting}>
          {submitting ? "Placing order…" : `Place order · ${rwfLabel(total)}`}
        </Button>
        <p className="mt-3 text-center text-xs text-muted">
          You&apos;ll get an order number to track your delivery.
        </p>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  className,
  ...props
}: {
  name: string;
  label: string;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        className="w-full h-11 rounded-[var(--radius-md)] border border-line bg-canvas px-4 text-[15px] outline-none focus:border-accent transition-colors"
        {...props}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
