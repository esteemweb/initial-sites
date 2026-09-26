import type { ReactElement } from "react";

interface ProseProps {
  /** Each string is one paragraph. Keeps the copy in data, out of the JSX. */
  paragraphs: string[];
  className?: string;
}

/**
 * A run of body copy at the §3 line-length cap.
 *
 * The three content pages all need the same thing — Inter at `base`, capped by
 * `measure`, 24px between paragraphs — so they share this rather than each
 * rebuilding it slightly differently.
 */
export default function Prose({
  paragraphs,
  className = "",
}: ProseProps): ReactElement {
  return (
    <div className={`flex flex-col gap-24 ${className}`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="type-base measure">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
