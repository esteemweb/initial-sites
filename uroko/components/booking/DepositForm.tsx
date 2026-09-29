"use client";

import { startTransition, useActionState, useRef, useState, type FormEvent } from "react";
import { confirmDeposit, type DepositState } from "@/app/book/actions";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { checkTestCard, type CardErrors } from "@/lib/booking/card";

const initial: DepositState = { errors: {} };

/**
 * Demo deposit. The card fields have no `name`, so the browser never includes
 * them in a submission: they are checked here, in the visitor's browser, and
 * only the last four digits of an accepted test card are sent to the server.
 */
export function DepositForm({ amountLabel }: { amountLabel: string }) {
  const [state, action, pending] = useActionState(confirmDeposit, initial);
  const [local, setLocal] = useState<CardErrors>({});
  const holder = useRef<HTMLInputElement>(null);
  const number = useRef<HTMLInputElement>(null);
  const expiry = useRef<HTMLInputElement>(null);
  const cvc = useRef<HTMLInputElement>(null);
  const e: CardErrors = { ...state.errors, ...local };

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const { errors, last4 } = checkTestCard({
      holder: holder.current?.value ?? "",
      number: number.current?.value ?? "",
      expiry: expiry.current?.value ?? "",
      cvc: cvc.current?.value ?? "",
    });
    setLocal(errors);
    if (!last4) return;
    const fd = new FormData();
    fd.set("last4", last4);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="border border-warn/40 bg-surface-raised p-4 text-sm">
        <p className="font-medium">Demo payment. Nothing is charged.</p>
        <p className="mt-1 text-text-muted">
          Use the test card <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVC. Real card
          numbers are refused. The details are checked in your browser and never sent anywhere; only the last four digits
          of the test card are kept.
        </p>
      </div>
      {e.form ? (
        <p role="alert" className="text-sm text-err">
          {e.form}
        </p>
      ) : null}

      <Field id="holder" label="Name on card" error={e.holder}>
        <Input ref={holder} id="holder" autoComplete="cc-name" maxLength={100} error={e.holder} required />
      </Field>
      <Field id="number" label="Card number" error={e.number}>
        <Input
          ref={number}
          id="number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          maxLength={23}
          className="font-mono"
          error={e.number}
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-6">
        <Field id="expiry" label="Expiry" error={e.expiry}>
          <Input ref={expiry} id="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" maxLength={7} className="font-mono" error={e.expiry} required />
        </Field>
        <Field id="cvc" label="CVC" error={e.cvc}>
          <Input ref={cvc} id="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} className="font-mono" error={e.cvc} required />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Button type="submit" variant="seal" disabled={pending}>
          {pending ? "Confirming…" : `Pay ${amountLabel} deposit (demo)`}
        </Button>
        <p className="text-sm text-text-muted">Refundable up to 48 hours before the first session.</p>
      </div>
    </form>
  );
}
