import type { Metadata } from "next";
import { Panel, Cluster } from "@/components/Panel";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { SplitText } from "@/components/SplitText";
import { Parallax } from "@/components/Parallax";
import { Rail } from "@/components/Rail";
import { SiteChrome } from "@/components/SiteChrome";
import { RadialCarousel } from "@/components/RadialCarousel";
import { GALLERY } from "@/content/gallery";

/* Gallery — the third chapter.

   `/gallery` is one of the routes the reference's nav names and that this
   build had never made. The radial carousel gets a real home rather than
   being parked in a demo page. */

export const metadata: Metadata = {
  title: "Gallery — Talay Dao",
  description:
    "Rooms, water, weather and light at a twelve-villa sanctuary on Koh Yao Noi.",
};

export default function Gallery() {
  return (
    <>
      <main id="main">
        <Rail>
          {/* pattern: full-bleed hero, title low in frame at 80% with a
              bottom-weighted scrim — refs/tandjung-sari §10 */}
          <Panel height="bookend" bleed>
            <Parallax rate={-0.06} className="parallax-bleed">
              <Media
                label="Ridge line · afternoon shade"
                vtName="gate-gallery"
                src="/images/ridge-line-afternoon.jpg"
                alt="A steep jungle ridge rising behind a narrow shoreline in afternoon shade."
                ratio="fill"
                className="hero-settle"
                sizes="100vw"
                priority
                scrim
              />
            </Parallax>
            <SplitText
              as="h1"
              className="hero-title text-center font-display text-display text-on-media"
              text="Gallery"
            />
          </Panel>

          {/* pattern: chapter marker as an oversized single typographic
              element — refs/tandjung-sari §9 */}
          <Panel height="short">
            <Reveal>
              <SplitText
                as="p"
                className="font-display text-chapter text-ink-soft"
                text="Ten"
              />
            </Reveal>
            <Reveal index={1}>
              <Cluster className="mt-cluster-heading">
                <p className="text-body-lg">
                  Nothing here was styled for a camera. The rooms are
                  photographed as they are left, which is why the linen is
                  creased and the brass has gone green, and why the same
                  doorway looks like two different places depending on the
                  hour.
                </p>
              </Cluster>
            </Reveal>
          </Panel>

          {/* pattern: user-supplied radial carousel — restyled to the system
              (zero radius, hairline borders, no shadow); motion untouched */}
          <Panel height="tall" className="panel-carousel">
            <Cluster eyebrow="Drag to turn" className="mb-xl">
              <h2 className="text-heading">
                Ten frames, arranged in a ring. Drag it round and open any one
                of them.
              </h2>
            </Cluster>
            <RadialCarousel items={GALLERY} />
          </Panel>

          {/* pattern: closing bookend handing off to the next chapter
              — refs/tandjung-sari §9, its `next` panel */}
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
                scrim
              />
            </Parallax>
            <a href="/" className="hero-title block text-center">
              <h2 className="link-wipe inline-block font-display text-display text-on-media">
                Our Story
              </h2>
            </a>
          </Panel>
        </Rail>
      </main>

      <SiteChrome />
    </>
  );
}
