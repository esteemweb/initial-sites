import Link from "next/link";
import type { ComponentProps, ReactElement } from "react";

interface TextLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  className?: string;
}

/**
 * DESIGN.md §4. Not a button: Inter, sentence case, `base`, no padding, a 1px
 * underline at 2px offset, turning `signal` on hover. The underline is always
 * present, so the link is identifiable without hover.
 */
export default function TextLink({
  children,
  className = "",
  ...rest
}: TextLinkProps): ReactElement {
  return (
    <Link
      className={`type-base underline decoration-1 underline-offset-2 transition-colors hover:text-rose ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
