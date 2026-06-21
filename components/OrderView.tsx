"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { rwfLabel } from "@/lib/format";
import { SITE, whatsappLink, buildOrderWhatsapp, mapsLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { FulfillmentStatus, Order } from "@/lib/types";

const STEPS: { key: FulfillmentStatus; label: string; note: string }[] = [
  { key: "new", label: "Order received", note: "We've got your order." },
  { key: "confirmed", label: "Confirmed", note: "We're preparing your pieces." },
  { key: "out_for_delivery", label: "Out for delivery", note: "Our rider is on the way." },
  { key: "delivered", label: "Delivered", note: "Inspect, then pay. Enjoy!" },
];

export function OrderView({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    // 1) instant from sessionStorage (just placed), 2) server fallback (live/shared).
    try {
      const cached = sessionStorage.getItem(`stride-order-${orderNumber}`);
      if (cached) {
        setOrder(JSON.parse(cached));
        setState("ready");
        return;
      }
    } catch {
      /* ignore */
    }
    let active = true;
    fetch(`/api/orders/${orderNumber}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!active) return;
        if (d?.order) {
          setOrder(d.order);
          setState("ready");
        } else {
          setState("missing");
        }
      })
      .catch(() => active && setState("missing"));
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <p className="text-muted">Loading your order…</p>
      </div>
    );
  }

  if (state === "missing" || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)]">Order not found</h1>
        <p className="mt-3 text-ink-soft">
          We couldn&apos;t find order #{orderNumber}. If you just ordered, message us
          on WhatsApp and we&apos;ll sort it out instantly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <ButtonLink href={whatsappLink(`Hi STRIDE 👋 about order #${orderNumber}`)} size="lg">
            Message us on WhatsApp
          </ButtonLink>
          <ButtonLink href="/shop" variant="ghost" size="lg">Continue shopping</ButtonLink>
        </div>
      </div>
    );
  }

  const cancelled = order.fulfillment_status === "cancelled";
  const currentIndex = STEPS.findIndex((s) => s.key === order.fulfillment_status);
  const waMessage = buildOrderWhatsapp({
    orderNumber: order.order_number,
    name: order.customer_name,
    phone: order.phone,
    zone: order.zone_name,
    address: order.delivery_address,
    total: rwfLabel(order.total),
    items: order.items
      .map((i) => `${i.qty}× ${i.name}${i.size ? ` (${i.size})` : ""}`)
      .join(", "),
    lat: order.lat,
    lng: order.lng,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(180deg,#1aa0dd,#0a5e89)] text-white shadow-[var(--shadow-sky)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m5 12.5 4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-5 font-display text-[clamp(2rem,6vw,3rem)]">Order placed!</h1>
        <p className="mt-2 text-ink-soft">
          Thank you, {order.customer_name.split(" ")[0]}. We&apos;ll contact you on{" "}
          {order.phone} to confirm delivery.
        </p>
        <p className="mt-4 inline-block rounded-full border border-line bg-canvas-soft px-4 py-1.5 text-sm font-semibold">
          Order #{order.order_number}
        </p>
      </div>

      <section className="mt-10 rounded-[var(--radius-lg)] border border-line bg-canvas p-6">
        <h2 className="font-display text-xl mb-5">Delivery status</h2>
        {cancelled ? (
          <p className="rounded-[var(--radius-md)] bg-danger/10 text-danger px-4 py-3 text-sm font-medium">
            This order was cancelled. Questions? WhatsApp us below.
          </p>
        ) : (
          <ol className="space-y-1">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              return (
                <li key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors", done ? "bg-accent text-white" : "bg-canvas-soft text-muted border border-line")}>
                      {done ? "✓" : i + 1}
                    </span>
                    {i < STEPS.length - 1 && (
                      <span className={cn("w-0.5 flex-1 min-h-8", i < currentIndex ? "bg-accent" : "bg-line")} />
                    )}
                  </div>
                  <div className={cn("pb-6", !done && "opacity-60")}>
                    <p className={cn("font-semibold", active && "text-accent")}>{step.label}</p>
                    <p className="text-sm text-ink-soft">{step.note}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="mt-6 rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-6">
        <h2 className="font-display text-xl mb-4">Order summary</h2>
        <ul className="divide-y divide-line">
          {order.items.map((item, i) => (
            <li key={i} className="py-3 flex justify-between gap-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted">
                  {[item.size, item.color].filter(Boolean).join(" · ")} · ×{item.qty}
                </p>
              </div>
              <span className="font-semibold tabular-nums whitespace-nowrap">
                {rwfLabel(item.unit_price * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-line space-y-2 text-sm">
          <Row label="Subtotal" value={rwfLabel(order.subtotal)} />
          <Row label={`Delivery · ${order.zone_name}`} value={order.delivery_fee === 0 ? "Free" : rwfLabel(order.delivery_fee)} />
          <div className="flex justify-between pt-2 border-t border-line">
            <span className="font-bold">Total (pay on delivery)</span>
            <span className="font-bold tabular-nums">{rwfLabel(order.total)}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          <span className="font-semibold">Deliver to:</span> {order.delivery_address}
        </p>
      </section>

      <div className="mt-8 rounded-[var(--radius-lg)] glass-sky p-5 text-center">
        <p className="text-sm font-semibold">One more step — confirm on WhatsApp</p>
        <p className="text-xs text-ink-soft mt-1 max-w-md mx-auto">
          Send us your order on WhatsApp so our team can confirm delivery
          {order.lat != null ? " (your location pin is included)" : ""}.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <ButtonLink href={whatsappLink(waMessage)} size="lg">
            Send my order on WhatsApp
          </ButtonLink>
          {order.lat != null && order.lng != null && (
            <ButtonLink href={mapsLink(order.lat, order.lng)} variant="ghost" size="lg">
              View my pinned location
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <ButtonLink href="/shop" variant="ghost" size="lg">Continue shopping</ButtonLink>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Need help now? {SITE.phoneDisplay}
      </p>
      <div className="mt-4 text-center">
        <Link href="/" className="text-sm font-medium text-ink-soft hover:text-accent">← Back home</Link>
      </div>
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
