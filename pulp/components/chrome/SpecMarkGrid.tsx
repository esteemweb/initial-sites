import type { ReactElement } from "react";
import { SPEC_LABELS, type SpecCode } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";

/**
 * The footer's graphic element: the whole spec set at the 64px section-marker
 * scale (DESIGN.md §7), each glyph over its text equivalent.
 *
 * The symbols are marked decorative because the wording sits directly beneath
 * them — this is the case §4 means by "visible text where there is room",
 * rather than the visually-hidden fallback the 16px UI instances use. Reading
 * the two together, the grid doubles as the legend for every 16px symbol
 * elsewhere on the site.
 *
 * Labels come from the catalogue, so a symbol and its wording cannot drift.
 */

const SPEC_CODES = Object.keys(SPEC_LABELS) as SpecCode[];

export default function SpecMarkGrid(): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-40 tablet:grid-cols-5">
      {SPEC_CODES.map((code) => (
        <li key={code} className="flex flex-col gap-16">
          <SpecMark code={code} className="size-64" decorative />
          <span className="type-label">{SPEC_LABELS[code]}</span>
        </li>
      ))}
    </ul>
  );
}
