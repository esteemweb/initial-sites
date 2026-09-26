/* pattern: staggered 3-column grid with a baseline-anchored eyebrow row —
   autopsy §2 (offsets 0/+90/+229) and §10 "Card (service, 01-03)".
   Two divergences from the reference:
   - the stagger is a systematic 0/96/192 ladder instead of its arbitrary
     0/90/229, and the eyebrow rows stay baseline-aligned in their own grid
     row, which is what stops a stagger reading as a bug;
   - capped at three lots. The reference ran 01-09 down the whole page as its
     spine, which is its signature and is left behind (design-system §Decisions).
   Card anatomy: eyebrow -> 96 -> title -> 48 -> media -> 64 -> body.

   Motion, from the 2026-09-23 recording (autopsy §15.5–15.7): the heading's
   trailing rule draws in; the three columns rise into their ladder at
   different rates (the third leads, the second lands last) while each
   leading rule grows down its column; and hovering a card shows the
   reference's cherry corner square with a ↘ arrow. */
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { Badge } from "@/components/ui/badge";
import { EyebrowRow } from "@/components/ui/eyebrow-row";
import { MediaFrame } from "@/components/ui/media-frame";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { LOTS } from "@/content/home";

/* The stagger ladder. Removed below lg, per design-system §9. */
const stagger = ["", "lg:mt-24", "lg:mt-48"];

export function Origins() {
  return (
    <Section tone="linen" id="origins">
      <ScrollProgress start={0.95} end={0.55} className="flex items-center">
        <h2 className="text-2xl">Three lots, and that is the whole list</h2>
        <Rule variant="trailing" draw />
      </ScrollProgress>

      <ScrollProgress
        as="ul"
        start={1}
        end={0.35}
        className="u-rise-group mt-24 grid gap-16 lg:grid-cols-3"
      >
        {LOTS.map((lot, i) => (
          <Reveal as="li" key={lot.lead} className={stagger[i]}>
            {/* hover grows the leading rule 2px -> 4px. The media never
                scales. */}
            <article className="group u-rule-lead-draw u-rise hover:before:w-1">
              <EyebrowRow lead={lot.lead} label={lot.label} scramble />

              <h3 className="mt-24 text-lg">{lot.title}</h3>

              <div className="relative mt-12">
                <MediaFrame
                  src={lot.image}
                  alt={lot.imageAlt}
                  ratio="card"
                  sizes="(min-width: 1024px) 30vw, 100vw"
                />
                {/* Decorative only: the card has no link of its own. */}
                <span
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 flex size-12 items-center justify-center bg-accent text-accent-fg opacity-0 u-transition-ui group-hover:opacity-100"
                >
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 6l12 12M18 8v10H8" />
                  </svg>
                </span>
              </div>

              <p className="mt-16 u-measure-card text-sm">{lot.body}</p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <Badge>{lot.badge}</Badge>
                {/* No tasting-notes pages yet: plain text, not a link. */}
                <span className="text-sm text-text-muted">{lot.notes}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </ScrollProgress>
    </Section>
  );
}
