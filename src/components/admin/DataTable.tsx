import type { ReactNode } from "react";
import type { PaginationState } from "@/lib/pagination";
import { TablePagination } from "./TablePagination";

export type DataTableColumn = {
  label: string;
  className?: string;
};

type Props = {
  columns: DataTableColumn[];
  minWidth?: string;
  empty?: ReactNode;
  isEmpty?: boolean;
  children: ReactNode;
  pagination?: PaginationState;
};

/** Shared admin data table — dark header, zebra rows, optional pagination. */
export function DataTable({ columns, minWidth = "44rem", empty, isEmpty, children, pagination }: Props) {
  if (isEmpty) {
    return (
      empty ?? (
        <div className="card p-10 text-center">
          <p className="display text-3xl">No data</p>
        </div>
      )
    );
  }
  return (
    <div>
      <div className={`overflow-x-auto border border-line bg-white ${pagination ? "border-b-0" : ""}`}>
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          <thead className="bg-ink text-bone">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={`${col.label}-${i}`}
                  className={`px-3 py-3 text-xs font-semibold tracking-wide ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>tr:nth-child(even)]:bg-[#ebe8e1] [&>tr:nth-child(odd)]:bg-white [&>tr:hover]:bg-[#e2dfd6]">
            {children}
          </tbody>
        </table>
      </div>
      {pagination && <TablePagination {...pagination} />}
    </div>
  );
}
