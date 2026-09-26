import { Panel, Cluster } from "@/components/Panel";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { Parallax } from "@/components/Parallax";
import { Rail } from "@/components/Rail";
import { RadialCarousel } from "@/components/RadialCarousel";
import { GALLERY } from "@/content/gallery";
import { SiteChrome } from "@/components/SiteChrome";

/* Talay Dao — the homepage is the essay.

   TAKEN wholesale from refs/tandjung-sari §9: the reference's homepage IS
   its "Our Story" narrative — eleven panels, no feature grid, no
   testimonials, no pricing, no footer, and zero inline CTAs. For a
   twelve-villa property that is the most appropriate decision in the
   whole autopsy.

   Copy SHAPE is taken (headings as 8-20 word statements, paragraphs of
   25-83 words, third person, past tense, no second person, no
   imperatives). Every word here is written for this project.

   Panel rhythm — only the first and last are exactly one viewport:
   bookend · short · base · tall · long · short · tall · bookend */

/* Hoisted out of the component body: static content, rebuilt on every
   render otherwise. Audit finding (rendering-hoist-jsx). */
const TIDE_BEATS = [
  {
    time: "07:40",
    shot: "Low water · sand flats",
    src: "/images/tide-low-water-flats.jpg",
    alt: "Ribbed tidal sand flats at low water, running out toward distant limestone stacks.",
    body: "At low water the bay walks out for two hundred metres and the boats sit down on their keels. The flats fill with people collecting shellfish, and they are gone again by nine.",
  },
  {
    time: "13:20",
    shot: "High water · jetty",
    src: "/images/tide-high-water-jetty.jpg",
    alt: "A weathered timber jetty running out into calm water at high tide.",
    body: "By the middle of the day the water has come back to the foot of the steps. This is the only window in which the jetty is usable, which is why lunch is late here and nobody explains why.",
  },
  {
    time: "18:05",
    shot: "Turning tide · west light",
    src: "/images/tide-turning-west-light.jpg",
    alt: "Distant limestone islands appearing to float above flat water in hazy west light.",
    body: "The turn comes with the light behind the karsts. For about twenty minutes the bay goes completely flat, and the far islands appear to be sitting slightly above the water rather than in it.",
  },
] as const;

