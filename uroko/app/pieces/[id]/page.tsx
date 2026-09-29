import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ring } from "@/components/ui/Ring";
import { MotifTurn } from "@/components/motifs/MotifTurn";
import { ButtonLink } from "@/components/ui/Button";
import { getPiece, pieces, progress, type SessionStatus } from "@/lib/content/pieces";
import { getArtist } from "@/lib/content/artists";
import { getMotif } from "@/lib/content/motifs";
import { longDate, shortDate, yen } from "@/lib/format";

export function generateStaticParams() {
  return pieces.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/pieces/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Piece ${id}`, robots: { index: false } };
}

const statusLabel: Record<SessionStatus, string> = {
  done: "Done",
  healing: "Healing",
  next: "Next",
  planned: "Planned",
};

const statusMark: Record<SessionStatus, string> = {
  done: "bg-text",
  healing: "bg-warn",
  next: "bg-shu",
  planned: "border border-line bg-transparent",
};

export default async function PiecePage({ params }: PageProps<"/pieces/[id]">) {
  const { id } = await params;
  const p = getPiece(id);
  if (!p) notFound();
  const artist = getArtist(p.artist);
  const motifs = p.motifs.map(getMotif).filter(Boolean);
  const pr = progress(p);
  const next = p.sessions.find((s) => s.status === "next");
  const healing = p.sessions.find((s) => s.status === "healing");
  const complete = pr.done === pr.total && !next;
  const paidSessions = p.sessions.filter((s) => s.status === "done" || s.status === "healing").length;
  const estimate = p.totalSessions * p.perSession;
  const paid = p.deposit + paidSessions * p.perSession;

  return (
    <>
      <section className="stage">
        <div className="stage-inner">
          <Link href="/pieces" className="text-sm text-text-muted no-underline hover:underline">
            ← Tracker
          </Link>

          <div className="mt-6 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow font-mono normal-case tracking-normal">{p.id}</p>
              <h1 className="mt-3 text-3xl">
                {motifs.map((m) => m!.name).join(" and ")} <span className="text-text-muted">· {p.placement}</span>
              </h1>
              <p className="mt-4 text-lg text-text-muted">
                {p.client} with {artist ? <Link href={`/artists/${artist.slug}`}>{artist.name}</Link> : null},{" "}
                {p.method === "both" ? "machine outline and tebori shading" : p.method}, started {longDate(p.started)}.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {motifs.map((m) => (
                  <Link key={m!.slug} href={`/motifs/${m!.slug}`} className="w-20 no-underline">
                    <MotifTurn motif={m!} size="thumb" />
                    <span className="mt-1 block text-xs">{m!.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-8 lg:col-span-5 lg:justify-end">
              <Ring ratio={pr.ratio} label={`${pr.done}/${pr.total}`} sub={complete ? "complete" : "sessions"} size={180} />
              <dl className="grid gap-4 text-sm">
                <div>
                  <dt className="eyebrow">Status</dt>
                  <dd className="mt-1 text-lg">
                    {complete ? "Finished and healed" : healing ? "Healing from session " + healing.n : "Between sessions"}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Paid so far</dt>
                  <dd className="mt-1 text-lg">
                    {yen(paid)} <span className="text-text-muted">of ~{yen(estimate)}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {next || healing ? (
        <section className="stage bg-surface-deep py-8!">
          <div className="stage-inner grid gap-6 md:grid-cols-2">
            {next ? (
              <div className="border-l-2 border-shu bg-surface p-6">
                <p className="eyebrow">Next session · {String(next.n).padStart(2, "0")}</p>
                <p className="mt-2 text-2xl">{next.date ? longDate(next.date) : "Date to be set"}</p>
                <p className="mt-2 text-text-muted">{next.focus}</p>
                {next.hours ? <p className="mt-1 text-sm text-text-muted">About {next.hours} hours. Eat first; bring ID.</p> : null}
              </div>
            ) : null}
            {healing && p.aftercare ? (
              <div className="border-l-2 border-warn bg-surface p-6">
                <p className="eyebrow">Healing · session {String(healing.n).padStart(2, "0")}</p>
                <p className="mt-2 text-lg">{p.aftercare}</p>
                <p className="mt-3 text-sm">
                  <Link href="/aftercare">Aftercare guide</Link>
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="stage">
        <div className="stage-inner">
          <h2 className="text-2xl">The plan</h2>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {p.sessions.map((s) => (
              <li
                key={s.n}
                className={`grid grid-cols-[2.5rem_1fr] items-baseline gap-4 py-4 sm:grid-cols-[2.5rem_7rem_1fr_5rem_6rem] ${
                  s.status === "planned" ? "text-text-muted" : ""
                }`}
                aria-current={s.status === "next" ? "step" : undefined}
              >
                <span className="flex items-center gap-2 font-mono text-sm">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusMark[s.status]}`} aria-hidden="true" />
                  {String(s.n).padStart(2, "0")}
                </span>
                <span className="text-sm sm:order-none">{s.date ? shortDate(s.date) : "Not set"}</span>
                <span className="col-start-2 sm:col-start-auto">
                  {s.focus}
                  {s.note ? <span className="mt-1 block text-sm text-text-muted">{s.note}</span> : null}
                </span>
                <span className="col-start-2 text-sm text-text-muted sm:col-start-auto">{s.hours ? `${s.hours} h` : ""}</span>
                <span className="col-start-2 text-sm sm:col-start-auto sm:text-right">{statusLabel[s.status]}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-prose text-sm text-text-muted">
            Sessions are roughly a month apart so each layer heals before the next. Dates for planned sessions are set at the end of the previous one. A deposit of {yen(p.deposit)} was taken at booking and comes off the final session.
          </p>
          <div className="mt-8">
            <ButtonLink href={`/book?artist=${p.artist}`} variant="secondary">
              Start a piece like this
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
