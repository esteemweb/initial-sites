import { getImageProps } from "next/image";
import { site } from "@/lib/content/site";
import { HeroInk } from "./HeroInk";

/**
 * Home hero, back to front:
 *   1. dark water: a drop of indigo ink spreads into the uroko (fish-scale) pattern (HeroInk)
 *   2. the studio name in the Mincho serif
 *   3. the tattooed man, cut out (scripts/hero-cutout.mjs), so his head sits in front of the name
 * His original painted backdrop is gone: the ink scene is his background. The 3D scale mark
 * (Emblem3D) floats small above him and grows as you scroll. Phones get a tall crop of the same
 * frame (art direction via <picture>). Restored at the user's request on 2026-09-29.
 */
const alt = "A man in a traditional Japanese body suit stands with his eyes closed in dark water and ink.";

export function Hero() {
  const common = { alt, sizes: "100vw", quality: 75 };
  const desktop = getImageProps({ ...common, src: "/photos/hero/figure-wide.webp", width: 2560, height: 1429 }).props.srcSet;
  const { srcSet: mobile, ...rest } = getImageProps({
    ...common,
    src: "/photos/hero/figure-tall.webp",
    width: 1200,
    height: 2286,
    fetchPriority: "high",
    loading: "eager",
  }).props;

  return (
    <section data-hero className="relative h-[100svh] overflow-hidden bg-ink">
      <HeroInk />

      <h1 className="hero-masthead font-masthead text-masthead uppercase text-paper">{site.name}</h1>

      <picture className="hero-stage">
        <source media="(min-width: 1024px)" srcSet={desktop} />
        <source srcSet={mobile} />
        <img {...rest} alt={alt} />
      </picture>

      <div className="hero-shade" aria-hidden="true" />

      <p
        lang="ja"
        aria-hidden="true"
        className="tategaki absolute left-12 top-1/2 hidden -translate-y-1/2 font-display text-2xl leading-[1.3] text-paper/70 lg:block"
      >
        横浜元町の彫師
      </p>

      <div className="absolute inset-x-5 bottom-24 grid gap-6 sm:inset-x-8 lg:inset-x-12 lg:bottom-24 lg:grid-cols-12 lg:items-end">
        <p className="max-w-xs text-base text-paper/85 lg:col-span-4">
          A small tattoo studio above Motomachi street in Yokohama. Traditional Japanese work, by hand and by machine.
        </p>
        <ul className="hidden text-sm leading-relaxed text-paper/70 lg:col-span-3 lg:col-start-10 lg:block lg:text-right">
          <li>Tebori, by hand</li>
          <li>Machine work</li>
          <li>Body suits and back pieces</li>
        </ul>
      </div>
    </section>
  );
}
