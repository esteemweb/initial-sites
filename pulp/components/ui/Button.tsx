import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import LoadingMark from "@/components/icons/LoadingMark";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary";
  /** Swaps the label for the rotating drum and blocks further presses. */
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

/* DESIGN.md §4. Both types use the `button` type role and 24px/40px padding.
   Focus comes from the global :focus-visible rule — 2px signal, 2px offset —
   so it is identical on both types and cannot be styled away per button. */

/* Shared with ButtonLink, so a navigation styled as a button cannot drift
   from a real one. */
export const BUTTON_BASE =
  "type-button relative inline-flex items-center justify-center px-40 py-24 " +
  "transition-colors active:translate-y-[1px] disabled:pointer-events-none " +
  "disabled:translate-y-0";

export const BUTTON_VARIANTS = {
  // Primary inverts to ink on hover.
  primary: "bg-rose text-page hover:bg-ink",
  // Secondary fills ink with white text on hover.
  secondary:
    "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-page",
} as const;

/* Loading is disabled for input purposes but is not the disabled state: a
   button waiting on a request keeps its fill, or the drum ends up ink on rule
   and the button reads as unavailable rather than busy.

   These **replace** the variant classes rather than being appended after them.
   Appending looks like it should win but does not: `bg-rose` and `bg-rule`
   set the same property, so the winner is whichever Tailwind emits later in the
   stylesheet, not whichever appears later in the class attribute. `bg-rose`
   is emitted later, so a disabled primary rendered at full `signal` — enabled
   to look at, unusable to press. Swapping the whole set removes the conflict.

   Each entry is self-contained for the same reason: the disabled secondary has
   to carry its own `border-2`, since the variant string is no longer there to
   supply it. No hover classes are needed — `disabled:pointer-events-none` in
   the base means hover can never fire. */
const DISABLED = {
  primary: "bg-rule text-ink/60",
  secondary: "border-2 border-rule bg-transparent text-ink/60",
} as const;

export default function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps): ReactElement {
  const showDisabled = disabled && !loading;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${BUTTON_BASE} ${showDisabled ? DISABLED[variant] : BUTTON_VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {/* The label stays in the flow while loading so the button holds its
          width and the page does not reflow under the pointer. */}
      <span className={loading ? "invisible" : undefined}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingMark />
        </span>
      )}
    </button>
  );
}
