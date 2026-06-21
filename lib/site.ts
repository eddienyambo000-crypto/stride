/**
 * STRIDE — single source of truth for brand + contact info.
 * Update these once real client details land (GROWTH×EDDIE checklist).
 */
export const SITE = {
  name: "STRIDE",
  tagline: "Stride to Conquer",
  description:
    "STRIDE is Rwanda's premium streetwear label. Bold graphic tees and statement pieces, designed in Kigali. Order online — pay on delivery, inspect before you pay.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stride.rw",

  // Contact (from intake — confirm/replace with client)
  whatsapp: "250791922259", // receives website orders
  phoneDisplay: "+250 791 922 259",
  email: "stride863@gmail.com",
  location: "Kigali · Remera, KG 330 St",

  socials: {
    instagram: "https://www.instagram.com/_strid3/",
    instagramHandle: "@_strid3",
    tiktok: "",
    facebook: "",
  },

  // Customer-facing promises (shown as trust signals)
  responsePromise: "Replies within 2 hours",
  delivery: {
    kigali: "Kigali delivery in 24 hours",
    rwanda: "Rwanda-wide in 2–4 days",
  },
} as const;

export function whatsappLink(message: string, phone: string = SITE.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function mapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Build the WhatsApp order message the customer sends to the store (with pin). */
export function buildOrderWhatsapp(opts: {
  orderNumber: string;
  name: string;
  phone: string;
  zone: string;
  address: string;
  total: string;
  items: string;
  lat?: number | null;
  lng?: number | null;
}) {
  const pin =
    opts.lat != null && opts.lng != null
      ? `\n📍 Live location: ${mapsLink(opts.lat, opts.lng)}`
      : "";
  return (
    `*New STRIDE order* #${opts.orderNumber}\n\n` +
    `👤 ${opts.name}\n📞 ${opts.phone}\n🚚 ${opts.zone}\n🏠 ${opts.address}${pin}\n\n` +
    `🛍️ ${opts.items}\n\n💰 Total (pay on delivery): ${opts.total}`
  );
}
