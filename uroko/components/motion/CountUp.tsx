/** Formerly an animated count-up. Removed in the slop audit: the number is just the number. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  return <span className={`tabular-nums ${className}`}>{value}</span>;
}
