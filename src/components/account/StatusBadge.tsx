import type { BookingStatus } from "@/types/booking";
const map: Record<BookingStatus, [string, string]> = {
  pending: ["Pending", "bg-amber-100 text-amber-900"],
  confirmed: ["Confirmed", "bg-emerald-100 text-emerald-900"],
  completed: ["Completed", "bg-stone-200 text-stone-800"],
  cancelled: ["Cancelled", "bg-red-100 text-red-900"],
};
export function StatusBadge({ status }: { status: BookingStatus }) {
  const [label, cls] = map[status];
  return <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}
