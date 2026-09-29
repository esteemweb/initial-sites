import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "seal";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-150 ease-standard disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-text text-surface hover:bg-shu hover:text-shu-fg",
  secondary: "border border-line text-text hover:border-text hover:bg-surface-deep",
  ghost: "text-text underline-offset-4 hover:underline",
  seal: "bg-shu text-shu-fg hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6",
  sm: "h-10 px-4",
};

type Common = { variant?: Variant; size?: Size; className?: string };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
