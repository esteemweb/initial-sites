import type { ReactElement } from "react";
import type { Measurement, Size } from "@/data/products";

interface MeasurementTableProps {
  measurements: Measurement[];
}

/** Every measurement the catalogue can carry, in the order a table should read. */
const COLUMNS = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "length", label: "Length" },
  { key: "inseam", label: "Inseam" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

function sizeLabel(size: Size): string {
  return size === "ONE" ? "One size" : size;
}

/**
 * Measurements, flat, in centimetres.
 *
 * The columns are worked out from the data rather than fixed: a trouser carries
 * waist and inseam, a tee carries chest and length, and neither should render a
 * column of blanks for the other's fields.
 *
 * Quiet register (§11) — sizing is one of the zones the voice stays plain in.
 * Field labels are still Space Mono, because §11 puts no page-scoped exception
 * on those anywhere on the site.
 */
export default function MeasurementTable({
  measurements,
}: MeasurementTableProps): ReactElement {
  const columns = COLUMNS.filter((column) =>
    measurements.some((row) => row[column.key as ColumnKey] !== undefined),
  );

  return (
    // Tables are one of the three things §5 lets scroll sideways, in their own
    // container, rather than the page doing it.
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="type-base measure mb-24 text-left">
          Measured flat, in centimetres. Garments are cut boxy, so if you are
          between sizes take the smaller one unless you want the extra room.
        </caption>
        <thead>
          <tr className="border-b-2 border-ink">
            <th scope="col" className="type-label py-16 pr-24">
              Size
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="type-label py-16 pr-24">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {measurements.map((row) => (
            <tr key={row.size} className="border-b border-rule">
              <th scope="row" className="type-label py-16 pr-24 font-normal">
                {sizeLabel(row.size)}
              </th>
              {columns.map((column) => (
                <td key={column.key} className="type-base py-16 pr-24">
                  {row[column.key as ColumnKey] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
