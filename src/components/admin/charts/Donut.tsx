const COLORS: Record<string, string> = { pending: "#d9a441", confirmed: "#2f7d5b", completed: "#141517", cancelled: "#c4574b" };
export function Donut({ data }: { data: { status: string; count: number }[] }) {
  const total = data.reduce((a, d) => a + d.count, 0);
  const r = 36, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" role="img" aria-label={`Bookings by status: ${data.map((d) => `${d.status} ${d.count}`).join(", ")}`} className="h-24 w-24 shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#ece9e1" strokeWidth="14" />
        {total > 0 && data.map((d) => {
          const len = (d.count / total) * C, el = <circle key={d.status} cx="50" cy="50" r={r} fill="none" stroke={COLORS[d.status]} strokeWidth="14" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />;
          offset += len; return el;
        })}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" transform="rotate(90 50 50)" fontSize="16" fontWeight="600" fill="#141517">{total}</text>
      </svg>
      <ul className="grid gap-1.5 text-sm">
        {data.map((d) => <li key={d.status} className="flex items-center gap-2 capitalize"><span className="h-2.5 w-2.5 shrink-0" style={{ background: COLORS[d.status] }} aria-hidden /> {d.status}: <strong>{d.count}</strong></li>)}
      </ul>
    </div>
  );
}
