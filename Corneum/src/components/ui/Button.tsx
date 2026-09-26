import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

/* design-system §Components/Button: the only two variants. Pill, 48px tall
   minimum (touch target), type-body. Hover is opacity only; no colour change,
   no accent. The secondary border is solid ink because the hairline (1.32:1)
   fails the 3:1 non-text contrast rule for a component boundary. */

export type ButtonVariant = "primary" | "secondary";
export type ButtonState = "default" | "disabled" | "loading" | "error";

type Common = {
  variant?: ButtonVariant;
  state?: ButtonState;
  /** Shown in place of the label while loading. Mono, uppercase. */
  loadingLabel?: string;
  /** Required when state is "error": says what went wrong, in words. */
  errorMessage?: string;
  /** Styleguide only: renders a pseudo-state without the pointer. */
  preview?: "hover" | "active" | "focus";
  children: ReactNode;
};

type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "children">;
type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "children" | "href">;

const base =
  "relative inline-grid min-h-48 items-center justify-items-center rounded-pill px-24 type-body " +
  "transition-opacity duration-160 ease-enter select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper",
  secondary: "bg-paper text-ink border border-ink",
};

const live = "cursor-pointer hover:opacity-72 active:opacity-60 data-hover:opacity-72 data-active:opacity-60";
const disabled = "cursor-not-allowed bg-paper text-ink-muted border border-hairline hover:opacity-100";

export function Button(props: AsButton | AsLink) {
  const {
    variant = "primary",
    state = "default",
    loadingLabel = "Working…",
    errorMessage,
    preview,
    children,
    className = "",
    ...rest
  } = props;

  const isDisabled = state === "disabled";
  const isLoading = state === "loading";
  const isError = state === "error";
  const id = useId();
  const errorId = isError ? `${id}-error` : undefined;

  const cls = [base, isDisabled ? disabled : `${variants[variant]} ${live}`, className].join(" ");
  const previewAttrs = preview ? { [`data-${preview}`]: "" } : {};

  /* Both labels share one grid cell, so the button keeps the width of the
     longer one and the layout never jumps when the label swaps. */
  const label = (
    <>
      <span className={`col-start-1 row-start-1 ${isLoading ? "invisible" : ""}`}>
        {isError ? "Try again" : children}
      </span>
      <span
        className={`col-start-1 row-start-1 type-data ${isLoading ? "" : "invisible"}`}
        aria-hidden={!isLoading}
      >
        {loadingLabel}
      </span>
    </>
  );

  const stateAttrs = {
    "aria-disabled": isDisabled || isLoading || undefined,
    "aria-busy": isLoading || undefined,
    "aria-describedby": errorId ?? (rest as { "aria-describedby"?: string })["aria-describedby"],
    ...previewAttrs,
  };

  const control =
    "href" in rest && rest.href !== undefined ? (
      <a
        {...(rest as ComponentPropsWithoutRef<"a">)}
        href={isDisabled ? undefined : rest.href}
        /* A disabled link has no href, which would drop it from the
           accessibility tree; keep it focusable and announced as a
           disabled link so its reason (aria-describedby) is reachable. */
        role={isDisabled ? "link" : undefined}
        tabIndex={isDisabled ? 0 : undefined}
        className={cls}
        {...stateAttrs}
      >
        {label}
      </a>
    ) : (
      <button
        type="button"
        {...(rest as ComponentPropsWithoutRef<"button">)}
        onClick={isDisabled || isLoading ? undefined : (rest as ComponentPropsWithoutRef<"button">).onClick}
        className={cls}
        {...stateAttrs}
      >
        {label}
      </button>
    );

  if (!isError) return control;

  return (
    <span className="inline-flex flex-col items-start gap-8">
      {control}
      <span id={errorId} className="type-data" role="alert">
        Error — {errorMessage ?? "something went wrong"}
      </span>
    </span>
  );
}
