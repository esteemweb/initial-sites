import Image from "next/image";

/* Media slot — design-system.md §8.

   One component, two states, IDENTICAL box:
   - `src` given  -> renders the photograph
   - `src` absent -> renders the labelled placeholder field

   That is the point of §8: the placeholder holds the exact final box, so
   swapping a photograph in never moves layout. Keeping both paths in one
   component is what makes that promise hold — a slot with no asset yet
   still reserves the right space.

   Scrim and wash layer OVER whichever state is showing, so the day/night
   transition behaves the same either way.
   pattern: full-bleed media with bottom-weighted scrim — refs/tandjung-sari §7 */

type Ratio = "hero" | "panel" | "portrait" | "square" | "fill";

/* `fill` positions the element absolutely, so it must NOT also carry
   `relative` — both would be emitted and the cascade, not the class order,
   would decide. Position and ratio are chosen together for that reason. */
const RATIO_CLASS: Record<Ratio, string> = {
  hero: "relative aspect-hero",
  panel: "relative aspect-panel",
  portrait: "relative aspect-portrait",
  square: "relative aspect-square",
  fill: "absolute inset-0",
};

const RATIO_LABEL: Record<Ratio, string> = {
  hero: "2.52:1",
  panel: "16:9",
  portrait: "3:4",
  square: "1:1",
  fill: "FILL",
};

export function Media({
  label,
  vtName,
  src,
  alt,
  sizes = "100vw",
  priority = false,
  ratio = "panel",
  scrim = false,
  wash = true,
  className = "",
}: {
  /** What the finished shot is, e.g. "Villa terrace · morning". Used for the
   *  placeholder field when no `src` exists yet. */
  label: string;
  /** Shared view-transition name. Set on the bookend media of one chapter
   *  and the hero media of the next: the browser pairs the two ACROSS
   *  documents, so the gate morphs instead of cutting. Must be unique
   *  within each document. */
  vtName?: string;
  /** Path under /public. Omit to render the placeholder instead. */
  src?: string;
  /** Required whenever `src` is set — a real description, not the label. */
  alt?: string;
  /** Tells next/image which srcset entry to pick. Must match the slot's
   *  real rendered width or the browser over-downloads. */
  sizes?: string;
  /** Only the above-the-fold hero should set this. */
  priority?: boolean;
  ratio?: Ratio;
  /** Bottom-weighted black scrim — required wherever text sits over media */
  scrim?: boolean;
  /** The day/night colour wash */
  wash?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`isolate overflow-hidden bg-placeholder ${RATIO_CLASS[ratio]} ${className}`}
      style={vtName ? { viewTransitionName: vtName } : undefined}
    >
      {src ? (
        /* `fill` rather than width/height: the box is already fixed by the
           ratio token above, so the image inherits it and cannot shift
           layout. object-cover crops, matching the reference's treatment. */
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        /* Fallback: the labelled field. Same box, no layout difference. */
        <div className="absolute inset-0 grid place-items-center border border-hairline">
          <span className="px-gutter-sm text-center font-sans text-label uppercase text-placeholder-ink">
            {label}
            <span aria-hidden="true"> · {RATIO_LABEL[ratio]}</span>
          </span>
        </div>
      )}

      {/* TAKEN — refs/tandjung-sari §7: the reference's overlay-solid layer,
          which it ships and never animates. Animating it is the concept. */}
      {wash ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-wash"
          style={{ backgroundColor: "var(--wash)" }}
        />
      ) : null}

      {/* TAKEN — refs/tandjung-sari §7: bottom-weighted scrim, transparent
          at top to opaque at bottom. This is why text-over-image passes
          contrast on the reference (19.50:1). Systematic, not per-image. */}
      {scrim ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "var(--scrim-media)" }}
        />
      ) : null}
    </div>
  );
}
