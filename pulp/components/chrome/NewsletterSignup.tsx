"use client";

import { useId, useState, type FormEvent, type ReactElement } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

/**
 * The footer newsletter (DESIGN.md §11).
 *
 * The heading is loud, written as a care instruction, because §11 puts the
 * newsletter signup squarely in the loud zone. The field is not: §11 is
 * explicit that a form field on a loud page takes a plain functional label,
 * because a label's only job is to be understood. So the heading is a joke and
 * the label says "Email address".
 *
 * Email sending is out of scope for this build, so submitting validates and
 * confirms locally with no request. That is also why the button never enters
 * its loading state — there is nothing to wait for, and faking a delay would
 * be theatre.
 */

// Deliberately loose. The job is to catch a typo, not to adjudicate RFC 5322 —
// a rejected valid address is a worse failure than an accepted invalid one.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup(): ReactElement {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [signedUp, setSignedUp] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (value === "") {
      setError("Enter an email address.");
      return;
    }

    if (!EMAIL.test(value)) {
      setError("Enter an email address like name@example.com");
      return;
    }

    setError(undefined);
    setSignedUp(true);
  }

  return (
    <div className="flex flex-col gap-40 desktop:flex-row desktop:gap-96">
      <div className="measure flex-1">
        <h2 className="type-lg">Do not spam. Do not sell.</h2>
        <p className="type-base mt-24">
          One email a month. New drops, restocks, and the occasional word on
          getting a stain out of something heavy.
        </p>
      </div>

      <div className="flex-1">
        {signedUp ? (
          // The success state is designed, not a browser default: it confirms
          // the address and says what happens next.
          <div role="status" className="measure">
            <p className="type-label">On the list</p>
            <p className="type-base mt-16">
              {email.trim()} is signed up. The next email goes out with the next
              drop.
            </p>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="measure">
            <FormField
              id={`${fieldId}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              label="Email address"
              placeholder="name@example.com"
              value={email}
              error={error}
              onChange={(event) => {
                setEmail(event.target.value);
                // The error clears as soon as the customer starts fixing it,
                // rather than sitting there until they submit again.
                if (error) setError(undefined);
              }}
            />

            <Button type="submit" className="mt-24">
              Sign up
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
