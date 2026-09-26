import type { ReactElement } from "react";
import { FREE_DELIVERY_THRESHOLD, toPounds } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";

interface FreeDeliveryProgressProps {
  /** Pence, before any discount — the threshold reads the subtotal as spent. */
  subtotal: number;
  remaining: number;
}

/**
 * Progress toward free delivery at £75 (DESIGN.md §12).
 *
 * The sentence carries the meaning and the bar repeats it, never the other way
 * round — the same rule that governs spec marks. The bar is therefore hidden
 * from assistive software rather than announced as a second, vaguer version of
 * the line above it.
 *
 * Fill is `signal` on a `rule` track, 8px tall, square. No gradient, no stripes,
 * no shine.
 */
export default function FreeDeliveryProgress({
  subtotal,
  remaining,
}: FreeDeliveryProgressProps): ReactElement {
  const unlocked = remaining === 0;
  const percent = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100),
  );

  return (
    <div className="flex flex-col gap-8">
      <p className="type-label">
        {unlocked
          ? "Free delivery unlocked"
          : `${formatPrice(toPounds(remaining))} away from free delivery`}
      </p>

      <div aria-hidden="true" className="h-8 w-full bg-rule">
        <div className="h-full bg-rose" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
