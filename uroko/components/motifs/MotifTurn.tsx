import Image from "next/image";
import type { Motif } from "@/lib/content/motifs";
import { MotifPlate } from "./MotifPlate";
import { Revolve } from "./Revolve";

type Size = "card" | "hero" | "panel" | "thumb";

const sizes: Record<Size, string> = {
  hero: "(min-width: 1024px) 50vw, 100vw",
  panel: "(min-width: 1024px) 35rem, 100vw",
  card: "(min-width: 1024px) 25vw, 50vw",
  thumb: "(min-width: 1024px) 12vw, 30vw",
};

/**
 * A motif everywhere on the site: the plate on the front, the same motif
 * healed on someone's skin on the back (see Revolve for when it turns).
 * Falls back to the plate alone if a motif has no photo yet.
 */
export function MotifTurn({
  motif,
  size = "card",
  priority = false,
  className = "",
  fill = false,
}: {
  motif: Motif;
  size?: Size;
  priority?: boolean;
  className?: string;
  fill?: boolean;
}) {
  const plate = <MotifPlate motif={motif} size={size} priority={priority} className={className} />;
  if (!motif.worn) return plate;
  return (
    <Revolve
      fill={fill}
      front={plate}
      back={
        <div className="relative h-full w-full overflow-hidden bg-ink">
          <Image
            src={motif.worn}
            alt={`${motif.name} tattoo, healed, on ${motif.wornOn ?? "the body"}`}
            fill
            sizes={sizes[size]}
            className="object-cover"
          />
        </div>
      }
    />
  );
}
