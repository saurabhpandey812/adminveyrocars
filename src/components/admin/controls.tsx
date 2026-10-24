"use client";
import { useState } from "react";

/** Selected-value tones for booking + car status selects */
const tone: Record<string, string> = {
  pending: "border-amber-500 bg-amber-100 text-amber-950",
  confirmed: "border-emerald-600 bg-emerald-100 text-emerald-950",
  completed: "border-indigo-600 bg-indigo-100 text-indigo-950",
  cancelled: "border-red-500 bg-red-100 text-red-950",
  available: "border-emerald-600 bg-emerald-100 text-emerald-950",
  unavailable: "border-stone-400 bg-stone-200 text-stone-800",
  maintenance: "border-amber-500 bg-amber-100 text-amber-950",
};

const optionTone: Record<string, string> = {
  pending: "bg-amber-100 text-amber-950",
  confirmed: "bg-emerald-100 text-emerald-950",
  completed: "bg-indigo-100 text-indigo-950",
  cancelled: "bg-red-100 text-red-950",
  available: "bg-emerald-100 text-emerald-950",
  unavailable: "bg-stone-200 text-stone-800",
  maintenance: "bg-amber-100 text-amber-950",
};

export function StatusSelect({
  name = "status",
  defaultValue,
  options,
  label,
}: {
  name?: string;
  defaultValue: string;
  options: string[];
  label: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const cls = tone[value] ?? "border-line bg-white text-ink";

  return (
    <select
      name={name}
      value={value}
      aria-label={label}
      className={`min-h-9 w-auto rounded-sm border px-2.5 py-1.5 text-sm font-semibold capitalize outline-none focus:ring-1 focus:ring-brass/40 ${cls}`}
      onChange={(e) => {
        setValue(e.target.value);
        e.currentTarget.form?.requestSubmit();
      }}
    >
      {options.map((o) => (
        <option key={o} value={o} className={`capitalize ${optionTone[o] ?? ""}`}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function ConfirmButton({
  message,
  children,
  className = "",
}: {
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
