"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { MetaList, MetaRow } from "@/components/ui/MetaRow";
import { getProduct } from "@/data/products";
import { useCart } from "@/lib/cart";

export function Confirmation() {
  const id = useSearchParams().get("order");
  const { ready, orders } = useCart();
  const order = orders.find((o) => o.id === id);

  return (
    <main id="content" tabIndex={-1} className="outline-none">
      <Grid as="section" aria-labelledby="confirm-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">{order ? "Order received" : "Order"}</p>
        <h1 id="confirm-title" className="type-display title-rise col-span-12">
          {!ready ? "Checking…" : order ? "Thank you." : "Order not found."}
        </h1>
      </Grid>

      <div className="min-h-svh">
      {ready && !order && (
        <Grid as="section" aria-label="No order" className="gap-y-24 border-t border-hairline py-64">
          <p className="type-body col-span-12 max-w-measure lg:col-span-6">
            There is no order with that number in this browser. Orders are only remembered where they were placed.
          </p>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Button href="/range">The range</Button>
          </div>
        </Grid>
      )}

      {ready && order && (
        <Grid as="section" aria-label="Order details" className="gap-y-40 border-t border-hairline py-64 lg:py-96">
          <p className="type-h3 col-span-12 lg:col-span-6">No payment was taken.</p>
          <MetaList>
            <MetaRow label="Order" value={order.id} />
            {order.items.map((i) => {
              const p = getProduct(i.slug);
              return <MetaRow key={i.slug} label={`${i.qty} × ${p?.name}`} value={`$${(p?.price.value ?? 0) * i.qty}`} />;
            })}
            <MetaRow label="Total" value={`$${order.total}`} />
          </MetaList>
          <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-4 lg:col-start-9">
            {order.hasVessel && (
              <p className="type-body max-w-measure">Vessel 01 is on your record in this browser. Your next order can be refills only.</p>
            )}
            <Button variant="secondary" href="/range">
              Back to the range
            </Button>
          </div>
        </Grid>
      )}
      </div>
    </main>
  );
}
