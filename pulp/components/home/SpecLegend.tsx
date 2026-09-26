"use client";

import { useId, useState, type ReactElement } from "react";
import { SPEC_LABELS, type SpecCode } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";
import { SPEC_MEANINGS } from "@/lib/spec";

/**
 * The interactive key to the spec set.
 *
 * Built on a native radio group, the same way `SizeSelector` and
 * `ColourwaySwatch` are, so arrow-key navigation, roving focus and group
 * semantics come from the browser rather than from re-implemented key handling.
 *
 * Every symbol carries its short label in visible text at rest. Selecting one
 * adds the longer explanation; it is never the only way to find out what a
 * mark means, which is what §4 requires — spec marks never carry meaning
 * alone. Nothing here is hover-only: selection is a tap, a click or a keypress.
 *
 * Two of the three scales from §7 appear together: the controls are 16px UI
 * glyphs, and the selected symbol is a 400px page graphic.
 *
 * The codes come from the catalogue's `SPEC_LABELS`, so the key cannot fall out
 * of step with the symbols the products actually use.
 */

const SPEC_CODES = Object.keys(SPEC_LABELS) as SpecCode[];

const CONTROL =
  "type-label flex min-h-48 w-full items-center gap-8 border-2 border-ink p-8 " +
  "text-left transition-colors " +
  "peer-checked:bg-ink peer-checked:text-page " +
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 " +
  "peer-focus-visible:outline-ultra";

export default function SpecLegend(): ReactElement {
  const groupName = useId();
  const [selected, setSelected] = useState<SpecCode>("fit-boxy");

  return (
    <section
      aria-labelledby="legend-heading"
      className="shell py-40 desktop:py-48"
    >
      <p className="type-label">The key</p>
      <h2 id="legend-heading" className="type-lg mt-16">
        Read the label.
      </h2>
      <p className="type-base measure mt-24">
        Every mark on this site describes how a garment is cut, printed or
        woven, and every one of them appears on something in the range. Pick
        one to find out what it actually tells you.
      </p>

      <fieldset className="mt-64">
        <legend className="sr-only">Choose a spec mark</legend>

        {/* One column at the 360 base: two would leave 112px for the label, and
            "Loopback cotton" needs 160 before it starts breaking mid-phrase. */}
        <div className="grid grid-cols-1 gap-8 tablet:grid-cols-2 desktop:grid-cols-4">
          {SPEC_CODES.map((code) => (
            <label key={code} className="cursor-pointer">
              <input
                type="radio"
                name={groupName}
                value={code}
                checked={code === selected}
                onChange={() => setSelected(code)}
                className="peer sr-only"
              />
              <span className={CONTROL}>
                {/* Decorative: the label it sits beside is the text equivalent. */}
                <SpecMark code={code} className="size-16" decorative />
                {SPEC_LABELS[code]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Announced politely, because the detail sits away from the control that
          changed it and arrowing through a radio group otherwise reads only the
          labels. */}
      <div
        aria-live="polite"
        className="mt-64 flex flex-col gap-40 border-t-2 border-ink pt-64 desktop:flex-row desktop:gap-96"
      >
        <SpecMark
          code={selected}
          className="symbol-graphic shrink-0"
          decorative
        />

        <div>
          <h3 className="type-lg">{SPEC_LABELS[selected]}</h3>
          <p className="type-base measure mt-24">
            {SPEC_MEANINGS[selected]}
          </p>
        </div>
      </div>
    </section>
  );
}
