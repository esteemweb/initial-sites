import { useId, type InputHTMLAttributes } from "react";

/* design-system §Components/TextField: label above in type-data at 0.6,
   a 48px pill input with a 1px ink border (the hairline fails 3:1 for a
   control boundary), type-body text. Radius is the system's "999 on
   anything tappable".
   States: default, hover (border stays ink; field is the target, no
   opacity change so typed text stays full contrast), focus (ink ring),
   filled, disabled (hairline border, muted text), error (message below
   with an ERROR — prefix, aria-invalid, aria-describedby). */
export function TextField({
  label,
  error,
  hint,
  optional = false,
  className = "",
  ...input
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">) {
  const autoId = useId();
  const id = input.id ?? autoId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`grid content-start gap-8 ${className}`}>
      <label htmlFor={id} className="type-data text-ink-muted">
        {label}
        {optional && " (optional)"}
      </label>
      <input
        required={!optional}
        {...input}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="type-body h-48 w-full rounded-pill border border-ink bg-paper px-24 text-ink placeholder:text-ink-muted disabled:cursor-not-allowed disabled:border-hairline disabled:text-ink-muted aria-invalid:border-2"
      />
      {hint && !error && (
        <p id={hintId} className="type-data text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="type-data">
          Error — {error}
        </p>
      )}
    </div>
  );
}
