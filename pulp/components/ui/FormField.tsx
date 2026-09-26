import type { InputHTMLAttributes, ReactElement } from "react";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> {
  id: string;
  label: string;
  /** What went wrong and how to fix it. Never an apology, never vague. */
  error?: string;
  /** Shown under the field when there is no error. */
  hint?: string;
  className?: string;
}

/**
 * DESIGN.md §4. Square, 2px ink border, 16px padding, Inter at `base`, with the
 * label above in Space Mono `label` uppercase — everywhere on the site,
 * checkout included (§11).
 *
 * On error the border deliberately stays `ink` rather than turning red: there
 * is no fourth interface colour, and the message below carries the meaning.
 */
export default function FormField({
  id,
  label,
  error,
  hint,
  disabled = false,
  className = "",
  ...rest
}: FormFieldProps): ReactElement {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <label htmlFor={id} className="type-label">
        {label}
      </label>

      <input
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className="type-base w-full border-2 border-ink bg-page p-16 text-ink
          placeholder:text-ink/60 focus:border-rose
          disabled:border-rule disabled:text-ink/60"
        {...rest}
      />

      {error ? (
        <p id={messageId} className="type-base">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="type-base text-ink/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
