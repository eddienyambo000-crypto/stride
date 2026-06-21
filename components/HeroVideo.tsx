"use client";

import { useEffect, useState } from "react";

/**
 * Looped, muted hero background video. Skips loading entirely on data-saver
 * connections and when reduced-motion is requested — so it never hurts the
 * low-data mobile experience. The hero's gradient sits underneath as fallback.
 */
export function HeroVideo({ src }: { src: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <>
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Scrim keeps the dark headline readable over any footage */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(245,242,236,0.94) 0%, rgba(245,242,236,0.7) 42%, rgba(245,242,236,0.35) 100%)",
        }}
      />
    </>
  );
}
