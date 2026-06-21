import type { Collection, DeliveryZone, Product } from "./types";

/**
 * Seed catalog — lets the whole site run + demo before Supabase keys land.
 * Replace images/prices/copy with real client data (GROWTH×EDDIE checklist).
 * Placeholder images use brand colors so the layout reads correctly.
 */
const img = (seed: string, label: string) =>
  `https://placehold.co/900x1100/efe9dd/141210/png?text=${encodeURIComponent(label)}&font=montserrat`;

export const COLLECTIONS: Collection[] = [
  {
    id: "c-signature",
    slug: "signature",
    name: "Signature Graphics",
    description: "Statement graphic tees — the pieces STRIDE is known for.",
    sort_order: 1,
  },
  {
    id: "c-essentials",
    slug: "essentials",
    name: "Essentials",
    description: "Everyday heavyweight basics built to last.",
    sort_order: 2,
  },
  {
    id: "c-limited",
    slug: "limited",
    name: "Limited Drops",
    description: "Small-run releases. When they're gone, they're gone.",
    sort_order: 3,
  },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: "z-kigali", name: "Kigali", fee_rwf: 2000, eta: "Within 24 hours", sort_order: 1 },
  { id: "z-rwanda", name: "Rwanda-wide", fee_rwf: 4500, eta: "2–4 working days", sort_order: 2 },
  { id: "z-pickup", name: "Pickup (Remera)", fee_rwf: 0, eta: "Ready same day", sort_order: 3 },
];

const SIZES = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    id: "p-assignment",
    slug: "average-was-never-the-assignment",
    name: "Average Was Never The Assignment",
    description:
      "Heavyweight oversized tee with a neon-charged back graphic. A reminder stitched into cotton: average was never the goal.",
    price_rwf: 25000,
    price_usd: 19,
    collection: "signature",
    is_best_seller: true,
    stock_status: "in_stock",
    sizes: SIZES,
    colors: ["Sand", "Black"],
    created_at: "2026-06-01T00:00:00Z",
    images: [
      { id: "i1", product_id: "p-assignment", url: img("assignment", "AVERAGE / WAS NEVER"), alt: "Average Was Never The Assignment tee — back graphic", sort_order: 1 },
      { id: "i1b", product_id: "p-assignment", url: img("assignment2", "STRIDE TEE"), alt: "Front view", sort_order: 2 },
    ],
  },
  {
    id: "p-uncommon",
    slug: "uncommon",
    name: "Uncommon",
    description:
      "Bold brushed 'UNCOMMON' front print with electric pink streaks and crown detailing on the sleeves. Oversized fit, premium combed cotton.",
    price_rwf: 22000,
    price_usd: 17,
    collection: "signature",
    is_best_seller: true,
    stock_status: "in_stock",
    sizes: SIZES,
    colors: ["Sand", "Cream"],
    created_at: "2026-06-02T00:00:00Z",
    images: [
      { id: "i2", product_id: "p-uncommon", url: img("uncommon", "UNCOMMON"), alt: "Uncommon tee — front print", sort_order: 1 },
    ],
  },
  {
    id: "p-classic",
    slug: "stride-to-conquer-classic-tee",
    name: "Stride to Conquer — Classic Tee",
    description:
      "The signature wordmark, clean and confident. Mid-weight everyday tee in a relaxed cut.",
    price_rwf: 18000,
    price_usd: 14,
    collection: "essentials",
    is_best_seller: true,
    stock_status: "in_stock",
    sizes: SIZES,
    colors: ["Black", "Cream", "Sand"],
    created_at: "2026-06-03T00:00:00Z",
    images: [
      { id: "i3", product_id: "p-classic", url: img("classic", "STRIDE / CLASSIC"), alt: "Stride classic tee", sort_order: 1 },
    ],
  },
  {
    id: "p-hoodie",
    slug: "conquer-heavyweight-hoodie",
    name: "Conquer Heavyweight Hoodie",
    description:
      "400gsm brushed-back fleece hoodie with embroidered wordmark. Made to order in limited runs.",
    price_rwf: 45000,
    price_usd: 35,
    collection: "essentials",
    is_best_seller: false,
    stock_status: "made_to_order",
    sizes: SIZES,
    colors: ["Black", "Sand"],
    created_at: "2026-06-04T00:00:00Z",
    images: [
      { id: "i4", product_id: "p-hoodie", url: img("hoodie", "CONQUER / HOODIE"), alt: "Conquer hoodie", sort_order: 1 },
    ],
  },
  {
    id: "p-nightfall",
    slug: "nightfall-graphic-tee",
    name: "Nightfall Graphic Tee",
    description:
      "Midnight-toned back graphic with chromatic glow. Drop-shoulder oversized fit.",
    price_rwf: 25000,
    price_usd: 19,
    collection: "signature",
    is_best_seller: false,
    stock_status: "in_stock",
    sizes: SIZES,
    colors: ["Black"],
    created_at: "2026-06-05T00:00:00Z",
    images: [
      { id: "i5", product_id: "p-nightfall", url: img("nightfall", "NIGHTFALL"), alt: "Nightfall graphic tee", sort_order: 1 },
    ],
  },
  {
    id: "p-crew",
    slug: "heritage-crewneck",
    name: "Heritage Crewneck",
    description:
      "Clean heavyweight crewneck with tonal chest embroidery. Built for the everyday rotation.",
    price_rwf: 38000,
    price_usd: 29,
    collection: "essentials",
    is_best_seller: false,
    stock_status: "in_stock",
    sizes: SIZES,
    colors: ["Cream", "Black"],
    created_at: "2026-06-06T00:00:00Z",
    images: [
      { id: "i6", product_id: "p-crew", url: img("crew", "HERITAGE / CREW"), alt: "Heritage crewneck", sort_order: 1 },
    ],
  },
  {
    id: "p-pulse",
    slug: "pulse-limited-drop",
    name: "Pulse — Limited Drop",
    description:
      "Numbered limited release. Hand-finished print, only 50 made. When it's gone, it's gone.",
    price_rwf: 30000,
    price_usd: 23,
    collection: "limited",
    is_best_seller: false,
    stock_status: "made_to_order",
    sizes: SIZES,
    colors: ["Sand"],
    created_at: "2026-06-07T00:00:00Z",
    images: [
      { id: "i7", product_id: "p-pulse", url: img("pulse", "PULSE / LIMITED"), alt: "Pulse limited drop tee", sort_order: 1 },
    ],
  },
  {
    id: "p-cap",
    slug: "momentum-cap",
    name: "Momentum Cap",
    description:
      "Structured 6-panel cap with raised wordmark. One size, adjustable.",
    price_rwf: 12000,
    price_usd: 9,
    collection: "essentials",
    is_best_seller: false,
    stock_status: "in_stock",
    sizes: ["One Size"],
    colors: ["Black", "Sand"],
    created_at: "2026-06-08T00:00:00Z",
    images: [
      { id: "i8", product_id: "p-cap", url: img("cap", "MOMENTUM / CAP"), alt: "Momentum cap", sort_order: 1 },
    ],
  },
];
