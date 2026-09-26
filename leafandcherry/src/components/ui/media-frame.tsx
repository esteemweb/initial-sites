/* pattern: imagery treatment — autopsy §7 (radius 0, no border, no shadow)
   with the reference's one real failure fixed: it puts cream text straight
   onto live photography with NO scrim of any kind. Here the scrim is not
   optional — passing children turns it on. design-system §4, §8. */
import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  src?: string;
  alt?: string;
  /** Aspect ratio. Preserved at every width — the reference pinned height
   *  instead and let the ratio drift 1.62:1 -> 1.28:1 on mobile. */
  ratio?: "card" | "wide" | "portrait" | "fill";
  priority?: boolean;
  sizes?: string;
  /** Tiny data URL shown blurred while the image loads (content/placeholders). */
  blurDataURL?: string;
  /** Text laid over the image. Its presence applies the scrim. */
  children?: React.ReactNode;
  /** Where overlaid text sits within the frame. */
  align?: "bottom-left" | "bottom-right";
  /** Shown while real photography does not exist yet. */
  placeholderLabel?: string;
  className?: string;
};

const ratios = {
  card: "aspect-card",
  wide: "aspect-wide",
  portrait: "aspect-portrait",
  fill: "h-full",
} as const;

export function MediaFrame({
  src,
  alt = "",
  ratio = "card",
  priority = false,
  sizes = "100vw",
  blurDataURL,
  children,
  align = "bottom-left",
  placeholderLabel,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-none bg-surface-roast",
        ratios[ratio],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 font-mono text-2xs uppercase text-text-muted-dark"
        >
          {placeholderLabel ?? "Photography pending"}
        </span>
      )}

      {children ? (
        <>
          <span className="u-scrim" aria-hidden="true" />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex p-6 text-text-on-dark lg:p-12",
              align === "bottom-right" ? "justify-end" : "justify-start",
            )}
          >
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}
