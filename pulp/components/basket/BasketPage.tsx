"use client";

import type { ReactElement } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import LoadingMark from "@/components/icons/LoadingMark";
import BasketEmpty from "./BasketEmpty";
import BasketLineItem from "./BasketLineItem";
import BasketSummary from "./BasketSummary";
import DiscountCodeField from "./DiscountCodeField";
import FreeDeliveryProgress from "./FreeDeliveryProgress";
import { useBasket } from "./BasketProvider";

/**
 * The basket as a full page (DESIGN.md §12 — the slide-over is primary, and a
 * `/basket` route exists as a fallback for direct links and no-JS access).
 *
 * §12 also says both render the same line item, so this renders **the same
 * components** as the slide-over throughout — line item, progress, discount
 * field, summary and empty state. There is no second implementation of the
 * basket anywhere, only a second arrangement of it: two columns here where the
 * panel has one.
 */
export default function BasketPage(): ReactElement {
  const { lines, totals, code, hydrated, setQuantity, remove } = useBasket();

  if (!hydrated) {
    return (
      <div className="flex min-h-96 items-center py-80">
        <LoadingMark label="Loading your basket" />
      </div>
    );
  }

  if (lines.length === 0) {
    return <BasketEmpty />;
  }

  return (
    <div className="mt-64 grid gap-64 desktop:grid-cols-[2fr_1fr] desktop:gap-96">
      <ul className="flex flex-col border-t-2 border-ink">
        {lines.map((line) => (
          <BasketLineItem
            key={line.key}
            line={line}
            onQuantityChange={setQuantity}
            onRemove={remove}
          />
        ))}
      </ul>

      <div className="flex flex-col gap-40">
        <FreeDeliveryProgress
          subtotal={totals.subtotal}
          remaining={totals.remainingForFreeDelivery}
        />

        <DiscountCodeField />

        <BasketSummary totals={totals} code={code} />

        <ButtonLink href="/checkout" fullWidth>
          Checkout
        </ButtonLink>
      </div>
    </div>
  );
}
