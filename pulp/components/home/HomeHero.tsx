import type { ReactElement } from "react";
import SignatureLine from "@/components/brand/SignatureLine";
import Wordmark from "@/components/brand/Wordmark";

/**
 * The homepage hero (DESIGN.md §5, §9).
 *
 * The wordmark is the dominant element and it is type, not a mark — Bricolage
 * Grotesque 800 at `display`, on one line.
 *
 * Four characters is well inside the seven §3 allows at this size, so unlike
 * the name this brand replaced it needs no forced break and comes nowhere near
 * the gutters at any width. §3 still switches `display` at 1174 rather than
 * 1024, because that threshold protects the *rule* — a seven-character word at
 * 200px does not fit a 1024px viewport — not this particular word.
 *
 * The signature line steps down sharply to `lg`. It cannot take `display`: §3
 * exempts it from the six-word cap but not from the seven-character rule, and
 * "colours" is seven with a full stop after it.
 *
 * Behind the type, the one ambient film §9 permits: a 15-second locked-off
 * overhead of garments being printed and folded on the same graph paper the
 * rest of the site is drawn on, cut so its last frame is its first. It was
 * generated with the empty sheet pinned as both start and end frame, so the
 * loop is exact rather than approximate. The film keeps its left third calm;
 * that is where the type sits at every width.
 *
 * Three states, no JavaScript:
 *   - playing: the `<video>`, muted, looping, inline
 *   - buffering: the browser shows the `poster`, the film's own first frame
 *   - reduced motion: the `<video>` is hidden and a plain `<img>` of that same
 *     frame stands in — the static equivalent §9 requires, and because the
 *     first frame *is* the empty sheet, it is also exactly what the section
 *     looks like between garments
 *
 * The section's own plotted-sheet ground stays underneath all three, so
 * nothing ever flashes bare paper while an asset is on its way.
 */
export default function HomeHero(): ReactElement {
  return (
    /* Full-bleed: a ground that stops at the 1200px edge reads as a stray
       block rather than as the sheet the page is printed on. */
    <section className="wash-rose plotted-sheet relative overflow-hidden border-b-2 border-ink">
      <video
        className="film-shift absolute inset-0 object-cover motion-reduce:hidden"
        src="/hero/hero-loop.mp4"
        poster="/hero/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- a fixed
          full-bleed frame behind type; next/image's sizing and lazy loading
          would fight `object-cover` for no gain on a single above-the-fold
          asset that is already the video's poster. */}
      <img
        className="film-shift absolute inset-0 hidden object-cover motion-reduce:block"
        src="/hero/hero-poster.jpg"
        alt=""
        aria-hidden="true"
      />

      {/* Two columns from `desktop`, and the type takes only the first. The
          film composes its garments into the right half of the frame, so the
          type must stay out of it: at 1536px an unconstrained signature line
          reaches 55% of the viewport, straight across a black hoodie. Half of
          the 1200px shell ends at 760, short of the 768 midpoint. Below
          `desktop` the film is cropped hard by `object-cover` and the type
          runs the full width as before. */}
      <div className="shell viewport-hero relative grid py-40 desktop:grid-cols-2 desktop:py-48">
        <div className="flex flex-col justify-between">
          {/* Set like the top line of a garment label. */}
          <p className="type-label">
            Small-run printed clothing &middot; Made in Portugal
          </p>

          <Wordmark as="h1" className="type-display my-40" />

          <SignatureLine className="type-lg measure" />
        </div>
      </div>
    </section>
  );
}
