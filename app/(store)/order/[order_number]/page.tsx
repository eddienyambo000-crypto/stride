import type { Metadata } from "next";
import { OrderView } from "@/components/OrderView";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ order_number: string }>;
}) {
  const { order_number } = await params;
  return <OrderView orderNumber={order_number} />;
}
