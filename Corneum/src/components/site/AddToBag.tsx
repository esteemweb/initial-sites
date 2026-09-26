"use client";

import { Button, type ButtonVariant } from "@/components/ui/Button";
import { useCart } from "@/lib/cart";

/* Adds one unit. The confirmation is announced by the cart's aria-live
   region; visually, the quantity already in the bag is shown beside it. */
export function AddToBag({
  slug,
  label = "Add to bag",
  variant = "primary",
  showQty = true,
  ariaLabel,
}: {
  slug: string;
  label?: string;
  variant?: ButtonVariant;
  showQty?: boolean;
  /** Accessible name when the visible label is short ("Add"). */
  ariaLabel?: string;
}) {
  const { items, add } = useCart();
  const qty = items.find((i) => i.slug === slug)?.qty ?? 0;

  return (
    <span className="inline-flex flex-wrap items-center gap-16">
      <Button variant={variant} onClick={() => add(slug)} aria-label={ariaLabel}>
        {label}
      </Button>
      {showQty && qty > 0 && <span className="type-data text-ink-muted">In bag: {qty}</span>}
    </span>
  );
}
