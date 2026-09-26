import type { ReactElement } from "react";
import { SPEC_LABELS, type Product } from "@/data/products";
import SpecMark from "@/components/icons/SpecMark";
import { cardSpecMarks } from "@/lib/spec";
import { SPEC_MEANINGS } from "@/lib/spec";

interface SpecMarkerProps {
  product: Product;
}

/**
 * The spec section marker: one oversized mark, full-bleed, below the fold
 * (DESIGN.md §5 — oversized spec marks break the grid and run edge to edge;
 * §7 — 400px+ is the page-graphic scale).
 *
 * A section marker, not the page opener. The garment leads this page; this sits
 * under the buy panel and the spec, where it breaks the page rather than
 * introducing it.
 *
 * The symbol is the product's wash instruction, chosen through the existing
 * `cardSpecMarks()` priority so it is deterministic and matches what the card
 * for the same product shows first. It is marked decorative because every
 * instruction is listed in full beside it — §4's "visible text where there is
 * room", and there is a great deal of room here.
 */
export default function SpecMarker({ product }: SpecMarkerProps): ReactElement {
  const [primary] = cardSpecMarks(product.spec, 1);

  return (
    <section
      aria-labelledby="spec-heading"
      className="border-y-2 border-ink bg-rule/40"
    >
      <div className="shell flex flex-col gap-64 py-80 desktop:flex-row desktop:items-center desktop:gap-96 desktop:py-96">
        <SpecMark
          code={primary}
          className="symbol-graphic shrink-0"
          decorative
        />

        <div>
          <p className="type-label">How to wash it</p>
          <h2 id="spec-heading" className="type-lg mt-16">
            {SPEC_LABELS[primary]}
          </h2>
          <p className="type-base measure mt-24">
            {SPEC_MEANINGS[primary]}
          </p>

          <ul className="mt-48 flex flex-col gap-24">
            {product.spec.map((code) => (
              <li key={code} className="flex items-center gap-16">
                <SpecMark code={code} className="size-24" decorative />
                <span className="type-label">{SPEC_LABELS[code]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
