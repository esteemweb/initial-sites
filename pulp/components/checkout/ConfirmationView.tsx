"use client";

import { useEffect, useReducer, type ReactElement } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import LoadingMark from "@/components/icons/LoadingMark";
import { readOrder, type PlacedOrder } from "@/lib/checkout/order";
import ProofSlip from "./ProofSlip";
import CheckoutEmpty from "./CheckoutEmpty";

/**
 * The confirmation.
 *
 * The order is read from storage rather than passed through navigation, so a
 * reload, a bookmark or a back-navigation all still render it — the basket it
 * was built from has already been emptied, so there is nothing else left to
 * rebuild it from.
 *
 * Three states, all designed: still reading, an order to show, and no order at
 * all — which is what a stale link or a fresh browser gets.
 */
/**
 * `loading` is a state, not a second boolean beside the order. "Not looked
 * yet" and "looked and found nothing" are different things, and collapsing
 * them would flash the no-order message before the read lands.
 */
type Lookup =
  | { status: "loading" }
  | { status: "ready"; order: PlacedOrder | null };

export default function ConfirmationView(): ReactElement {
  const [lookup, resolve] = useReducer(
    (_state: Lookup, order: PlacedOrder | null): Lookup => ({
      status: "ready",
      order,
    }),
    { status: "loading" } as Lookup,
  );

  useEffect(() => {
    resolve(readOrder());
  }, []);

  if (lookup.status === "loading") {
    return (
      <div className="flex min-h-96 items-center py-80">
        <LoadingMark label="Loading your order" />
      </div>
    );
  }

  const { order } = lookup;

  if (!order) {
    return (
      <CheckoutEmpty
        heading="There is no order to show."
        body="We could not find a recent order in this browser. If you have just placed one, the confirmation was sent to your email address."
      />
    );
  }

  return (
    <>
      <p className="type-base measure mt-24">
        Order {order.number} is placed. A confirmation is on its way to{" "}
        {order.details.email}. {order.estimate.replace("Arrives", "It arrives")}.
      </p>

      <div className="mt-64">
        <ProofSlip order={order} />
      </div>

      <ButtonLink href="/shop" variant="secondary" className="mt-64">
        Keep shopping
      </ButtonLink>
    </>
  );
}
