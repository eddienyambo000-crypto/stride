/** Whether real Supabase credentials are present. When false, the app
 *  transparently falls back to local seed data + an in-memory order store,
 *  so the site runs and demos end-to-end before keys are added. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
