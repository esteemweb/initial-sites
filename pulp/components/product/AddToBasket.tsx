"use client";

import { useCallback, useRef, useState, type ReactElement } from "react";
import type { Colourway, Product, Size } from "@/data/products";
import Button from "@/components/ui/Button";
import { useBasket } from "@/components/basket/BasketProvider";
import TumbleGhost, { type TumbleFlight } from "./TumbleGhost";

interface AddToBasketProps {
  product: Product;
  colourway: Colourway;
  size: Size | null;
  /** Units left in this size of this colourway. 0 disables the button. */
  available: number;
}

/**
 * The buy button (DESIGN.md §7, §9).
 *
 * The label is `ADD TO BASKET` and nothing else — §7 is explicit that the buy
 * button is not written in brand voice. Disabled until a size is chosen and
 * while that size has no stock, with the reason said in words underneath rather
 * than left to a greyed-out control to imply.
 *
 * On a successful add the garment tumbles into the basket icon (§9, 400ms).
 * Under `prefers-reduced-motion` no ghost is created and the confirmation alone
 * carries the result — a static equivalent that still communicates state, which
 * is what §9 asks for instead of the animation simply not happening.
 *
 * The confirmation is a live region, so the add is announced either way, and it
 * is words rather than a colour change or a movement.
 */
export default function AddToBasket({
  product,
  colourway,
  size,
  available,
}: AddToBasketProps): ReactElement {
  const { add } = useBasket();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<TumbleFlight | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const confirmTimer = useRef<number | undefined>(undefined);

  const soldOut = size !== null && available === 0;
  const canAdd = size !== null && available > 0;

  const handleAdd = useCallback(() => {
    if (!canAdd || size === null) return;

    add(product.id, colourway.slug, size);

    const label = size === "ONE" ? "One size" : size;
    setConfirmed(`Added to basket. ${product.name}, ${colourway.name}, ${label}.`);
    window.clearTimeout(confirmTimer.current);
    confirmTimer.current = window.setTimeout(() => setConfirmed(null), 4000);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Both ends measured here, in the one event, so the flight cannot be laid
    // out against a header that has since scrolled or a button that has moved.
    const origin = buttonRef.current?.getBoundingClientRect();
    const basket = document
      .querySelector("[data-basket-target]")
      ?.getBoundingClientRect();
    if (!origin || !basket) return;

    setFlight({
      id: Date.now(),
      from: origin,
      to: basket,
      colour: colourway.hex,
    });
  }, [add, canAdd, colourway, product, size]);

  return (
    <div className="flex flex-col gap-16">
      <div ref={buttonRef}>
        <Button onClick={handleAdd} disabled={!canAdd} fullWidth>
          Add to basket
        </Button>
      </div>

      {/* Why the button is off, in words. A disabled control on its own says
          only that something is wrong, never what. */}
      {!canAdd && (
        <p className="type-base">
          {soldOut
            ? "That size is sold out. Try another size or colour."
            : "Choose a size to add this to your basket."}
        </p>
      )}

      {/* Present for both motion paths, and the only confirmation under reduced
          motion. Kept in the flow rather than floated, so it cannot cover the
          size selector it sits under. */}
      <p role="status" className="type-label min-h-16 text-rose">
        {confirmed ?? ""}
      </p>

      <TumbleGhost flight={flight} onDone={() => setFlight(null)} />
    </div>
  );
}
