import { AdminShell } from "@/components/admin/AdminShell";
import { env } from "@/config";
import { requireAdmin } from "@/server/admin";

/** Always hit Mongo — web pe nayi booking turant admin me dikhe */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <AdminShell adminEmail={env.admin.email} adminName="Admin">
      {children}
    </AdminShell>
  );
}
