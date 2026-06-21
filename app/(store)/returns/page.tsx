import type { Metadata } from "next";
import { LegalPage, P, H2, UL } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "STRIDE returns and exchange policy. Inspect before you pay.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Exchanges" updated="June 2026">
      <P>
        Because you inspect your order at the door before paying, most issues are
        solved on the spot. If something isn&apos;t right, here&apos;s how it works.
      </P>
      <H2>Inspect before you pay</H2>
      <P>
        When our rider delivers, check the item — size, fit, print, and condition.
        If you&apos;re not happy, you don&apos;t have to pay. Simply decline the item
        and the rider takes it back.
      </P>
      <H2>Exchanges</H2>
      <P>
        Want a different size or colour? Let us know at delivery or within 48 hours
        and we&apos;ll arrange a swap, subject to availability. A small delivery fee
        may apply for re-delivery.
      </P>
      <H2>Made-to-order &amp; limited drops</H2>
      <P>
        Made-to-order and limited pieces are produced specifically for you. These can
        be exchanged for size only, not refunded, unless the item is faulty.
      </P>
      <H2>Faulty items</H2>
      <UL
        items={[
          "If an item has a genuine defect, we'll replace it at no extra cost.",
          "Report faults within 7 days of delivery with a photo via WhatsApp.",
        ]}
      />
      <P>
        Questions about a return? Message us on WhatsApp — we reply fast.
      </P>
    </LegalPage>
  );
}
