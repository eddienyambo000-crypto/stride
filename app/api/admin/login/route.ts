import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_PASSCODE, ADMIN_TOKEN } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { passcode } = (await request.json().catch(() => ({}))) as {
    passcode?: string;
  };

  if (!passcode || passcode !== ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
  return res;
}
