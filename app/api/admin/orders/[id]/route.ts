import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/data";
import { isAuthed } from "@/lib/admin-auth";
import type { FulfillmentStatus, PaymentStatus } from "@/lib/types";

const VALID: FulfillmentStatus[] = [
  "new",
  "confirmed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    fulfillment_status?: FulfillmentStatus;
  };
  const fulfillment = body.fulfillment_status;

  if (!fulfillment || !VALID.includes(fulfillment)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  // Delivered COD orders are paid at handover; cancelled stay pending.
  let payment: PaymentStatus | undefined;
  if (fulfillment === "delivered") payment = "paid";

  try {
    await updateOrderStatus(id, fulfillment, payment);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
