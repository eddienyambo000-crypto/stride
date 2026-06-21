import { cookies } from "next/headers";

/**
 * v1 admin gate: a shared passcode that sets an httpOnly cookie.
 * Simple and effective for a single-operator dashboard. When the team grows,
 * swap this for Supabase Auth (the orders RLS is already keyed to `authenticated`).
 */
export const ADMIN_COOKIE = "stride_admin";
export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE ?? "stride-admin";
export const ADMIN_TOKEN = "ok";

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_TOKEN;
}
