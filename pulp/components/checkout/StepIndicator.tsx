"use client";

import type { ReactElement } from "react";
import { STEPS, useCheckout } from "./CheckoutProvider";

/**
 * The checkout step indicator (DESIGN.md §4 inventory).
 *
 * Numbered, because this is the one case §7 allows: "don't use numbered markers
 * unless the content is a sequence", and three checkout steps are exactly a
 * sequence.
 *
 * A step already visited is a button back to itself. A step not yet reached is
 * inert — you cannot skip an unvalidated address by clicking "Review order".
 *
 * State is never carried by colour alone: the current step is marked with
 * `aria-current`, every step says "done", "current" or "not started" to a
 * screen reader, and the fill is redundant to that.
 */
export default function StepIndicator(): ReactElement {
  const { step, furthest, goTo } = useCheckout();

  return (
    <nav aria-label="Checkout progress">
      <ol className="flex flex-col gap-8 tablet:flex-row tablet:gap-16">
        {STEPS.map((entry, index) => {
          const current = index === step;
          const visited = index <= furthest;
          const done = index < step;

          const state = current ? "current" : done ? "done" : "not started";

          return (
            <li key={entry.key} className="flex-1">
              <button
                type="button"
                disabled={!visited || current}
                onClick={() => goTo(index)}
                aria-current={current ? "step" : undefined}
                className={`type-label flex min-h-48 w-full items-center gap-16 border-2 border-ink px-16 py-8 text-left transition-colors
                  ${current ? "bg-ink text-page" : "bg-page text-ink"}
                  ${visited && !current ? "hover:bg-ink hover:text-page active:translate-y-[1px]" : ""}
                  ${!visited ? "border-rule text-ink/60" : ""}`}
              >
                <span aria-hidden="true">{index + 1}</span>
                <span>{entry.label}</span>
                <span className="sr-only">, {state}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
