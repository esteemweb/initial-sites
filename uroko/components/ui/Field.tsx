import type { ComponentProps, ReactNode } from "react";

const control =
  "h-12 w-full border-b border-line bg-surface-raised px-3 text-base outline-none placeholder:text-text-muted/70 focus:border-shu aria-[invalid=true]:border-err";

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-err" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ error, hint, className = "", ...props }: ComponentProps<"input"> & { error?: string; hint?: string }) {
  return (
    <input
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
      className={`${control} ${className}`}
      {...props}
    />
  );
}

export function Select({ error, className = "", children, ...props }: ComponentProps<"select"> & { error?: string }) {
  return (
    <select
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={`${control} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%2316140f%22 stroke-width=%221.5%22/></svg>')] bg-[length:12px_8px] bg-[position:right_0.75rem_center] bg-no-repeat pr-8 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, className = "", ...props }: ComponentProps<"textarea"> & { error?: string }) {
  return (
    <textarea
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={`${control} h-32 resize-y py-3 ${className}`}
      {...props}
    />
  );
}
