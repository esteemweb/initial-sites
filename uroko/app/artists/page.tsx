import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArtistCard } from "@/components/artists/ArtistCard";
import { Reveal } from "@/components/motion/Reveal";
import { artists } from "@/lib/content/artists";

export const metadata: Metadata = {
  title: "Artists",
  description: "The three resident artists at Uroko, Motomachi: tebori, machine, and both. Focus, availability and recent work.",
};

export default function ArtistsPage() {
  return (
    <section className="stage">
      <div className="stage-inner">
        <SectionHeading
          level="h1"
          eyebrow="Resident artists"
          ja="彫師"
          title="Three artists, three hands."
          lead="One founder who works by hand, one colourist on the machine, one who does both. Book with a person, not a studio."
        />
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((a, i) => (
            <li key={a.slug}>
              <Reveal delay={i * 3}>
                <ArtistCard artist={a} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
