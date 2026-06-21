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

  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.image_url) {
    const { data: existing } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", id)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("product_images")
        .update({ url: String(body.image_url), alt: String(body.image_alt ?? "") })
        .eq("id", existing.id);
    } else {
      await supabase.from("product_images").insert({
        product_id: id,
        url: String(body.image_url),
        alt: String(body.image_alt ?? ""),
        sort_order: 1,
      });
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
