"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { rwfLabel } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Collection, Product } from "@/lib/types";

interface FormState {
  id?: string;
  name: string;
  description: string;
  price_rwf: string;
  price_usd: string;
  collection: string;
  stock_status: string;
  is_best_seller: boolean;
  sizes: string;
  colors: string;
  image_url: string;
  image_alt: string;
}

const empty = (collection: string): FormState => ({
  name: "",
  description: "",
  price_rwf: "",
  price_usd: "",
  collection,
  stock_status: "in_stock",
  is_best_seller: false,
  sizes: "S, M, L, XL",
  colors: "",
  image_url: "",
  image_alt: "",
});

export function ProductManager({
  products,
  collections,
  editable,
}: {
  products: Product[];
  collections: Collection[];
  editable: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openNew() {
    setError(null);
    setForm(empty(collections[0]?.slug ?? "signature"));
  }

  function openEdit(p: Product) {
    setError(null);
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price_rwf: String(p.price_rwf),
      price_usd: p.price_usd ? String(p.price_usd) : "",
      collection: p.collection,
      stock_status: p.stock_status,
      is_best_seller: p.is_best_seller,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      image_url: p.images[0]?.url ?? "",
      image_alt: p.images[0]?.alt ?? "",
    });
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError(null);
    const method = form.id ? "PATCH" : "POST";
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm(null);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save.");
    }
    setSaving(false);
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not delete.");
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-sm text-muted mt-1">{products.length} in catalog</p>
        </div>
        {editable && (
          <button
            type="button"
            onClick={openNew}
            className="rounded-[var(--radius-md)] bg-accent text-white text-sm font-semibold px-5 py-2.5 hover:bg-accent-deep transition-colors cursor-pointer"
          >
            + Add product
          </button>
        )}
      </div>

      {!editable && (
        <div className="mb-6 rounded-[var(--radius-md)] border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-ink-soft">
          <span className="font-semibold text-warning">Demo mode.</span> Connect
          Supabase (add keys to <code className="font-mono">.env.local</code>) to add
          and edit products live. The catalog below is read-only seed data.
        </div>
      )}

      <div className="grid gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-canvas p-3"
          >
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-canvas-soft border border-line">
              {p.images[0] && (
                <Image
                  src={p.images[0].url}
                  alt={p.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.name}</p>
              <p className="text-sm text-muted capitalize">
                {p.collection} · {rwfLabel(p.price_rwf)}
                {p.is_best_seller && " · ★ Best seller"}
              </p>
            </div>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap",
                p.stock_status === "sold_out"
                  ? "bg-danger/10 text-danger"
                  : p.stock_status === "made_to_order"
                    ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success",
              )}
            >
              {p.stock_status.replace(/_/g, " ")}
            </span>
            {editable && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="text-sm font-semibold text-ink-soft hover:text-accent transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  className="text-sm font-semibold text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {form && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setForm(null)}
          />
          <div className="relative w-full max-w-md h-full overflow-y-auto bg-canvas border-l border-line p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl">
                {form.id ? "Edit product" : "New product"}
              </h2>
              <button
                type="button"
                onClick={() => setForm(null)}
                aria-label="Close"
                className="h-9 w-9 grid place-items-center rounded-full hover:bg-ink/[0.06] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Price (RWF)" type="number" value={form.price_rwf} onChange={(v) => setForm({ ...form, price_rwf: v })} />
                <Input label="Price (USD, optional)" type="number" value={form.price_usd} onChange={(v) => setForm({ ...form, price_usd: v })} />
              </div>
              <Select
                label="Collection"
                value={form.collection}
                options={collections.map((c) => ({ value: c.slug, label: c.name }))}
                onChange={(v) => setForm({ ...form, collection: v })}
              />
              <Select
                label="Stock"
                value={form.stock_status}
                options={[
                  { value: "in_stock", label: "In stock" },
                  { value: "made_to_order", label: "Made to order" },
                  { value: "sold_out", label: "Sold out" },
                ]}
                onChange={(v) => setForm({ ...form, stock_status: v })}
              />
              <Input label="Sizes (comma separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} />
              <Input label="Colours (comma separated)" value={form.colors} onChange={(v) => setForm({ ...form, colors: v })} />
              <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
              <div>
                <label className="block text-sm font-semibold mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-[var(--radius-md)] border border-line bg-canvas px-3 py-2 text-[15px] outline-none focus:border-accent resize-y"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_best_seller}
                  onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                Feature as best seller
              </label>

              {error && <p role="alert" className="text-sm text-danger">{error}</p>}

              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="w-full rounded-[var(--radius-md)] bg-accent text-white font-semibold py-3 hover:bg-accent-deep transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving…" : form.id ? "Save changes" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-[var(--radius-md)] border border-line bg-canvas px-3 text-[15px] outline-none focus:border-accent"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 rounded-[var(--radius-md)] border border-line bg-canvas px-3 text-[15px] outline-none focus:border-accent cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
