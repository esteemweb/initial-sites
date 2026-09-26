"use client";

import type { ReactElement } from "react";
import { formatPrice } from "@/lib/format";
import { toPounds } from "@/lib/commerce";

interface DeliveryMethodOptionProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  /** Pence actually charged for this method on this basket. */
  price: number;
  free: boolean;
  estimate: string;
}

/**
 * One delivery method (DESIGN.md §4 inventory — delivery-method radio group).
 *
 * A native radio with an `sr-only` input and a styled label, the pattern
 * `SizeSelector` and the filter chips already use, so arrow keys move through
 * the group and nothing is hover-only.
 *
 * The price shown is what this basket is actually charged, not the list price:
 * over the threshold, standard reads "Free" while express still reads £9.95.
 */
export default function DeliveryMethodOption({
  name,
  value,
  checked,
  onSelect,
  label,
  price,
  free,
  estimate,
}: DeliveryMethodOptionProps): ReactElement {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className="flex min-h-48 flex-col gap-8 border-2 border-ink p-24 transition-colors
          peer-checked:bg-ink peer-checked:text-page
          peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2
          peer-focus-visible:outline-ultra"
      >
        <span className="flex flex-wrap items-baseline justify-between gap-16">
          <span className="type-label">{label}</span>
          <span className="type-base">
            {free ? "Free" : formatPrice(toPounds(price))}
          </span>
        </span>
        <span className="type-base">{estimate}</span>
      </span>
    </label>
  );
}
