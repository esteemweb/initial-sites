"use client";

import { useId, useState, type FormEvent, type ReactElement } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { formatPrice } from "@/lib/format";
import { toPounds } from "@/lib/commerce";
import { useBasket } from "./BasketProvider";

/**
 * The discount code field (DESIGN.md §12) — WASHDAY, 10% off the subtotal,
 * before delivery.
 *
 * The basket is a loud page, but §11 is explicit that a field on a loud page
 * takes a plain functional label, so this one says "Discount code" and the
 * error says what to do about it rather than making a joke of the failure.
 *
 * Matching ignores case and surrounding whitespace, because a customer pasting
 * a code from an email should not be punished for a trailing space.
 */
export default function DiscountCodeField(): ReactElement {
  const fieldId = useId();
  const { code, totals, applyCode, removeCode } = useBasket();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (value.trim() === "") {
      setError("Enter a discount code.");
      return;
    }

    if (!applyCode(value)) {
      setError("That code is not recognised. Check the spelling and try again.");
      return;
    }

    setError(undefined);
    setValue("");
  }

  if (code) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-16 border-2 border-ink p-16">
        <p className="type-label">
          {code} applied
          <span className="sr-only">
            , {formatPrice(toPounds(totals.discount))} off
          </span>
        </p>

        <button
          type="button"
          onClick={removeCode}
          className="type-base underline decoration-1 underline-offset-2
            transition-colors hover:text-rose active:translate-y-[1px]"
        >
          Remove
          <span className="sr-only"> discount code {code}</span>
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-16">
      <FormField
        id={`${fieldId}-code`}
        name="discount-code"
        label="Discount code"
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        error={error}
        onChange={(event) => {
          setValue(event.target.value);
          if (error) setError(undefined);
        }}
      />

      <Button type="submit" variant="secondary" className="self-start">
        Apply
      </Button>
    </form>
  );
}
