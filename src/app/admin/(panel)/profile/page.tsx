import { AdminProfileForm } from "@/components/admin/AdminProfileForm";
import { getAdminProfile } from "@/server/admin-users";
import { requireAdmin } from "@/server/admin";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  await requireAdmin();
  const profile = await getAdminProfile();
  return <AdminProfileForm profile={profile} />;
}
