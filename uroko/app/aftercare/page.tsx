import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/ui/spotlight-card";
import { guides, timeline } from "@/lib/content/aftercare";
import { site } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Aftercare",
  description: "How to look after a new tattoo: the first two weeks day by day, plus guides for tebori, large pieces, summer and when to call.",
};

export default function AftercarePage() {
  return (
    <>
      <section className="stage">
        <div className="stage-inner">
          <SectionHeading
            level="h1"
            eyebrow="Aftercare"
            ja="養生"
            title="The first two weeks decide how it looks in twenty years."
            lead="Wash, don't soak. Moisturise, don't smother. Stay out of the sun. Everything else is detail, and the detail is below."
          />
          <ol className="mt-12 divide-y divide-line border-y border-line">
            {timeline.map((d, i) => (
              <Reveal as="li" key={d.when} delay={i * 2} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-8">
                <p className="font-mono text-sm text-accent sm:col-span-3">{d.when}</p>
                <p className="max-w-prose text-text-muted sm:col-span-9">{d.what}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="stage bg-surface-deep">
        <div className="stage-inner">
          <h2 className="text-3xl">Guides</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {guides.map((g, i) => (
              <li key={g.slug}>
                <Reveal delay={i * 2} className="h-full">
                  <Link href={`/aftercare/${g.slug}`} className="group block h-full no-underline">
                    <GlowCard glowColor="red" autoGlow customSize className="h-full min-w-0 grid-cols-1 grid-rows-none! p-6!">
                      <div className="flex h-full flex-col">
                        <p lang="ja" className="font-display text-3xl text-accent">
                          {g.ja}
                        </p>
                        <p className="mt-4 text-xl group-hover:underline group-hover:underline-offset-4">{g.title}</p>
                        <p className="mt-2 text-text-muted">{g.summary}</p>
                        <p className="mt-auto pt-6 text-xs text-text-muted">{g.readMinutes} min read</p>
                      </div>
                    </GlowCard>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-prose text-sm text-text-muted">
            General advice for healthy skin, not medical advice. If something looks wrong, message {site.email} the same day or see a doctor.
          </p>
        </div>
      </section>
    </>
  );
}
