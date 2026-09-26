import Link from "next/link";
import { cn } from "@/lib/cn";

/* Buttons — design-system §8. 8px corners. Hovers invert: there is no fifth
   colour to darken to. Disabled is a dashed outline, never a faded tint.

   accent — the one gold button: or fill, indigo label (6.38:1), Instrument
   Serif at `md` (24 / 20). Gold on the lacquer ground is 3.39:1, above the
   3:1 a control's edge needs. */

export type Variant = "accent" | "primary" | "secondary" | "on-dark" | "text";

const BASE =
  "inline-flex items-center justify-center gap-8 no-underline transition-colors duration-(--duration-fast) ease-standard disabled:cursor-not-allowed disabled:border-dashed disabled:border-ink disabled:bg-transparent disabled:text-ink";

const VARIANT: Record<Variant, string> = {
  accent: "type-md h-56 px-24 rounded-control border border-or bg-or text-indigo hover:border-ink hover:bg-ink hover:text-ground",
  primary: "type-small font-medium h-48 px-24 rounded-control border border-ink bg-ink text-ground hover:bg-ground hover:text-ink",
  secondary: "type-small font-medium h-48 px-24 rounded-control border border-ink text-ink hover:bg-ink hover:text-ground",
  "on-dark": "type-small font-medium h-48 px-24 rounded-control border border-chaux bg-chaux text-indigo hover:bg-indigo hover:text-chaux",
  text: "type-small font-medium underline underline-offset-4 decoration-1 hover:decoration-2",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cn(BASE, VARIANT[variant], className);
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: { variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />;
}

/* The one glyph set: 16px strokes in the block's mark colour — gold on the
   ground and on the indigo band (§4). */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className={cn("size-16 shrink-0 stroke-mark", className)}
      fill="none"
      strokeWidth="1.25"
    >
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  );
}
