/* pattern: sticky full-viewport media with a text rail scrolling past it —
   autopsy §6/§12, the strongest structural idea on the reference and about
   fifteen lines of CSS with no JS. Rail 30%, media 70%, one item per
   --sequence-pitch (1.6 screens per item; the reference ran ~1 screen per item
   but across six of them, so the pin held for roughly six viewports).
   Diverged: two items, not six. The reference's 01-09 spine is its signature.
   Below lg the media un-sticks and each item stacks (design-system §9).

   Motion, from the 2026-09-23 recording (autopsy §15.8), above lg only: the
   pinned photograph arrives full-bleed and its left edge slides right into
   the 30/70 split over the first 0.4 viewport of the pin. Only then does the
   rail's first item rise into view from below — two steps, in order, as on
   the reference, rather than the edge uncovering text already in place. */
import { Section } from "@/components/ui/section";
import { EyebrowRow } from "@/components/ui/eyebrow-row";
import { MediaFrame } from "@/components/ui/media-frame";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BlurUp } from "@/components/ui/blur-up";
import { HOUSES } from "@/content/home";
import { ellaHillCountry } from "@/content/placeholders";

export function TwoHouses() {
  return (
    <Section tone="linen" id="houses" bleed flush>
      <ScrollProgress start={0} end={-0.4} name="--slide" className="u-split">
        {/* Rail — scrolls normally, but starts a screen down (u-slide-rail) so
            the photo's edge lands first and the text then rises from below. */}
        <div className="u-gutter u-slide-rail order-2 lg:order-1">
          {HOUSES.map((house) => (
            <article
              key={house.lead}
              className="u-sequence-item flex flex-col justify-center py-16 lg:pr-12"
            >
              <div className="u-rule-cap pt-8">
                <EyebrowRow lead={house.lead} label={house.label} scramble />
              </div>

              <h2 className="mt-16 text-xl">{house.title}</h2>

              <p className="mt-12 u-measure-card text-sm">{house.body}</p>

              <ul className="mt-16 grid gap-2 font-mono text-2xs uppercase text-text-muted">
                {house.meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Media — sticks to the viewport while the rail scrolls past it.
            The sticky element is the inner div, not the grid item: a stretched
            grid item is exactly as tall as its row and can never stick. */}
        <div className="order-1 lg:relative lg:z-10 lg:order-2">
          <div className="lg:sticky lg:top-0 lg:h-svh">
            {/* Widens leftward over the rail at progress 0 — see u-slide-edge.
                data-tone lets the header switch to cream while the photo is
                under it at full bleed. */}
            <div className="u-slide-edge" data-tone="dark">
              <BlurUp className="h-full">
                <MediaFrame
                  src="/images/photo-ella-hill-country.webp"
                  alt="Rows of coffee shrubs stepping down a steep hillside above Ella, with mist lying over the ridges beyond."
                  ratio="fill"
                  sizes="100vw"
                  blurDataURL={ellaHillCountry}
                  className="u-hero-media lg:h-svh lg:min-h-0"
                />
              </BlurUp>
            </div>
          </div>
        </div>
      </ScrollProgress>
    </Section>
  );
}
