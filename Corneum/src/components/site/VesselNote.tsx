"use client";

import { useCart } from "@/lib/cart";
import { AddToBag } from "./AddToBag";

/* Refills pour into Vessel 01, so a first order has to include one
   (BRIEF §12). Said up front; enforced at checkout. */
export function VesselNote() {
  const { hasVessel, ownsVessel } = useCart();
  if (hasVessel || ownsVessel) return null;
  return (
    <div className="grid justify-items-start gap-16 border-t border-hairline pt-16">
      <p className="type-body max-w-measure">
        Refills pour into Vessel 01. A first order has to include one: $65, bought once.
      </p>
      <AddToBag slug="vessel-01" label="Add Vessel 01" variant="secondary" showQty={false} />
    </div>
  );
}
