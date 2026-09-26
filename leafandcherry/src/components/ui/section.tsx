/* pattern: full-bleed section with a viewport gutter — autopsy §2
   ("no max-width container; content anchored to a ~2% gutter"),
   design-system §1. Section padding 128/64 = 2:1, design-system §2. */
import { cn } from "@/lib/cn";

type Tone = "linen" | "raised" | "forest" | "roast";

const tones: Record<Tone, string> = {
  linen: "bg-surface text-text",
  raised: "bg-surface-raised text-text",
  forest: "bg-surface-forest text-text-on-dark",
  roast: "bg-surface-roast text-text-on-dark",
};

type Props = {
  tone?: Tone;
  /** Drop the gutter when a child needs to run edge to edge (media panels). */
  bleed?: boolean;
  /** Drop the vertical section padding when the section sets its own height. */
  flush?: boolean;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Section({
  tone = "linen",
  bleed = false,
  flush = false,
  id,
  className,
  children,
}: Props) {
  return (
    <section
      id={id}
      /* The fixed header reads this to keep itself legible over dark bands
         without ever gaining a background (autopsy §8 / design-system §8). */
      data-tone={tone === "forest" || tone === "roast" ? "dark" : "light"}
      className={cn(
        "relative w-full",
        tones[tone],
        !flush && "u-section",
        !bleed && "u-gutter",
        className,
      )}
    >
      {children}
    </section>
  );
}
