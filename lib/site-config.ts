import "server-only";
import { SUPABASE_URL } from "./supabase/config";

export interface SiteConfig {
  heroVideoUrl?: string;
}

const CONFIG_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/site-media/config.json`
  : null;

/**
 * Reads owner-managed site settings (e.g. hero background video) from a small
 * JSON file in Supabase Storage. No extra DB table needed. Cached for 60s so
 * changes from the admin panel appear shortly after upload.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  if (!CONFIG_URL) return {};
  try {
    const res = await fetch(CONFIG_URL, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return (await res.json()) as SiteConfig;
  } catch {
    return {};
  }
}
