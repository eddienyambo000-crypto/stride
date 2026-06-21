# STRIDE — E-commerce Store

Premium Rwandan streetwear store. **Stride to Conquer.**

Next.js 16 · TypeScript · Tailwind v4 · Supabase · COD checkout · admin/delivery dashboard.

---

## How it runs (two modes)

The app works **with or without** Supabase:

- **Demo / seed mode** (no env keys): runs on local seed data (`lib/seed.ts`) and an
  in-memory order store. Great for building and previewing. Orders reset on restart.
- **Live mode** (Supabase keys set): real catalog + persisted orders + realtime admin queue.

```bash
npm install
npm run dev          # http://localhost:3007
npm run build        # production build
```

## Going live with Supabase

1. Create a Supabase project.
2. In the SQL Editor, run `supabase/schema.sql` then `supabase/seed.sql`.
3. Copy `.env.example` → `.env.local` and fill:
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ADMIN_PASSCODE=choose-a-strong-passcode
   ```
4. Restart. The site now reads/writes Supabase, and the admin order queue updates in
   **realtime** as customers check out.

## Admin / delivery dashboard

- URL: `/admin` (passcode gate — `ADMIN_PASSCODE`, default `stride-admin` in demo).
- **Orders**: live queue. Each paid/confirmed order shows customer, address, zone,
  phone, one-tap Call / WhatsApp, line items, and the amount to **collect on delivery**.
  Advance status: new → confirmed → out for delivery → delivered (delivered = paid).
- **Products**: add/edit/delete (live mode only; read-only seed catalog in demo).

## How payment works (v1)

**Cash / MoMo on delivery.** Customer orders online → order lands in the admin queue →
delivery team brings it → customer inspects → pays the rider. No upfront payment, no risk.
This is the trust mechanic ("inspect before you pay").

Online prepay is **architected but not enabled** — `orders.payment_status` already drives
everything, so adding Flutterwave later flips it to `paid` at checkout with no schema change.

## SEO

SSR/SSG product pages · JSON-LD (Product / Offer / BreadcrumbList / Organization) ·
`/sitemap.xml` · `/robots.txt` · clean URLs · `next/image` (AVIF/WebP).

## Project map

```
app/(store)/        storefront: home, shop, product, cart, checkout, order, about, contact, legal
app/admin/          dashboard (orders + products) + login
app/api/            orders (public create) · admin (orders, products, auth)
components/         UI, header/footer, product card/gallery, checkout, admin board/manager
lib/                site config, types, format, cart, data-access (Supabase|seed), auth
supabase/           schema.sql + seed.sql
proxy.ts            admin route protection (Next 16 proxy convention)
```

## Deploy (Vercel)

Push to GitHub, import in Vercel, add the env vars above, deploy. Set the production
domain in `NEXT_PUBLIC_SITE_URL`. Submit `/sitemap.xml` to Google Search Console.

## Roadmap (documented fast-follows)

- Flutterwave online payments (MoMo / Airtel / card) — needs business registration first
- WhatsApp auto-dispatch to delivery team via n8n
- Leaflet pin-drop delivery location at checkout
- Kinyarwanda / French localisation
- Real product photos + multi-image galleries (replace placeholders)

## Client inputs still needed

Logo (PNG/SVG) · confirmed brand colours · real product photos + names/prices/sizes ·
best sellers · collections · WhatsApp/phone/email · delivery zones & fees · MoMo name+number ·
return policy · domain · social links.
