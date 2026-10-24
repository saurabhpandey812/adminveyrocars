import Link from "next/link";
import { CalendarCheck, Car, Clock, IndianRupee, KeyRound, Users } from "lucide-react";
import { requireAdmin } from "@/server/admin";
import { getDashboard } from "@/server/stats";
import { setBookingStatusAction } from "@/server/actions/bookings";
import { inr } from "@/lib/utils/pricing";
import { WelcomeBanner } from "@/components/admin/WelcomeBanner";
import { StatCard } from "@/components/admin/charts/StatCard";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { Donut } from "@/components/admin/charts/Donut";
import { BarColumns, BarList } from "@/components/admin/charts/Bars";
import { StatusBadge } from "@/components/account/StatusBadge";
import { DataTable } from "@/components/admin/DataTable";

export const metadata = { title: "Dashboard" };
const day = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default async function Dashboard() {
  await requireAdmin();
  const d = await getDashboard();
  return (
    <>
      <WelcomeBanner />

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Revenue this month" value={inr(d.revenueThisMonth)} delta={d.revenueDelta} icon={IndianRupee} />
        <StatCard label="Bookings this month" value={String(d.bookingsThisMonth)} delta={d.bookingsDelta} icon={CalendarCheck} />
        <StatCard label="Pending requests" value={String(d.pending)} icon={Clock} />
        <StatCard label="Cars available" value={`${d.cars.available}/${d.cars.total}`} icon={Car} />
        <StatCard label="Cars out now" value={String(d.outNow)} icon={KeyRound} />
        <StatCard label="Customers" value={String(d.customers)} icon={Users} />
      </section>

      <section className="mt-5 grid items-stretch gap-4 xl:grid-cols-3">
        <div className="card flex h-full flex-col p-5 xl:col-span-2">
          <h2 className="display mb-3 text-2xl">Revenue</h2>
          <div className="flex min-h-0 flex-1 items-center">
            <RevenueChart data={d.monthly} />
          </div>
        </div>
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="card flex min-h-0 flex-1 flex-col p-4">
            <h2 className="display mb-2 text-xl">By status</h2>
            <div className="flex min-h-0 flex-1 items-center">
              <Donut data={d.statusCounts} />
            </div>
          </div>
          <div className="card flex min-h-0 flex-1 flex-col p-4">
            <h2 className="display mb-3 text-xl">Top cars</h2>
            <div className="min-h-0 flex-1 overflow-auto">
              <BarList items={d.topCars} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="card p-5">
          <h2 className="display mb-4 text-2xl">Bookings</h2>
          <BarColumns items={d.monthly.map((m) => ({ label: m.label, value: m.bookings }))} />
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="display text-2xl">Pending</h2><Link href="/admin/bookings?status=pending" className="text-sm underline">See all</Link></div>
          <DataTable
            minWidth="28rem"
            columns={[
              { label: "Customer / car" },
              { label: "Dates" },
              { label: "Actions", className: "text-right" },
            ]}
            isEmpty={d.pendingList.length === 0}
            empty={<div className="card p-6 text-sm text-mute">None</div>}
          >
            {d.pendingList.map((b) => (
              <tr key={b.id} className="hover:bg-bone/60">
                <td className="p-3">
                  <p className="font-medium">{b.fullName}</p>
                  <p className="text-xs text-mute">{d.carName(b.carSlug)} · {b.mobile}</p>
                </td>
                <td className="px-3 py-3 text-xs text-mute">{day(b.pickupAt)} to {day(b.returnAt)}</td>
                <td className="px-3 py-3">
                  <form action={setBookingStatusAction} className="flex justify-end gap-2">
                    <input type="hidden" name="id" value={b.id} />
                    <button name="status" value="confirmed" className="btn btn-dark min-h-8 px-3 text-xs">Confirm</button>
                    <button name="status" value="cancelled" className="btn btn-ghost min-h-8 px-3 text-xs">Decline</button>
                  </form>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between"><h2 className="display text-2xl">Recent</h2><Link href="/admin/bookings" className="text-sm underline">See all</Link></div>
          <DataTable
            minWidth="24rem"
            columns={[
              { label: "Booking" },
              { label: "Status", className: "text-right" },
            ]}
            isEmpty={d.recent.length === 0}
            empty={<div className="card p-6 text-sm text-mute">None</div>}
          >
            {d.recent.map((b) => (
              <tr key={b.id} className="hover:bg-bone/60">
                <td className="p-3">
                  <p className="font-medium">{d.carName(b.carSlug)}</p>
                  <p className="text-xs text-mute">{b.fullName} · {day(b.pickupAt)}</p>
                </td>
                <td className="px-3 py-3 text-right"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </>
  );
}
