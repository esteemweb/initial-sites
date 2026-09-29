import Link from "next/link";
import { Cinema } from "@/components/home/Cinema";
import { EmblemLoader } from "@/components/home/EmblemLoader";
import { Hero } from "@/components/home/Hero";
import { Photo } from "@/components/site/Photo";
import { NextSlot } from "@/components/site/NextSlot";
import { OpenNow } from "@/components/site/OpenNow";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { StudioJsonLd } from "@/components/site/JsonLd";
import { MotifTurn } from "@/components/motifs/MotifTurn";
import { GlowCard } from "@/components/ui/spotlight-card";
import { site } from "@/lib/content/site";
import { categories, featuredMotifs, motifs, type MotifCategory } from "@/lib/content/motifs";
import { PinnedChapters, type Chapter } from "@/components/studio/PinnedChapters";
import { guides } from "@/lib/content/aftercare";
import { artists } from "@/lib/content/artists";

const years = new Date().getFullYear() - site.founded;


const chapters = [
  { ja: "手彫り", title: "Tebori", points: ["Hand-poked with a rod of needles", "Softer shading, denser colour", "Back pieces and body suits"], photo: "hand-tebori" as const },
  { ja: "機械彫り", title: "Machine", points: ["Outlines that stay put", "Even colour, shorter sittings", "Half sleeves in about three sessions"], photo: "needles" as const },
  { ja: "大作", title: "Large pieces", points: ["Planned as one design", "Sittings a month apart", "Followed on the tracker"], photo: "back-piece" as const },
];

const steps = [
  { ja: "相談", title: "Consultation", body: "Thirty minutes in the studio. Placement, motif, number of sessions, cost. Nothing is drawn yet." },
  { ja: "下絵", title: "Drawn on you", body: "For large work the design is brushed straight onto the skin and adjusted to the body before the outline." },
  { ja: "彫り", title: "Sessions", body: "Three to four hours, about a month apart, so each layer heals before the next. The tracker shows where you are." },
  { ja: "養生", title: "Healing", body: "Written guides for the first two weeks, and a same-day reply if something looks wrong." },
];

const journalPhotos = ["washi-ink", "brush-drawing", "studio-night"] as const;

const blurbs: Record<MotifCategory, string> = {
  creature: "Koi, dragons, tigers, cranes and foxes. Most first large pieces start here.",
  flower: "Peony, chrysanthemum, cherry, lotus and plum. Each belongs to a season.",
  water: "Waves and wind bars join separate pieces into one. They get planned first.",
  guardian: "Hannya, Fudō, tengu, oni and the lion-dog, worn to keep bad luck off.",
  background: "Clouds, rocks, bamboo and pine: what everything else stands on.",
};

const motifChapters: Chapter[] = categories.map((c) => ({
  id: `motif-${c.id}`,
  ja: c.ja,
  title: c.label,
  body: blurbs[c.id],
  visual: (
    <div key={c.id} className="grid h-full grid-cols-2 gap-2">
      {motifs
        .filter((m) => m.category === c.id)
        .slice(0, 4)
        .map((m) => (
          <MotifTurn key={m.slug} motif={m} size="thumb" className="aspect-auto! h-full" fill />
        ))}
    </div>
  ),
  href: { label: `See all ${c.label.toLowerCase()}`, url: `/motifs?c=${c.id}` },
}));

