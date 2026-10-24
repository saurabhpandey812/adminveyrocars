"use client";
export function StatusSelect({ name = "status", defaultValue, options, label }: { name?: string; defaultValue: string; options: string[]; label: string }) {
  return (
    <select name={name} defaultValue={defaultValue} aria-label={label} className="field min-h-9 w-auto py-0 text-sm capitalize" onChange={(e) => e.currentTarget.form?.requestSubmit()}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
export function ConfirmButton({ message, children, className = "" }: { message: string; children: React.ReactNode; className?: string }) {
  return <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}
