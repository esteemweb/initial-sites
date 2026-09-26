import { cn } from "@/lib/cn";

/* Weft-ruled fact list: label left, value right, 1px rule under each row.
   pattern: hairline-separated lists — REFERENCE-AUTOPSY §6. */

export function Facts({
  items,
  dark = false,
  className,
}: {
  items: { label: string; value: string }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <dl className={cn("border-t", dark ? "border-chaux" : "border-ink", className)}>
      {items.map((f) => (
        <div
          key={f.label}
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-24 gap-y-4 border-b py-16",
            dark ? "border-chaux" : "border-ink",
          )}
        >
          <dt className={cn("type-label", dark ? "text-chaux" : "text-ink")}>{f.label}</dt>
          <dd className="type-body font-medium tabular-nums text-right">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
