/* pattern: the number <-> LABEL eyebrow row — autopsy §10 "Eyebrow row (the
   page's real signature component)", used nine times on the reference.
   A numeral pinned left and a caps label pinned right, sharing one baseline
   across the full column width. design-system §8. */
import { cn } from "@/lib/cn";
import { ScrambleText } from "@/components/ui/scramble-text";

type Props = {
  /** Left side — a numeral, lot code, or short key. */
  lead: React.ReactNode;
  /** Right side — the category label. */
  label: React.ReactNode;
  tone?: "default" | "onDark";
  /** Decode string sides with the reference's text-scramble as the row
   *  enters (autopsy §15.6). Marketing pages only, never the dashboard. */
  scramble?: boolean;
  className?: string;
};

const maybeScramble = (node: React.ReactNode, on: boolean) =>
  on && typeof node === "string" ? <ScrambleText text={node} /> : node;

export function EyebrowRow({
  lead,
  label,
  tone = "default",
  scramble = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 font-mono text-2xs uppercase",
        // 6.39:1 on linen — the reference's equivalent was 3.80:1 and failed
        tone === "onDark" ? "text-text-muted-dark" : "text-text-muted",
        className,
      )}
    >
      <span>{maybeScramble(lead, scramble)}</span>
      <span className="text-right">{maybeScramble(label, scramble)}</span>
    </div>
  );
}
