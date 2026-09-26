import Link from "next/link";
import type { ReactElement } from "react";

/**
 * The closing campaign block: one full-bleed image, one line, one destination.
 *
 * 16:9 is the ratio the image brief specifies for campaign shots. The box is
 * flat `wash` because photography is not generated yet; when `campaign-1.jpg`
 * lands it goes here through `next/image` and takes the §10 duotone — hard
 * `ink` and `signal`, high contrast, blown highlights. The placeholder is
 * deliberately not duotone, so nobody mistakes it for the finished treatment.
 *
 * The whole block is one link rather than a block containing a link: a single
 * large target works on touch, takes one tab stop, and avoids nesting an anchor
 * inside an anchor. "Shop everything" is plain text inside it, so the target is
 * named rather than being an image you are expected to guess at.
 */
export default function CampaignBlock(): ReactElement {
  return (
    <section aria-labelledby="campaign-heading">
      <h2 id="campaign-heading" className="sr-only">
        The range
      </h2>

      <Link
        href="/shop"
        className="group wash-ultra plotted-sheet block border-y-2 border-ink
          transition-colors hover:bg-rose hover:text-page"
      >
        <div className="relative aspect-[16/9] w-full">
          <div className="absolute inset-0 flex flex-col justify-end gap-24 p-24 desktop:p-64">
            <p className="type-xl measure">Printed, not repeated.</p>

            {/* Underlined at rest, so the target is legible without hover. */}
            <p className="type-button underline decoration-2 underline-offset-8">
              Shop everything
            </p>
          </div>

          {/* Names the slot the photograph will fill. Comes out with the image. */}
          <p className="type-label absolute right-24 top-24 text-ink/60 group-hover:text-page">
            Campaign 16:9
          </p>
        </div>
      </Link>
    </section>
  );
}
