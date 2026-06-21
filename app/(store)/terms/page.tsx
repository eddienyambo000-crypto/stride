import type { Metadata } from "next";
import { LegalPage, P, H2 } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of using the STRIDE store.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="June 2026">
      <P>
        By ordering from STRIDE, you agree to these terms.
      </P>
      <H2>Orders</H2>
      <P>
        Placing an order is an offer to buy. We confirm your order by contacting you
        on the phone number you provide. Prices are shown in Rwandan Francs (RWF).
      </P>
      <H2>Payment</H2>
      <P>
        Payment is made on delivery by cash or mobile money, after you have
        inspected your order. We may add online payment options in future.
      </P>
      <H2>Delivery</H2>
      <P>
        We deliver across Kigali and Rwanda. Delivery times are estimates and may
        vary. A delivery fee applies based on your zone, shown at checkout.
      </P>
      <H2>Products</H2>
      <P>
        We work to show products accurately, but colours may vary slightly between
        screens and real life. Limited and made-to-order pieces are subject to
        availability.
      </P>
      <H2>Contact</H2>
      <P>
        Questions about these terms? Reach us at {SITE.email} or WhatsApp{" "}
        {SITE.phoneDisplay}.
      </P>
    </LegalPage>
  );
}
