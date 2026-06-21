export type StockStatus = "in_stock" | "made_to_order" | "sold_out";

export type PaymentMethod = "cod" | "momo_online"; // momo_online reserved for Flutterwave phase
export type PaymentStatus = "pending" | "paid" | "refunded";
export type FulfillmentStatus =
  | "new"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_rwf: number;
  price_usd: number | null;
  collection: string; // collection slug
  is_best_seller: boolean;
  stock_status: StockStatus;
  sizes: string[];
  colors: string[];
  created_at: string;
  images: ProductImage[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sort_order: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee_rwf: number;
  eta: string;
  sort_order: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  name: string;
  size: string | null;
  color: string | null;
  qty: number;
  unit_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp: string | null;
  zone_id: string | null;
  zone_name: string;
  delivery_address: string;
  lat: number | null;
  lng: number | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  fulfillment_status: FulfillmentStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface NewOrderInput {
  customer_name: string;
  phone: string;
  whatsapp?: string;
  zone_id: string;
  delivery_address: string;
  lat?: number | null;
  lng?: number | null;
  notes?: string;
  items: Array<{
    product_id: string;
    name: string;
    size: string | null;
    color: string | null;
    qty: number;
    unit_price: number;
  }>;
}
