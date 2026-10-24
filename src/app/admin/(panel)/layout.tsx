import { AdminShell } from "@/components/admin/AdminShell";
import { env } from "@/config";
import { requireAdmin } from "@/server/admin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  // Config only — no Mongo on every page (keeps nav fast / no hang)
  return (
    <AdminShell adminEmail={env.admin.email} adminName="Admin">
      {children}
    </AdminShell>
  );
}
