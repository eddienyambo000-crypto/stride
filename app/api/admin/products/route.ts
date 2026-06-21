import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { isAuthed } from "@/lib/admin-auth";

const SEED_MSG =
  "Product editing goes live once Supabase is connected. In demo mode the catalog is read-only.";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: SEED_MSG }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const price_rwf = Number(body.price_rwf);
  if (!name || !Number.isFinite(price_rwf) || price_rwf <= 0) {
    return NextResponse.json(
      { error: "Name and a valid price are required." },
      { status: 400 },
    );
  }

  const slug = body.slug ? slugify(String(body.slug)) : slugify(name);
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      name,
      description: String(body.description ?? ""),
      price_rwf,
      price_usd: body.price_usd ? Number(body.price_usd) : null,
      collection: String(body.collection ?? "signature"),
      is_best_seller: Boolean(body.is_best_seller),
      stock_status: String(body.stock_status ?? "in_stock"),
      sizes: parseList(body.sizes),
      colors: parseList(body.colors),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Up to 10 images, ordered. Accepts images[] (preferred) or single image_url.
  const urls: string[] = Array.isArray(body.images)
    ? body.images.map(String)
    : body.image_url
      ? [String(body.image_url)]
      : [];
  if (urls.length) {
    await supabase.from("product_images").insert(
      urls.slice(0, 10).map((url, i) => ({
        product_id: data.id,
        url,
        alt: name,
        sort_order: i + 1,
      })),
    );
  }

  return NextResponse.json({ product: data }, { status: 201 });
}

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string")
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}
