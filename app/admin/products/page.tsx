import { AdminShell } from "@/components/admin/AdminShell";
import { ProductManager } from "@/components/admin/ProductManager";
import { getCollections, getProducts } from "@/lib/data";
import { isOrdersLive } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);
  return (
    <AdminShell>
      <ProductManager
        products={products}
        collections={collections}
        editable={isOrdersLive}
      />
    </AdminShell>
  );
}
