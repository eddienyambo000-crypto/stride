import { AdminShell } from "@/components/admin/AdminShell";
import { SiteMediaManager } from "@/components/admin/SiteMediaManager";
import { getSiteConfig } from "@/lib/site-config";
import { isOrdersLive } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const config = await getSiteConfig();
  return (
    <AdminShell>
      <SiteMediaManager heroVideoUrl={config.heroVideoUrl} editable={isOrdersLive} />
    </AdminShell>
  );
}
