import type { ElementType, ReactNode } from "react";

/**
 * Formerly a staggered scroll reveal. Removed in the slop audit: text is
 * simply present. Kept as a thin wrapper so call sites stay readable.
 */
export function Reveal({
  as: Tag = "div",
  children,
  words,
  className = "",
  ...rest
}: {
  as?: ElementType;
  children?: ReactNode;
  words?: string;
  className?: string;
  delay?: number;
  [key: string]: unknown;
}) {
  delete (rest as { delay?: number }).delay;
  return (
    <Tag className={className} {...rest}>
      {words ?? children}
    </Tag>
  );
}