export default function Home() {
  return (
    <>
      <main id="main">
        <Rail>
        {/* pattern: full-bleed hero, title low in frame at 80% with a
            bottom-weighted scrim — refs/tandjung-sari §10 */}
        <Panel height="bookend" bleed>
          <Parallax rate={-0.06} className="parallax-bleed">
          <Media
            label="Bay at first light · limestone stacks"
            vtName="gate-story"
            src="/images/hero-bay-first-light.jpg"
            alt="Limestone stacks in Phang Nga Bay at first light, seen low across flat water."
            ratio="fill"
            className="hero-settle"
            sizes="100vw"
            priority
            scrim
          />
          </Parallax>
          {/* The carousel sits on the landing screen, layered over the
              scrimmed hero media. relative + z so it paints above the
              absolutely positioned media beneath it. */}
          {/* Sized down from the defaults for the hero: the title sits at
              80% of the panel, so the expanded ring has to clear it. At the
              default radius of 260 the bottom thumbnails landed on top of
              the wordmark. mb lifts the whole block off the title. */}
          {/* ps-rail: the title below is inset by the fixed rail (hero-title),
              so the ring is inset the same way and the two share a centre. */}
          <div className="relative z-10 mb-3xl w-full ps-rail">
            <RadialCarousel
              items={GALLERY}
              radius={190}
              thumbnailSize={90}
              centerSize={320}
              initialExpanded
              introSpin
            />
          </div>

          <SplitText as="h1" className="hero-title text-center font-display text-display text-on-media" text="Talay Dao" />
        </Panel>

        {/* pattern: chapter marker as an oversized single typographic
            element — refs/tandjung-sari §9, adjacent version: the reference
            uses a date in Caslon ("1960's,"), we use a time of day */}
        <Panel height="short">
          <Reveal>
            <SplitText as="p" className="font-display text-chapter text-ink-soft" text="06:14" />
          </Reveal>
          <Reveal index={1}>
            <Cluster className="mt-cluster-heading">
              <p className="text-body-lg">
                The longtail from Bang Rong takes forty minutes, and for most of
                them there is nothing to look at but water. Then the limestone
                comes up out of the bay — one stack, then a dozen — and Koh Yao
                Noi arranges itself behind them, low and green and almost
                entirely unlit.
              </p>
            </Cluster>
          </Reveal>
        </Panel>

        {/* pattern: split image and text, ratio free per panel
            — refs/tandjung-sari §2 (its splits are not fixed either) */}
        <Panel height="base">
          <div className="grid items-center gap-xl md:grid-cols-2 md:gap-3xl">
            <Reveal>
              <Parallax rate={-0.14}>
              <Media
                label="Villa terrace · morning"
                src="/images/villa-terrace-morning.jpg"
                alt="An empty timber villa terrace in the morning, framed by a weathered teak post."
                ratio="portrait"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="mx-auto max-h-panel-media"
              />
              </Parallax>
            </Reveal>
            <Reveal index={1}>
              <Cluster eyebrow="The plan">
                <SplitText as="h2" className="text-heading" text="Twelve villas were set along a single tideline, and nothing was built behind them." />
                <p className="mt-cluster-heading">
                  The land rises steeply a hundred metres inland, which settled
                  the plan before anyone drew it. Every villa faces the same
                  water at the same angle, and none of them can see another. The
                  count was fixed at twelve because thirteen would have required
                  clearing the ridge.
                </p>
              </Cluster>
            </Reveal>
          </div>
        </Panel>

        {/* pattern: statement over full-bleed media with scrim
            — refs/tandjung-sari §9 (its split-image-text-overlay panels) */}
        <Panel height="tall" bleed className="justify-end">
          <Parallax rate={-0.06} className="parallax-bleed">
          <Media
            label="Ridge line · afternoon shade"
            src="/images/ridge-line-afternoon.jpg"
            alt="A steep jungle ridge rising behind a narrow shoreline in afternoon shade."
            ratio="fill"
            className="hero-settle"
            sizes="100vw"
            scrim
          />
          </Parallax>
          {/* A bleed panel skips Panel's padding, so this content block carries
              its own — and must carry the rail clearance with it, or it sits
              under the lacquer the way the chapter numerals used to. */}
          <div className="relative px-gutter-sm pb-section-sm ps-rail md:px-gutter md:pb-section">
            <Reveal>
              <Cluster>
                <SplitText as="h2" className="text-heading text-on-media" text="The island has no streetlights, and the owners declined to add any." />
                <p className="mt-cluster-heading text-on-media">
                  Power arrives on a single line from the mainland and goes down
                  often enough that the lamps in each villa were chosen for how
                  they look unlit. The generator runs the kitchen and nothing
                  else.
                </p>
              </Cluster>
            </Reveal>
          </div>
        </Panel>

        {/* pattern: the long multi-beat panel — refs/tandjung-sari §9,
            its 2.20-viewport history-timeline section, ported to 2.25 */}
        <Panel height="long">
          <Cluster eyebrow="A day, in three parts" className="mb-lg">
            <SplitText as="h2" className="text-heading" text="The tide moves four metres here, so the shoreline is a different shape twice a day." />
          </Cluster>

          <div className="beats-row grid gap-3xl md:grid-cols-3 md:gap-xl">
            {TIDE_BEATS.map((beat, i) => (
              <Reveal key={beat.time} index={i} className="beat">
                <Parallax rate={-0.14}>
                <Media
                  label={beat.shot}
                  src={beat.src}
                  alt={beat.alt}
                  ratio="portrait"
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="mx-auto max-h-panel-media"
                />
                </Parallax>
                {/* One grid cell, not two. Previously each paragraph took
                    its own row while the media spanned both, so the time
                    label sat in a 308px-tall row and the beat was 166px
                    taller than its own media — which is what forced the
                    media to be shrunk in the first place. */}
                <div className="beat-caption">
                  <p className="font-sans text-label uppercase text-ink-soft">
                    {beat.time}
                  </p>
                  <p className="mt-cluster-eyebrow">{beat.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Panel>

        {/* pattern: chapter marker — as above */}
        <Panel height="short">
          <Reveal>
            <SplitText as="p" className="font-display text-chapter text-ink-soft" text="19:52" />
          </Reveal>
          <Reveal index={1}>
            <Cluster className="mt-cluster-heading">
              <p className="text-body-lg">
                Sunset is not an event on this coast so much as a change of
                material. The water stops reflecting and starts absorbing, and
                the karsts lose their depth and become flat cut-outs against
                what is left of the light.
              </p>
            </Cluster>
          </Reveal>
        </Panel>

        {/* pattern: split image and text — as above, inverted order so the
            media falls on the opposite side from the earlier split */}
        <Panel height="tall">
          <div className="grid items-center gap-xl md:grid-cols-2 md:gap-3xl">
            <Reveal className="md:order-2">
              <Parallax rate={-0.14}>
              <Media
                label="Shallows after dark · long exposure"
                src="/images/shallows-after-dark.jpg"
                alt="Faint bioluminescence breaking in shallow seawater on a moonless night."
                ratio="portrait"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="mx-auto max-h-panel-media"
              />
              </Parallax>
            </Reveal>
            <Reveal index={1} className="md:order-1">
              <Cluster eyebrow="Below">
                <SplitText as="h2" className="text-heading" text="After dark the water does the lighting, and it does it unreliably." />
                <p className="mt-cluster-heading">
                  For a few weeks around the new moon the plankton in the
                  shallows carry a cold blue light that breaks wherever the
                  surface is disturbed — a foot, an oar, a fish turning. It is
                  what the house is named for. It does not happen on request,
                  and the staff have learned not to promise it.
                </p>
              </Cluster>
            </Reveal>
          </div>
        </Panel>

        {/* pattern: closing bookend that hands off to the next chapter
            — refs/tandjung-sari §9, its `next` panel */}
        <Panel height="bookend" bleed>
          <Parallax rate={-0.06} className="parallax-bleed">
          <Media
            label="Villa interior · lamplight"
            vtName="gate-villas"
            src="/images/villa-interior-lamplight.jpg"
            alt="A timber villa interior at night, lit by a single low lamp."
            ratio="fill"
            className="hero-settle"
            sizes="100vw"
            scrim
          />
          </Parallax>
          {/* The navigation model: chapters hand off through the closing
              bookend, since there is no nav bar (design-system.md §8).
              link-wipe from refs/tandjung-sari §8. */}
          <a href="/villas" className="hero-title block text-center">
            <SplitText as="h2" className="link-wipe inline-block font-display text-display text-on-media" text="The Villas" />
          </a>
        </Panel>
        </Rail>
      </main>

      <SiteChrome />
    </>
  );
}
