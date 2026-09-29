import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Ring } from "@/components/ui/Ring";
import { pieces, progress } from "@/lib/content/pieces";
import { getArtist } from "@/lib/content/artists";
import { getMotif } from "@/lib/content/motifs";

export const metadata: Metadata = {
  title: "Piece tracker",
  description: "Follow a multi-session tattoo at Uroko: what is done, what is healing, what is next.",
};

export default async function PiecesPage({ searchParams }: PageProps<"/pieces">) {
  const sp = await searchParams;
  const notfound = Array.isArray(sp.notfound) ? sp.notfound[0] : sp.notfound;
  return (
    <section className="stage">
      <div className="stage-inner">
        {notfound !== undefined ? (
          <p role="alert" className="mb-8 border-l-2 border-err pl-4 text-err">
            No piece found for “{notfound}”. Check the reference on your booking confirmation.
          </p>
        ) : null}
        <SectionHeading
          level="h1"
          eyebrow="Piece tracker"
          ja="経過"
          title="Where your piece is."
          lead="Large work happens over months. Each piece has a private page with the plan, the sessions done, what is healing and what comes next. Enter the reference from your booking, or open one of the demo pieces."
        />

        <form action="/pieces/lookup" method="get" className="mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="ref" className="eyebrow block">
              Piece reference
            </label>
            <input
              id="ref"
              name="ref"
              placeholder="UR-24-0031"
              className="mt-2 h-12 w-full border-b border-line bg-surface-raised px-3 font-mono text-base uppercase outline-none placeholder:normal-case placeholder:text-text-muted/70 focus:border-shu"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center bg-text px-6 text-sm font-medium text-surface hover:bg-shu hover:text-shu-fg"
          >
            Open
          </button>
        </form>

        <h2 className="mt-16 text-2xl">Demo pieces</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {pieces.map((p) => {
            const a = getArtist(p.artist);
            const pr = progress(p);
            const motifNames = p.motifs.map((m) => getMotif(m)?.name).filter(Boolean).join(", ");
            return (
              <li key={p.id}>
                <Link href={`/pieces/${p.id}`} className="grid grid-cols-[5rem_1fr] items-center gap-6 py-5 no-underline hover:bg-surface-deep sm:grid-cols-[5rem_1fr_1fr_8rem]">
                  <Ring ratio={pr.ratio} label={`${pr.done}`} size={80} />
                  <div>
                    <p className="font-mono text-sm text-text-muted">{p.id}</p>
                    <p className="text-lg font-medium">
                      {motifNames} · {p.placement}
                    </p>
                  </div>
                  <p className="hidden text-sm text-text-muted sm:block">
                    {a?.name} · {p.method === "both" ? "machine + tebori" : p.method}
                  </p>
                  <p className="hidden text-sm sm:block">
                    {pr.done} of {pr.total} sessions
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
