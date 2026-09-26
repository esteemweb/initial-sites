import { cn } from "@/lib/cn";
import { JellyText } from "@/components/ui/jelly-text";

/* The heading cluster — design-system §2, §7:
   warp rule → eyebrow → 12 → heading → 24 → body → 32 → action.
   pattern: eyebrow/heading/paragraph/link — REFERENCE-AUTOPSY §3.5,
   left-aligned (the reference centres it). The warp rule sits on the column
   line instead of the reference's centred thread (§2.3, signature). */

type Size = "display" | "h1" | "h2" | "h3";
const SIZE: Record<Size, string> = {
  display: "type-display",
  h1: "type-xl",
  h2: "type-lg",
  h3: "type-md",
};

export function Cluster({
  eyebrow,
  title,
  as = "h2",
  size = "h2",
  id,
  warp = true,
  dark = false,
  children,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  as?: "h1" | "h2" | "h3";
  size?: Size;
  id?: string;
  warp?: boolean;
  dark?: boolean;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const Heading = as;
  return (
    <div className={cn("flex flex-col", className)}>
      {warp && <span aria-hidden className="warp-rule mb-24" />}
      {eyebrow && (
        <p className={cn("type-label mb-12", dark ? "text-chaux" : "text-ink")}>
          {eyebrow}
        </p>
      )}
      <Heading id={id} className={SIZE[size]}>
        <JellyText text={title} />
      </Heading>
      {children && (
        <div
          className={cn(
            "mt-24 flex max-w-prose flex-col gap-16",
            dark ? "text-chaux" : "text-ink",
          )}
        >
          {children}
        </div>
      )}
      {action && <div className="mt-32 flex flex-wrap items-center gap-24">{action}</div>}
    </div>
  );
}
