"use client";

import type { ReactElement } from "react";
import IconShell from "@/components/icons/IconShell";
import { MINUS_GLYPH, PLUS_GLYPH } from "@/components/icons/glyph-paths";

interface QuantityStepperProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  /** Usually the units left in the chosen size, so the stepper cannot oversell. */
  max: number;
  /** Names the line this stepper belongs to, for screen readers. */
  itemLabel?: string;
  className?: string;
}

const CONTROL =
  "flex size-48 items-center justify-center text-ink transition-colors " +
  "hover:bg-ink hover:text-page active:translate-y-[1px] " +
  "disabled:pointer-events-none disabled:text-ink/60";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  itemLabel,
  className = "",
}: QuantityStepperProps): ReactElement {
  const suffix = itemLabel ? ` for ${itemLabel}` : "";
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className={`inline-flex items-center border-2 border-ink ${className}`}>
      <button
        type="button"
        disabled={atMin}
        onClick={() => onChange(value - 1)}
        aria-label={`Decrease quantity${suffix}`}
        className={CONTROL}
      >
        <IconShell
          paths={MINUS_GLYPH}
          defaultLabel="Decrease"
          className="size-16"
          decorative
        />
      </button>

      {/* Announced on change rather than on every render, so a screen reader
          hears the new quantity without the buttons re-reading themselves. */}
      <output
        aria-live="polite"
        className="type-label flex min-w-48 items-center justify-center border-x-2 border-ink px-8 py-16"
      >
        <span className="sr-only">Quantity{suffix}: </span>
        {value}
      </output>

      <button
        type="button"
        disabled={atMax}
        onClick={() => onChange(value + 1)}
        aria-label={`Increase quantity${suffix}`}
        className={CONTROL}
      >
        <IconShell
          paths={PLUS_GLYPH}
          defaultLabel="Increase"
          className="size-16"
          decorative
        />
      </button>
    </div>
  );
}
