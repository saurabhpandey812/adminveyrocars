import Link from "next/link";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { requireAdmin } from "@/server/admin";
import { getAllCars } from "@/data/cars";
import { deleteCarAction, setCarStatusAction } from "@/server/actions/cars";
import { carStatuses } from "@/lib/validations/car";
import { inr } from "@/lib/utils/pricing";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { TableToolbar } from "@/components/admin/TableToolbar";
import { parsePageParams, slicePage } from "@/lib/pagination";
import { ConfirmButton, StatusSelect } from "@/components/admin/controls";
import { AdminImage } from "@/components/admin/AdminImage";

export const metadata = { title: "Cars" };
type SP = Promise<Record<string, string | undefined>>;

export default async function AdminCars({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const p = await searchParams;
  const q = (p.q ?? "").toLowerCase(), st = p.status ?? "all";
  const { page, perPage } = parsePageParams(p);
  const all = await getAllCars();
  const list = all.filter(
    (c) =>
      (`${c.brand} ${c.model} ${c.carNumber}`).toLowerCase().includes(q) &&
      (st === "all" || c.status === st),
  );
  const sliced = slicePage(list, page, perPage);
  const keep = { q: p.q, status: st === "all" ? undefined : st, perPage: String(sliced.perPage) };

  return (
    <>
      <PageHeader title="Cars" action={<Link href="/admin/cars/new" className="btn btn-dark"><Plus size={16} aria-hidden /> Add car</Link>} />
      {p.saved && <p role="status" className="mb-4 border border-emerald-300 bg-emerald-50 p-3 text-sm">Saved</p>}
      {p.deleted && <p role="status" className="mb-4 border border-emerald-300 bg-emerald-50 p-3 text-sm">Deleted</p>}
      {p.error === "has-bookings" && <p role="alert" className="mb-4 border border-red-300 bg-red-50 p-3 text-sm">Active bookings exist — set unavailable or finish them first.</p>}
      <TableToolbar
        action="/admin/cars"
        q={p.q ?? ""}
        status={st}
        searchPlaceholder="Search cars"
        extraParams={{ perPage: String(sliced.perPage) }}
        statusOptions={[
          { value: "all", label: "All" },
          ...carStatuses.map((s) => ({ value: s, label: s })),
        ]}
      />
      <DataTable
        minWidth="62rem"
        columns={[
          { label: "Car" },
          { label: "Car number" },
          { label: "Category" },
          { label: "Specs" },
          { label: "Price / day" },
          { label: "Status" },
          { label: "Actions", className: "text-right" },
        ]}
        isEmpty={list.length === 0}
        empty={
          <div className="card p-10 text-center">
            <p className="display text-3xl">No cars</p>
            <Link href="/admin/cars/new" className="btn btn-dark mt-4">Add car</Link>
          </div>
        }
        pagination={{
          page: sliced.page,
          perPage: sliced.perPage,
          total: sliced.total,
          basePath: "/admin/cars",
          params: keep,
        }}
      >
        {sliced.rows.map((c) => (
          <tr key={c.id}>
            <td className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-ink-2">
                  <AdminImage src={c.images[0]?.src ?? ""} alt={c.images[0]?.alt ?? `${c.brand} ${c.model}`} />
                </div>
                <p className="font-medium">
                  {c.brand} {c.model}{" "}
                  {c.featured && <Star size={13} className="inline fill-brass text-brass" aria-label="Featured" />}
                </p>
              </div>
            </td>
            <td className="px-3 py-3 font-mono text-xs tracking-wide">{c.carNumber || "—"}</td>
            <td className="px-3 py-3">{c.category}</td>
            <td className="px-3 py-3 text-mute">{c.seats} · {c.transmission} · {c.fuel}</td>
            <td className="px-3 py-3">
              <p className="font-medium">{inr(c.pricePerDay)}</p>
              <p className="text-xs text-mute">{inr(c.securityDeposit)}</p>
            </td>
            <td className="px-3 py-3">
              <form action={setCarStatusAction}>
                <input type="hidden" name="id" value={c.id} />
                <StatusSelect defaultValue={c.status} options={[...carStatuses]} label={`Status of ${c.brand} ${c.model}`} />
              </form>
            </td>
            <td className="px-3 py-3">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/cars/${c.id}/edit`}
                  className="grid h-9 w-9 place-items-center text-ink hover:bg-white/60"
                  aria-label={`Edit ${c.brand} ${c.model}`}
                  title="Edit"
                >
                  <Pencil size={16} aria-hidden />
                </Link>
                <form action={deleteCarAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <ConfirmButton
                    message={`Delete ${c.brand} ${c.model}?`}
                    className="grid h-9 w-9 place-items-center text-red-700 hover:bg-red-50"
                  >
                    <span className="sr-only">Delete</span>
                    <Trash2 size={16} aria-hidden />
                  </ConfirmButton>
                </form>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
