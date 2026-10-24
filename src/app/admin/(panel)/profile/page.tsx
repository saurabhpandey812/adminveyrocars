import { AdminProfileForm } from "@/components/admin/AdminProfileForm";
import { getUserProfile } from "@/server/users";
import { requireAdmin } from "@/server/admin";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  await requireAdmin();
  const profile = await getUserProfile();
  return <AdminProfileForm profile={profile} />;
}
