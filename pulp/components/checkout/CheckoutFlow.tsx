"use client";

import type { ReactElement } from "react";
import LoadingMark from "@/components/icons/LoadingMark";
import { useBasket } from "@/components/basket/BasketProvider";
import CheckoutEmpty from "./CheckoutEmpty";
import DeliveryDetailsStep from "./DeliveryDetailsStep";
import DeliveryMethodStep from "./DeliveryMethodStep";
import OrderSummary from "./OrderSummary";
import ReviewStep from "./ReviewStep";
import StepIndicator from "./StepIndicator";
import { useCheckout } from "./CheckoutProvider";

/**
 * The three steps, the indicator and the summary.
 *
 * Waits for the basket to hydrate before deciding there is nothing to check
 * out — without that, the first paint would accuse everybody of an empty basket
 * for a frame before the stored one arrives.
 *
 * The summary sits beside the steps from 1024 up and above them below it, so on
 * a phone the total is read before the form rather than after it.
 */
export default function CheckoutFlow(): ReactElement {
  const { lines, hydrated } = useBasket();
  const { stepKey, method, hydrated: checkoutHydrated } = useCheckout();

  if (!hydrated || !checkoutHydrated) {
    return (
      <div className="flex min-h-96 items-center py-80">
        <LoadingMark label="Loading your order" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <CheckoutEmpty
        heading="There is nothing to check out."
        body="Your basket is empty, so there is no order to place. Add something from the shop and come back."
      />
    );
  }

  return (
    <>
      <div className="mt-48">
        <StepIndicator />
      </div>

      <div className="mt-64 grid gap-64 desktop:grid-cols-[2fr_1fr] desktop:gap-96">
        {/* Summary first in the DOM below 1024, beside the form above it. */}
        <div className="desktop:order-2">
          <OrderSummary method={method} />
        </div>

        <div className="desktop:order-1">
          {stepKey === "details" && <DeliveryDetailsStep />}
          {stepKey === "method" && <DeliveryMethodStep />}
          {stepKey === "review" && <ReviewStep />}
        </div>
      </div>
    </>
  );
}
