/* pattern: audience band — autopsy §9 (three uppercase labels spread across a
   full-bleed dark image band), now also carrying the reference's pinned-media
   scroll (autopsy §6 and §14 #7). The photograph holds still for a full
   viewport while the labels travel past it.

   Labels are amber on roast (8.61:1); cherry would be 2.11:1 here, which is
   why the accent never appears on dark.
   The photograph is shown at full strength and fills the middle of the pin:
   three cups spaced along one counter, which is the three audiences. It used
   to sit at opacity-20, which left two screens of empty brown. The text is
   kept legible by u-band-scrim instead: roast gradients at the top (the
   sentence) and the bottom (the labels), clear through the middle. The labels
   only ever travel through the bottom band, so they are never over the bare
   photograph — re-measure if they move. */
import Image from "next/image";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { AUDIENCES } from "@/content/home";

export function AudienceBand() {
  return (
    <Section tone="roast" id="who" bleed flush className="u-pinned-2 isolate">
      {/* Pinned layer — held still while the content below scrolls past it. */}
      <div className="u-pinned-layer">
        <div className="u-pinned-panel">
          <Image
            src="/images/photo-audience-counter.webp"
            alt="Three cups of coffee spaced along a long, worn wooden counter, with scattered beans, a tamper and a folded cloth between them."
            fill
            sizes="100vw"
            className="object-cover"
          />
          <span className="u-band-scrim" aria-hidden="true" />
        </div>
      </div>

      {/* Travelling content. Pushed apart so the labels arrive on the second
          screen, which is what gives the pin something to hold against. */}
      <div className="u-gutter u-pinned-2 flex flex-col justify-between py-32">
        <p className="u-measure text-base text-text-muted-dark">
          Three kinds of people drink what we roast. We are not precious about
          which one you are.
        </p>

        <Reveal>
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-16">
            {AUDIENCES.map((a) => (
              <li
                key={a}
                className="u-rule-cap-dark pt-6 font-mono text-2xs uppercase text-amber"
              >
                {a}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
