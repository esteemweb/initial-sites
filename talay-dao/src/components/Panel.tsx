/* The panel primitive — design-system.md §1 and §7.

   The vertical port of the reference's variable-width filmstrip. What
   transfers is the RULE, not the direction: only the opening and closing
   panels are exactly one viewport; every panel between is deliberately
   NOT one viewport. That is what produces the reference's pacing.
   pattern: variable panel rhythm with exact-1.00 bookends
            — refs/tandjung-sari §2, vertical port (not their horizontal track) */

type Height = "bookend" | "short" | "base" | "tall" | "long";

const HEIGHT_CLASS: Record<Height, string> = {
  bookend: "h-panel-bookend",
  short: "h-panel-short",
  base: "h-panel-base",
  tall: "h-panel-tall",
  long: "h-panel-long",
};

export function Panel({
  height = "base",
  bleed = false,
  className = "",
  children,
  ...rest
}: {
  height?: Height;
  /** Full-bleed media panels skip the section padding */
  bleed?: boolean;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"section">, "className" | "children">) {
  return (
    <section
      className={[
        /* overflow-hidden is load-bearing: parallax-bleed is deliberately
           oversized (inset:-10%) so travel never exposes a gap, and in a
           horizontal track that spill would otherwise land on top of the
           neighbouring panel's text. Clip it to its own panel. */
        "relative flex w-full flex-col justify-center overflow-hidden",
        /* `panel-*` carries the horizontal rhythm when the rail is on;
           `h-panel-*` carries the vertical one when it is off. */
        `panel-${height}`,
        HEIGHT_CLASS[height],
        /* ps-rail is NOT md-only. Below 48rem the panels used to fall back
           to a flat gutter and their content ran under the fixed rail, which
           only became visible once the rail stopped being transparent. */
        bleed ? "" : "py-section-sm px-gutter-sm md:py-section md:px-gutter ps-rail",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </section>
  );
}

/* The heading cluster — design-system.md §2.
   The eyebrow carries `rule-mark`, the ~69x1px ornamental hairline the
   reference places beside its headings (refs/tandjung-sari §6). Recorded in
   the autopsy, missing from the first build.
   One repeating rhythm (16 / 24 / 32), which the reference lacks: it
   composes every panel individually and its measured gaps (14.1 / 31.6 /
   88.4 / 98.1px) form no scale. */
export function Cluster({
  eyebrow,
  children,
  className = "",
}: {
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-measure ${className}`}>
      {eyebrow ? (
        <p className="rule-mark mb-cluster-eyebrow font-sans text-label uppercase text-ink-soft">
          {eyebrow}
        </p>
      ) : null}
      {children}
    </div>
  );
}
