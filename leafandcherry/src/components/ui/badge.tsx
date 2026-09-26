/* pattern: the roastery badge pill — autopsy §10 "Badge / pill (header CTA)",
   design-system §8 "Roastery badge pill".
   Square, amber fill, 1px ink border, mono uppercase label. The asymmetric
   padding (1px more top than bottom) is the reference's optical-centring trick
   for a cap-height-only label. */
import { cn } from "@/lib/cn";

type Tone = "default" | "onDark";
type Status = "active" | "pending" | "paused";

const tones: Record<Tone, string> = {
  // ink on amber = 11.40:1
  default: "bg-amber text-text border-text",
  // amber on roast = 8.61:1 — cherry would be 2.11:1 here, so it is not an option
  onDark: "bg-surface-roast text-amber border-amber",
};

/* Colour is never the only signal — a status badge also carries a dot,
   and the label itself states the status. */
const statusDot: Record<Status, string> = {
  active: "bg-leaf",
  pending: "bg-amber-ink",
  paused: "bg-accent",
};

type Props = {
  tone?: Tone;
  status?: Status;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ tone = "default", status, className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-none border font-mono text-2xs uppercase",
        // asymmetric on purpose: more above than below, optically centring a
        // cap-height-only label. The reference used 8px/7px at a larger size.
        "px-3 pt-1.5 pb-1",
        tones[tone],
        className,
      )}
    >
      {status ? (
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", statusDot[status])}
        />
      ) : null}
      {children}
    </span>
  );
}
