import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { ArtistPlate } from "@/components/artists/ArtistPlate";
import { MotifTurn } from "@/components/motifs/MotifTurn";
import { artists, availabilityLabel, getArtist } from "@/lib/content/artists";
import { getMotif, methodOf } from "@/lib/content/motifs";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artists/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArtist(slug);
  return a ? { title: `${a.name} (${a.ja})`, description: a.bio } : {};
}

const statusTone = {
  open: "border-ok text-ok",
  waitlist: "border-warn text-warn",
  closed: "border-err text-err",
} as const;

export default async function ArtistPage({ params }: PageProps<"/artists/[slug]">) {
  const { slug } = await params;
  const a = getArtist(slug);
  if (!a) notFound();
  const method = methodOf(a.method);
  const takes = a.motifs.map(getMotif).filter(Boolean);

  return (
    <>
      <section className="stage">
        <div className="stage-inner">
          <Link href="/artists" className="text-sm text-text-muted no-underline hover:underline">
            ← All artists
          </Link>

          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ArtistPlate artist={a} />
            </div>

            <div className="lg:col-span-7">
              <p className="eyebrow">
                {a.role} · since {a.since}
              </p>
              <h1 className="mt-3 text-4xl">
                {a.name}{" "}
                <span lang="ja" className="font-display text-[0.7em] font-normal text-text-muted">
                  {a.ja}
                </span>
              </h1>
              <p className="mt-8 max-w-prose border-l-2 border-shu pl-5 text-xl">{a.statement}</p>
              <p className="mt-6 max-w-prose text-text-muted">{a.bio}</p>

              <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
                <div>
                  <dt className="eyebrow">Method</dt>
                  <dd className="mt-2 text-xl">
                    {method.label}{" "}
                    <span lang="ja" className="font-display text-base text-text-muted">
                      {method.ja}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Languages</dt>
                  <dd className="mt-2 text-xl">{a.languages.join(", ")}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="eyebrow">Focus</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {a.focus.map((f) => (
                      <span key={f} className="rounded-sm border border-line px-2.5 py-1 text-sm">
                        {f}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <div className={`mt-8 border-l-2 pl-5 ${statusTone[a.availability.status]}`}>
                <p className="text-sm font-medium">{availabilityLabel[a.availability.status]}</p>
                <p className="mt-1 text-text-muted">{a.availability.note}</p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href={`/book?artist=${a.slug}`} variant="seal">
                  Book with {a.name}
                </ButtonLink>
                {/* Plain text on purpose: the handle is fictional and belongs to nobody */}
                <p className="inline-flex h-12 items-center gap-2 px-2 text-sm text-text-muted">
                  {a.instagram}
                  <span className="text-xs">(fictional account)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stage bg-surface-deep">
        <div className="stage-inner">
          <h2 className="text-3xl">Recent work</h2>
          <p className="mt-3 max-w-prose text-text-muted">
            A few pieces from the last two years. Photographs arrive once the pieces have healed and the client agrees.
          </p>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {a.works.map((w, i) => {
              const m = getMotif(w.motif);
              if (!m) return null;
              const wm = methodOf(w.method);
              return (
                <li key={i} className="grid grid-cols-[4rem_1fr] items-center gap-4 py-4 sm:grid-cols-[5rem_2fr_1fr_1fr_4rem] sm:gap-6">
                  <Link href={`/motifs/${m.slug}`} className="block">
                    <MotifTurn motif={m} size="thumb" />
                  </Link>
                  <div>
                    <p className="text-lg font-medium">
                      <Link href={`/motifs/${m.slug}`} className="no-underline hover:underline">
                        {m.name}
                      </Link>{" "}
                      <span className="text-text-muted">· {w.placement}</span>
                    </p>
                    {w.note ? <p className="mt-1 text-sm text-text-muted">{w.note}</p> : null}
                    <p className="mt-1 text-sm text-text-muted sm:hidden">
                      {w.sessions} sessions · {wm.label} · {w.year}
                    </p>
                  </div>
                  <p className="hidden text-sm sm:block">{w.sessions} sessions</p>
                  <p className="hidden text-sm sm:block">
                    {wm.label}{" "}
                    <span lang="ja" className="font-display text-text-muted">
                      {wm.ja}
                    </span>
                  </p>
                  <p className="hidden font-mono text-sm text-text-muted sm:block">{w.year}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="stage">
        <div className="stage-inner">
          <h2 className="text-3xl">Takes on</h2>
          <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {takes.map((m) => (
              <li key={m!.slug}>
                <Link href={`/motifs/${m!.slug}`} className="group block no-underline">
                  <MotifTurn motif={m!} size="thumb" />
                  <p className="mt-2 text-sm group-hover:underline">{m!.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
