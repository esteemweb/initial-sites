"use client";

import { AddToBag } from "./AddToBag";

/* Below 1024 the buy path stays on screen: price and Add to bag, fixed to
   the bottom edge. Pages that use it add bottom padding (pb-96) so the bar
   never covers content. */
export function BuyBar({ slug, name, price, note }: { slug: string; name: string; price: number; note: string }) {
  return (
    <div className="grid-page fixed inset-x-0 bottom-0 z-20 items-center gap-y-8 border-t border-hairline bg-paper py-8 lg:hidden">
      <p className="col-span-6 grid">
        <span className="type-data">{name}</span>
        <span className="type-data text-ink-muted">
          ${price} · {note}
        </span>
      </p>
      <div className="col-span-6 col-start-7 justify-self-end">
        <AddToBag slug={slug} showQty={false} />
      </div>
    </div>
  );
}
