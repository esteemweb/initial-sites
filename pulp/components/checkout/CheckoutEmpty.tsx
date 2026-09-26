import type { ReactElement } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import SpecMark from "@/components/icons/SpecMark";

interface CheckoutEmptyProps {
  heading: string;
  body: string;
}

/**
 * Nothing to check out, or nothing to confirm.
 *
 * Checkout is the quiet zone (§11), so this one is written plainly rather than
 * in the basket's loud register — somebody who has landed here by a stale link
 * wants to know what happened and where to go, not a joke about laundry.
 */
export default function CheckoutEmpty({
  heading,
  body,
}: CheckoutEmptyProps): ReactElement {
  return (
    <div className="flex flex-col items-start gap-24 py-80">
      <SpecMark code="no-print" className="size-64" decorative />
      <h2 className="type-lg">{heading}</h2>
      <p className="type-base measure">{body}</p>
      <ButtonLink href="/shop" className="mt-16">
        Shop everything
      </ButtonLink>
    </div>
  );
}
