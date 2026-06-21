import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ — Delivery, Payment & Sizing",
  description:
    "Everything about ordering STRIDE streetwear in Rwanda: pay on delivery, Kigali & Rwanda-wide shipping, sizing, returns. Inspect before you pay.",
  alternates: { canonical: "/faq" },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do you deliver across Kigali and Rwanda?",
    a: "Yes. We deliver anywhere in Kigali within 24 hours and Rwanda-wide in 2–4 working days. You can also pick up from Remera.",
  },
  {
    q: "How do I pay?",
    a: "You pay on delivery — cash or mobile money (MTN MoMo / Airtel Money). You inspect your order first, then pay the rider. No upfront payment needed.",
  },
  {
    q: "Can I check the item before paying?",
    a: "Always. Our rider waits while you check the size, fit and quality. If it's not right, you don't pay — simple as that.",
  },
  {
    q: "How much does delivery cost?",
    a: "Kigali delivery is 2,000 RWF, Rwanda-wide is 4,500 RWF, and pickup from Remera is free. The fee is shown clearly at checkout.",
  },
  {
    q: "How do I know my size?",
    a: "Most STRIDE pieces are oversized streetwear fits. Each product lists available sizes (S–XL). Unsure? Message us on WhatsApp and we'll guide you.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Because you inspect before paying, most issues are solved at the door. For exchanges, contact us within 48 hours of delivery and we'll arrange a swap subject to availability.",
  },
  {
    q: "How do I track my order?",
    a: "After checkout you get an order number and a tracking page showing live status — received, confirmed, out for delivery, delivered.",
  },
  {
    q: "Where is STRIDE based?",
    a: "STRIDE is a Rwandan streetwear label designed and based in Kigali (Remera). We ship across the country.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-3">
        Help centre
      </p>
      <h1 className="font-display text-[clamp(2.2rem,7vw,4rem)]">
        Questions, answered
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Everything about ordering STRIDE in Rwanda. Still stuck? WhatsApp us — we
        reply within 2 hours.
      </p>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {FAQS.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-[17px]">
              {f.q}
              <span className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-ink-soft leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] glass-sky p-8 text-center">
        <h2 className="font-display text-2xl">Still have a question?</h2>
        <p className="mt-2 text-ink-soft">We&apos;re a WhatsApp message away.</p>
        <div className="mt-6">
          <ButtonLink href={`https://wa.me/${SITE.whatsapp}`} size="lg">
            Chat on WhatsApp
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
