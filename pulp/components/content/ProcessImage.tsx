import type { ReactElement } from "react";

interface ProcessImageProps {
  /** What the photograph will show. Also the alt text when it lands. */
  caption: string;
  /** Tailwind aspect class. 16:9 for campaign frames, 1:1 for detail macros. */
  ratio?: string;
  className?: string;
}

/**
 * A placeholder for process photography — the mill, the machines, the make.
 *
 * Deliberately **`signal`, not `wash`**. The `wash` boxes elsewhere stand in for
 * product shots, which stay full colour (§10). These stand in for campaign
 * imagery, which gets the hard `ink`-and-`signal` duotone, so the placeholder
 * carries the endpoint of that treatment rather than looking like a product
 * frame that somebody forgot to fill.
 *
 * The caption is the brief for the shot and becomes the alt text when the real
 * image arrives, so the description is written once and never has to be
 * invented again at the point of substitution.
 */
export default function ProcessImage({
  caption,
  ratio = "aspect-[16/9]",
  className = "",
}: ProcessImageProps): ReactElement {
  return (
    <figure className={className}>
      <div className={`relative w-full bg-rose ${ratio}`}>
        <span className="type-label absolute left-24 top-24 text-page">
          Duotone
        </span>
      </div>
      <figcaption className="type-label measure mt-16">{caption}</figcaption>
    </figure>
  );
}
