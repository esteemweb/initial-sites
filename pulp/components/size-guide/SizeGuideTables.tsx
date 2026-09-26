"use client";

import { useState, type ReactElement } from "react";
import {
  PRODUCTS,
  type Measurement,
  type Product,
  type Size,
} from "@/data/products";
import {
  CATEGORY_FIT,
  CATEGORY_HEADINGS,
  CATEGORY_ORDER,
} from "@/lib/content/sizeGuide";
import UnitToggle, { type Unit } from "./UnitToggle";

/**
 * Every garment's measurements, grouped by category, in either unit.
 *
 * Built from `data/products.ts` — no number on this page is typed by hand, so
 * the guide cannot drift from what the product pages quote.
 *
 * Columns are worked out per garment, the same way `MeasurementTable` does it
 * on the product page: a trouser carries waist and inseam, a tee carries chest
 * and length, and neither renders a column of blanks for the other's fields.
 *
 * The unit lives here rather than in each table, so one switch changes the
 * whole page and there is no chance of two tables disagreeing.
 */

const COLUMNS = [
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "length", label: "Length" },
  { key: "inseam", label: "Inseam" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

const CM_PER_INCH = 2.54;

/** One decimal. Half-inch rounding would hide real differences between sizes. */
function convert(centimetres: number, unit: Unit): string {
  if (unit === "cm") return String(centimetres);
  return (centimetres / CM_PER_INCH).toFixed(1);
}

function sizeLabel(size: Size): string {
  return size === "ONE" ? "One size" : size;
}

function columnsFor(measurements: Measurement[]) {
  return COLUMNS.filter((column) =>
    measurements.some((row) => row[column.key as ColumnKey] !== undefined),
  );
}

function GarmentTable({
  product,
  unit,
}: {
  product: Product;
  unit: Unit;
}): ReactElement {
  const columns = columnsFor(product.measurements);

  return (
    <div className="border-t-2 border-ink pt-24">
      <h3 className="type-md">{product.name}</h3>

      {product.measurements.length === 0 ? (
        <p className="type-base measure mt-16">
          One size, and not cut to body measurements, so there is no chart for
          this one.
        </p>
      ) : (
        // Tables are one of the three things §5 lets scroll sideways, in their
        // own container, rather than the page doing it.
        <div className="mt-24 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              {product.name} measurements in{" "}
              {unit === "cm" ? "centimetres" : "inches"}
            </caption>
            <thead>
              <tr className="border-b-2 border-ink">
                <th scope="col" className="type-label py-16 pr-24">
                  Size
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="type-label py-16 pr-24"
                  >
                    {column.label} ({unit})
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.measurements.map((row) => (
                <tr key={row.size} className="border-b border-rule">
                  <th
                    scope="row"
                    className="type-label py-16 pr-24 font-normal"
                  >
                    {sizeLabel(row.size)}
                  </th>
                  {columns.map((column) => {
                    const value = row[column.key as ColumnKey];
                    return (
                      <td key={column.key} className="type-base py-16 pr-24">
                        {value === undefined ? "—" : convert(value, unit)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SizeGuideTables(): ReactElement {
  const [unit, setUnit] = useState<Unit>("cm");

  return (
    <>
      <div className="mt-48">
        <UnitToggle value={unit} onChange={setUnit} />
      </div>

      {CATEGORY_ORDER.map((category) => {
        const products = PRODUCTS.filter(
          (product) => product.category === category,
        );
        if (products.length === 0) return null;

        return (
          <section
            key={category}
            aria-labelledby={`fit-${category}`}
            className="mt-80"
          >
            <h2 id={`fit-${category}`} className="type-lg">
              {CATEGORY_HEADINGS[category]}
            </h2>
            <p className="type-base measure mt-24">{CATEGORY_FIT[category]}</p>

            <div className="mt-48 flex flex-col gap-48">
              {products.map((product) => (
                <GarmentTable key={product.id} product={product} unit={unit} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
