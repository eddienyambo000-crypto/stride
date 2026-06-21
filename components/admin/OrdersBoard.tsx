"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { rwf, rwfLabel } from "@/lib/format";
import { whatsappLink, mapsLink, buildOrderWhatsapp } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { FulfillmentStatus, Order } from "@/lib/types";

const NEXT_ACTION: Partial<
  Record<FulfillmentStatus, { to: FulfillmentStatus; label: string }>
> = {
  new: { to: "confirmed", label: "Confirm order" },
  confirmed: { to: "out_for_delivery", label: "Out for delivery" },
  out_for_delivery: { to: "delivered", label: "Mark delivered · collect payment" },
};

const STATUS_BADGE: Record<FulfillmentStatus, string> = {
  new: "bg-accent text-white",
  confirmed: "bg-warning/15 text-warning",
  out_for_delivery: "bg-ink text-canvas",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-danger/10 text-danger",
};

const STATUS_LABEL: Record<FulfillmentStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrdersBoard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "delivered" | "cancelled">("active");
  const prevCount = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + polling fallback (works in seed mode without Supabase).
  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

  // Realtime: instant refresh on order changes when Supabase is configured.
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const channel = supabase
      .channel("orders-board")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () =>
        load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  async function setStatus(order: Order, to: FulfillmentStatus) {
    setUpdating(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: to }),
      });
      if (res.ok) await load();
    } finally {
      setUpdating(null);
    }
  }

  const { active, delivered, cancelled, stats } = useMemo(() => {
    const active = orders.filter(
      (o) => !["delivered", "cancelled"].includes(o.fulfillment_status),
    );
    const delivered = orders.filter((o) => o.fulfillment_status === "delivered");
    const cancelled = orders.filter((o) => o.fulfillment_status === "cancelled");
    const newCount = orders.filter((o) => o.fulfillment_status === "new").length;
    const outCount = orders.filter(
      (o) => o.fulfillment_status === "out_for_delivery",
    ).length;
    const collected = delivered.reduce((s, o) => s + o.total, 0);
    return {
      active,
      delivered,
      cancelled,
      stats: { newCount, outCount, deliveredCount: delivered.length, collected },
    };
  }, [orders]);

  // Subtle signal when a new order arrives.
  useEffect(() => {
    if (stats.newCount > prevCount.current && prevCount.current !== 0) {
      document.title = `(${stats.newCount}) New order · STRIDE Admin`;
    }
    prevCount.current = stats.newCount;
  }, [stats.newCount]);

  const list = tab === "active" ? active : tab === "delivered" ? delivered : cancelled;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="text-sm text-muted mt-1">
            Live queue · updates automatically. Collect payment on delivery.
          </p>
        </div>
        <div className="flex gap-3">
          <Stat label="New" value={String(stats.newCount)} highlight={stats.newCount > 0} />
          <Stat label="Out for delivery" value={String(stats.outCount)} />
          <Stat label="Delivered" value={String(stats.deliveredCount)} />
          <Stat label="Collected" value={`${rwf(stats.collected)} RWF`} />
        </div>
      </div>

      <div className="flex gap-2 mb-5 border-b border-line">
        {(
          [
            ["active", `Active (${active.length})`],
            ["delivered", `Delivered (${delivered.length})`],
            ["cancelled", `Cancelled (${cancelled.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold -mb-px border-b-2 transition-colors cursor-pointer",
              tab === key
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted py-10 text-center">Loading orders…</p>
      ) : list.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-12 text-center">
          <p className="font-display text-2xl">No orders here</p>
          <p className="mt-2 text-muted">
            {tab === "active"
              ? "New orders will appear here the moment a customer checks out."
              : "Nothing in this list yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              updating={updating === order.id}
              onAdvance={(to) => setStatus(order, to)}
              onCancel={() => setStatus(order, "cancelled")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  updating,
  onAdvance,
  onCancel,
}: {
  order: Order;
  updating: boolean;
  onAdvance: (to: FulfillmentStatus) => void;
  onCancel: () => void;
}) {
  const next = NEXT_ACTION[order.fulfillment_status];
  const isActive = !["delivered", "cancelled"].includes(order.fulfillment_status);
  const isNew = order.fulfillment_status === "new";

  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border bg-canvas p-5 shadow-[var(--shadow-soft)]",
        isNew ? "border-accent ring-1 ring-accent/40" : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold tabular-nums">#{order.order_number}</p>
          <p className="text-xs text-muted mt-0.5">
            {new Date(order.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
            STATUS_BADGE[order.fulfillment_status],
          )}
        >
          {STATUS_LABEL[order.fulfillment_status]}
        </span>
      </div>

      {/* Customer */}
      <div className="mt-4 rounded-[var(--radius-md)] bg-canvas-soft p-3">
        <p className="font-semibold">{order.customer_name}</p>
        <p className="text-sm text-ink-soft">{order.delivery_address}</p>
        <p className="text-xs text-muted mt-1">
          {order.zone_name} · {order.phone}
          {order.lat != null && order.lng != null && (
            <span className="ml-1 text-accent font-semibold">· 📍 pinned</span>
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a
            href={`tel:+${order.phone.replace(/\D/g, "")}`}
            className="rounded-[var(--radius-sm)] bg-ink text-canvas text-xs font-semibold px-3 py-1.5 hover:bg-ink-soft transition-colors"
          >
            Call
          </a>
          <a
            href={whatsappLink(
              `Hi ${order.customer_name.split(" ")[0]} 👋 This is STRIDE about your order #${order.order_number}.`,
              (order.whatsapp ?? order.phone).replace(/\D/g, ""),
            )}
            className="rounded-[var(--radius-sm)] bg-success/15 text-success text-xs font-semibold px-3 py-1.5 hover:bg-success/25 transition-colors"
          >
            WhatsApp
          </a>
          {order.lat != null && order.lng != null && (
            <a
              href={mapsLink(order.lat, order.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[var(--radius-sm)] bg-accent/15 text-accent-deep text-xs font-semibold px-3 py-1.5 hover:bg-accent/25 transition-colors"
            >
              Open map
            </a>
          )}
          <a
            href={whatsappLink(
              buildOrderWhatsapp({
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
              }),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[var(--radius-sm)] bg-ink text-canvas text-xs font-semibold px-3 py-1.5 hover:bg-ink-soft transition-colors"
          >
            Send to delivery
          </a>
        </div>
        {order.notes && (
          <p className="mt-2 text-xs text-ink-soft italic">Note: {order.notes}</p>
        )}
      </div>

      {/* Items */}
      <ul className="mt-3 space-y-1.5">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span className="text-ink-soft">
              {item.qty}× {item.name}
              {item.size || item.color ? (
                <span className="text-muted">
                  {" "}
                  ({[item.size, item.color].filter(Boolean).join(", ")})
                </span>
              ) : null}
            </span>
            <span className="tabular-nums">{rwfLabel(item.unit_price * item.qty)}</span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mt-3 pt-3 border-t border-line flex justify-between items-center">
        <span className="text-xs text-muted">
          {order.delivery_fee === 0 ? "Free delivery" : `+ ${rwfLabel(order.delivery_fee)} delivery`}
        </span>
        <span className="font-bold">
          {order.payment_status === "paid" ? (
            <span className="text-success text-xs uppercase mr-2">Paid</span>
          ) : (
            <span className="text-muted text-xs uppercase mr-2">Collect</span>
          )}
          {rwfLabel(order.total)}
        </span>
      </div>

      {/* Actions */}
      {isActive && (
        <div className="mt-4 flex gap-2">
          {next && (
            <button
              type="button"
              onClick={() => onAdvance(next.to)}
              disabled={updating}
              className="flex-1 rounded-[var(--radius-md)] bg-accent text-white text-sm font-semibold py-2.5 hover:bg-accent-deep transition-colors disabled:opacity-50 cursor-pointer"
            >
              {updating ? "…" : next.label}
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={updating}
            className="rounded-[var(--radius-md)] border border-line text-sm font-semibold px-4 text-ink-soft hover:border-danger hover:text-danger transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
    </article>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-2 text-center min-w-20",
        highlight ? "border-accent bg-accent-soft/40" : "border-line bg-canvas",
      )}
    >
      <p className={cn("text-lg font-bold tabular-nums", highlight && "text-accent")}>
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
    </div>
  );
}
