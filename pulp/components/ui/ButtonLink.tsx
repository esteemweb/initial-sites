import Link from "next/link";
import type { ComponentProps, ReactElement } from "react";
import { BUTTON_BASE, BUTTON_VARIANTS } from "./Button";

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  className?: string;
}

/**
 * A navigation that looks like a button (DESIGN.md §4).
 *
 * Checkout and "shop everything" go somewhere rather than doing something, so
 * they are links and belong in the tab order as links. The styling comes from
 * the same two constants `Button` uses, so the two cannot drift apart — and
 * there is deliberately no `loading` or `disabled` here, because a link cannot
 * be busy and a disabled link is not a thing.
 */
export default function ButtonLink({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonLinkProps): ReactElement {
  return (
    <Link
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
