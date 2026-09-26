"use client";

import { useId, useRef, type FormEvent, type ReactElement } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import { useCheckout } from "./CheckoutProvider";
import {
  DETAIL_FIELDS,
  hasErrors,
  validateDetails,
  type DeliveryDetails,
} from "@/lib/checkout/validation";

/**
 * Step one: where the order goes.
 *
 * Guest checkout — there are no accounts on this site, so there is nothing to
 * sign in to and nothing to create. The form says so once rather than offering
 * a "continue as guest" choice that has no alternative.
 *
 * Validation runs on submit, not on keystroke: being corrected halfway through
 * typing an email address is the most irritating thing a form does. Errors
 * clear as soon as the field is edited, which the provider handles.
 *
 * On failure, focus moves to the first invalid field in tab order — an error
 * summary nobody's cursor reaches is not an error message.
 */

interface FieldSpec {
  name: keyof DeliveryDetails;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
  hint?: string;
  optional?: boolean;
}

const FIELDS: FieldSpec[] = [
  { name: "name", label: "Full name", autoComplete: "name" },
  {
    name: "email",
    label: "Email address",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    hint: "For your order confirmation. Nothing else.",
  },
  {
    name: "phone",
    label: "Phone number",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    hint: "So the courier can reach you on the day.",
  },
  { name: "line1", label: "Address line 1", autoComplete: "address-line1" },
  {
    name: "line2",
    label: "Address line 2",
    autoComplete: "address-line2",
    optional: true,
  },
  { name: "town", label: "Town or city", autoComplete: "address-level2" },
  {
    name: "county",
    label: "County",
    autoComplete: "address-level1",
    optional: true,
  },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code" },
];

export default function DeliveryDetailsStep(): ReactElement {
  const scope = useId();
  const { details, setField, errors, setErrors, next } = useCheckout();
  const formRef = useRef<HTMLFormElement>(null);

  const fieldId = (name: keyof DeliveryDetails) => `${scope}-${name}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateDetails(details);
    setErrors(found);

    if (!hasErrors(found)) {
      next();
      return;
    }

    const firstBad = DETAIL_FIELDS.find((field) => field in found);
    if (firstBad) {
      formRef.current
        ?.querySelector<HTMLInputElement>(`#${CSS.escape(fieldId(firstBad))}`)
        ?.focus();
    }
  }

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit}>
      <h2 className="type-lg">Delivery details</h2>
      <p className="type-base measure mt-24">
        There are no accounts on this site, so there is nothing to sign in to.
        Fill this in and your order is placed.
      </p>

      <div className="mt-48 flex flex-col gap-40">
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            id={fieldId(field.name)}
            name={field.name}
            label={field.optional ? `${field.label} (optional)` : field.label}
            type={field.type}
            inputMode={field.inputMode}
            autoComplete={field.autoComplete}
            value={details[field.name]}
            error={errors[field.name]}
            hint={field.hint}
            onChange={(event) => setField(field.name, event.target.value)}
          />
        ))}
      </div>

      <Button type="submit" className="mt-48">
        Continue to delivery
      </Button>
    </form>
  );
}
