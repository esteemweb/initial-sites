import Image from "next/image";
import { PlateText } from "@/components/plate-text";

const steps: {
  plate: string;
  title: string;
  body: string;
  image?: { src: string; alt: string };
}[] = [
  {
    plate: "C",
    title: "Proof",
    body: "We listen, read everything you have and sketch fast. Nothing is precious yet.",
    image: {
      src: "/images/process/proof-photo.jpg",
      alt: "A designer's desk at night covered in letterform sketches, a hand drawing with a black marker under an angled lamp.",
    },
  },
  {
    plate: "M",
    title: "Separate",
    body: "We split the idea into its plates: type, colour, grid and voice. Each one has to work alone.",
    image: {
      src: "/images/process/separate-photo.jpg",
      alt: "A hand lifting a cyan film separation off magenta and yellow films of a letterform on a glowing lightbox.",
    },
  },
  {
    plate: "Y",
    title: "Register",
    body: "The plates are lined up across print, screen and signage until they hit together.",
    image: {
      src: "/images/process/register-photo.jpg",
      alt: "Ink-stained hands holding a brass loupe over registration marks on a printed sheet beside spinning press rollers.",
    },
  },
  {
    plate: "K",
    title: "Print",
    body: "Press checks, production files, guidelines and launch. You get everything you need to run it.",
    image: {
      src: "/images/process/print-photo.jpg",
      alt: "A press operator in overalls watching CMYK sheets feed onto the delivery pile of a four-colour offset press.",
    },
  },
];

/* pattern: pinned horizontal gallery — refs/flowers-sim §8/§9 item 5 (sticky
   section, track moves x −3500px over 3300px of scroll). CSS scroll-driven, no JS.
   Reduced motion / no support: the same track is a keyboard-scrollable snap strip. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="pin-section pt-section-sm md:pt-section">
      <div className="pin-sticky">
        <div
          role="region"
          aria-label="Process steps"
          tabIndex={0}
          className="pin-scroller snap-x snap-mandatory scroll-px-edge overflow-x-auto pb-6"
        >
          <ol className="pin-track flex w-max items-end gap-gutter px-edge">
            <li className="flex w-card shrink-0 snap-start flex-col justify-end gap-4 md:w-card-md">
              <p className="text-micro text-ink-muted uppercase">(How a job runs)</p>
              <h2 id="process-title" className="text-head">
                <PlateText className="register-scroll">Four plates, one print</PlateText>
              </h2>
              <p className="max-w-md text-lede">
                Every job runs the same four steps. Keep scrolling to follow a piece from sketch
                to press.
              </p>
            </li>

            {steps.map((step, i) => (
              <li key={step.plate} className="flex w-card shrink-0 snap-start flex-col gap-3 md:w-card-md">
                <div className="relative aspect-3/2 overflow-hidden bg-ink">
                  {step.image ? (
                    <Image
                      src={step.image.src}
                      alt={step.image.alt}
                      fill
                      sizes="(min-width: 60rem) 36vw, 80vw"
                      className="object-cover"
                    />
                  ) : (
                    /* step 02 — live CMYK separation: the same glyph on four plates */
                    <div aria-hidden="true" className="plate-shift-wide grid h-full place-items-center bg-paper font-display text-display font-bold">
                      <PlateText decorative className="register-scroll">
                        Ab
                      </PlateText>
                    </div>
                  )}
                </div>
                <p className="text-micro text-ink-muted">
                  ({step.plate}) Step {String(i + 1).padStart(2, "0")} / 04
                </p>
                <h3 className="text-head">{step.title}</h3>
                <p className="max-w-md text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