export default function HomePage() {
  return (
    <>
      <StudioJsonLd />
      <Cinema />
      <EmblemLoader />

      {/* 1. Hero: ink spreading through water into the scale pattern, the name, the 3D mark */}
      <Hero />

      {/* 2. Motifs: the library first, because it is what people come for */}
      <section data-services-intro className="bg-ink px-5 pb-8 pt-32 sm:px-8 lg:px-12 lg:pt-44">
        <div className="mx-auto max-w-wide lg:grid lg:grid-cols-12">
          <h2 className="text-3xl leading-tight text-paper lg:col-span-7">
            {motifs.length} motifs, each with a meaning older than the studio.
          </h2>
          <p className="mt-8 max-w-prose text-lg text-text-muted lg:col-span-4 lg:col-start-9 lg:mt-2">
            Every design in the library is drawn here, and every one turns over to show it healed on skin. Start with a
            motif; the artist, the placement and the size follow from it.
          </p>
        </div>
      </section>
      <section data-filmstrip className="relative bg-ink px-5 py-24 sm:px-8 lg:h-screen lg:overflow-hidden lg:px-0 lg:py-0">
        <p className="mb-8 text-base text-text-muted lg:absolute lg:left-12 lg:top-36 lg:mb-0">Six motifs from the library</p>
        <div className="relative lg:flex lg:h-full lg:items-center lg:justify-center">
          <div data-track className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-6">
            {featuredMotifs.map((m) => (
              <Link key={m.slug} href={`/motifs/${m.slug}`} data-card className="filmstrip-card block w-full no-underline lg:w-[19vw]">
                <MotifTurn motif={m} size="card" />
                <p className="mt-2 text-sm lg:hidden">{m.name}</p>
              </Link>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {featuredMotifs.map((m) => (
              <div key={m.slug} data-name className="absolute inset-0 opacity-0 transition-opacity duration-500">
                <p className="absolute left-12 top-1/2 -translate-y-1/2 text-4xl text-paper">
                  {m.name}{" "}
                  <span lang="ja" className="font-display text-text-muted">
                    {m.ja}
                  </span>
                </p>
                <p className="absolute right-12 top-1/2 w-72 -translate-y-1/2 text-base text-paper/80">{m.meaning}</p>
              </div>
            ))}
            <p className="absolute bottom-24 right-12 text-base tabular-nums text-text-muted">
              <span data-counter className="text-paper">01</span> / {String(featuredMotifs.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </section>
      <section className="stage stage-pin overflow-x-clip bg-ink px-5 pt-8 sm:px-8 lg:px-12 lg:pt-0">
        <p className="mb-8 text-base text-text-muted lg:hidden">Motifs by kind</p>
        <PinnedChapters chapters={motifChapters} eyebrow="Motifs by kind" />
        <div className="mt-8 lg:mt-0">
          <Link href="/motifs" className="text-base text-paper">
            All {motifs.length} motifs
          </Link>
        </div>
      </section>

      {/* 3. Artists: who you would be booking */}
      <section className="bg-ink px-5 py-32 sm:px-8 lg:px-12 lg:py-44">
        <div className="mx-auto max-w-wide">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
            <h2 className="text-3xl text-paper">
              Artists{" "}
              <span lang="ja" className="font-display text-shu-bright">
                彫師
              </span>
            </h2>
            <Link href="/artists" className="text-base text-text-muted hover:text-paper">
              All artists
            </Link>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((a) => (
              <li key={a.slug} className="min-w-0">
                <ArtistCard artist={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Large projects: how a back piece or body suit is actually made */}
      <section className="bg-ink px-5 pb-16 pt-32 sm:px-8 lg:px-12 lg:pt-44">
        <div className="mx-auto max-w-wide lg:grid lg:grid-cols-12">
          <h2 className="text-3xl leading-tight text-paper lg:col-span-7">
            Large pieces are planned on the body, one session at a time.
          </h2>
          <p className="mt-8 max-w-prose text-lg text-text-muted lg:col-span-4 lg:col-start-9 lg:mt-2">
            A back piece here is a year of monthly sittings. We draw it on you with a brush, outline it, then shade it in
            layers that heal between visits. You see the whole plan before the first needle, and you can follow it
            session by session on this site.
          </p>
        </div>
        {/* The studio's numbers, said in a sentence rather than as big stat rows */}
        <p className="mx-auto mt-16 max-w-wide border-t border-line pt-8 text-lg text-text-muted lg:text-xl">
          <span className="text-paper">{years} years</span> in the same second-floor room on Motomachi,{" "}
          <span className="text-paper">{artists.length} artists</span> (two of them trained here), and{" "}
          <span className="text-paper">up to 40 sessions</span> for a full body suit. A single peony takes one.
        </p>
      </section>
      <section data-services className="relative bg-ink lg:h-screen lg:overflow-hidden">
        <div className="mx-auto max-w-wide px-5 py-16 sm:px-8 lg:grid lg:h-full lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-24">
          {/* Text: one chapter per block; on desktop they share one spot and hand over (Cinema) */}
          <div className="relative grid gap-24 lg:col-span-5 lg:block lg:h-full">
            {chapters.map((c, i) => (
              <div key={c.ja} data-chapter className="grid gap-8 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-between lg:gap-0">
                <div className="flex items-baseline gap-4 text-base">
                  <span className="overflow-hidden">
                    <span data-label className="block tabular-nums text-paper">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-text-muted"> / {String(chapters.length).padStart(2, "0")}</span>
                    </span>
                  </span>
                  <span className="overflow-hidden">
                    <span data-label className="block text-text-muted">
                      {c.title}
                    </span>
                  </span>
                </div>
                <div className="overflow-hidden py-[0.15em]">
                  <p data-word lang="ja" className="whitespace-nowrap font-display text-[clamp(4rem,8.5vw,8.5rem)] leading-[1.1] text-shu-bright">
                    {c.ja}
                  </p>
                </div>
                <div className="relative aspect-[4/5] overflow-hidden lg:hidden">
                  <Photo id={c.photo} sizes="100vw" />
                </div>
                <ul className="space-y-3 text-lg text-paper lg:text-xl">
                  {c.points.map((p) => (
                    <li key={p} data-point className="border-b border-line pb-3">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Photo panel (desktop): each chapter's photo wipes up over the last, led by a vermilion line */}
          <div className="relative hidden lg:col-span-7 lg:block lg:h-full">
            <div className="absolute -left-6 inset-y-0 w-px bg-line" aria-hidden="true">
              <div data-progress className="h-full w-full origin-top scale-y-0 bg-shu-bright" />
            </div>
            <div data-window className="absolute inset-0 overflow-hidden">
              {chapters.map((c, i) => (
                <div key={c.photo} data-frame className="absolute inset-0 overflow-hidden">
                  <Photo id={c.photo} sizes="(min-width:1024px) 58vw, 100vw" priority={i === 0} />
                  <div data-shade className="absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
                </div>
              ))}
              <div data-edge className="absolute inset-x-0 top-0 h-[2px] bg-shu-bright opacity-0" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
      <section data-process className="bg-ink px-5 py-32 sm:px-8 lg:h-screen lg:overflow-hidden lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-wide gap-12 lg:h-full lg:grid-cols-12 lg:gap-16">
          {/* Photo: fills the column, top and bottom level with the text column */}
          <div data-process-photo className="relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:aspect-auto lg:h-full">
            <div data-process-img className="absolute inset-0">
              <Photo id="ink-water" sizes="(min-width:1024px) 38vw, 100vw" />
            </div>
          </div>

          <div className="flex flex-col lg:col-span-7 lg:h-full">
            <h3 className="text-3xl leading-tight text-paper">From the consultation to the healed piece.</h3>
            {/* Each step: fixed kanji column, then number + title on one line and the text under it */}
            <ol className="mt-10 grid flex-1 content-between gap-10 lg:mt-12 lg:gap-0">
              {steps.map((s, i) => (
                <li key={s.ja} data-step className="relative grid grid-cols-[4.25rem_1fr] items-start gap-x-5 pt-6 sm:grid-cols-[9rem_1fr] sm:gap-x-6">
                  <span data-step-line className="absolute inset-x-0 top-0 h-px origin-left bg-line" aria-hidden="true" />
                  <span className="overflow-hidden py-[0.1em]">
                    <span data-step-kanji lang="ja" className="block whitespace-nowrap font-display text-2xl leading-none text-shu-bright sm:text-3xl">
                      {s.ja}
                    </span>
                  </span>
                  <div data-step-text className="pt-1">
                    <p className="flex items-baseline gap-3 text-xl leading-tight text-paper">
                      <span className="text-base tabular-nums text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </p>
                    <p className="mt-2 max-w-prose text-text-muted">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. Booking, stated plainly */}
      <section className="bg-ink px-5 py-32 sm:px-8 lg:px-12 lg:py-44">
        <div className="mx-auto max-w-wide border-t border-line pt-12">
          <h2 className="max-w-4xl text-4xl leading-tight text-paper">Consultations are free and take thirty minutes.</h2>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
            <Link
              href="/book"
              className="inline-block text-2xl text-shu-bright underline decoration-1 underline-offset-8 hover:text-paper lg:text-3xl"
            >
              Book one
            </Link>
            <NextSlot className="text-base text-text-muted" />
          </div>
        </div>
      </section>

      {/* 6. Aftercare guides */}
      <section data-journal className="bg-ink px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-wide">
          <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-baseline lg:justify-between">
            <h2 className="text-3xl text-paper">
              Aftercare{" "}
              <span lang="ja" className="font-display text-shu-bright">
                養生
              </span>
            </h2>
            <Link href="/aftercare" className="text-base text-text-muted hover:text-paper">
              All guides
            </Link>
          </div>
          <ul className="grid gap-8 lg:grid-cols-3">
            {guides.slice(0, 3).map((g, i) => (
              <li key={g.slug}>
                <Link href={`/aftercare/${g.slug}`} className="group block h-full no-underline">
                  <GlowCard glowColor="red" autoGlow customSize className="h-full min-w-0 grid-cols-1 grid-rows-none! content-start gap-4!">
                    <div className="aspect-[4/5] overflow-hidden">
                      <Photo id={journalPhotos[i]} sizes="(min-width:1024px) 30vw, 100vw" />
                    </div>
                    <div className="px-1 pb-1">
                      <p className="text-xl text-paper group-hover:underline group-hover:underline-offset-4">{g.title}</p>
                      <p className="mt-1 text-sm text-text-muted">{g.readMinutes} minute read</p>
                    </div>
                  </GlowCard>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Visiting: the street in the rain fills the screen; where the room is, when it's open, what to bring */}
      <section data-visit className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink">
        <div data-visit-photo className="absolute inset-0 will-change-transform" aria-hidden="true">
          <Photo id="motomachi-rain" sizes="100vw" className="[filter:brightness(0.75)]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" aria-hidden="true" />
        <p
          lang="ja"
          aria-hidden="true"
          className="tategaki absolute right-5 top-24 font-display text-2xl leading-[1.2] text-paper/60 sm:right-8 lg:right-12 lg:top-32 lg:text-3xl"
        >
          元町
        </p>

        <div className="relative mx-auto w-full max-w-wide px-5 pb-28 pt-40 sm:px-8 lg:px-12 lg:pb-24">
          <h2 className="whitespace-nowrap text-4xl leading-none text-paper">
            Visiting{" "}
            <span lang="ja" className="font-display text-shu-bright">
              来店
            </span>
          </h2>
          <OpenNow className="mt-6 text-base text-paper" />

          <div className="mt-12 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm text-text-muted">Address</p>
              <p lang="ja" className="mt-3 font-display text-lg text-paper">
                {site.address.ja}
              </p>
              <p className="mt-1 text-lg text-paper">
                {site.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <p className="mt-3 text-text-muted">{site.address.mapsLabel}.</p>
            </div>
            <div className="lg:col-span-3 lg:col-start-6">
              <p className="text-sm text-text-muted">Hours</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-lg">
                {site.hours.map((h) => (
                  <div key={h.days} className="contents">
                    <dt className="text-paper">{h.days}</dt>
                    <dd className="text-text-muted">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-3 lg:col-start-10">
              <p className="text-sm text-text-muted">Bring</p>
              <p className="mt-3 text-lg text-paper">Photo ID, every session. Minimum age 20.</p>
              <Link
                href="/book"
                className="mt-6 inline-block text-lg text-shu-bright underline decoration-1 underline-offset-8 hover:text-paper"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
