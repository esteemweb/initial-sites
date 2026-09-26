import Image from "next/image";
import { PHOTOS, type Aspect, type PhotoKey } from "@/content/images";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* Photography — design-system §5, amended 25 Sep 2026 (user: "bring them in
   some order or discipline… they should be interactive").

   Three frames, and only three: every portrait photograph is shown at 4:5,
   the one landscape (the view) at 3:2, the plates at 1:1. The frame is fixed
   and the photograph is cropped into it (object-fit: cover), so two photos
   side by side are always exactly the same size. 12px corners, no shadow, no
   text over images.

   Interactive: the frame is a button. Hover or focus eases the photograph in
   (105%, 600ms) and draws a gold edge; click or Enter opens it full screen in
   the lightbox (src/components/ui/lightbox.tsx), which finds every photo on
   the page through `data-lightbox`. Inside a link (the room list) pass
   `interactive={false}`: the zoom follows the link's hover instead. */

export type Frame = "portrait" | "landscape" | "square";

const FRAME: Record<Frame, string> = {
  portrait: "aspect-portrait",
  landscape: "aspect-landscape",
  square: "aspect-square",
};

export function frameOf(aspect: Aspect): Frame {
  if (aspect === "landscape") return "landscape";
  if (aspect === "square") return "square";
  return "portrait"; // window 1:2, tall 2:3 and portrait 4:5 all show at 4:5
}

const ENLARGE = { fr: "Agrandir la photo", en: "Enlarge photo" };

export function Photo({
  id,
  lang,
  sizes = "(min-width: 64rem) 40vw, 60vw",
  priority = false,
  interactive = true,
  frame: forced,
  className,
}: {
  id: PhotoKey;
  lang: Lang;
  sizes?: string;
  priority?: boolean;
  interactive?: boolean;
  /** Pairs force both photos into the same frame (a plate beside a portrait). */
  frame?: Frame;
  className?: string;
}) {
  const p = PHOTOS[id];
  const frame = forced ?? frameOf(p.aspect);
  const img = (
    <Image
      src={p.src}
      width={p.width}
      height={p.height}
      alt={p.alt[lang]}
      sizes={sizes}
      priority={priority}
      className={cn(
        "size-full object-cover transition-transform duration-(--duration-slow) ease-standard",
        interactive ? "group-hover/photo:scale-105 group-focus-visible/photo:scale-105" : "group-hover:scale-105",
      )}
    />
  );

  if (!interactive) {
    return <div className={cn("relative block w-full overflow-hidden rounded-image bg-ground", FRAME[frame], className)}>{img}</div>;
  }

  return (
    <button
      type="button"
      data-lightbox
      data-src={p.src}
      data-alt={p.alt[lang]}
      data-frame={frame}
      aria-haspopup="dialog"
      aria-label={`${ENLARGE[lang]} : ${p.alt[lang]}`}
      className={cn(
        "group/photo relative block w-full cursor-zoom-in overflow-hidden rounded-image bg-ground",
        FRAME[frame],
        className,
      )}
    >
      {img}
      {/* the gold edge: drawn inside the frame so nothing shifts */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-image border-2 border-or opacity-0 transition-opacity duration-(--duration-base) ease-standard group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100"
      />
      {/* the enlarge glyph, bottom right: a mark, so it is gold */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-12 right-12 flex size-32 items-center justify-center rounded-full bg-ground opacity-0 transition-opacity duration-(--duration-base) ease-standard group-hover/photo:opacity-100 group-focus-visible/photo:opacity-100"
      >
        <svg viewBox="0 0 16 16" className="size-16 stroke-mark" fill="none" strokeWidth="1.25">
          <path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" />
        </svg>
      </span>
    </button>
  );
}
