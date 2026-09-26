"use client";

import type { ReactElement } from "react";
import type { Size } from "@/data/products";

interface SizeSelectorProps {
  name: string;
  sizes: Size[];
  value: Size | null;
  onChange: (size: Size) => void;
  /** Sold-out sizes render disabled, never hidden (DESIGN.md §4). */
  isSoldOut?: (size: Size) => boolean;
  isLastFew?: (size: Size) => boolean;
  legend?: string;
  className?: string;
}

/**
 * DESIGN.md §4.
 *
 * Sold-out sizes stay on screen, disabled, so the customer can see the range
 * rather than wondering what is missing. Where a product has the single size
 * `ONE`, the control's slot carries a static "One size" label instead: the
 * structure holds and the control disappears.
 *
 * Stock state is passed in rather than derived here, so the same selector
 * serves the product page and the basket's size change without either one
 * reaching into the catalogue twice.
 */
export default function SizeSelector({
  name,
  sizes,
  value,
  onChange,
  isSoldOut = () => false,
  isLastFew = () => false,
  legend = "Size",
  className = "",
}: SizeSelectorProps): ReactElement {
  const singleSize = sizes.length === 1 && sizes[0] === "ONE";

  return (
    <fieldset className={className}>
      <legend className="type-label mb-16">{legend}</legend>

      {singleSize ? (
        // The control's slot, holding text rather than a control. A sold-out
        // one-size product still has to say so, or the slot reads as available.
        <p className="type-base">
          One size{isSoldOut("ONE") ? " — sold out" : ""}
        </p>
      ) : (
        <div className="flex flex-wrap gap-8">
          {sizes.map((size) => {
            const soldOut = isSoldOut(size);
            const lastFew = isLastFew(size);

            return (
              <label key={size} className="cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={size}
                  checked={value === size}
                  disabled={soldOut}
                  onChange={() => onChange(size)}
                  className="peer sr-only"
                />
                <span
                  className="type-label flex size-48 items-center justify-center border-2 border-ink
                    peer-checked:bg-ink peer-checked:text-page
                    peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ultra
                    peer-disabled:cursor-not-allowed peer-disabled:border-rule peer-disabled:bg-page peer-disabled:text-ink/60"
                >
                  {size}
                </span>
                <span className="sr-only">
                  {soldOut
                    ? ", sold out"
                    : lastFew
                      ? ", last few left"
                      : ""}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
