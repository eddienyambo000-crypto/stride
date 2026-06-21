import type { Metadata } from "next";
import Link from "next/link";
import { getCollections, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Buy Clothes Online in Rwanda — Shop",
  description:
    "Shop STRIDE — premium streetwear and clothes in Rwanda. Graphic tees, hoodies, and limited drops. Order online, cash or MoMo on delivery across Kigali and Rwanda.",
  keywords: [
    "buy clothes online Rwanda",
    "clothes Kigali",
    "streetwear Rwanda",
    "graphic tees Rwanda",
    "online clothing store Rwanda",
  ],
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({ collection: c }),
  ]);

  const active = collections.find((col) => col.slug === c);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: active ? active.name : "Shop STRIDE — clothes in Rwanda",
          itemListElement: products.slice(0, 20).map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE.url}/shop/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
          {active ? "Collection" : "All products"}
        </p>
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)]">
          {active ? active.name : "Shop STRIDE"}
        </h1>
        {active?.description && (
          <p className="mt-3 max-w-xl text-ink-soft">{active.description}</p>
        )}
      </header>

      {/* Collection filter chips */}
      <nav className="flex flex-wrap gap-2 mb-8" aria-label="Filter by collection">
        <FilterChip href="/shop" active={!c}>
          All
        </FilterChip>
        {collections.map((col) => (
          <FilterChip key={col.id} href={`/shop?c=${col.slug}`} active={c === col.slug}>
            {col.name}
          </FilterChip>
        ))}
      </nav>

      {products.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas-soft p-12 text-center">
          <p className="font-display text-2xl">Nothing here yet</p>
          <p className="mt-2 text-ink-soft">
            New pieces are added often. Check back soon or{" "}
            <Link href="/shop" className="text-accent font-semibold underline">
              browse everything
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors border",
        active
          ? "bg-ink text-canvas border-ink"
          : "bg-transparent text-ink-soft border-line hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
