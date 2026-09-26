import type { PhotoKey } from "@/content/images";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { Photo } from "./photo";

/* pattern: paired images per section — REFERENCE-AUTOPSY §5.2, adjacent
   version (design-system §8, amended 25 Sep 2026): two 4:5 portraits of
   exactly the same size, side by side, top and bottom aligned — no stagger,
   no mixed ratios. Full width: columns 2–6 and 7–11 (centred, 10 of 12).
   `compact`: for a pair placed in a narrower area beside text — the two
   halves of that area. `mirror` swaps which photo comes first. Mobile: the
   two halves of the page. */

export function PairedPortraits({
  a,
  b,
  lang,
  mirror = false,
  compact = false,
  priority = false,
  className,
}: {
  a: PhotoKey;
  b: PhotoKey;
  lang: Lang;
  mirror?: boolean;
  compact?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const [first, second] = mirror ? [b, a] : [a, b];
  const sizes = compact ? "(min-width: 64rem) 28vw, 48vw" : "(min-width: 64rem) 38vw, 48vw";
  return (
    <div className={cn("col-span-12 grid grid-cols-12 gap-x-16 lg:gap-x-24", className)}>
      <div className={cn("col-span-6", !compact && "lg:col-span-5 lg:col-start-2")}>
        <Photo id={first} lang={lang} frame="portrait" priority={priority} sizes={sizes} />
      </div>
      <div className={cn("col-span-6", !compact && "lg:col-span-5")}>
        <Photo id={second} lang={lang} frame="portrait" priority={priority} sizes={sizes} />
      </div>
    </div>
  );
}
