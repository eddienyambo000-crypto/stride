import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with STRIDE. WhatsApp ${SITE.phoneDisplay}, email ${SITE.email}. Based in Kigali, Rwanda.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
        Get in touch
      </p>
      <h1 className="font-display text-[clamp(2.4rem,8vw,4rem)]">Talk to us</h1>
      <p className="mt-4 text-lg text-ink-soft max-w-xl">
        Questions about sizing, an order, or a custom request? The fastest way to
        reach us is WhatsApp — {SITE.responsePromise.toLowerCase()}.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <Card
          title="WhatsApp"
          value={SITE.phoneDisplay}
          href={whatsappLink("Hi STRIDE 👋")}
          accent
        />
        <Card title="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
        <Card title="Call" value={SITE.phoneDisplay} href={`tel:+${SITE.whatsapp}`} />
        <Card title="Find us" value={SITE.location} />
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] bg-canvas-soft border border-line p-8 text-center">
        <h2 className="font-display text-2xl">Ready to order?</h2>
        <p className="mt-2 text-ink-soft">
          Browse the collection and check out in minutes — pay on delivery.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <ButtonLink href="/shop" size="lg">Shop now</ButtonLink>
          <ButtonLink href={whatsappLink("Hi STRIDE 👋 I have a question.")} variant="ghost" size="lg">
            Chat on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  href,
  accent,
}: {
  title: string;
  value: string;
  href?: string;
  accent?: boolean;
}) {
  const inner = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {title}
      </p>
      <p className={`mt-1.5 font-semibold ${accent ? "text-accent" : "text-ink"}`}>
        {value}
      </p>
    </>
  );
  const cls =
    "block rounded-[var(--radius-lg)] border border-line bg-canvas p-5 transition-colors hover:border-ink";
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
