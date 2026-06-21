import type { Metadata } from "next";
import { LegalPage, P, H2, UL } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How STRIDE collects and uses your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <P>
        STRIDE respects your privacy. This policy explains what we collect when you
        order from us and how we use it.
      </P>
      <H2>What we collect</H2>
      <UL
        items={[
          "Your name, phone number, and delivery address — to fulfil your order.",
          "Order details (items, sizes, amounts) — to process and deliver.",
          "Optional WhatsApp number — to coordinate delivery.",
        ]}
      />
      <H2>How we use it</H2>
      <P>
        We use your information only to process orders, arrange delivery, and
        contact you about your purchase. We do not sell your data to anyone.
      </P>
      <H2>Who sees it</H2>
      <P>
        Only STRIDE and our delivery team see your order details, and only to get
        your order to you.
      </P>
      <H2>Your choices</H2>
      <P>
        You can ask us to update or delete your information at any time by
        contacting {SITE.email}.
      </P>
    </LegalPage>
  );
}
