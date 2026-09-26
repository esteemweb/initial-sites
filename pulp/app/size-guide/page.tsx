import type { Metadata } from "next";
import type { ReactElement } from "react";
import Prose from "@/components/content/Prose";
import TextLink from "@/components/ui/TextLink";
import SizeGuideTables from "@/components/size-guide/SizeGuideTables";
import { HOW_TO_MEASURE, SIZE_GUIDE_INTRO } from "@/lib/content/sizeGuide";

export const metadata: Metadata = {
  title: "Size guide — PULP",
  description:
    "Flat measurements for every garment in centimetres or inches, how to measure, and how each style is cut.",
};

/**
 * `/size-guide`.
 *
 * Quiet register (§11): sizing is the plain zone, so nothing here is written
 * for effect. The product page's size-guide panel links here for the general
 * advice it does not carry.
 */
export default function SizeGuide(): ReactElement {
  return (
    <main className="shell py-40 desktop:py-48">
      <p className="type-label">Size guide</p>
      <h1 className="type-lg mt-16">How everything is cut.</h1>

      <Prose paragraphs={SIZE_GUIDE_INTRO} className="mt-48" />

      <section aria-labelledby="how-to-measure" className="mt-64">
        <h2 id="how-to-measure" className="type-label">
          How each measurement is taken
        </h2>
        <dl className="measure mt-24 flex flex-col gap-24">
          {HOW_TO_MEASURE.map((entry) => (
            <div key={entry.term}>
              <dt className="type-label">{entry.term}</dt>
              <dd className="type-base mt-8">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <SizeGuideTables />

      <p className="type-base mt-80">
        Still unsure, or between sizes on something?{" "}
        <TextLink href="/delivery-returns">
          Returns are free for 30 days
        </TextLink>
        , so ordering both is a reasonable thing to do.
      </p>
    </main>
  );
}
