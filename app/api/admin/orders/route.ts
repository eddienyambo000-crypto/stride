import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/data";
import { isAuthed } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getAllOrders();
  return NextResponse.json({ orders });
}
