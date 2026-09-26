import type { Metadata } from "next";
import type { ReactElement } from "react";
import Prose from "@/components/content/Prose";
import ProcessImage from "@/components/content/ProcessImage";
import ButtonLink from "@/components/ui/ButtonLink";
import SignatureLine from "@/components/brand/SignatureLine";
import { LABEL_INTRO, LABEL_SECTIONS } from "@/lib/content/label";

export const metadata: Metadata = {
  title: "The Label — PULP",
  description:
    "A printing operation that happens to make clothes. One colour per pass, runs of a few hundred, printed where it is sewn in Portugal.",
};

/**
 * `/the-label` — the brand story.
 *
 * The one page that stays loud throughout (§11). Process imagery only, no
 * models: §10 rules out lifestyle photography, and the argument this page makes
 * is about how the thing is printed rather than who wears it.
 *
 * Sections alternate the density §1 asks for — a block of prose, then a wide
 * image, then a block of prose — rather than running uniformly busy.
 */
export default function TheLabel(): ReactElement {
  return (
    <main>
      <section className="shell py-40 desktop:py-48">
        <p className="type-label">The Label</p>
        <h1 className="type-xl mt-16">Loud product, plain house.</h1>
        <Prose paragraphs={LABEL_INTRO} className="mt-48" />
      </section>

      {LABEL_SECTIONS.map((section) => (
        <section
          key={section.marker}
          aria-labelledby={`label-${section.marker.replace(/\s+/g, "-")}`}
          className="shell py-40 desktop:py-48"
        >
          <p className="type-label">{section.marker}</p>
          <h2
            id={`label-${section.marker.replace(/\s+/g, "-")}`}
            className="type-lg mt-16"
          >
            {section.heading}
          </h2>

          <div className="mt-48 grid gap-64 desktop:grid-cols-2 desktop:gap-96">
            <Prose paragraphs={section.paragraphs} />
            {section.image && (
              <ProcessImage
                caption={section.image.caption}
                ratio={section.image.ratio}
              />
            )}
          </div>
        </section>
      ))}

      {/* Closes on `paper`, not a `signal` band. The footer already ends every
          page with the signature line on `signal`, and a second one here would
          be the same note struck twice. The line is repeated at `lg` on white
          instead, which lets the button keep its own variant — tinting a
          `secondary` button white by appending `border-page` over `border-ink`
          would leave both classes on the element and let stylesheet order pick
          the winner, which is the bug this codebase already fixed once. */}
      <section className="shell py-40 desktop:py-48">
        <SignatureLine className="type-lg measure" />
        <ButtonLink href="/shop" className="mt-48">
          See what comes off it
        </ButtonLink>
      </section>
    </main>
  );
}
