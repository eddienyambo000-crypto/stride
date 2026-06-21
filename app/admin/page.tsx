import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersBoard } from "@/components/admin/OrdersBoard";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <OrdersBoard />
    </AdminShell>
  );
}
