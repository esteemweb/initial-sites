"use client";

import Link from "next/link";
import { AddToBag } from "@/components/site/AddToBag";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { getProduct } from "@/data/products";
import { MAX_QTY, useCart } from "@/lib/cart";
import { CheckoutBar } from "./CheckoutBar";
import { RULE_ACCOUNTS, RULE_MESSAGE } from "./rule";

export function BagView() {
  const { ready, items, count, total, canCheckout, hasVessel, setQty, remove } = useCart();
  const refillTypes = items.filter((i) => getProduct(i.slug)?.kind === "refill").length;
  const blocked = items.length > 0 && !canCheckout;

  return (
    <main id="content" tabIndex={-1} className="pb-96 outline-none lg:pb-0">
      <Grid as="section" aria-labelledby="bag-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">
          {ready ? `${count} ${count === 1 ? "item" : "items"}` : "Loading…"}
        </p>
        <h1 id="bag-title" className="type-display title-rise col-span-12">
          Bag
        </h1>
      </Grid>

      {/* Everything below depends on storage, read after hydration. A
          viewport of reserved height keeps the footer from jumping when it
          arrives (layout shift). */}
      <div className="min-h-svh">
      {/* Loading: storage is read after hydration, so no false "empty" */}
      {!ready && (
        <Grid className="gap-y-16 border-t border-hairline py-64" aria-busy>
          {[0, 1].map((i) => (
            <div key={i} className="col-span-12 grid gap-8 border-b border-hairline pb-24">
              <span className="h-16 w-1/3 bg-hairline" />
              <span className="h-16 w-1/4 bg-hairline" />
            </div>
          ))}
        </Grid>
      )}

      {ready && items.length === 0 && (
        <Grid as="section" aria-label="Empty bag" className="gap-y-24 border-t border-hairline py-64 lg:py-96">
          <p className="type-h3 col-span-12 lg:col-span-6">Your bag is empty.</p>
          <div className="col-span-12 flex flex-wrap gap-16 lg:col-span-4 lg:col-start-9">
            <Button href="/range/vessel-01">Vessel 01</Button>
            <Button variant="secondary" href="/range">
              The range
            </Button>
          </div>
        </Grid>
      )}

      {ready && items.length > 0 && (
        <>
          <Grid as="section" aria-labelledby="items-label" className="gap-y-40 border-t border-hairline py-64 lg:py-96">
            <h2 id="items-label" className="type-data col-span-12">
              Items
            </h2>
            <ul className="col-span-12 grid grid-cols-subgrid border-b border-hairline">
              {items.map((i) => {
                const p = getProduct(i.slug);
                if (!p) return null;
                return (
                  <li key={i.slug} className="col-span-12 grid grid-cols-subgrid items-center gap-y-16 border-t border-hairline py-24">
                    <div className="col-span-12 grid gap-8 lg:col-span-4">
                      <Link href={`/range/${p.slug}`} className="type-h4 justify-self-start">
                        {p.name}
                      </Link>
                      <span className="type-data">
                        {p.actives.value.length > 0
                          ? p.actives.value.map((a, n) => (
                              <span key={a.name}>
                                {n > 0 && " · "}
                                {a.name} <span className="text-green">{a.pct}</span>
                              </span>
                            ))
                          : p.purpose.value}
                      </span>
                    </div>
                    <div className="col-span-6 lg:col-span-4 lg:col-start-5">
                      <QuantityStepper label={p.name} value={i.qty} max={MAX_QTY} onChange={(q) => setQty(p.slug, q)} />
                    </div>
                    <div className="col-span-6 col-start-7 grid justify-items-end gap-8 lg:col-span-4 lg:col-start-9 lg:justify-items-start">
                      <span className="type-data">${p.price.value * i.qty}</span>
                      <span className="type-data text-ink-muted">${p.price.value} each</span>
                      <button
                        type="button"
                        onClick={() => remove(p.slug)}
                        className="link type-data inline-flex min-h-48 cursor-pointer items-center"
                        aria-label={`Remove ${p.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Grid>

          <Grid as="section" aria-labelledby="summary-label" className="gap-y-40 border-t border-hairline py-64 lg:py-96">
            <h2 id="summary-label" className="type-data col-span-12">
              Summary
            </h2>
            <div className="col-span-12 grid content-start gap-24 lg:col-span-6">
              {refillTypes > 2 && (
                <p className="type-body max-w-measure">
                  {refillTypes} different refills. We recommend no more than two at once. More actives means more
                  irritation, not more result.
                </p>
              )}
              {blocked && (
                <div className="grid justify-items-start gap-16">
                  <p id="checkout-rule" className="type-h4 max-w-measure">
                    {RULE_MESSAGE}
                  </p>
                  {!hasVessel && <AddToBag slug="vessel-01" label="Add Vessel 01 · $65" variant="secondary" showQty={false} />}
                  <p className="type-body max-w-measure text-ink-muted">{RULE_ACCOUNTS}</p>
                </div>
              )}
            </div>
            <div className="col-span-12 grid content-start justify-items-start gap-24 lg:col-span-4 lg:col-start-9">
              <dl className="w-full border-b border-hairline">
                <div className="flex justify-between gap-16 border-t border-hairline py-16">
                  <dt className="type-data text-ink-muted">Subtotal</dt>
                  <dd className="type-data">${total}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-16 border-t border-hairline py-16">
                  <dt className="type-data">Total</dt>
                  <dd className="type-h4">${total}</dd>
                </div>
              </dl>
              <p className="type-data text-ink-muted">No payment is taken on this site.</p>
              <Button href="/checkout" state={blocked ? "disabled" : "default"} aria-describedby={blocked ? "checkout-rule" : undefined}>
                Checkout
              </Button>
            </div>
          </Grid>

          <CheckoutBar total={total} blocked={blocked} />
        </>
      )}
      </div>
    </main>
  );
}
