"use client";

import type { ReactElement } from "react";
import { useBasket } from "@/components/basket/BasketProvider";
import { formatPrice } from "@/lib/format";
import {
  DELIVERY_METHODS,
  calculateTotals,
  toPounds,
  type DeliveryMethodKey,
} from "@/lib/commerce";

interface OrderSummaryProps {
  method: DeliveryMethodKey;
}

/**
 * The order summary, alongside every step.
 *
 * Reads the same `useBasket()` lines and subtotal the slide-over reads, and
 * re-prices only the delivery line through the same `calculateTotals` — so the
 * figure here cannot drift from the one in the basket. WASHDAY carries through
 * automatically, because it is part of the basket's state rather than something
 * checkout holds a second copy of.
 *
 * Quiet zone: it lists what is being bought and what it costs, and nothing else.
 */
export default function OrderSummary({ method }: OrderSummaryProps): ReactElement {
  const { lines, totals, code } = useBasket();
  const priced = calculateTotals(totals.subtotal, code !== null, method);

  return (
    <aside
      aria-labelledby="summary-heading"
      className="border-2 border-ink p-24"
    >
      <h2 id="summary-heading" className="type-label">
        Your order
      </h2>

      <ul className="mt-24 flex flex-col gap-16 border-b-2 border-ink pb-24">
        {lines.map((line) => (
          <li key={line.key} className="flex justify-between gap-16">
            <span className="type-base">
              {line.product.name}
              <span className="type-label block mt-8">
                {line.colourway.name} /{" "}
                {line.line.size === "ONE" ? "One size" : line.line.size} &times;{" "}
                {line.line.quantity}
              </span>
            </span>
            <span className="type-base shrink-0">
              {formatPrice(toPounds(line.linePrice))}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-24 flex flex-col gap-16">
        <div className="flex items-baseline justify-between gap-16">
          <dt className="type-label">Subtotal</dt>
          <dd className="type-base">{formatPrice(toPounds(priced.subtotal))}</dd>
        </div>

        {code && priced.discount > 0 && (
          <div className="flex items-baseline justify-between gap-16">
            <dt className="type-label">{code} &minus;10%</dt>
            <dd className="type-base">
              &minus;{formatPrice(toPounds(priced.discount))}
            </dd>
          </div>
        )}

        <div className="flex items-baseline justify-between gap-16">
          <dt className="type-label">{DELIVERY_METHODS[method].label}</dt>
          <dd className="type-base">
            {priced.deliveryIsFree
              ? "Free"
              : formatPrice(toPounds(priced.delivery))}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-16 border-t-2 border-ink pt-16">
          <dt className="type-label">Total</dt>
          <dd className="type-md">{formatPrice(toPounds(priced.total))}</dd>
        </div>
      </dl>
    </aside>
  );
}
