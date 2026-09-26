import type { Metadata } from "next";
import type { ReactElement } from "react";
import BasketPage from "@/components/basket/BasketPage";

export const metadata: Metadata = {
  title: "Basket — PULP",
  description: "What is in your basket, and what it comes to.",
};

/**
 * The basket, full page (DESIGN.md §12).
 *
 * The slide-over is the primary presentation; this is the fallback for direct
 * links and for anyone arriving without the panel. Both render the same
 * components, so the two cannot drift apart.
 */
export default function Basket(): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Basket</p>
      <h1 className="type-lg mt-16">What you are taking.</h1>
      <BasketPage />
    </main>
  );
}
