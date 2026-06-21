# CLAUDE.md — STRIDE store

Premium Rwandan streetwear e-commerce. Brand: **STRIDE** · slogan **"Stride to Conquer"**.
Client: brand owner (Eddie is the developer). Intake docs led the scope; the $60k "research"
PDF was an AI wishlist — we built the realistic, buildable core.

## Stack & run
- Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase · Vercel.
- Dev: `npm run dev` → http://localhost:3007 · `npm run build` to verify.
- Screenshots: reuse `../ai7 web project/screenshot.mjs http://localhost:3007 <label> <width>`
  (puppeteer lives in the ai7 project; uses system Chrome).

## Architecture rules
- **Seed-or-Supabase fallback**: all data flows through `lib/data.ts`. With no Supabase env,
  it serves `lib/seed.ts` + an in-memory order store. NEVER hardcode data in pages.
- Catalog reads are server-side; cart is client (`lib/cart.tsx`, localStorage).
- Order prices are recomputed server-side in `app/api/orders/route.ts` — never trust client prices.
- `orders.payment_status` is the seam for future online payments (COD flips it on delivery;
  Flutterwave webhook would flip it at checkout — no schema change).
- Admin gated by passcode cookie via `proxy.ts` + `lib/admin-auth.ts`. Upgrade path: Supabase Auth.

## Brand tokens (in `app/globals.css`)
- Canvas ivory `#f6f2ea` · ink `#141210` · accent fuchsia `#e0479e`.
- Fonts: Anton (display, `.font-display`), Inter (body), Sacramento (`.font-script` wordmark).
- Follow anti-generic rules: transform/opacity animation only, layered shadows, real
  hover/focus-visible/active states, no default Tailwind blue.

## Payments
v1 is **Cash/MoMo on delivery** (inspect before you pay). Do NOT promise programmatic MoMo
escrow — that needs a licensed operator. Online prepay = Flutterwave, deferred until the
brand has business registration.

## Hard rules
- Run `npm run build` before declaring done.
- Do NOT push to GitHub or deploy until the owner/Eddie explicitly says so.
- Replace placehold.co images + seed copy with real client assets when they arrive.
