import Image from "next/image";

/* Product imagery: radius 0, white ground, hard shadow baked into the
   photograph. Until a file exists the slot holds its ratio and says what
   belongs there, rather than showing a stand-in picture. */
export function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) {
    return (
      <div role="img" aria-label={alt} className="grid aspect-4/5 w-full place-items-center border border-hairline">
        <span aria-hidden className="type-data text-ink-muted">
          Photograph pending
        </span>
      </div>
    );
  }
  return (
    <div className="relative aspect-4/5 w-full">
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="rounded-none object-contain" />
    </div>
  );
}
