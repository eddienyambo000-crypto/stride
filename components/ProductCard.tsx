import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { rwfLabel } from "@/lib/format";
import { cn } from "@/lib/cn";

const STOCK_LABEL: Record<Product["stock_status"], string | null> = {
  in_stock: null,
  made_to_order: "Made to order",
  sold_out: "Sold out",
};

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const img = product.images[0];
  const stock = STOCK_LABEL[product.stock_status];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block focus-visible:outline-none"
    >
      <div className="relative aspect-[9/11] overflow-hidden rounded-[var(--radius-lg)] bg-canvas-soft border border-line">
        {img ? (
          <Image
            src={img.url}
            alt={img.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted text-sm">
            No image
          </div>
        )}

        {product.is_best_seller && (
          <span className="absolute top-3 left-3 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 shadow-[var(--shadow-accent)]">
            Best seller
          </span>
        )}
        {stock && (
          <span
            className={cn(
              "absolute top-3 right-3 rounded-full text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 backdrop-blur",
              product.stock_status === "sold_out"
                ? "bg-ink/80 text-canvas"
                : "bg-canvas/80 text-ink",
            )}
          >
            {stock}
          </span>
        )}

        <span className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-[transform,opacity] duration-300 rounded-[var(--radius-md)] bg-canvas/95 text-ink text-center text-sm font-semibold py-2.5 shadow-[var(--shadow-float)]">
          View product
        </span>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted capitalize mt-0.5">{product.collection}</p>
        </div>
        <span className="text-[15px] font-bold tabular-nums whitespace-nowrap">
          {rwfLabel(product.price_rwf)}
        </span>
      </div>
    </Link>
  );
}
