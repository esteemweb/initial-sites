import type { Metadata } from "next";
import type { ReactElement } from "react";
import ConfirmationView from "@/components/checkout/ConfirmationView";

export const metadata: Metadata = {
  title: "Order placed — PULP",
  description: "Your order number and what happens next.",
};

/**
 * Order confirmation.
 *
 * "Place order" produces "Order placed" — §11 keeps an action's name through
 * the flow. The heading is plain; the proof slip below it carries the detail.
 */
export default function Confirmation(): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Checkout</p>
      <h1 className="type-lg mt-16">Order placed.</h1>
      <ConfirmationView />
    </main>
  );
}
