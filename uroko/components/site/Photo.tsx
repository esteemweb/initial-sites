import Image from "next/image";

export const photos = {
  "ink-water": { w: 1920, h: 1080, alt: "Black ink dispersing in dark water" },
  "studio-night": { w: 1920, h: 1080, alt: "The studio at night: chair, lantern, tools on a cloth" },
  "motomachi-rain": { w: 1920, h: 1080, alt: "Motomachi street at night in the rain" },
  needles: { w: 1200, h: 1500, alt: "A tebori rod and needles on dark cloth" },
  "hand-tebori": { w: 1200, h: 1500, alt: "A gloved hand holding a tebori rod" },
  "brush-drawing": { w: 1200, h: 1500, alt: "A brush drawing a dragon outline on washi paper" },
  "washi-ink": { w: 1200, h: 1500, alt: "Washi paper, an ink stone and a red seal" },
  "back-piece": { w: 1200, h: 1500, alt: "A healed black and grey dragon back piece" },
} as const;

export type PhotoKey = keyof typeof photos;

/** Full-bleed photograph behind a `.photo-stage` section. */
export function PhotoBackdrop({ id, priority = false }: { id: PhotoKey; priority?: boolean }) {
  const p = photos[id];
  return (
    <div className="photo">
      <Image src={`/photos/${id}.webp`} alt="" width={p.w} height={p.h} sizes="100vw" priority={priority} />
    </div>
  );
}

/** Photograph as an object in the layout (cards, chapter visuals). */
export function Photo({ id, className = "", priority = false, sizes = "(min-width: 1024px) 40vw, 100vw" }: { id: PhotoKey; className?: string; priority?: boolean; sizes?: string }) {
  const p = photos[id];
  return (
    <Image
      src={`/photos/${id}.webp`}
      alt={p.alt}
      width={p.w}
      height={p.h}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-cover [filter:brightness(0.85)] ${className}`}
    />
  );
}
