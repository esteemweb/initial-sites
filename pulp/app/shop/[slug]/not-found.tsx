import type { ReactElement } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import SpecMark from "@/components/icons/SpecMark";

/**
 * A slug that is not in the catalogue.
 *
 * Scoped to `/shop/[slug]` rather than the site-wide 404, because the useful
 * thing to offer someone here is the shop, not the homepage. Loud register —
 * §11 puts 404s and empty states in the same voice — and it invites action
 * rather than apologising.
 */
export default function ProductNotFound(): ReactElement {
  return (
    <main className="shell flex flex-col items-start gap-24 py-80 desktop:py-160">
      <SpecMark code="no-print" className="size-64" decorative />

      <h1 className="type-xl">Never made it.</h1>

      <p className="type-base measure">
        There is no garment at this address. It may have been renamed, or it may
        never have existed. The rest of the range is still where you left it.
      </p>

      <ButtonLink href="/shop" className="mt-16">
        Back to the shop
      </ButtonLink>
    </main>
  );
}
