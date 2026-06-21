import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when order persistence + admin writes are wired (service role present). */
export const isOrdersLive = Boolean(SUPABASE_URL && SERVICE_KEY);

let cached: SupabaseClient | null = null;

/**
 * Service-role Supabase client. SERVER-ONLY — bypasses RLS, so it must never be
 * imported into client code. Used for order create/read/update and admin product
 * writes (the public anon role is locked to catalog reads + order inserts by RLS).
 * Returns null when not configured (→ falls back to the in-memory demo store).
 */
export function getServiceSupabase(): SupabaseClient | null {
  if (!isOrdersLive) return null;
  if (cached) return cached;
  cached = createClient(SUPABASE_URL!, SERVICE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
