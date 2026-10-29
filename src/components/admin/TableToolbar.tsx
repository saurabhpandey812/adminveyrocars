"use client";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";

type Option = { value: string; label: string };

/** Search + status filter — always one row. Dropdown filters on change. */
export function TableToolbar({
  action,
  q = "",
  status = "all",
  statusOptions,
  searchPlaceholder = "Search",
  searchName = "q",
  statusName = "status",
  date,
  dateName = "day",
  dateLabel = "Check date",
  extraParams,
}: {
  action: string;
  q?: string;
  status?: string;
  statusOptions: Option[];
  searchPlaceholder?: string;
  searchName?: string;
  statusName?: string;
  /** Optional date next to status (e.g. cars free on this day) */
  date?: string;
  dateName?: string;
  dateLabel?: string;
  /** Preserve pagination keys etc. when filtering */
  extraParams?: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [pending, start] = useTransition();

  function go(form: HTMLFormElement) {
    const fd = new FormData(form);
    const params = new URLSearchParams(extraParams ?? {});
    params.delete("page"); // reset to page 1 on new filter/search
    for (const [k, v] of fd.entries()) {
      const s = String(v).trim();
      if (!s || (k === statusName && s === "all")) {
        params.delete(k);
        continue;
      }
      params.set(k, s);
    }
    const qs = params.toString();
    start(() => router.push(qs ? `${action}?${qs}` : action));
  }

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        go(e.currentTarget);
      }}
      className={`mb-4 flex flex-nowrap items-center gap-3 ${pending ? "opacity-70" : ""}`}
    >
      <input
        name={searchName}
        defaultValue={q}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        className="field !w-auto min-w-0 flex-1 basis-0 sm:max-w-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            formRef.current && go(formRef.current);
          }
        }}
      />
      <select
        name={statusName}
        defaultValue={status}
        aria-label="Filter by status"
        className="field !w-auto shrink-0 basis-[11rem] capitalize"
        onChange={() => formRef.current && go(formRef.current)}
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {date !== undefined && (
        <input
          type="date"
          name={dateName}
          defaultValue={date}
          aria-label={dateLabel}
          title={dateLabel}
          className="field !w-auto shrink-0 basis-[11rem]"
          onChange={() => formRef.current && go(formRef.current)}
        />
      )}
    </form>
  );
}
