import type { Metadata } from "next";
import { Panel, Cluster } from "@/components/Panel";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { Parallax } from "@/components/Parallax";
import { Rail } from "@/components/Rail";
import { SiteChrome } from "@/components/SiteChrome";

/* The Villas — the second chapter.

   Built entirely from the existing tokens: this page required NO new token,
   which is the signal the system generalised rather than fitting only the
   page it was authored against (design-system.md §8).

   Copy SHAPE follows the homepage: plain descriptive names in the reference's
   register (its own list reads "Village Bungalow", "Beachfront Bungalow"),
   one factual line each, third person, no marketing adjectives, no CTAs. */

export const metadata: Metadata = {
  title: "The Villas — Talay Dao",
  description:
    "Twelve villas set along a single tideline on Koh Yao Noi, none of them within sight of another.",
};

/* Hoisted: static content, rebuilt on every render otherwise
   (audit finding, rendering-hoist-jsx). */
const VILLAS = [
  { n: "01", name: "North Rocks", line: "The furthest north, set against the boulders that close the bay. Shaded until eleven." },
  { n: "02", name: "Casuarina", line: "Built around two existing trees rather than clearing them. The roof is cut to fit." },
  { n: "03", name: "The Boathouse", line: "The oldest structure on the land, and the only one not built by the family." },
  { n: "04", name: "Low Tide", line: "Sits closest to the water. At spring tides the steps are in the sea." },
  { n: "05", name: "Pandanus", line: "Screened on three sides by planting that was already there in 1987." },
  { n: "06", name: "The Long Room", line: "One room, eleven metres end to end, with doors on both long walls." },
  { n: "07", name: "Mangrove", line: "Backs onto the tidal creek. The water arrives under the deck twice a day." },
  { n: "08", name: "Driftwood", line: "Framed in timber recovered from the old jetty when it was replaced." },
  { n: "09", name: "South Point", line: "The last villa before the headland, and the only one that sees the sunset whole." },
  { n: "10", name: "The Kiln", line: "Stands where the lime kiln stood. The original floor was kept and levelled." },
  { n: "11", name: "Sandbar", line: "Looks straight down the sandbar that appears for four hours either side of low water." },
  { n: "12", name: "Night Water", line: "The darkest of the twelve, and the one the plankton reaches first." },
] as const;

export default function Villas() {
  return (
    <>
      <main id="main">
        <Rail>
        {/* pattern: full-bleed hero, title low in frame at 80% with a
            bottom-weighted scrim — refs/tandjung-sari §10 */}
        <Panel height="bookend" bleed>
          <Parallax rate={-0.06} className="parallax-bleed">
          <Media
            label="Villa terrace · morning"
            vtName="gate-villas"
            src="/images/villa-terrace-morning.jpg"
            alt="An empty timber villa terrace in the morning, framed by a weathered teak post."
            ratio="fill"
            className="hero-settle"
            sizes="100vw"
            priority
            scrim
          />
          </Parallax>
          <SplitText as="h1" className="hero-title text-center font-display text-display text-on-media" text="The Villas" />
        </Panel>

        {/* pattern: chapter marker as an oversized single typographic element
            — refs/tandjung-sari §9, adjacent version: the reference uses a
            date in Caslon, we use a count */}
        <Panel height="short">
          <Reveal>
            <SplitText as="p" className="font-display text-chapter text-ink-soft" text="Twelve" />
          </Reveal>
          <Reveal index={1}>
            <Cluster className="mt-cluster-heading">
              <p className="text-body-lg">
                They were built over nineteen years, one at a time, as the
                family could afford them. Nothing was demolished to make room
                for any of them, which is why no two share a plan and why the
                numbering runs along the shore rather than in the order they
                were finished.
              </p>
            </Cluster>
          </Reveal>
        </Panel>

        {/* pattern: index entry grid — design-system.md §8, which reuses the
            three-beat tide pattern from refs/tandjung-sari §9 rather than
            introducing a card the reference never had */}
        <Panel height="long" className="panel-villas">
          <Cluster eyebrow="Along the tideline" className="mb-md">
            <SplitText as="h2" className="text-heading" text="The numbering runs north to south, and the walk from one end to the other takes about nine minutes." />
          </Cluster>

          <ul className="villa-index grid gap-3xl sm:grid-cols-2 md:grid-cols-3 md:gap-xl">
            {VILLAS.map((villa, i) => (
              <li key={villa.n}>
                <Reveal index={i % 3}>
                  {/* Not a link. Per-villa detail pages are not built, and
                      the navigation model (design-system.md §8) forbids
                      linking to a route that does not exist. */}
                  <Parallax rate={-0.14}>
                  <Media
                    label={`${villa.name} · exterior`}
                    ratio="portrait"
                    className="mx-auto max-h-panel-media"
                  />
                  </Parallax>
                  {/* One cell for the whole caption, so the entry is as tall
                      as its media rather than media + stacked text. */}
                  <div className="villa-entry-text">
                    <p className="font-sans text-label uppercase text-ink-soft">
                      {villa.n}
                    </p>
                    <h3 className="mt-cluster-eyebrow text-heading">{villa.name}</h3>
                    <p className="mt-cluster-eyebrow text-ink">{villa.line}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Panel>

        {/* pattern: closing bookend that hands off to the next chapter
            — refs/tandjung-sari §9, its `next` panel. The chain runs
            story -> villas -> gallery -> story. */}
        <Panel height="bookend" bleed>
          <Parallax rate={-0.06} className="parallax-bleed">
          <Media
            label="Shallows after dark · long exposure"
            vtName="gate-gallery"
            src="/images/shallows-after-dark.jpg"
            alt="Faint bioluminescence breaking in shallow seawater on a moonless night."
            ratio="fill"
            className="hero-settle"
            sizes="100vw"
            scrim
          />
          </Parallax>
          <a href="/gallery" className="hero-title block text-center">
            <SplitText as="h2" className="link-wipe inline-block font-display text-display text-on-media" text="Gallery" />
          </a>
        </Panel>
        </Rail>
      </main>

      <SiteChrome />
    </>
  );
}
