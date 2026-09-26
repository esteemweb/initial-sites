import Image, { type StaticImageData } from "next/image";
import dt from "./duotone.module.css";
import s from "./photo.module.css";

/**
 * Every photograph outside the hero goes through the same single
 * treatment: hero state 1, grayscale, contrast 1.15, brightness 0.85.
 * One treatment for all of them, as the brief asks. It also removes the
 * red t-shirt, the red neon and the sodium-orange cast in the night
 * shots, which would otherwise be colours outside the four.
 */
export default function Photo({
  src,
  alt,
  sizes,
  ratio,
  priority,
  className,
  caption,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
  caption?: string;
}) {
  return (
    <figure className={`${s.figure} ${className ?? ""}`} data-reveal="photo">
      <div className={s.frame} style={{ aspectRatio: ratio ?? `${src.width} / ${src.height}` }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`${dt.plain} ${s.img}`} />
      </div>
      {caption && <figcaption className={`${s.caption} t-record`}>{caption}</figcaption>}
    </figure>
  );
}
