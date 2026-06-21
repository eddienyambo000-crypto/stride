import type { Order } from "./types";

/**
 * In-memory order store used ONLY in seed mode (no Supabase configured).
 * Lets the COD checkout → confirmation → admin-queue flow work locally for
 * demos. Resets on server restart. Real persistence comes from Supabase.
 */
declare global {
  // eslint-disable-next-line no-var
  var __strideOrders: Order[] | undefined;
}

export const memoryOrders: Order[] = globalThis.__strideOrders ?? [];
globalThis.__strideOrders = memoryOrders;
