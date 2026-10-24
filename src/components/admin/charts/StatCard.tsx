import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";

const tones = {
  ink: "bg-ink text-bone [&_.mute]:text-bone/55 [&_.icon]:bg-ink-2 [&_.icon]:text-brass",
  brass: "bg-brass text-white [&_.mute]:text-white/75 [&_.icon]:bg-brass-d/40 [&_.icon]:text-white",
  white: "bg-white text-ink border border-line [&_.mute]:text-mute [&_.icon]:bg-bone [&_.icon]:text-brass-d",
  bone: "bg-[#e8e4db] text-ink [&_.mute]:text-mute [&_.icon]:bg-white [&_.icon]:text-ink",
  dark: "bg-ink-2 text-bone [&_.mute]:text-bone/50 [&_.icon]:bg-ink [&_.icon]:text-brass",
  soft: "bg-white text-ink border border-line [&_.mute]:text-mute [&_.icon]:bg-[#f0ebe3] [&_.icon]:text-brass-d",
} as const;

export type StatTone = keyof typeof tones;

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "white",
}: {
  label: string;
  value: string;
  delta?: number | null;
  icon: LucideIcon;
  tone?: StatTone;
}) {
  return (
    <div className={`p-3.5 sm:p-4 ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="mute text-xs leading-snug font-medium">{label}</p>
        <span className="icon grid h-8 w-8 shrink-0 place-items-center" aria-hidden>
          <Icon size={16} />
        </span>
      </div>
      <p className="display mt-3 text-2xl leading-none sm:text-[1.75rem]">{value}</p>
      {delta != null && (
        <p className="mute mt-1.5 text-[11px]">
          {delta >= 0 ? (
            <span className="flex items-center gap-0.5 font-semibold text-emerald-600">
              <TrendingUp size={12} aria-hidden />
              {delta}%
            </span>
          ) : (
            <span className="flex items-center gap-0.5 font-semibold text-red-600">
              <TrendingDown size={12} aria-hidden />
              {Math.abs(delta)}%
            </span>
          )}
        </p>
      )}
    </div>
  );
}
