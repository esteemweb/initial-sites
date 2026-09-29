import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { categoryOf, getMotif, methodOf, type Motif } from "@/lib/content/motifs";
import { MotifTurn } from "./MotifTurn";

/**
 * Shared body for the motif page and the motif panel. `variant="panel"`
 * stacks everything in one column; `variant="page"` uses two.
 */
export function MotifDetail({ motif, variant }: { motif: Motif; variant: "page" | "panel" }) {
  const cat = categoryOf(motif.category);
  const method = methodOf(motif.method);
  const pairs = motif.pairsWith.map(getMotif).filter(Boolean) as Motif[];
  const Heading = variant === "page" ? "h1" : "h2";

  return (
    <div className={variant === "page" ? "grid gap-12 lg:grid-cols-12" : "grid gap-8"}>
      <div className={variant === "page" ? "lg:col-span-6" : ""}>
        <MotifTurn motif={motif} size={variant === "page" ? "hero" : "panel"} priority />
      </div>

      <div className={variant === "page" ? "lg:col-span-6" : ""}>
        <p className="eyebrow flex items-center gap-3">
          <span lang="ja" className="font-display text-base normal-case tracking-normal text-accent">
            {cat.ja}
          </span>
          <span>{cat.label}</span>
        </p>
        <Heading className={`mt-3 ${variant === "page" ? "text-4xl" : "text-3xl"}`}>
          {motif.name}{" "}
          <span lang="ja" className="font-display text-[0.7em] font-normal text-text-muted">
            {motif.ja}
          </span>
        </Heading>
        <p className="mt-1 text-sm text-text-muted">{motif.reading}</p>

        <p className="mt-6 max-w-prose text-lg">{motif.meaning}</p>
        <p className="mt-4 max-w-prose text-text-muted">{motif.lore}</p>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
          <div>
            <dt className="eyebrow">Sessions</dt>
            <dd className="mt-2 text-xl">
              {motif.sessions[0]}–{motif.sessions[1]}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Method</dt>
            <dd className="mt-2 text-xl">
              {method.label}{" "}
              <span lang="ja" className="font-display text-base text-text-muted">
                {method.ja}
              </span>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="eyebrow">Placements</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {motif.placements.map((p) => (
                <span key={p} className="rounded-sm border border-line px-2.5 py-1 text-sm">
                  {p}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        {pairs.length ? (
          <div className="mt-8 border-t border-line pt-6">
            <p className="eyebrow">Pairs with</p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {pairs.map((p) => (
                <li key={p.slug}>
                  <Link href={`/motifs/${p.slug}`} className="text-base">
                    {p.name}{" "}
                    <span lang="ja" className="font-display text-text-muted">
                      {p.ja}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`/book?motif=${motif.slug}`} variant="seal">
            Discuss this motif
          </ButtonLink>
          {variant === "panel" ? (
            <ButtonLink href={`/motifs/${motif.slug}`} variant="secondary">
              Open full page
            </ButtonLink>
          ) : (
            <ButtonLink href="/motifs" variant="secondary">
              All motifs
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
