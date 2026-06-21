import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/data";

/** Public read of a single order by its number (used by the confirmation page). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ order_number: string }> },
) {
  const { order_number } = await params;
  const order = await getOrderByNumber(order_number);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
