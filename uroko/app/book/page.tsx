import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { getMotif } from "@/lib/content/motifs";
import { getArtist } from "@/lib/content/artists";
import { consultationSlots } from "@/lib/booking/slots";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: "Book a free consultation at Uroko, Motomachi. Demo booking with a simulated deposit; nothing is charged.",
};

const facts = ["Thirty minutes", "Free", "At the studio, Japan time", "Minimum age 20"];

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const motif = first(sp.motif) ? getMotif(first(sp.motif)!) : undefined;
  const artist = first(sp.artist) ? getArtist(first(sp.artist)!) : undefined;
  const days = consultationSlots();

  return (
    <>
      <section className="bg-ink px-5 pb-16 pt-36 sm:px-8 lg:px-12 lg:pb-20 lg:pt-56">
        <div className="mx-auto grid max-w-wide gap-10 lg:grid-cols-12 lg:items-end">
          <p lang="ja" aria-hidden="true" className="font-display text-[clamp(5rem,14vw,11rem)] leading-none text-shu-bright lg:col-span-4">
            相談
          </p>
          <div className="lg:col-span-8">
            <h1 className="max-w-3xl text-3xl leading-tight text-paper">Free, thirty minutes, no drawing until we have talked.</h1>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base text-text-muted">
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {artist || motif ? (
              <p className="mt-6 text-base text-paper">
                Asking about{" "}
                {motif ? <Link href={`/motifs/${motif.slug}`}>{motif.name}</Link> : null}
                {motif && artist ? " with " : null}
                {artist ? <Link href={`/artists/${artist.slug}`}>{artist.name}</Link> : null}. It&apos;s filled in below.
              </p>
            ) : null}
          </div>
        </div>
        <div className="mx-auto mt-14 max-w-wide">
          <BookingSteps current={1} />
        </div>
      </section>

      <section className="bg-ink px-5 pb-32 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-wide">
          <BookingForm days={days} defaults={{ artist: artist?.slug, motif: motif?.slug }} />
        </div>
      </section>
    </>
  );
}
