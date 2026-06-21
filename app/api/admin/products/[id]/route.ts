import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { isAuthed } from "@/lib/admin-auth";

const SEED_MSG = "Connect Supabase to edit products. Demo catalog is read-only.";

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string")
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: SEED_MSG }, { status: 503 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const patch: Record<string, unknown> = {};
  if (body.name != null) patch.name = String(body.name);
  if (body.description != null) patch.description = String(body.description);
  if (body.price_rwf != null) patch.price_rwf = Number(body.price_rwf);
  if (body.price_usd !== undefined)
    patch.price_usd = body.price_usd ? Number(body.price_usd) : null;
  if (body.collection != null) patch.collection = String(body.collection);
  if (body.is_best_seller != null) patch.is_best_seller = Boolean(body.is_best_seller);
  if (body.stock_status != null) patch.stock_status = String(body.stock_status);
  if (body.sizes != null) patch.sizes = parseList(body.sizes);
  if (body.colors != null) patch.colors = parseList(body.colors);

  if (Object.keys(patch).length) {
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // When images[] is sent, replace the full set (handles add/remove/reorder).
  if (Array.isArray(body.images)) {
    await supabase.from("product_images").delete().eq("product_id", id);
    const urls = body.images.map(String).slice(0, 10);
    if (urls.length) {
      await supabase.from("product_images").insert(
        urls.map((url: string, i: number) => ({
          product_id: id,
          url,
          alt: body.name ? String(body.name) : "",
          sort_order: i + 1,
        })),
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  if (!supabase) return NextResponse.json({ error: SEED_MSG }, { status: 503 });

  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
