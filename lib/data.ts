import "server-only";
import { getPublicSupabase } from "./supabase/public";
import { getServiceSupabase } from "./supabase/admin";
import { COLLECTIONS, DELIVERY_ZONES, PRODUCTS } from "./seed";
import { memoryOrders } from "./order-store";
import { generateOrderNumber } from "./format";
import type {
  Collection,
  DeliveryZone,
  FulfillmentStatus,
  NewOrderInput,
  Order,
  PaymentStatus,
  Product,
} from "./types";

/* ============================================================
   Catalog reads — Supabase when configured, else seed data.
   ============================================================ */

export async function getCollections(): Promise<Collection[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [...COLLECTIONS].sort((a, b) => a.sort_order - b.sort_order);

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order");
  if (error || !data) return COLLECTIONS;
  return data as Collection[];
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [...DELIVERY_ZONES].sort((a, b) => a.sort_order - b.sort_order);

  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("sort_order");
  if (error || !data) return DELIVERY_ZONES;
  return data as DeliveryZone[];
}

export async function getProducts(opts?: {
  collection?: string;
  bestSeller?: boolean;
}): Promise<Product[]> {
  const supabase = getPublicSupabase();

  if (!supabase) {
    let list = [...PRODUCTS];
    if (opts?.collection) list = list.filter((p) => p.collection === opts.collection);
    if (opts?.bestSeller) list = list.filter((p) => p.is_best_seller);
    return list;
  }

  let query = supabase
    .from("products")
    .select("*, images:product_images(*)")
    .order("created_at", { ascending: false });
  if (opts?.collection) query = query.eq("collection", opts.collection);
  if (opts?.bestSeller) query = query.eq("is_best_seller", true);

  const { data, error } = await query;
  if (error || !data) return [];
  return (data as Product[]).map(normalizeImages);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return PRODUCTS.find((p) => p.slug === slug) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return normalizeImages(data as Product);
}

export async function getBestSellers(limit = 4): Promise<Product[]> {
  const list = await getProducts({ bestSeller: true });
  return list.slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const list = await getProducts();
  return list.map((p) => p.slug);
}

function normalizeImages(p: Product): Product {
  const images = (p.images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  return { ...p, images };
}

/* ============================================================
   Orders — create / read / update
   ============================================================ */

export async function createOrder(input: NewOrderInput): Promise<Order> {
  const zones = await getDeliveryZones();
  const zone = zones.find((z) => z.id === input.zone_id) ?? zones[0];
  const subtotal = input.items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const delivery_fee = zone?.fee_rwf ?? 0;
  const total = subtotal + delivery_fee;
  const order_number = generateOrderNumber();
  const created_at = new Date().toISOString();
  const lat = input.lat ?? null;
  const lng = input.lng ?? null;

  // Orders persist via the service-role client (RLS locks anon to inserts only).
  const supabase = getServiceSupabase();

  if (!supabase) {
    const order: Order = {
      id: order_number,
      order_number,
      customer_name: input.customer_name,
      phone: input.phone,
      whatsapp: input.whatsapp ?? input.phone,
      zone_id: zone?.id ?? null,
      zone_name: zone?.name ?? "—",
      delivery_address: input.delivery_address,
      lat,
      lng,
      payment_method: "cod",
      payment_status: "pending",
      fulfillment_status: "new",
      subtotal,
      delivery_fee,
      total,
      notes: input.notes ?? null,
      created_at,
      items: input.items.map((i) => ({ ...i })),
    };
    memoryOrders.unshift(order);
    return order;
  }

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      order_number,
      customer_name: input.customer_name,
      phone: input.phone,
      whatsapp: input.whatsapp ?? input.phone,
      zone_id: zone?.id ?? null,
      zone_name: zone?.name ?? "—",
      delivery_address: input.delivery_address,
      lat,
      lng,
      payment_method: "cod",
      payment_status: "pending",
      fulfillment_status: "new",
      subtotal,
      delivery_fee,
      total,
      notes: input.notes ?? null,
    })
    .select()
    .single();

  if (orderErr || !orderRow) {
    throw new Error(orderErr?.message ?? "Failed to create order");
  }

  const items = input.items.map((i) => ({ ...i, order_id: orderRow.id }));
  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) throw new Error(itemsErr.message);

  return { ...(orderRow as Order), items };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return memoryOrders.find((o) => o.order_number === orderNumber) ?? null;

  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", orderNumber)
    .single();
  if (error || !data) return null;
  return data as Order;
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [...memoryOrders];

  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Order[];
}

export async function updateOrderStatus(
  id: string,
  fulfillment: FulfillmentStatus,
  payment?: PaymentStatus,
): Promise<void> {
  const supabase = getServiceSupabase();

  if (!supabase) {
    const order = memoryOrders.find((o) => o.id === id);
    if (order) {
      order.fulfillment_status = fulfillment;
      if (payment) order.payment_status = payment;
    }
    return;
  }

  const patch: Record<string, unknown> = { fulfillment_status: fulfillment };
  if (payment) patch.payment_status = payment;
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}
