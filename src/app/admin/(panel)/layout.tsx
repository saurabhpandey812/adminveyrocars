import { AdminShell } from "@/components/admin/AdminShell";
import { env } from "@/config";
import { getUserProfile } from "@/server/users";
import { requireAdmin } from "@/server/admin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  // Never block shell on DB — config always available
  let email: string = env.admin.email;
  let name = "Admin";
  try {
    const profile = await getUserProfile();
    email = profile.email || email;
    name = profile.name || name;
  } catch {
    /* config fallback */
  }
  return (
    <AdminShell adminEmail={email} adminName={name}>
      {children}
    </AdminShell>
  );
}
