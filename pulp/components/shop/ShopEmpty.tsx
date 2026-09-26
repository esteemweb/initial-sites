"use client";

import type { ReactElement } from "react";
import Button from "@/components/ui/Button";
import SpecMark from "@/components/icons/SpecMark";

interface ShopEmptyProps {
  onClear: () => void;
}

/**
 * No results (DESIGN.md §4 — empty states are designed, never left to a
 * browser default; §11 — they are loud, and they invite action).
 *
 * The crossed triangle carries the joke at the 64px section-marker scale and is
 * decorative, because the heading beside it already says the same thing. The
 * way out is a control, not an instruction to go and undo it yourself.
 */
export default function ShopEmpty({ onClear }: ShopEmptyProps): ReactElement {
  return (
    <div className="flex flex-col items-start gap-24 border-t-2 border-ink py-80">
      <SpecMark code="no-print" className="size-64" decorative />

      <h2 className="type-lg">Nothing in this load.</h2>

      <p className="type-base measure">
        No garment matches every filter you have set. Take one off and the grid
        will fill back up.
      </p>

      <Button onClick={onClear} className="mt-16">
        Clear filters
      </Button>
    </div>
  );
}
