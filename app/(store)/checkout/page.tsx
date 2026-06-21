import type { Metadata } from "next";
import { getDeliveryZones } from "@/lib/data";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your STRIDE order. Pay on delivery — inspect before you pay.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const zones = await getDeliveryZones();
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] mb-8">Checkout</h1>
      <CheckoutForm zones={zones} />
    </div>
  );
}
