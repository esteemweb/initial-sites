"use client";

/* design-system §Components/QuantityStepper: − / value / +. Both buttons
   are 48px pills with a 1px ink border (a control boundary, so not the
   hairline). The value is announced by the cart's live region, not here.
   States: default, hover (0.72), focus (ring), disabled at the limits,
   loading (both buttons aria-disabled, value shown as —). */
export function QuantityStepper({
  label,
  value,
  min = 1,
  max,
  onChange,
  loading = false,
}: {
  /** What is being counted, for the buttons' accessible names. */
  label: string;
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  loading?: boolean;
}) {
  const btn =
    "grid size-48 place-items-center rounded-pill border border-ink type-body transition-opacity duration-160 " +
    "not-aria-disabled:cursor-pointer not-aria-disabled:hover:opacity-72 not-aria-disabled:active:opacity-60 " +
    "aria-disabled:cursor-not-allowed aria-disabled:border-hairline aria-disabled:text-ink-muted";
  const lowOff = loading || value <= min;
  const highOff = loading || value >= max;

  return (
    <div role="group" aria-label={`Quantity, ${label}`} className="inline-flex items-center gap-8">
      <button
        type="button"
        className={btn}
        aria-label={`Decrease quantity, ${label}`}
        aria-disabled={lowOff || undefined}
        onClick={() => !lowOff && onChange(value - 1)}
      >
        <span aria-hidden>−</span>
      </button>
      <output className="type-data inline-grid w-40 place-items-center" aria-live="off">
        {loading ? "—" : value}
      </output>
      <button
        type="button"
        className={btn}
        aria-label={`Increase quantity, ${label}`}
        aria-disabled={highOff || undefined}
        onClick={() => !highOff && onChange(value + 1)}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
