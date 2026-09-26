"use client";

import { Button } from "@/components/ui/Button";

/* Below 1024 the way to checkout stays on screen, as the BuyBar does on
   product pages. Pages that use it add pb-96. */
export function CheckoutBar({ total, blocked }: { total: number; blocked: boolean }) {
  return (
    <div className="grid-page fixed inset-x-0 bottom-0 z-20 items-center border-t border-hairline bg-paper py-8 lg:hidden">
      <p className="col-span-6 grid">
        <span className="type-data text-ink-muted">Total</span>
        <span className="type-data">${total}</span>
      </p>
      <div className="col-span-6 col-start-7 justify-self-end">
        <Button href="/checkout" state={blocked ? "disabled" : "default"} aria-describedby={blocked ? "checkout-rule" : undefined}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
