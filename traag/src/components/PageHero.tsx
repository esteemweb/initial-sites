import Image, { type StaticImageData } from "next/image";
import s from "./pagehero.module.css";

/**
 * The template's page header: a full-width photograph, tinted in ink and
 * darkened, with the page title centred in it. The tint is the site's
 * duotone idea applied softly: grayscale, then multiplied by ink.
 */
export default function PageHero({
  title,
  image,
  alt,
  position = "50% 50%",
}: {
  title: string;
  image: StaticImageData;
  alt: string;
  position?: string;
}) {
  return (
    <section className={s.hero} aria-labelledby="page-title">
      <div className={s.photo}>
        <Image src={image} alt={alt} fill priority sizes="100vw" quality={70} style={{ objectPosition: position }} />
      </div>
      <div className={s.shade} aria-hidden="true" />
      <h1 id="page-title" className={s.title}>
        {title}
      </h1>
    </section>
  );
}
