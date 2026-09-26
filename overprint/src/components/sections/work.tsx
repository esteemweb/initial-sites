import Image from "next/image";
import { PlateText } from "@/components/plate-text";

/* Placeholder projects — swap for real case studies. Images generated with
   Nano Banana 2 (Higgsfield), hyperrealistic. */
const projects: {
  title: string;
  meta: string;
  src: string;
  alt: string;
  feature?: boolean;
}[] = [
  {
    title: "Tidewater Records",
    meta: "Identity · Sleeves",
    src: "/images/work/tidewater-records-photo.jpg",
    alt: "A record sleeve printed with overlapping cyan and magenta circles and a yellow label, at the front of a crate in a record shop.",
  },
  {
    title: "Halftone Bakery",
    meta: "Packaging",
    src: "/images/work/halftone-bakery-photo.jpg",
    alt: "Kraft pastry boxes and bags printed with magenta halftone dots and yellow bands on a floury counter as a baker boxes a croissant.",
  },
  {
    title: "Northern Plate Journal",
    meta: "Editorial · Masthead & grid",
    src: "/images/work/northern-plate-journal-photo.jpg",
    alt: "A hand turning the pages of a magazine of huge overprinted CMYK letterforms on a print-shop bench, printers at work behind.",
    feature: true,
  },
  {
    title: "Gridline Transit",
    meta: "Wayfinding",
    src: "/images/work/gridline-transit-photo.jpg",
    alt: "Yellow, cyan and magenta striped wayfinding on a tiled underground platform as commuters walk past a waiting train.",
  },
  {
    title: "Mill Street Type",
    meta: "Type specimen",
    src: "/images/work/mill-street-type-photo.jpg",
    alt: "A giant black ampersand poster pasted on a red-brick pillar on a wet city street at dusk, cyclists passing.",
  },
];

/* pattern: catalog grid — refs/flowers-sim §9 item 6: two 350×400 cards per row
   on cols 1–4 beside one 708×806 feature on cols 5–8 spanning both rows, 6px
   gaps, titles set on the image. Photography is generated, not stock. */
export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pt-section-sm md:pt-section">
      <div className="grid-page gap-y-4">
        <p className="col-span-4 text-micro text-ink-muted uppercase md:col-span-2">
          (Selected work)
        </p>
        <h2 id="work-title" className="col-span-4 text-head md:col-start-5">
          <PlateText className="register-scroll">Work that prints loud</PlateText>
        </h2>
      </div>

      <ul className="grid-page mt-stack-sm gap-y-gutter md:mt-stack">
        {projects.map((p) => (
          <li
            key={p.title}
            className={
              p.feature
                ? "col-span-4 md:col-start-5 md:row-span-2 md:row-start-1"
                : "col-span-2"
            }
          >
            <article
              className={`group relative isolate h-full overflow-hidden bg-ink text-paper ${
                p.feature ? "aspect-7/8 md:aspect-auto" : "aspect-7/8"
              }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={p.feature ? "(min-width: 60rem) 50vw, 100vw" : "(min-width: 60rem) 25vw, 50vw"}
                className="-z-10 object-cover transition-transform duration-500 ease-press group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-ink/85 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 md:p-4">
                <h3 className={p.feature ? "text-head" : "text-title"}>{p.title}</h3>
                <p className="text-micro">{p.meta}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
