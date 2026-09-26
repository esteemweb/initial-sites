"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Grid";
import { TextField } from "@/components/ui/TextField";
import { getProduct } from "@/data/products";
import { useCart } from "@/lib/cart";
import { RULE_ACCOUNTS, RULE_MESSAGE } from "./rule";

type Field = "email" | "name" | "line1" | "line2" | "city" | "state" | "zip";
type Values = Record<Field, string>;

const FIELDS: { key: Field; label: string; autoComplete: string; type?: string; optional?: boolean; hint?: string; inputMode?: "numeric" | "email" }[] = [
  { key: "email", label: "Email", autoComplete: "email", type: "email", inputMode: "email" },
  { key: "name", label: "Full name", autoComplete: "name" },
  { key: "line1", label: "Address", autoComplete: "address-line1" },
  { key: "line2", label: "Apartment, suite", autoComplete: "address-line2", optional: true },
  { key: "city", label: "City", autoComplete: "address-level2" },
  { key: "state", label: "State", autoComplete: "address-level1", hint: "Two letters, e.g. MA" },
  { key: "zip", label: "ZIP code", autoComplete: "postal-code", inputMode: "numeric" },
];

function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter an email address like name@example.com.";
  if (!v.name.trim()) e.name = "Enter your full name.";
  if (!v.line1.trim()) e.line1 = "Enter the street address.";
  if (!v.city.trim()) e.city = "Enter the city.";
  if (!/^[A-Za-z]{2}$/.test(v.state.trim())) e.state = "Enter the two-letter state code, e.g. MA.";
  if (!/^\d{5}(-\d{4})?$/.test(v.zip.trim())) e.zip = "Enter a five-digit ZIP code.";
  return e;
}

export function CheckoutForm() {
  const router = useRouter();
  const { ready, items, total, canCheckout, placeOrder } = useCart();
  const [values, setValues] = useState<Values>({ email: "", name: "", line1: "", line2: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [placing, setPlacing] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setPlacing(true);
    const order = placeOrder();
    router.push(`/checkout/confirmation?order=${order.id}`);
  };

  const errorList = FIELDS.filter((f) => errors[f.key]);

  return (
    <main id="content" tabIndex={-1} className="outline-none">
      <Grid as="section" aria-labelledby="checkout-title" className="gap-y-24 pt-40 pb-64 lg:pb-96">
        <p className="type-data col-span-12 text-ink-muted">No payment is taken on this site</p>
        <h1 id="checkout-title" className="type-display title-rise col-span-12">
          Checkout
        </h1>
      </Grid>

      {/* Storage-dependent content: reserved height stops the footer jumping */}
      <div className="min-h-svh">
      {!ready && (
        <Grid className="border-t border-hairline py-64" aria-busy>
          <p className="type-data col-span-12 text-ink-muted">Loading…</p>
        </Grid>
      )}

      {/* Nothing to check out */}
      {ready && items.length === 0 && !placing && (
        <Grid as="section" aria-label="Empty bag" className="gap-y-24 border-t border-hairline py-64">
          <p className="type-h3 col-span-12 lg:col-span-6">Your bag is empty.</p>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Button href="/range">The range</Button>
          </div>
        </Grid>
      )}

      {/* The rule, checked again here for anyone who arrives by URL */}
      {ready && items.length > 0 && !canCheckout && !placing && (
        <Grid as="section" aria-labelledby="rule-label" className="gap-y-24 border-t border-hairline py-64">
          <h2 id="rule-label" className="type-h3 col-span-12 lg:col-span-6">
            {RULE_MESSAGE}
          </h2>
          <div className="col-span-12 grid justify-items-start gap-16 lg:col-span-4 lg:col-start-9">
            <Button href="/bag">Back to bag</Button>
            <p className="type-body max-w-measure text-ink-muted">{RULE_ACCOUNTS}</p>
          </div>
        </Grid>
      )}

      {ready && (canCheckout || placing) && (
        <Grid as="section" aria-label="Delivery details" className="gap-y-40 border-t border-hairline py-64 lg:py-96">
          <form noValidate onSubmit={onSubmit} className="col-span-12 grid content-start gap-40 lg:col-span-6">
            {errorList.length > 0 && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="grid gap-8 border-y border-hairline py-16">
                <p className="type-data">
                  Error — {errorList.length} {errorList.length === 1 ? "field needs" : "fields need"} attention
                </p>
                <ul>
                  {errorList.map((f) => (
                    <li key={f.key}>
                      <a href={`#field-${f.key}`} className="type-body inline-flex min-h-48 items-center underline">
                        {f.label}: {errors[f.key]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <fieldset className="grid gap-24">
              <legend className="type-data pb-16">Contact</legend>
              {FIELDS.slice(0, 1).map((f) => (
                <TextField
                  key={f.key}
                  id={`field-${f.key}`}
                  label={f.label}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  value={values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  error={errors[f.key]}
                  optional={f.optional}
                  hint={f.hint}
                />
              ))}
            </fieldset>

            <fieldset className="grid grid-cols-6 gap-x-20 gap-y-24">
              <legend className="type-data pb-16">Delivery</legend>
              {FIELDS.slice(1).map((f) => (
                <TextField
                  key={f.key}
                  id={`field-${f.key}`}
                  className={f.key === "state" || f.key === "zip" ? "col-span-3" : "col-span-6"}
                  label={f.label}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  value={values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  error={errors[f.key]}
                  optional={f.optional}
                  hint={f.hint}
                />
              ))}
              <p className="type-data col-span-6 text-ink-muted">Country: United States</p>
            </fieldset>

            <div>
              <Button type="submit" state={placing ? "loading" : "default"} loadingLabel="Placing…">
                Place order · ${total}
              </Button>
            </div>
          </form>

          {/* Order summary in the rail */}
          <aside aria-labelledby="order-label" className="col-span-12 grid content-start gap-16 lg:col-span-4 lg:col-start-9">
            <h2 id="order-label" className="type-data">
              Order
            </h2>
            <dl className="border-b border-hairline">
              {items.map((i) => {
                const p = getProduct(i.slug);
                return (
                  <div key={i.slug} className="flex justify-between gap-16 border-t border-hairline py-16">
                    <dt className="type-data">
                      {i.qty} × {p?.name}
                    </dt>
                    <dd className="type-data">${(p?.price.value ?? 0) * i.qty}</dd>
                  </div>
                );
              })}
              <div className="flex items-baseline justify-between gap-16 border-t border-hairline py-16">
                <dt className="type-data">Total</dt>
                <dd className="type-h4">${total}</dd>
              </div>
            </dl>
            <Link href="/bag" className="type-data inline-flex min-h-48 items-center justify-self-start">
              Edit bag
            </Link>
          </aside>
        </Grid>
      )}
      </div>
    </main>
  );
}
