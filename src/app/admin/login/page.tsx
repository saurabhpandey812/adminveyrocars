import { AdminAuthShell } from "@/components/admin/AdminAuthShell";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { site } from "@/lib/constants/site";

export const metadata = { title: "Sign in" };

export default function AdminLogin() {
  return (
    <AdminAuthShell
      title="Welcome back"
      intro="Sign in with your admin email to manage the fleet, bookings and customers."
      eyebrow={site.name}
    >
      <AdminLoginForm />
    </AdminAuthShell>
  );
}
