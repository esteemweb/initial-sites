import type { ElementType, HTMLAttributes, ReactNode } from "react";

/* design-system §Grid: 12 columns, 20px gutter, 20px outer margin, no
   max-width. Text edges only land on column starts. */
export function Grid({
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`grid-page ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
