"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { rwfLabel } from "@/lib/format";

/**
 * Auto-advancing product rail. A seamless, continuously moving showcase of the
 * newest drops that scrolls itself (pauses on hover/touch, honors reduced motion,
 * and can still be dragged). Replaces the old text marquee.
 */
export function NewArrivals({ products }: { products: Product[] }) {
  const items = products.slice(0, 8);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const SPEED = 40; // px / second

  useAnimationFrame((_, delta) => {
    if (paused || reduce || !trackRef.current) return;
    const half = trackRef.current.scrollWidth / 2;
    if (half === 0) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -half) next += half; // wrap seamlessly
    x.set(next);
  });

  if (items.length === 0) return null;
  const loop = [...items, ...items]; // duplicate for seamless wrap

  return (
    <section
      aria-label="New arrivals"
      className="relative overflow-hidden border-y border-line bg-ink py-7"
    >
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-4 flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-accent-bright animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-canvas/70">
          Just dropped — new arrivals
        </span>
      </div>

      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex gap-4 w-max px-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: -99999, right: 99999 }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerCancel={() => setPaused(false)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {loop.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/shop/${p.slug}`}
            draggable={false}
            className="group relative w-44 sm:w-52 shrink-0 rounded-[var(--radius-lg)] overflow-hidden border border-line-ink bg-canvas-soft"
          >
            <div className="relative aspect-[4/5]">
              {p.images[0] && (
                <Image
                  src={p.images[0].url}
                  alt={p.images[0].alt ?? p.name}
                  fill
                  sizes="208px"
                  draggable={false}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 glass-ink p-3">
              <p className="text-sm font-semibold text-canvas truncate">{p.name}</p>
              <p className="text-xs text-accent-bright font-semibold tabular-nums">
                {rwfLabel(p.price_rwf)}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
