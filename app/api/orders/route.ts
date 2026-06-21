import { NextResponse } from "next/server";
import { createOrder, getDeliveryZones, getProducts } from "@/lib/data";

interface IncomingItem {
  product_id: string;
  size: string | null;
  color: string | null;
  qty: number;
}

interface IncomingOrder {
  customer_name?: string;
  phone?: string;
  whatsapp?: string;
  zone_id?: string;
  delivery_address?: string;
  lat?: number | null;
  lng?: number | null;
  notes?: string;
  company?: string; // honeypot — real users never fill this
  items?: IncomingItem[];
}

function clampCoord(v: unknown, max: number): number | null {
  const n = Number(v);
  if (!Number.isFinite(n) || Math.abs(n) > max) return null;
  return n;
}

export async function POST(request: Request) {
  let body: IncomingOrder;
  try {
    body = (await request.json()) as IncomingOrder;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, persist nothing.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ order_number: "STR-OK" }, { status: 201 });
  }

  const name = body.customer_name?.trim();
  const phone = body.phone?.trim();
  const address = body.delivery_address?.trim();

  if (!name || !phone || !address || !body.zone_id) {
    return NextResponse.json(
      { error: "Name, phone, delivery zone and address are required." },
      { status: 400 },
    );
  }
  if (!/^[+0-9\s-]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Validate zone + recompute item prices from the catalog (never trust client prices).
  const [zones, products] = await Promise.all([getDeliveryZones(), getProducts()]);
  if (!zones.some((z) => z.id === body.zone_id)) {
    return NextResponse.json({ error: "Invalid delivery zone." }, { status: 400 });
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const items = [];
  for (const item of body.items) {
    const product = byId.get(item.product_id);
    if (!product) {
      return NextResponse.json(
        { error: "One of your items is no longer available." },
        { status: 400 },
      );
    }
    if (product.stock_status === "sold_out") {
      return NextResponse.json(
        { error: `${product.name} is sold out.` },
        { status: 400 },
      );
    }
    const qty = Math.max(1, Math.min(20, Math.floor(item.qty || 1)));
    items.push({
      product_id: product.id,
      name: product.name,
      size: item.size ?? null,
      color: item.color ?? null,
      qty,
      unit_price: product.price_rwf,
    });
  }

  try {
    const order = await createOrder({
      customer_name: name,
      phone,
      whatsapp: body.whatsapp?.trim() || phone,
      zone_id: body.zone_id,
      delivery_address: address,
      lat: clampCoord(body.lat, 90),
      lng: clampCoord(body.lng, 180),
      notes: body.notes?.trim() || undefined,
      items,
    });
    return NextResponse.json(
      { order_number: order.order_number, order },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
