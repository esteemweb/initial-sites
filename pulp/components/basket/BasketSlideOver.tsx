"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactElement } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import ButtonLink from "@/components/ui/ButtonLink";
import BasketEmpty from "./BasketEmpty";
import BasketLineItem from "./BasketLineItem";
import BasketSummary from "./BasketSummary";
import DiscountCodeField from "./DiscountCodeField";
import FreeDeliveryProgress from "./FreeDeliveryProgress";
import { useBasket } from "./BasketProvider";

/**
 * The basket slide-over (DESIGN.md §4 inventory, §12 — the panel is the primary
 * basket presentation).
 *
 * §6 makes this the single exception to "there is no depth": a plain `ink`
 * overlay at 40% behind the panel, and **no shadow** on the panel itself.
 * Separation from the page comes from the 2px `ink` rule down its left edge,
 * the way separation is done everywhere else here.
 *
 * Radix supplies the focus trap, focus restoration to the basket button,
 * Escape, the scroll lock and `aria-modal`. Every visual is from DESIGN.md.
 *
 * §9 has no entry for a drawer, so the slide reuses the accordion's 200ms
 * rather than inventing a duration. Under `prefers-reduced-motion` the global
 * rule collapses it and the panel appears in place, still closing cleanly.
 */
export default function BasketSlideOver(): ReactElement {
  const {
    lines,
    count,
    totals,
    code,
    isOpen,
    setOpen,
    close,
    setQuantity,
    remove,
  } = useBasket();

  const empty = lines.length === 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-40 bg-ink/40
            data-[state=open]:animate-overlay-in
            data-[state=closed]:animate-overlay-out"
        />

        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col
            border-l-2 border-ink bg-page
            data-[state=open]:animate-panel-in
            data-[state=closed]:animate-panel-out
            tablet:w-panel"
        >
          <header className="flex shrink-0 items-center justify-between gap-16 border-b-2 border-ink px-24 py-16">
            <Dialog.Title className="type-lg">Basket</Dialog.Title>

            <Dialog.Close
              aria-label="Close basket"
              className="inline-flex size-48 shrink-0 items-center justify-center
                text-ink transition-colors hover:bg-ink hover:text-page
                active:translate-y-[1px]"
            >
              <CloseIcon className="size-24" decorative />
            </Dialog.Close>
          </header>

          <Dialog.Description className="sr-only">
            {empty
              ? "Your basket is empty."
              : `${count} ${count === 1 ? "item" : "items"} in your basket.`}
          </Dialog.Description>

          <div className="flex-1 overflow-y-auto overscroll-contain px-24">
            {empty ? (
              <BasketEmpty />
            ) : (
              <ul className="flex flex-col">
                {lines.map((line) => (
                  <BasketLineItem
                    key={line.key}
                    line={line}
                    onQuantityChange={setQuantity}
                    onRemove={remove}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* The money stays put while the lines scroll, so the total is always
              on screen. Hidden entirely when the basket is empty: a £0 summary
              and a progress bar at zero say nothing the empty state has not. */}
          {!empty && (
            <div className="flex shrink-0 flex-col gap-24 border-t-2 border-ink px-24 py-24">
              <FreeDeliveryProgress
                subtotal={totals.subtotal}
                remaining={totals.remainingForFreeDelivery}
              />

              <DiscountCodeField />

              <BasketSummary totals={totals} code={code} />

              <ButtonLink href="/checkout" fullWidth onClick={close}>
                Checkout
              </ButtonLink>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
