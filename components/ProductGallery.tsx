"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[9/11] overflow-hidden rounded-[var(--radius-lg)] bg-canvas-soft border border-line">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt ?? name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted">
            No image
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                "relative h-20 w-16 overflow-hidden rounded-[var(--radius-md)] border-2 transition-colors cursor-pointer",
                i === active ? "border-accent" : "border-line hover:border-ink",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? `${name} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
