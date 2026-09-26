"use client";

import { useId, type ReactElement } from "react";
import Button from "@/components/ui/Button";
import { useBasket } from "@/components/basket/BasketProvider";
import {
  DELIVERY_METHODS,
  FREE_DELIVERY_THRESHOLD,
  calculateTotals,
  toPounds,
  type DeliveryMethodKey,
} from "@/lib/commerce";
import { describeEstimate, estimate } from "@/lib/checkout/delivery";
import { formatPrice } from "@/lib/format";
import { useCheckout } from "./CheckoutProvider";
import DeliveryMethodOption from "./DeliveryMethodOption";

const METHOD_KEYS = Object.keys(DELIVERY_METHODS) as DeliveryMethodKey[];

/**
 * Step two: how it gets there.
 *
 * Each option is priced against **this** basket rather than showing a list
 * price, so the customer sees what they will actually be charged before
 * choosing. Free delivery is a standard-post perk, so over the threshold
 * standard reads "Free" and express still reads its price — and the note
 * underneath says why, rather than leaving it to be worked out.
 *
 * Dates are counted in working days from today, so they move with the calendar
 * and skip weekends.
 */
export default function DeliveryMethodStep(): ReactElement {
  const group = useId();
  const { totals, code } = useBasket();
  const { method, setMethod, next, back } = useCheckout();

  const qualifies = totals.subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div>
      <h2 className="type-lg">Delivery method</h2>
      <p className="type-base measure mt-24">
        Working days, counted from today. We do not deliver at weekends.
      </p>

      <fieldset className="mt-48">
        <legend className="sr-only">Choose a delivery method</legend>

        <div className="flex flex-col gap-16">
          {METHOD_KEYS.map((key) => {
            // Priced through the same function the basket uses, so the number
            // here and the number in the summary cannot disagree.
            const withMethod = calculateTotals(
              totals.subtotal,
              code !== null,
              key,
            );

            return (
              <DeliveryMethodOption
                key={key}
                name={`${group}-method`}
                value={key}
                checked={method === key}
                onSelect={() => setMethod(key)}
                label={DELIVERY_METHODS[key].label}
                price={withMethod.delivery}
                free={withMethod.deliveryIsFree}
                estimate={describeEstimate(estimate(key))}
              />
            );
          })}
        </div>
      </fieldset>

      {qualifies && (
        <p className="type-base measure mt-24">
          Your order is over {formatPrice(toPounds(FREE_DELIVERY_THRESHOLD))},
          so standard delivery is free. Express is charged either way.
        </p>
      )}

      <div className="mt-48 flex flex-wrap gap-16">
        <Button onClick={next}>Continue to review</Button>
        <Button variant="secondary" onClick={back}>
          Back to details
        </Button>
      </div>
    </div>
  );
}
