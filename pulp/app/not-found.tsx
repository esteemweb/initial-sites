import type { Metadata } from "next";
import type { ReactElement } from "react";
import PressMark from "@/components/brand/PressMark";
import ButtonLink from "@/components/ui/ButtonLink";
import TextLink from "@/components/ui/TextLink";

export const metadata: Metadata = {
  title: "Off the press — PULP"
};

/**
 * The site-wide 404.
 *
 * Loud (§11 puts 404s in the same register as empty states) and **centred** —
 * §5 reserves centre for full-bleed `signal` blocks and this page, so it is one
 * of only two places on the site where centring is correct rather than a
 * mistake.
 *
 * "Never printed" is two words at `xl` rather than `display`: `display`
 * caps any word at seven characters and this heading is nowhere near that.
 *
 * `/shop/[slug]` keeps its own narrower 404 for a bad product slug, where the
 * useful offer is the shop rather than the whole site.
 */
export default function NotFound(): ReactElement {
  return (
    <main className="shell flex flex-col items-center py-80 text-center desktop:py-160">
      <PressMark className="symbol-graphic" />

      <p className="type-label mt-64">Error 404</p>
      <h1 className="type-xl mt-16">Never printed.</h1>

      <p className="type-base measure mt-40">
        There is nothing at this address. It may have been renamed, or it may
        never have existed. Either way there is no run of it to find.
      </p>

      <ButtonLink href="/shop" className="mt-48">
        Back to the shop
      </ButtonLink>

      <p className="type-base mt-40">
        Or start again from <TextLink href="/">the homepage</TextLink>.
      </p>
    </main>
  );
}
