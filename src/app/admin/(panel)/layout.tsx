import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminProfile } from "@/server/admin-users";
import { requireAdmin } from "@/server/admin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const profile = await getAdminProfile();
  return (
    <AdminShell adminEmail={profile.email} adminName={profile.displayName}>
      {children}
    </AdminShell>
  );
}
