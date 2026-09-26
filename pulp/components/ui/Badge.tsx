import type { ReactElement, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * DESIGN.md §4. A conditional overlay, not a structural variant: `signal` fill,
 * white text, Space Mono `label`. It carries no positioning of its own — the
 * surface it sits on places it flush to the corner.
 */
export default function Badge({
  children,
  className = "",
}: BadgeProps): ReactElement {
  return (
    <span className={`type-label bg-rose px-8 py-8 text-page ${className}`}>
      {children}
    </span>
  );
}
