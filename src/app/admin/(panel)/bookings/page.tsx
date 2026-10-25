import Link from "next/link";
import { requireAdmin } from "@/server/admin";
import { readDBSafe } from "@/server/db";
import { setBookingStatusAction } from "@/server/actions/bookings";
import { inr } from "@/lib/utils/pricing";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { parsePageParams, slicePage } from "@/lib/pagination";
import { StatusSelect } from "@/components/admin/controls";

export const metadata = { title: "Bookings" };
export const dynamic = "force-dynamic";

const tabs = ["all", "pending", "confirmed", "completed", "cancelled"];
const statuses = tabs.slice(1);
const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function AdminBookings({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const p = await searchParams;
  const st = p.status ?? "all";
  const { page, perPage } = parsePageParams(p);
  const db = await readDBSafe();
  const list = db.bookings
    .filter((b) => st === "all" || b.status === st)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const sliced = slicePage(list, page, perPage);
  const pendingCount = db.bookings.filter((b) => b.status === "pending").length;
  const name = (slug: string) => {
    const c = db.cars.find((x) => x.slug === slug);
    return c ? `${c.brand} ${c.model}` : slug;
  };
  const tabHref = (t: string) => {
    const qs = new URLSearchParams();
    if (t !== "all") qs.set("status", t);
    if (perPage !== 10) qs.set("perPage", String(perPage));
    const s = qs.toString();
    return s ? `/admin/bookings?${s}` : "/admin/bookings";
  };

  return (
    <>
      <PageHeader title="Bookings" />
      {!db.ok && (
        <p role="alert" className="mb-4 border border-amber-300 bg-amber-50 p-3 text-sm">
          Database se data nahi mila: {db.error ?? "connection failed"}. Atlas Network Access me{" "}
          <code className="text-xs">0.0.0.0/0</code> allow karo.
        </p>
      )}
      {db.ok && pendingCount > 0 && st !== "pending" && (
        <p role="status" className="mb-4 border border-brass/40 bg-brass/10 p-3 text-sm">
          <strong>{pendingCount}</strong> pending request{pendingCount === 1 ? "" : "s"} from website.{" "}
          <Link href="/admin/bookings?status=pending" className="font-semibold underline">
            Review pending
          </Link>
        </p>
      )}
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t}
            href={tabHref(t)}
            aria-current={st === t ? "page" : undefined}
            className={`px-3 py-1.5 text-sm capitalize ${st === t ? "bg-ink text-bone" : "card"}`}
          >
            {t} ({t === "all" ? db.bookings.length : db.bookings.filter((b) => b.status === t).length})
          </Link>
        ))}
      </nav>
      <DataTable
        minWidth="64rem"
        columns={[
          { label: "Ref" },
          { label: "Customer" },
          { label: "Car" },
          { label: "Pickup to return" },
          { label: "Estimate" },
          { label: "Status / confirm" },
        ]}
        isEmpty={list.length === 0}
        empty={
          <div className="card p-10 text-center">
            <p className="display text-3xl">No bookings</p>
            <p className="mt-2 text-sm text-mute">Website se booking aate hi yahan dikhegi.</p>
          </div>
        }
        pagination={{
          page: sliced.page,
          perPage: sliced.perPage,
          total: sliced.total,
          basePath: "/admin/bookings",
          params: { status: st === "all" ? undefined : st, perPage: String(sliced.perPage) },
        }}
      >
        {sliced.rows.map((b) => (
          <tr key={b.id} className="align-top">
            <td className="p-3 text-xs">
              <p className="font-mono">{b.id}</p>
              {!b.demo && <span className="mt-1 inline-block text-[0.65rem] tracking-wide text-brass uppercase">Website</span>}
              {b.demo && <span className="mt-1 inline-block text-[0.65rem] text-mute uppercase">Demo</span>}
            </td>
            <td className="px-3 py-3">
              <p className="font-medium">{b.fullName}</p>
              <a href={`https://wa.me/91${b.mobile.replace(/\D/g, "").slice(-10)}`} className="text-xs underline">
                {b.mobile}
              </a>
              <p className="text-xs text-mute">{b.email}</p>
              <p className="text-xs text-mute">
                {b.idProofType} · DL {b.drivingLicenceNumber}
              </p>
              {b.message && <p className="mt-1 max-w-xs text-xs text-mute">“{b.message}”</p>}
            </td>
            <td className="px-3 py-3">
              {name(b.carSlug)}
              <p className="text-xs text-mute">{b.pickupLocation}</p>
            </td>
            <td className="px-3 py-3 text-mute">
              {fmt(b.pickupAt)}
              <br />
              to {fmt(b.returnAt)}
            </td>
            <td className="px-3 py-3">{inr(b.estimatedTotal)}</td>
            <td className="px-3 py-3">
              <form action={setBookingStatusAction} className="mb-2">
                <input type="hidden" name="id" value={b.id} />
                <StatusSelect defaultValue={b.status} options={statuses} label={`Status of booking ${b.id}`} />
              </form>
              {b.status === "pending" && (
                <div className="flex flex-wrap gap-1.5">
                  <form action={setBookingStatusAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="confirmed" />
                    <button type="submit" className="border border-emerald-600 bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-950">
                      Confirm
                    </button>
                  </form>
                  <form action={setBookingStatusAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value="cancelled" />
                    <button type="submit" className="border border-red-500 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-950">
                      Cancel
                    </button>
                  </form>
                </div>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
