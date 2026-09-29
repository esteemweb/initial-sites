import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { PinnedChapters, type Chapter } from "@/components/studio/PinnedChapters";
import { site } from "@/lib/content/site";
import { artists } from "@/lib/content/artists";
import { Photo, PhotoBackdrop } from "@/components/site/Photo";

export const metadata: Metadata = {
  title: "Studio",
  description: "How Uroko works: tebori by hand, machine work, and how a large piece is planned across sessions. One room above Motomachi street.",
};

const chapters: Chapter[] = [
  {
    id: "tebori",
    ja: "手彫り",
    title: "Tebori, by hand",
    body: "A rod of needles, pushed by hand, at a rhythm the artist controls completely. It is slower than a machine and the ink sits differently: shading is softer and colour packs denser.",
    detail: "Most clients say it hurts less. All of them say it sounds different: a quiet tick instead of a buzz. Kaito works this way exclusively; Sho uses it for shading.",
    visual: <Photo id="hand-tebori" />,
  },
  {
    id: "machine",
    ja: "機械彫り",
    title: "Machine",
    body: "Outlines and fine detail by machine, because a line drawn once should stay drawn. Even colour with less time in the chair.",
    detail: "For most large work here the outline is machine and the rest is hand, so a back piece keeps moving between sessions. Mio's colour work is machine throughout.",
    visual: <Photo id="needles" />,
  },
  {
    id: "sessions",
    ja: "回",
    title: "Sessions",
    body: "A full sleeve is six to twelve sittings of three to four hours, a month apart. A back piece is more. You see the plan before the first needle.",
    detail: "Each session is booked with a deposit that comes off the last one. The piece tracker on this site shows where you are: what is done, what is healing, what is next.",
    visual: <Photo id="back-piece" />,
  },
];

const expect = [
  { ja: "一", text: "Bring ID. The minimum age is 20, no exceptions, and we photograph nothing without asking." },
  { ja: "二", text: "Eat before you come. Sessions run three to four hours with breaks; low blood sugar is the usual reason people faint." },
  { ja: "三", text: "No alcohol the night before, no sun on the area for two weeks before, loose clothes over the placement." },
  { ja: "四", text: "The drawing happens on you. For large work the design is brushed onto the skin, adjusted, and only then outlined." },
];

const numbers = [
  { value: String(new Date().getFullYear() - site.founded), unit: "years", note: "in the same room above Motomachi street" },
  { value: String(artists.length), unit: "resident artists", note: "one apprenticeship at a time" },
  { value: "1", unit: "chair for large work", note: "so a back piece never waits for a table" },
  { value: "2–40", unit: "sessions", note: "from a single peony to a full body suit" },
];

export default function StudioPage() {
  return (
    <>
      <section className="photo-stage stage flex min-h-[70svh] flex-col justify-end">
        <PhotoBackdrop id="studio-night" priority />
        <div className="stage-inner w-full">
          <SectionHeading
            level="h1"
            eyebrow="The studio"
            ja="工房"
            title="One room above Motomachi street."
            lead={`${site.address.mapsLabel}. Two ways of putting ink in skin, and a way of planning the work that makes large pieces possible.`}
          />
        </div>
      </section>

      <section className="stage stage-pin pt-8 lg:pt-0">
        <div className="stage-inner">
          <PinnedChapters chapters={chapters} eyebrow="The studio" />
        </div>
      </section>

      <section data-theme="paper" className="stage bg-surface text-text">
        <div className="stage-inner">
          <SectionHeading eyebrow="The studio in numbers" ja="数" title="Three artists, one room, one chair for large work." />
          <dl className="mt-12 grid gap-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {numbers.map((n, i) => (
              <Reveal key={n.unit} delay={i * 3} className="border-t border-line py-8">
                <dt className="text-sm text-text-muted">{n.unit}</dt>
                <dd className="mt-3 font-display text-4xl font-bold leading-none">
                  <CountUp value={n.value} />
                </dd>
                <dd className="mt-4 max-w-[28ch] text-text-muted">{n.note}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="stage">
        <div className="stage-inner grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Your first visit" ja="初回" title="What to expect." />
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="eyebrow">Address</dt>
                <dd className="mt-1">
                  <span lang="ja" className="font-display">
                    {site.address.ja}
                  </span>
                  <br />
                  {site.address.lines[0]}, {site.address.lines[1]}
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Hours</dt>
                <dd className="mt-1 space-y-0.5">
                  {site.hours.map((h) => (
                    <div key={h.days} className="flex max-w-[16rem] justify-between gap-4">
                      <span>{h.days}</span>
                      <span className="text-text-muted">{h.time}</span>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
          <ol className="lg:col-span-7">
            {expect.map((e, i) => (
              <Reveal as="li" key={e.ja} delay={i * 2} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6">
                <span lang="ja" className="font-display text-2xl text-accent">
                  {e.ja}
                </span>
                <p className="max-w-prose text-text-muted">{e.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section data-theme="shu" className="stage bg-surface text-text">
        <div className="stage-inner flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-prose">
            <p className="eyebrow">Consultation · 相談</p>
            <Reveal as="h2" words="Come and see the room before you decide anything." className="mt-3 text-4xl" />
          </div>
          <ButtonLink href="/book" variant="primary" className="bg-ink text-paper hover:bg-paper hover:text-ink">
            Book a consultation
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
