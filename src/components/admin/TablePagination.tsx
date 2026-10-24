"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationState } from "@/lib/pagination";

export type { PaginationState };

const SIZES = [10, 25, 50] as const;

function href(base: string, params: Record<string, string | undefined>, patch: Record<string, string | number>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "" && v !== "all") qs.set(k, v);
  }
  for (const [k, v] of Object.entries(patch)) qs.set(k, String(v));
  if (Number(qs.get("page") ?? 1) <= 1) qs.delete("page");
  if (Number(qs.get("perPage") ?? 10) === 10) qs.delete("perPage");
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export function TablePagination({ page, perPage, total, basePath, params = {} }: PaginationState) {
  const router = useRouter();
  const pages = Math.max(1, Math.ceil(total / perPage) || 1);
  const safePage = Math.min(Math.max(1, page), pages);
  const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
  const to = Math.min(safePage * perPage, total);
  const keep = { ...params, perPage: String(perPage) };

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center border border-line bg-white px-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 hover:bg-bone";

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-t-0 border-line bg-white px-3 py-2.5 text-sm">
      <p className="text-mute">
        Showing <strong className="text-ink">{from}</strong>–<strong className="text-ink">{to}</strong> of{" "}
        <strong className="text-ink">{total}</strong>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-mute">
          Rows
          <select
            className="field !h-9 !min-h-0 !w-auto py-0"
            value={perPage}
            aria-label="Rows per page"
            onChange={(e) => {
              const next = Number(e.target.value);
              router.push(href(basePath, { ...params, page: "1" }, { perPage: next }));
            }}
          >
            {SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Link
            href={href(basePath, keep, { page: 1 })}
            className={btn}
            aria-label="First page"
            aria-disabled={safePage <= 1}
            tabIndex={safePage <= 1 ? -1 : undefined}
            onClick={(e) => safePage <= 1 && e.preventDefault()}
          >
            <ChevronsLeft size={16} aria-hidden />
          </Link>
          <Link
            href={href(basePath, keep, { page: safePage - 1 })}
            className={btn}
            aria-label="Previous page"
            aria-disabled={safePage <= 1}
            tabIndex={safePage <= 1 ? -1 : undefined}
            onClick={(e) => safePage <= 1 && e.preventDefault()}
          >
            <ChevronLeft size={16} aria-hidden />
          </Link>
          <span className="px-2 text-mute">
            Page <strong className="text-ink">{safePage}</strong> / {pages}
          </span>
          <Link
            href={href(basePath, keep, { page: safePage + 1 })}
            className={btn}
            aria-label="Next page"
            aria-disabled={safePage >= pages}
            tabIndex={safePage >= pages ? -1 : undefined}
            onClick={(e) => safePage >= pages && e.preventDefault()}
          >
            <ChevronRight size={16} aria-hidden />
          </Link>
          <Link
            href={href(basePath, keep, { page: pages })}
            className={btn}
            aria-label="Last page"
            aria-disabled={safePage >= pages}
            tabIndex={safePage >= pages ? -1 : undefined}
            onClick={(e) => safePage >= pages && e.preventDefault()}
          >
            <ChevronsRight size={16} aria-hidden />
          </Link>
        </nav>
      </div>
    </div>
  );
}
