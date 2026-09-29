import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MotifCard } from "@/components/motifs/MotifCard";
import { MotifFilters } from "@/components/motifs/MotifFilters";
import { motifs } from "@/lib/content/motifs";
import { filterMotifs, parseMotifQuery } from "@/lib/motifs/filter";

export const metadata: Metadata = {
  title: "Motifs",
  description:
    "The Uroko motif library: koi, dragons, peonies, waves, guardians and backgrounds, with their meanings, placements and session counts.",
};

export default async function MotifsPage({ searchParams }: PageProps<"/motifs">) {
  const query = parseMotifQuery(await searchParams);
  const results = filterMotifs(query);

  return (
    <section className="stage">
      <div className="stage-inner">
        <SectionHeading level="h1"
          eyebrow="Motif library"
          ja="図柄"
          title="Motifs and what they mean."
          lead={`${motifs.length} traditional motifs. Filter by kind or method, or search by name, kanji or placement.`}
        />

        <div className="mt-12">
          <Suspense fallback={<div className="h-40 border-y border-line" />}>
            <MotifFilters count={results.length} />
          </Suspense>
        </div>

        {results.length ? (
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((m, i) => (
              <li key={m.slug} className="min-w-0">
                <MotifCard motif={m} priority={i < 4} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 border border-line p-8">
            <p lang="ja" className="font-display text-4xl text-accent">
              無
            </p>
            <p className="mt-4 text-lg">Nothing matches that yet.</p>
            <p className="mt-2 max-w-prose text-text-muted">
              Try a broader word, clear the filters, or{" "}
              <Link href="/book">ask us about it in a consultation</Link>. Most requests that are not in the
              library can still be drawn.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
