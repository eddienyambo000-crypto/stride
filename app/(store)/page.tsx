import Link from "next/link";
import { getBestSellers, getCollections, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/JsonLd";
import { NewArrivals } from "@/components/NewArrivals";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [bestSellers, collections, allProducts] = await Promise.all([
    getBestSellers(4),
    getCollections(),
    getProducts(),
  ]);
  const newArrivals = [...allProducts]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 8);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          slogan: SITE.tagline,
          description: SITE.description,
          sameAs: [SITE.socials.instagram],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kigali",
            addressCountry: "RW",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: `+${SITE.whatsapp}`,
            contactType: "sales",
            areaServed: "RW",
          },
        }}
      />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(62% 52% at 80% 0%, rgba(56,189,248,0.20), transparent 70%), radial-gradient(50% 50% at 0% 100%, rgba(18,20,23,0.06), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-8 items-center">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-bright" />
                Premium streetwear · Kigali
              </span>

              <h1 className="font-display text-ink mt-5 text-[clamp(2.8rem,9vw,6.5rem)]">
                Average was
                <br />
                never the
                <br />
                <span className="text-accent">assignment.</span>
              </h1>

              <p className="mt-6 max-w-md text-base sm:text-lg text-ink-soft leading-relaxed">
                STRIDE makes bold, heavyweight pieces for people who don&apos;t
                blend in. Order online — pay on delivery, inspect before you pay.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/shop" size="lg">
                  Shop the collection
                </ButtonLink>
                <ButtonLink href="/shop?c=limited" variant="ghost" size="lg">
                  Limited drops
                </ButtonLink>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <Trust label="Cash & MoMo on delivery" />
                <Trust label={SITE.delivery.kigali} />
                <Trust label="Rwanda-wide shipping" />
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative animate-rise">
              <div className="relative aspect-[4/5] rounded-[var(--radius-xl)] overflow-hidden border border-line-ink bg-ink shadow-[var(--shadow-float)]">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 50% 0%, #123a52, #121417 62%)",
                  }}
                />
                <div className="absolute inset-0 grid place-items-center p-8 text-center">
                  <div>
                    <span className="font-script text-sky-sheen text-6xl sm:text-7xl block leading-none">
                      Stride
                    </span>
                    <span className="mt-3 inline-block text-canvas/60 text-xs font-semibold uppercase tracking-[0.4em]">
                      to conquer
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-[var(--radius-md)] glass-ink px-4 py-3 text-canvas/90 text-sm">
                  New season graphics — live now
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-advancing new arrivals (replaces the old ticker) */}
        <NewArrivals products={newArrivals} />
      </section>

      {/* ───────── Best sellers ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                Most wanted
              </p>
              <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)]">Best sellers</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-ink-soft hover:text-accent transition-colors whitespace-nowrap"
            >
              View all →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── Collections ───────── */}
      <section className="bg-canvas-soft border-y border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)] mb-8">
              Shop by collection
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {collections.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <Link
                  href={`/shop?c=${c.slug}`}
                  className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line-ink bg-ink text-canvas p-7 min-h-44 flex flex-col justify-end transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                    style={{
                      background:
                        "radial-gradient(100% 80% at 100% 0%, rgba(56,189,248,0.4), transparent 60%), #121417",
                    }}
                  />
                  <div className="relative">
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-1.5 text-sm text-canvas/70 max-w-xs">
                      {c.description}
                    </p>
                    <span className="mt-3 inline-block text-sm font-semibold text-accent-bright">
                      Explore →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── How it works (trust) ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
              Buy with confidence
            </p>
            <h2 className="font-display text-[clamp(1.8rem,5vw,3rem)]">
              Inspect before you pay
            </h2>
            <p className="mt-4 text-ink-soft">
              No risky upfront transfers. Order online, our rider brings it to you,
              you check it, then you pay. That&apos;s the STRIDE promise.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            ["01", "Order online", "Add your pieces, pick your size, choose your delivery zone. Two-minute checkout — no account needed."],
            ["02", "We deliver to you", "Our rider brings your order to your door anywhere in Kigali within 24 hours, Rwanda-wide in days."],
            ["03", "Inspect, then pay", "Try it, check the fit and quality, and only then pay by cash or MoMo. Not right? Don't pay."],
          ].map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 0.08}>
              <Step n={n} title={title} body={body} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── CTA band ───────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-ink text-canvas px-6 sm:px-12 py-14 text-center">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(80% 120% at 50% -20%, rgba(56,189,248,0.4), transparent 60%)",
              }}
            />
            <div className="relative">
              <h2 className="font-display text-[clamp(2rem,6vw,4rem)]">
                Ready to <span className="text-accent-bright">conquer?</span>
              </h2>
              <p className="mt-3 text-canvas/70 max-w-md mx-auto">
                New graphics drop regularly and limited pieces sell out fast.
              </p>
              <div className="mt-7">
                <ButtonLink href="/shop" size="lg">
                  Shop now
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m5 12.5 4 4 10-10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="h-full rounded-[var(--radius-lg)] border border-line bg-canvas p-6 shadow-[var(--shadow-soft)]">
      <span className="font-display text-accent text-3xl">{n}</span>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}
