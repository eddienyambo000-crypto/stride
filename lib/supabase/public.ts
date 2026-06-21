import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * Cookieless anon client for PUBLIC catalog reads (products, collections, zones).
 * Not bound to cookies() → keeps product/shop pages statically generated + ISR
 * even in live mode (fast on low-data mobile). RLS allows public select on catalog.
 */
let cached: SupabaseClient | null = null;

export function getPublicSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;
  cached = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
