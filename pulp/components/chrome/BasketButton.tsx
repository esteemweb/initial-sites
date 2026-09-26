"use client";

import type { ReactElement } from "react";
import CartIcon from "@/components/icons/CartIcon";
import Badge from "@/components/ui/Badge";
import { useBasket } from "@/components/basket/BasketProvider";

/**
 * Opens the basket slide-over, and carries the live count.
 *
 * Visible at every breakpoint (DESIGN.md §8) — the nav collapses on mobile,
 * the basket does not. The count chip is the §4 badge: `signal` fill, white
 * text, Space Mono `label`. The card puts that chip in a corner of an image;
 * here it sits inline beside the glyph, because a chip that size floated over
 * a 48px control would cover most of it.
 *
 * The chip is hidden from assistive software and the count is carried by the
 * control's accessible name instead, so a screen reader hears "Basket, 3
 * items" rather than "Basket 3". A separate polite region announces the change
 * without the button re-reading itself on every render.
 */
export default function BasketButton(): ReactElement {
  const { count, hydrated, open } = useBasket();

  // Before the stored basket has been read the count is unknown, so nothing is
  // claimed: no chip, and a name that does not assert an empty basket.
  const label = !hydrated
    ? "Basket"
    : count === 0
      ? "Basket, empty"
      : `Basket, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={label}
        aria-haspopup="dialog"
        // Where the §9 tumble flies to. The product page measures this at the
        // moment of the add, so it stays correct wherever the header has
        // scrolled to and at whatever width.
        data-basket-target=""
        className="inline-flex h-48 items-center gap-8 bg-paper px-8 text-ink
          transition-colors hover:bg-ink hover:text-page
          active:translate-y-[1px]"
      >
        <CartIcon className="size-24" decorative />
        {hydrated && count > 0 && (
          <span aria-hidden="true">
            <Badge>{count}</Badge>
          </span>
        )}
      </button>

      <span role="status" className="sr-only">
        {hydrated ? label : ""}
      </span>
    </>
  );
}
