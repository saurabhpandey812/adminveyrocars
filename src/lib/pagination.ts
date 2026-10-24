/** Server-safe pagination helpers (no "use client"). */

export type PaginationState = {
  page: number;
  perPage: number;
  total: number;
  basePath: string;
  params?: Record<string, string | undefined>;
};

export function parsePageParams(p: Record<string, string | undefined>) {
  const raw = Number(p.perPage);
  const perPage = ([10, 25, 50] as const).includes(raw as 10 | 25 | 50) ? (raw as 10 | 25 | 50) : 10;
  const page = Math.max(1, Number(p.page) || 1);
  return { page, perPage };
}

export function slicePage<T>(items: T[], page: number, perPage: number) {
  const pages = Math.max(1, Math.ceil(items.length / perPage) || 1);
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * perPage;
  return { rows: items.slice(start, start + perPage), page: safePage, pages, total: items.length, perPage };
}
