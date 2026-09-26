"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type ReactElement } from "react";
import type { SpecCode } from "@/data/products";
import Button from "@/components/ui/Button";
import { useBasket } from "@/components/basket/BasketProvider";
import {
  DELIVERY_METHODS,
  calculateTotals,
  toPounds,
} from "@/lib/commerce";
import { describeEstimate, estimate } from "@/lib/checkout/delivery";
import { orderSpecCodes } from "@/lib/spec";
import { storeOrder, type PlacedOrder } from "@/lib/checkout/order";
import { takeOrderNumber } from "@/lib/checkout/orderNumber";
import { addressLines } from "@/lib/checkout/validation";
import { formatPrice } from "@/lib/format";
import { clearCheckoutDraft, useCheckout } from "./CheckoutProvider";

/**
 * Step three: check it, then place it.
 *
 * **There are no card fields here, and there are none anywhere else.** Payment
 * is out of scope for this build, and the step says so in a plain sentence
 * rather than leaving somebody scrolling for a box that does not exist.
 *
 * "Place order" is the name of the action and stays its name through the flow
 * (§11), which is why the confirmation says "Order placed".
 *
 * Placing snapshots the order, empties the basket and clears the draft, in that
 * order — the snapshot has to be written before the basket it was built from
 * goes away.
 */
export default function ReviewStep(): ReactElement {
  const router = useRouter();
  const { lines, totals, code, clear } = useBasket();
  const { details, method, back } = useCheckout();
  const [placing, setPlacing] = useState(false);

  const priced = calculateTotals(totals.subtotal, code !== null, method);
  const deliveryEstimate = describeEstimate(estimate(method));

  const placeOrder = useCallback(() => {
    if (placing || lines.length === 0) return;
    setPlacing(true);

    const spec = orderSpecCodes(
      lines.flatMap((line) => line.product.spec as SpecCode[]),
    );

    const order: PlacedOrder = {
      number: takeOrderNumber(),
      placedAt: new Date().toISOString(),
      lines: lines.map((line) => ({
        name: line.product.name,
        colourway: line.colourway.name,
        size: line.line.size === "ONE" ? "One size" : line.line.size,
        quantity: line.line.quantity,
        linePrice: line.linePrice,
      })),
      totals: priced,
      method,
      details,
      spec,
      estimate: deliveryEstimate,
    };

    storeOrder(order);
    clear();
    clearCheckoutDraft();
    router.push("/checkout/confirmation");
  }, [
    placing,
    lines,
    priced,
    method,
    details,
    deliveryEstimate,
    clear,
    router,
  ]);

  return (
    <div>
      <h2 className="type-lg">Review order</h2>
      <p className="type-base measure mt-24">
        Check everything below, then place your order. Nothing is charged on
        this site.
      </p>

      <section aria-labelledby="review-items" className="mt-48">
        <h3 id="review-items" className="type-label">
          Items
        </h3>
        <ul className="mt-16 flex flex-col gap-16 border-t-2 border-ink pt-24">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-16">
              <span className="type-base">
                {line.product.name}
                <span className="type-label mt-8 block">
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
      </section>

      <section aria-labelledby="review-address" className="mt-48">
        <h3 id="review-address" className="type-label">
          Delivering to
        </h3>
        <address className="type-base mt-16 not-italic">
          {addressLines(details).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="type-base mt-16">
          {details.email} &middot; {details.phone}
        </p>
      </section>

      <section aria-labelledby="review-method" className="mt-48">
        <h3 id="review-method" className="type-label">
          Delivery method
        </h3>
        <p className="type-base mt-16">
          {DELIVERY_METHODS[method].label} &mdash;{" "}
          {priced.deliveryIsFree
            ? "Free"
            : formatPrice(toPounds(priced.delivery))}
        </p>
        <p className="type-base mt-8">{deliveryEstimate}</p>
      </section>

      <section aria-labelledby="review-payment" className="mt-48">
        <h3 id="review-payment" className="type-label">
          Payment
        </h3>
        <p className="type-base measure mt-16">
          This is a demonstration shop. There is no payment step and no card
          details are collected anywhere on this site. Placing the order will
          generate an order number and nothing will be charged.
        </p>
      </section>

      <div className="mt-48 flex flex-wrap gap-16">
        <Button onClick={placeOrder} loading={placing}>
          Place order
        </Button>
        <Button variant="secondary" onClick={back} disabled={placing}>
          Back to delivery
        </Button>
      </div>
    </div>
  );
}
