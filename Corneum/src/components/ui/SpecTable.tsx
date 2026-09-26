import type { ReactNode } from "react";
import { keepCase } from "@/lib/keepCase";

/* design-system §Components/SpecTable: a comparison table in the lab
   register. Hairline rows, mono headers at 0.6, no fills, no zebra.
   Rows are laid out on the page's 12 columns (each column declares its
   start and span) so the table sits on the same grid as everything else.
   CSS grid on table elements drops their implicit roles in some browsers,
   so every element restates its role explicitly.

   Shown from 1024 up. Below that, pages render the same data as stacked
   MetaRow blocks instead; `hidden` keeps the table out of the
   accessibility tree there, so nothing is announced twice. */

export type SpecColumn<T> = {
  key: string;
  header: string;
  /** Tailwind column placement on the 12-col grid, e.g. "col-span-3 col-start-3". */
  place: string;
  /** Right-align (actions). */
  end?: boolean;
  cell: (row: T) => ReactNode;
};

export type SpecTableState = "default" | "loading" | "error" | "empty";

type Props<T> = {
  caption: string;
  columns: SpecColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  state?: SpecTableState;
  /** Display class; defaults to "grid". Pass e.g. "hidden lg:grid". */
  className?: string;
};

const rowCls = "col-span-12 grid grid-cols-subgrid items-center border-t border-hairline";

export function SpecTable<T>({ caption, columns, rows, rowKey, state = "default", className = "grid" }: Props<T>) {
  const message =
    state === "loading" ? "Loading…" : state === "error" ? "Unavailable" : state === "empty" || rows.length === 0 ? "No products" : null;

  return (
    <table
      role="table"
      aria-busy={state === "loading" || undefined}
      className={`col-span-12 grid-cols-subgrid border-b border-hairline ${className}`}
    >
      <caption className="sr-only">{caption}</caption>
      <thead role="rowgroup" className="col-span-12 grid grid-cols-subgrid">
        <tr role="row" className={`${rowCls} py-16`}>
          {columns.map((c) => (
            <th
              key={c.key}
              role="columnheader"
              scope="col"
              className={`type-data text-left font-regular text-ink-muted ${c.place} ${c.end ? "justify-self-end" : ""}`}
            >
              {keepCase(c.header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup" className="col-span-12 grid grid-cols-subgrid">
        {message ? (
          <tr role="row" className={`${rowCls} py-24`}>
            <td role="cell" className="type-data col-span-12 text-ink-muted">
              {message}
            </td>
          </tr>
        ) : (
          rows.map((r) => (
            <tr key={rowKey(r)} role="row" className={`${rowCls} py-16`}>
              {columns.map((c) => (
                <td key={c.key} role="cell" className={`${c.place} ${c.end ? "justify-self-end" : ""}`}>
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
