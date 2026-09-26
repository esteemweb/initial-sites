import type { ReactElement } from "react";

/**
 * The pitch: what the clothes are, how heavy, how long they last.
 *
 * Spec-sheet language — a Space Mono field name over a display heading, the
 * way a garment label names a thing before it tells you about it.
 *
 * Three co-equal `lg` headings rather than one dominant element: a deliberate
 * triad, and the quiet beat between the hero and the product. No 01 / 02 / 03
 * markers, because §7 reserves numbered markers for sequences and these three
 * are not one — they are three facts about the same garment.
 *
 * The weight figures are the catalogue's: 200gsm is the Baby Tee, the
 * lightest thing in the range, and 420 is the Studio Hoodie.
 */

const BLOCKS = [
  {
    label: "The press",
    heading: "One colour at a time.",
    body: "Every print on this site is screen printed one ink per pass, the way a riso does it. Flat fluorescent colour that sits on the cotton instead of soaking into it, with the slight misregistration that comes with printing something by hand.",
  },
  {
    label: "The cloth",
    heading: "Nothing thin.",
    body: "Nothing here starts below 200gsm and the Studio Hoodie lands at 420. Cotton with enough weight to hang instead of cling, and enough body to hold a print without the ink cracking at the first fold.",
  },
  {
    label: "The run",
    heading: "A few hundred, then gone.",
    body: "Every colourway is a run of a few hundred and it is not made again. Not a marketing device, just how much a small press can put out before the screens are reclaimed for the next one.",
  },
];

export default function PitchBlocks(): ReactElement {
  return (
    <section
      aria-labelledby="pitch-heading"
      className="shell py-40 desktop:py-48"
    >
      <h2 id="pitch-heading" className="sr-only">
        What these clothes are
      </h2>

      <div className="grid gap-64 desktop:grid-cols-3 desktop:gap-64">
        {BLOCKS.map((block) => (
          <div key={block.label}>
            <p className="type-label">{block.label}</p>
            <h3 className="type-lg mt-16">{block.heading}</h3>
            <p className="type-base measure mt-24">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
