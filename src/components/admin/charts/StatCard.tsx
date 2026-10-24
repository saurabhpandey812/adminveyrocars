import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

export function StatCard({ label, value, delta, icon: Icon }: { label: string; value: string; delta?: number | null; icon: LucideIcon }) {
  return (
    <div className="card p-3 sm:p-3.5">
      <div className="flex items-start justify-between gap-1 text-mute">
        <p className="text-xs leading-snug">{label}</p>
        <Icon size={14} className="mt-0.5 shrink-0" aria-hidden />
      </div>
      <p className="display mt-1.5 text-2xl leading-none sm:text-[1.65rem]">{value}</p>
      {delta != null && (
        <p className="mt-1 text-[11px] text-mute">
          {delta >= 0
            ? <span className="flex items-center gap-0.5 font-semibold text-emerald-700"><TrendingUp size={12} aria-hidden />{delta}%</span>
            : <span className="flex items-center gap-0.5 font-semibold text-red-700"><TrendingDown size={12} aria-hidden />{Math.abs(delta)}%</span>}
        </p>
      )}
    </div>
  );
}
