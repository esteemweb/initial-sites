import type { Metadata } from "next";
import type { ReactElement } from "react";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import { CheckoutProvider } from "@/components/checkout/CheckoutProvider";

export const metadata: Metadata = {
  title: "Checkout — PULP",
  description: "Delivery details, delivery method, then review your order.",
};

/**
 * Checkout.
 *
 * One route holding three steps rather than three routes, so moving between
 * them cannot lose a half-filled address. The step lives in `CheckoutProvider`
 * and is mirrored to `sessionStorage`, which also survives a refresh.
 *
 * Quiet zone (§11): plain sentences, no brand voice on any control here.
 */
export default function Checkout(): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Checkout</p>
      <h1 className="type-lg mt-16">Place your order.</h1>

      <CheckoutProvider>
        <CheckoutFlow />
      </CheckoutProvider>
    </main>
  );
}
