"use client";

import type { ReactElement } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import SpecMark from "@/components/icons/SpecMark";
import { useBasket } from "./BasketProvider";

/**
 * The empty basket (DESIGN.md §4 — empty states are designed, never left to a
 * browser default; §11 — empty states are loud, and they invite action).
 *
 * The mark carries the joke at the 64px section-marker scale and is
 * marked decorative, because the heading beside it already says the same thing
 * in words.
 *
 * Navigating away closes the panel: leaving an empty slide-over hanging over
 * the shop the customer just asked for would be its own small joke.
 */
export default function BasketEmpty(): ReactElement {
  const { close } = useBasket();

  return (
    <div className="flex flex-col items-start gap-24 py-48">
      <SpecMark
        code="no-print"
        className="size-64 text-ink"
        decorative
      />

      <h3 className="type-lg">Nothing in it.</h3>

      <p className="type-base measure">
        Nothing in here yet. Every run is small and none of them come back, so
        the shop is the place to start.
      </p>

      <ButtonLink href="/shop" onClick={close} className="mt-16">
        Shop everything
      </ButtonLink>
    </div>
  );
}
