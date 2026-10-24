import { inr } from "@/lib/utils/pricing";
const niceMax = (v: number) => { const step = Math.pow(10, Math.floor(Math.log10(v))); return Math.ceil(v / step) * step; };
const tick = (v: number) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`);

export function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  const W = 640, H = 260, L = 52, R = 16, T = 16, B = 32, iw = W - L - R, ih = H - T - B;
  const max = niceMax(Math.max(...data.map((d) => d.revenue), 1));
  const x = (i: number) => L + (data.length === 1 ? iw / 2 : (i * iw) / (data.length - 1));
  const y = (v: number) => T + ih - (v / max) * ih;
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.revenue)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${T + ih} L${x(0)},${T + ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Revenue by month: ${data.map((d) => `${d.label} ${inr(d.revenue)}`).join(", ")}`} className="h-auto w-full">
      {[0, 1, 2, 3, 4].map((t) => { const v = (max / 4) * t; return (
        <g key={t}><line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#dcd9d0" strokeDasharray={t ? "3 4" : undefined} />
          <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#66655f">{tick(v)}</text></g>); })}
      <path d={area} fill="#a9824a" opacity=".13" />
      <path d={line} fill="none" stroke="#a9824a" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.label}><circle cx={x(i)} cy={y(d.revenue)} r="4" fill="#fff" stroke="#a9824a" strokeWidth="2"><title>{`${d.label}: ${inr(d.revenue)}`}</title></circle>
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="12" fill="#66655f">{d.label}</text></g>
      ))}
    </svg>
  );
}
