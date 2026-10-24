export function BarList({ items, empty = "No data yet." }: { items: { label: string; value: number }[]; empty?: string }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length) return <p className="text-sm text-mute">{empty}</p>;
  return (
    <ul className="grid gap-3">
      {items.map((i) => (
        <li key={i.label}><div className="mb-1 flex justify-between text-sm"><span>{i.label}</span><span className="font-semibold">{i.value}</span></div>
          <div className="h-2 bg-bone"><div className="h-2 bg-brass" style={{ width: `${(i.value / max) * 100}%` }} /></div></li>
      ))}
    </ul>
  );
}
export function BarColumns({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex h-44 items-end gap-3" role="img" aria-label={`Bookings per month: ${items.map((i) => `${i.label} ${i.value}`).join(", ")}`}>
      {items.map((i) => (
        <div key={i.label} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-xs font-semibold">{i.value}</span>
          <div className="w-full bg-ink" style={{ height: `${Math.max((i.value / max) * 100, 3)}%` }} />
          <span className="text-xs text-mute">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
