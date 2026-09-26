import Link from "next/link";
import type { ComponentProps, ReactElement } from "react";

interface NavLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  current?: boolean;
  children: string;
}

/**
 * A primary-nav link with the roll-over (DESIGN.md §9, "the header").
 *
 * Two copies of the label stacked in a box exactly one line tall, clipped.
 * Hover or focus slides the stack up one line in 200ms, so the resting copy
 * leaves through the top as the `rose` copy arrives from below — a sheet
 * feeding through the press. The rest state is the same underlined text link
 * as everywhere else, so the link is identifiable and tappable with no hover
 * at all (§7).
 *
 * The current route sits in `rose` at rest and does not roll: it has nowhere
 * to go.
 *
 * Reduced motion: the stack never moves and the incoming copy is not rendered,
 * so the link falls back to the plain colour change every text link already
 * has. The second copy is `aria-hidden`, so the label is read once.
 */
export default function NavLink({
  current = false,
  children,
  ...rest
}: NavLinkProps): ReactElement {
  const base =
    "group relative inline-block overflow-hidden type-base underline decoration-1 underline-offset-2 transition-colors";
  const tone = current ? "text-rose" : "hover:text-rose";
  const roll = current
    ? ""
    : "group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:translate-y-0";

  return (
    <Link
      aria-current={current ? "page" : undefined}
      className={base + " " + tone}
      {...rest}
    >
      <span className={"press-roll block " + roll}>{children}</span>
      {!current && (
        <span
          aria-hidden="true"
          className="press-roll absolute inset-0 block translate-y-full text-rose group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:hidden"
        >
          {children}
        </span>
      )}
    </Link>
  );
}
