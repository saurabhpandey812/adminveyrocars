import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/server/admin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-bone lg:grid lg:grid-cols-[15rem_1fr]">
      <AdminSidebar />
      <main className="min-w-0 p-5 lg:p-8">{children}</main>
    </div>
  );
}
