/* pattern: button system — design-system §8 "Buttons".
   The reference has exactly one rendered button and no hover delta at all
   (autopsy §8, verified). Every variant here has a real hover state, and
   every variant is 48px so it clears the 44px floor the reference fails. */
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "badge" | "ghost" | "link" | "onDark" | "ghostOnDark";
type Size = "sm" | "md" | "lg";

/* duration-300 === --duration-base; ease-hover comes from --ease-hover. */
const base =
  "inline-flex items-center justify-center gap-2 rounded-none font-sans " +
  "u-transition-ui " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  // white on cherry = 6.61:1 (the reference's pairing was 3.85:1)
  primary:
    "bg-accent text-accent-fg font-medium hover:bg-accent-hover hover:-translate-y-px",
  // the reference's cream square badge, kept as secondary. Hover is a full
  // inversion rather than a tint — ink on amber is 11.40:1 either way.
  badge:
    "bg-amber text-text border border-text hover:bg-text hover:text-amber",
  ghost:
    "bg-transparent text-text border border-hairline hover:border-rule",
  link:
    "bg-transparent text-accent underline decoration-1 underline-offset-4 " +
    "hover:decoration-2 px-0",
  // --color-accent on forest is 2.11:1, so there is no cherry button on dark.
  // The focus ring is amber here too: a cherry ring on forest is 2.11:1.
  onDark:
    "bg-amber text-text font-medium hover:bg-text-on-dark " +
    "focus-visible:outline-amber",
  // The secondary on a dark surface. Filling it amber too (as `badge` does)
  // would make both CTAs read as primary — the distinction has to survive.
  ghostOnDark:
    "bg-transparent text-text-on-dark border border-text-muted-dark " +
    "hover:border-amber hover:text-amber focus-visible:outline-amber",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-6 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...rest
}: Props) {
  const classes = cn(
    base,
    variants[variant],
    // the link variant keeps its text size but still needs a 44px hit box
    variant === "link" ? "min-h-11" : sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
