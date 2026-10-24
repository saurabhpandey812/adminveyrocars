import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdmin } from "@/server/admin";
import { readDB } from "@/server/db";
import { clearDemoDataAction } from "@/server/actions/settings";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmButton } from "@/components/admin/controls";

export const metadata = { title: "Settings" };

export default async function Settings() {
  await requireAdmin();
  const db = await readDB();
  const demo = db.bookings.filter((b) => b.demo).length + db.customers.filter((c) => c.demo).length;
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-3xl gap-6">
        <section className="card p-5">
          <h2 className="display text-2xl">Data</h2>
          <p className="mt-1 text-sm text-mute">{db.cars.length} cars · {db.bookings.length} bookings · {db.customers.length} customers</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/admin/export" prefetch={false} className="btn btn-ghost"><Download size={16} aria-hidden /> Backup</Link>
            {demo > 0 && (
              <form action={clearDemoDataAction}>
                <ConfirmButton message="Remove all demo bookings and customers?" className="btn btn-dark">
                  Clear demo ({demo})
                </ConfirmButton>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
