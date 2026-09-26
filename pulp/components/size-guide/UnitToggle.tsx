"use client";

import { useId, type ReactElement } from "react";

export type Unit = "cm" | "in";

interface UnitToggleProps {
  value: Unit;
  onChange: (unit: Unit) => void;
}

const UNITS: { key: Unit; label: string }[] = [
  { key: "cm", label: "Centimetres" },
  { key: "in", label: "Inches" },
];

/**
 * The cm / inches switch.
 *
 * A native radio group rather than a button pair, because it is a choice
 * between two states rather than two actions — so arrow keys move between them
 * and the current unit is announced as selected, both for free.
 *
 * Every table on the page reads one unit, so this sits once at the top rather
 * than repeating above each table.
 */
export default function UnitToggle({
  value,
  onChange,
}: UnitToggleProps): ReactElement {
  const group = useId();

  return (
    <fieldset>
      <legend className="type-label mb-16">Units</legend>
      <div className="flex flex-wrap gap-8">
        {UNITS.map((unit) => (
          <label key={unit.key} className="cursor-pointer">
            <input
              type="radio"
              name={group}
              value={unit.key}
              checked={value === unit.key}
              onChange={() => onChange(unit.key)}
              className="peer sr-only"
            />
            <span
              className="type-label flex min-h-48 items-center border-2 border-ink px-24 py-8
                transition-colors
                peer-checked:bg-ink peer-checked:text-page
                peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
                peer-focus-visible:outline-ultra"
            >
              {unit.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
