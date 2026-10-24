export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="display text-3xl sm:text-4xl">{title}</h1>
        {desc && <p className="mt-1 text-sm text-mute">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
