import type { ReactElement } from "react";
import { formatPrice } from "@/lib/format";
import { toPounds, type Totals } from "@/lib/commerce";

interface BasketSummaryProps {
  totals: Totals;
  code: string | null;
}

/**
 * Subtotal, discount, delivery, total.
 *
 * Labels take the Space Mono `label` role, which is what §3 gives to spec
 * values; the money itself is Inter, because it is read as a number rather than
 * scanned as a field name. The total steps up to `md` and sits under a 2px rule
 * — separation by flat rule, not by weight or shade (§6).
 *
 * The discount row only exists when a code is applied. A row reading
 * "Discount £0" is noise.
 */
export default function BasketSummary({
  totals,
  code,
}: BasketSummaryProps): ReactElement {
  return (
    <dl className="flex flex-col gap-16">
      <div className="flex items-baseline justify-between gap-16">
        <dt className="type-label">Subtotal</dt>
        <dd className="type-base">{formatPrice(toPounds(totals.subtotal))}</dd>
      </div>

      {code && totals.discount > 0 && (
        <div className="flex items-baseline justify-between gap-16">
          <dt className="type-label">{code} &minus;10%</dt>
          <dd className="type-base">
            &minus;{formatPrice(toPounds(totals.discount))}
          </dd>
        </div>
      )}

      <div className="flex items-baseline justify-between gap-16">
        <dt className="type-label">Delivery</dt>
        <dd className="type-base">
          {totals.deliveryIsFree ? "Free" : formatPrice(toPounds(totals.delivery))}
        </dd>
      </div>

      <div className="flex items-baseline justify-between gap-16 border-t-2 border-ink pt-16">
        <dt className="type-label">Total</dt>
        <dd className="type-md">{formatPrice(toPounds(totals.total))}</dd>
      </div>
    </dl>
  );
}
