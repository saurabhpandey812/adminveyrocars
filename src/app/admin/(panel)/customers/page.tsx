import { requireAdmin } from "@/server/admin";
import { readDB } from "@/server/db";
import { inr } from "@/lib/utils/pricing";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { parsePageParams, slicePage } from "@/lib/pagination";

export const metadata = { title: "Customers" };

export default async function AdminCustomers({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const p = await searchParams;
  const { page, perPage } = parsePageParams(p);
  const db = await readDB();
  const rows = db.customers
    .map((c) => {
      const bs = db.bookings.filter((b) => b.userId === c.id);
      const spent = bs
        .filter((b) => b.status === "completed" || b.status === "confirmed")
        .reduce((a, b) => a + (b.rentalAmount ?? b.estimatedTotal), 0);
      return { c, count: bs.length, spent, last: bs.map((b) => b.pickupAt).sort().at(-1) };
    })
    .sort((a, b) => b.spent - a.spent);
  const sliced = slicePage(rows, page, perPage);
  return (
    <>
      <PageHeader title="Customers" />
      <DataTable
        minWidth="44rem"
        columns={[
          { label: "Customer" },
          { label: "Contact" },
          { label: "Bookings" },
          { label: "Spent" },
          { label: "Last pickup" },
        ]}
        isEmpty={rows.length === 0}
        empty={<div className="card p-10 text-center"><p className="display text-3xl">No customers</p></div>}
        pagination={{
          page: sliced.page,
          perPage: sliced.perPage,
          total: sliced.total,
          basePath: "/admin/customers",
          params: { perPage: String(sliced.perPage) },
        }}
      >
        {sliced.rows.map(({ c, count, spent, last }) => (
          <tr key={c.id}>
            <td className="p-3 font-medium">{c.fullName}</td>
            <td className="px-3 py-3 text-mute">{c.mobile}<br />{c.email}</td>
            <td className="px-3 py-3">{count}</td>
            <td className="px-3 py-3">{inr(spent)}</td>
            <td className="px-3 py-3 text-mute">{last ? new Date(last).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}</td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
