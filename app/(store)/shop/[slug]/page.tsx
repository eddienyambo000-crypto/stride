import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProductSlugs, getProductBySlug, getProducts } from "@/lib/data";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { AddToCart } from "@/components/AddToCart";
import { JsonLd } from "@/components/JsonLd";
import { rwfLabel, usd } from "@/lib/format";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${SITE.name}`,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
      type: "website",
    },
  };
}

const STOCK_TEXT: Record<string, string> = {
  in_stock: "In stock — ready to ship",
  made_to_order: "Made to order — ships in a few days",
  sold_out: "Sold out",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProducts({ collection: product.collection }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.images.map((i) => i.url),
          sku: product.slug.toUpperCase(),
          brand: { "@type": "Brand", name: SITE.name },
          offers: {
            "@type": "Offer",
            url: `${SITE.url}/shop/${product.slug}`,
            priceCurrency: "RWF",
            price: String(product.price_rwf),
            priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
            itemCondition: "https://schema.org/NewCondition",
            availability:
              product.stock_status === "sold_out"
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE.name },
            // Shipping + returns → eligible for Google free product listings & rich results
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: {
                "@type": "MonetaryAmount",
                value: "2000",
                currency: "RWF",
              },
              shippingDestination: {
                "@type": "DefinedRegion",
                addressCountry: "RW",
              },
              deliveryTime: {
                "@type": "ShippingDeliveryTime",
                handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 4, unitCode: "DAY" },
              },
            },
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "RW",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 2,
              returnMethod: "https://schema.org/ReturnByMail",
              returnFees: "https://schema.org/FreeReturn",
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE.url}/shop` },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: `${SITE.url}/shop/${product.slug}`,
            },
          ],
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-soft">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {product.collection}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2rem,5vw,3.25rem)]">
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold tabular-nums">
              {rwfLabel(product.price_rwf)}
            </span>
            {usd(product.price_usd) && (
              <span className="text-sm text-muted">≈ {usd(product.price_usd)}</span>
            )}
          </div>

          <p className="mt-2 text-sm font-medium text-ink-soft">
            {STOCK_TEXT[product.stock_status]}
          </p>

          <p className="mt-6 text-ink-soft leading-relaxed">{product.description}</p>

          <AddToCart product={product} />

          <div className="mt-8 grid gap-3 text-sm text-ink-soft border-t border-line pt-6">
            <Detail label="Delivery" value={`${SITE.delivery.kigali} · ${SITE.delivery.rwanda}`} />
            <Detail label="Payment" value="Cash or MoMo on delivery — inspect before you pay" />
            <Detail label="Questions?" value={`WhatsApp ${SITE.phoneDisplay}`} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] mb-6">
            You might also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted pt-0.5">
        {label}
      </span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
