/* pattern: split hero 30/70, text rail left, full-bleed media right, overlay
   statement at the media's bottom-right — autopsy §2 (29/71 measured), §10
   "Hero". Mobile collapses to text above, media below (autopsy §11).
   Diverged: the reference's h1 is a coined trademark and its overlay text has
   no scrim. Ours is the brand's own line, and the scrim is mandatory.

   Motion, above lg only (autopsy §15.3–15.4, sequenced the same way as Two
   Houses — see HERO SEQUENCE in globals.css). Three steps, in order:
   1. the page opens on the photograph full-bleed, and scrolling slides its
      left edge right into the split over a still-empty rail;
   2. the rail's copy then rises from the fold and scrolls past it;
   3. the photograph collapses into the label strip, the overlay statement
      riding its edge and fading, while the Statement slides up underneath.
   The trade-off: at first paint the h1 is below the fold, under the photo.
   It is in the DOM and first in reading order either way. */
import { Section } from "@/components/ui/section";
import { MediaFrame } from "@/components/ui/media-frame";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BlurUp } from "@/components/ui/blur-up";
import { SITE } from "@/content/site";
import { HERO_STRIP } from "@/content/home";
import { colomboRoastery } from "@/content/placeholders";

export function Hero() {
  return (
    <Section tone="linen" bleed flush className="u-hero-offset">
      {/* Step 1 — the slide, over the first 0.4 screens of scroll. */}
      <ScrollProgress start={0} end={-0.4} name="--slide" className="u-split">
        {/* Step 2 — the rail starts one screen down, so its copy rises from
            the fold once the edge has landed. */}
        <div className="u-gutter u-hero-rail flex flex-col justify-center lg:pr-12">
          <h1 className="text-hero">{SITE.tagline}</h1>

          {/* Operational detail at body size, not fine print — autopsy §9. */}
          <div className="mt-12 text-sm">
            <p>
              {SITE.colombo.label} &amp; {SITE.ella.label}.
            </p>
            <p className="text-text-muted">
              {SITE.colombo.hours} · {SITE.ella.hours}
            </p>
            <p className="mt-4">
              {/* Plain text, not a tel: link — a demo number (site.ts). */}
              {SITE.phone}
            </p>
          </div>
        </div>

        {/* Step 3 — the collapse, from 1.2 to 1.7 screens of scroll. */}
        <ScrollProgress start={-1.2} end={-1.7} className="u-hero-pin">
          <div className="u-hero-stick">
            {/* Full-bleed until the slide lands. data-tone lets the header
                switch to cream while the photo is under it. */}
            <div className="u-slide-edge" data-tone="dark">
              {/* Opens blurred and sharpens as the photo lands — the
                  reference's load, instead of a loading screen. */}
              <BlurUp className="h-full">
                <MediaFrame
                  src="/images/photo-colombo-roastery.webp"
                  alt="The drum roaster behind its plate-glass partition in the Colombo roastery, lit by late afternoon sun."
                  ratio="fill"
                  priority
                  sizes="100vw"
                  blurDataURL={colomboRoastery}
                  className="u-hero-media lg:min-h-0"
                />
              </BlurUp>

              {/* Overlay statement + its scrim, riding the rising edge. */}
              <div className="u-hero-ride absolute inset-0">
                <span className="u-scrim" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex justify-end p-6 text-text-on-dark lg:p-12">
                  <p className="text-base u-measure-card">
                    The first is our tea. Sorry — <em>their</em> tea.
                    Everything we pour is grown in Sri Lanka and roasted within
                    200 km of the cup.
                  </p>
                </div>
              </div>

              {/* The strip's label band. Decorative: every line repeats copy
                  that is stated in full elsewhere on the page. */}
              <div
                aria-hidden="true"
                className="u-hero-strip u-gutter font-mono text-2xs uppercase text-text-on-dark"
              >
                {HERO_STRIP.map((label, i) => (
                  <span key={label} className={i === 1 ? "text-amber" : undefined}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollProgress>
      </ScrollProgress>
    </Section>
  );
}
