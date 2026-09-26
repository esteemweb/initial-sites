"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

/* Inputs — design-system §8: 48px, 8px corners, 1px indigo edge, label
   above; an error is a 2px edge plus a message (there is no fifth colour). */

const INPUT =
  "type-body h-48 w-full rounded-control border border-ink bg-transparent px-16 text-ink placeholder:text-ink aria-invalid:border-2";

export function Field({
  label,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  optional?: string;
  children: (props: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const described = [error && `${id}-err`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-8">
      <label htmlFor={id} className="type-small font-medium">
        {label}
        {optional && <span className="font-regular"> · {optional}</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": described })}
      {hint && (
        <p id={`${id}-hint`} className="type-small text-ink">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="type-small font-medium text-ink">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(INPUT, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={cn(INPUT, "h-auto py-12", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(INPUT, "appearance-auto", props.className)} />;
}

export function Checkbox({
  label,
  error,
  ...rest
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="flex flex-col gap-8">
      <label htmlFor={id} className="flex min-h-48 cursor-pointer items-start gap-12 py-12">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-4 size-16 shrink-0 rounded-control accent-ink"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-err`} className="type-small font-medium text-ink">
          {error}
        </p>
      )}
    </div>
  );
}

/* − n + stepper, 48px targets. */
export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  format = String,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  format?: (n: number) => string;
}) {
  const id = useId();
  const btn =
    "type-md flex size-48 items-center justify-center border border-ink hover:bg-ink hover:text-ground disabled:cursor-not-allowed disabled:border-dashed";
  // one rounded control: outer corners only
  return (
    <div className="flex flex-col gap-8" role="group" aria-labelledby={id}>
      <span id={id} className="type-small font-medium">
        {label}
      </span>
      <div className="flex items-stretch">
        <button type="button" className={cn(btn, "rounded-l-control")} aria-label="−" disabled={value <= min} onClick={() => onChange(value - 1)}>
          −
        </button>
        <output aria-live="polite" className="type-body font-medium tabular-nums flex h-48 min-w-96 items-center justify-center border-y border-ink px-16">
          {format(value)}
        </output>
        <button type="button" className={cn(btn, "rounded-r-control")} aria-label="+" disabled={value >= max} onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </div>
  );
}

/* Choice buttons (radio group look, 48px). */
export function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; note?: string; disabled?: boolean }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className="flex flex-col gap-8">
      <legend className="type-small font-medium mb-8">{label}</legend>
      <div className="flex flex-wrap gap-8">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex min-h-48 cursor-pointer flex-col justify-center rounded-control border px-16 py-8 has-checked:border-ink has-checked:bg-ink has-checked:text-ground has-disabled:cursor-not-allowed has-disabled:border-dashed",
              "border-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              disabled={o.disabled}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="type-small font-medium">{o.label}</span>
            {o.note && <span className="type-small">{o.note}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
