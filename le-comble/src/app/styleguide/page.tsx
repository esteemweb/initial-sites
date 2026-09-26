import { PAIRINGS, PALETTE, checkDisplay, contrast, verdict, type ColourId } from "@/lib/palette";
import { ClassProbes, LiveHex, MeasuredHeadline } from "./probes";

/* /styleguide — the visual foundation and nothing else (user foundation
   brief, 24 September 2026): the four colours with measured contrast, every
   type step at both breakpoints, proof that gold body text is not
   available, and one headline in French and English at 390px. */

const SWATCH: Record<ColourId, { bg: string; fg: string; varName: string }> = {
  indigo: { bg: "ground border border-ink", fg: "text-ink", varName: "--color-indigo" },
  chaux: { bg: "bg-chaux", fg: "text-ground", varName: "--color-chaux" },
  laque: { bg: "band border border-ink", fg: "text-chaux", varName: "--color-laque" },
  or: { bg: "bg-or", fg: "text-indigo", varName: "--background-color-or" },
};

const VERDICT_FR = { all: "tout texte", large: "≥ 24 px seulement", graphics: "graphismes", never: "refusé" };

function fmt(r: number) {
  return `${r.toFixed(2).replace(".", ",")}:1`;
}

/* Type steps. Sizes and leading come from the tokens in globals.css; each
   step is rendered twice with the ≥1024 and <1024 values forced, so both
   breakpoints are visible on one screen. */
const STEPS: {
  token: string;
  face: "serif" | "sans";
  lg: number;
  sm: number;
  leading: string;
  sample: string;
  upper?: boolean;
}[] = [
  { token: "display", face: "serif", lg: 112, sm: 44, leading: "display", sample: "Le comble" },
  { token: "xl", face: "serif", lg: 68, sm: 34, leading: "xl", sample: "Dix-neuf chambres" },
  { token: "lg", face: "serif", lg: 40, sm: 28, leading: "lg", sample: "Navette, le restaurant" },
  { token: "md", face: "serif", lg: 24, sm: 20, leading: "md", sample: "Quenelle de brochet, sauce Nantua" },
  { token: "body", face: "sans", lg: 17, sm: 16, leading: "body", sample: "Un seul menu, cinq services, 68 €. Il change toutes les trois semaines. Pas de carte, sauf au comptoir, pour ceux qui veulent une assiette et un verre." },
  { token: "small", face: "sans", lg: 14, sm: 14, leading: "small", sample: "Arrivée dès 15 h · départ avant 11 h · taxe de séjour en sus" },
  { token: "label", face: "sans", lg: 12, sm: 12, leading: "label", sample: "Pentes de la Croix-Rousse", upper: true },
];

function sizeVar(token: string, bp: "lg" | "sm") {
  if (token === "small" || token === "label") return `var(--type-${token})`;
  return `var(--type-${token}-${bp})`;
}

function Specimen({ step, bp }: { step: (typeof STEPS)[number]; bp: "lg" | "sm" }) {
  const px = bp === "lg" ? step.lg : step.sm;
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <p className="type-label">
        {bp === "lg" ? "≥ 1024" : "< 1024"} · {px} px
      </p>
      <p
        className={`${step.face === "serif" ? "font-serif font-regular" : "font-sans"} ${step.token === "label" ? "font-medium" : ""} max-w-prose`}
        style={{
          fontSize: sizeVar(step.token, bp),
          lineHeight: `var(--leading-${step.leading})`,
          letterSpacing: step.upper ? "var(--tracking-label)" : px >= 40 ? "var(--tracking-tight)" : "0",
          textTransform: step.upper ? "uppercase" : undefined,
        }}
      >
        {step.sample}
      </p>
    </div>
  );
}

export default function StyleguidePage() {
  const headline = { fr: "Dix-neuf chambres au-dessus.", en: "Nineteen rooms upstairs." };
  const rule = checkDisplay(headline.fr);

  return (
    <main className="pb-128">
      {/* pattern: styleguide header — user foundation brief */}
      <section className="section-pad border-b border-ink">
        <div className="grid-page">
          <div className="col-span-12 flex flex-col gap-24 lg:col-span-8">
            <p className="type-label">Le Comble · fondations</p>
            <h1 className="type-xl">Couleur et typographie</h1>
            <p className="max-w-prose">
              Quatre couleurs, il n&apos;y en a pas de cinquième. Deux familles. Une seule bascule, à 1024 px. Tout ce
              qui est mesuré ici l&apos;est sur la page elle-même : les couleurs sont lues dans les jetons, les
              contrastes calculés par la formule WCAG.
            </p>
          </div>
        </div>
      </section>

      {/* pattern: colour swatches with measured contrast — user foundation brief §Colour */}
      <section className="section-pad" aria-labelledby="couleur">
        <div className="grid-page gap-y-48">
          <div className="col-span-12 flex flex-col gap-12">
            <p className="type-label">01</p>
            <h2 id="couleur" className="type-lg">
              Couleur
            </h2>
          </div>
          {(Object.keys(PALETTE) as ColourId[]).map((id) => {
            const c = PALETTE[id];
            const s = SWATCH[id];
            const onIt = PAIRINGS.filter((p) => p.bg === id);
            return (
              <article key={id} className="col-span-12 flex flex-col gap-16 md:col-span-6 lg:col-span-3">
                {/* Only the ≥24px name sits on the colour; the 14px hex sits below it,
                    so no small text ever lands on gold. */}
                <div className={`${s.bg} ${s.fg} flex aspect-square flex-col justify-between rounded-image p-16`}>
                  <span className="type-lg">{id}</span>
                </div>
                <p className="type-small font-medium">
                  <LiveHex varName={s.varName} fallback={c.hex} />
                </p>
                <p className="type-small">{c.role.fr}</p>
                <p className="type-label">Utilitaires</p>
                <p className="type-small">
                  {c.utilities.map((u) => (
                    <code key={u} className="mr-8 inline-block">
                      {u}
                    </code>
                  ))}
                </p>
                <p className="type-label">Sur ce fond</p>
                <ul className="border-t border-ink">
                  {onIt.map((p) => {
                    const r = contrast(PALETTE[p.fg].hex, PALETTE[p.bg].hex);
                    return (
                      <li key={p.fg} className="type-small flex flex-col border-b border-ink py-8">
                        <span className={p.allowed ? "font-medium" : "font-medium line-through"}>
                          {p.fg} · <span className="tabular-nums">{fmt(r)}</span> · {p.allowed ? VERDICT_FR[verdict(r)] : "refusé"}
                        </span>
                        <span>{p.use.fr}</span>
                      </li>
                    );
                  })}
                  {onIt.length === 0 && <li className="type-small border-b border-ink py-8">—</li>}
                </ul>
              </article>
            );
          })}

          {/* the pairings as rendered samples */}
          <div className="col-span-12 grid grid-cols-12 gap-16">
            <p className="type-label col-span-12">Les associations, rendues</p>
            <div className="tone-field col-span-12 flex flex-col justify-between gap-12 rounded-image border border-ink p-16 md:col-span-6 lg:col-span-4">
              <p>Texte courant, chaux sur le velours indigo.</p>
              <p className="type-small font-medium tabular-nums">{fmt(contrast(PALETTE.chaux.hex, PALETTE.indigo.hex))} · tout texte · pire pixel du velours 6,24:1</p>
            </div>
            <div className="col-span-12 flex flex-col justify-between gap-12 rounded-image bg-ink p-16 text-ground md:col-span-6 lg:col-span-4">
              <p>Bouton plein : indigo sur chaux.</p>
              <p className="type-small font-medium tabular-nums">{fmt(contrast(PALETTE.indigo.hex, PALETTE.chaux.hex))} · tout texte</p>
            </div>
            <div className="band col-span-12 flex flex-col justify-between gap-12 rounded-image p-16 md:col-span-6 lg:col-span-4">
              <p>Texte courant, chaux sur la bande garance.</p>
              <p className="type-small font-medium tabular-nums">{fmt(contrast(PALETTE.chaux.hex, PALETTE.laque.hex))} · tout texte · pire pixel du brocart 5,89:1</p>
            </div>
            <div className="col-span-12 flex flex-col justify-between gap-12 rounded-image border border-ink p-16 md:col-span-6 lg:col-span-4">
              <span className="inline-flex h-48 w-fit items-center rounded-control bg-or px-24 font-medium text-indigo" style={{ fontSize: "var(--type-md-sm)" }}>
                Réserver
              </span>
              <p className="type-small font-medium tabular-nums">
                {fmt(contrast(PALETTE.indigo.hex, PALETTE.or.hex))} · bouton doré, libellé indigo
              </p>
            </div>
            <div className="col-span-12 flex flex-col justify-between gap-12 rounded-image border border-ink p-16 md:col-span-6 lg:col-span-4">
              <p className="type-lg-accent">Navette</p>
              <p className="type-small font-medium tabular-nums">
                {fmt(contrast(PALETTE.or.hex, PALETTE.indigo.hex))} · or sur indigo : titre d&apos;accent
              </p>
            </div>
            <div className="band col-span-12 flex flex-col justify-between gap-12 rounded-image p-16 md:col-span-6 lg:col-span-4">
              <svg aria-hidden viewBox="0 0 16 16" className="size-32 stroke-or" fill="none" strokeWidth="1.25">
                <path d="M2 8h11M9 4l4 4-4 4" />
              </svg>
              <p className="type-small font-medium tabular-nums">
                {fmt(contrast(PALETTE.or.hex, PALETTE.laque.hex))} · icône dorée sur la bande
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pattern: type scale at both breakpoints — user foundation brief §Type */}
      <section className="section-pad border-t border-ink" aria-labelledby="type">
        <div className="grid-page gap-y-32">
          <div className="col-span-12 flex flex-col gap-12">
            <p className="type-label">02</p>
            <h2 id="type" className="type-lg">
              Typographie
            </h2>
            <p className="max-w-prose">
              Instrument Serif 400 pour l&apos;affichage, les titres, la carte et les prix. Schibsted Grotesk 400 et 500
              pour le texte, l&apos;interface, les formulaires et la navigation. Une bascule à 1024, aucune taille
              intermédiaire. Approche −0,02 em à partir de 40 px.
            </p>
          </div>
          {STEPS.map((step) => (
            <div key={step.token} className="col-span-12 grid grid-cols-12 gap-x-24 gap-y-16 border-t border-ink pt-24">
              <div className="col-span-12 flex flex-col gap-4 lg:col-span-2">
                <p className="type-md">{step.token}</p>
                <p className="type-small">{step.face === "serif" ? "Instrument Serif 400" : step.token === "label" ? "Schibsted Grotesk 500" : "Schibsted Grotesk 400"}</p>
                <p className="type-small tabular-nums">
                  {step.lg} / {step.sm} px
                </p>
                <p className="type-small tabular-nums">
                  interlignage <code>--leading-{step.leading}</code>
                </p>
                <p className="type-small">
                  {step.upper ? "capitales, +0,08 em" : step.lg >= 40 ? (step.sm >= 40 ? "−0,02 em aux deux tailles" : "−0,02 em ≥ 1024, 0 en dessous") : "approche 0"}
                </p>
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-7">
                <Specimen step={step} bp="lg" />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-3">
                <Specimen step={step} bp="sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* pattern: refused pairing beside the passing alternative — user foundation brief §Contrast */}
      <section className="section-pad border-t border-ink" aria-labelledby="refus">
        <div className="grid-page gap-y-32">
          <div className="col-span-12 flex flex-col gap-12">
            <p className="type-label">03</p>
            <h2 id="refus" className="type-lg">
              L&apos;or ne porte pas de texte courant
            </h2>
            <p className="max-w-prose">
              L&apos;or sur la bande garance mesure {fmt(contrast(PALETTE.or.hex, PALETTE.laque.hex))} : sous le seuil de 4,5:1
              du texte courant. La règle n&apos;est pas une convention : la classe <code>text-or</code>{" "}
              n&apos;existe pas. L&apos;or ne s&apos;obtient en texte qu&apos;avec <code>type-display-accent</code>,{" "}
              <code>type-xl-accent</code> ou <code>type-lg-accent</code>, toutes au-dessus de 24 px.
            </p>
          </div>

          <figure className="col-span-12 flex flex-col gap-12 md:col-span-6">
            <figcaption className="type-label">Refusé · {fmt(contrast(PALETTE.or.hex, PALETTE.laque.hex))}</figcaption>
            <div className="band relative rounded-image border-2 border-dashed border-ink p-24">
              {/* Rendered through the raw token on purpose, to show the pairing
                  that no utility can produce. */}
              <p className="max-w-prose" style={{ color: "var(--background-color-or)" }}>
                La plupart des gens dans la salle ne dorment pas ici. Réservez, ou mangez au comptoir : six places, sans
                réservation.
              </p>
              <svg aria-hidden className="pointer-events-none absolute inset-0 size-full stroke-ink" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" strokeWidth="0.6">
                <path d="M0 0L100 100M100 0L0 100" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <p className="type-small">Texte courant doré sur la bande garance : illisible pour une partie des lecteurs.</p>
          </figure>

          <figure className="col-span-12 flex flex-col gap-12 md:col-span-6">
            <figcaption className="type-label">Accepté · {fmt(contrast(PALETTE.chaux.hex, PALETTE.laque.hex))}</figcaption>
            <div className="band rounded-image border-2 border-ink p-24">
              <p className="max-w-prose border-l-4 border-or pl-16">
                La plupart des gens dans la salle ne dorment pas ici. Réservez, ou mangez au comptoir : six places, sans
                réservation.
              </p>
            </div>
            <p className="type-small">Le texte reste chaux ; l&apos;or devient le repère, en filet.</p>
          </figure>

          <div className="col-span-12 flex flex-col gap-16">
            <p className="type-label">Preuve en direct : ce que le navigateur calcule pour chaque classe</p>
            <ClassProbes />
          </div>
        </div>
      </section>

      {/* pattern: bilingual headline test at 390px — user foundation brief §Bilingual constraint */}
      <section className="section-pad border-t border-ink" aria-labelledby="bilingue">
        <div className="grid-page gap-y-32">
          <div className="col-span-12 flex flex-col gap-12">
            <p className="type-label">04</p>
            <h2 id="bilingue" className="type-lg">
              Un titre, deux langues, 390 px
            </h2>
            <p className="max-w-prose">
              Écrit d&apos;abord en français, puis traduit. Rendu en <code>display</code> à sa taille mobile (44 px), dans
              un cadre de 390 px moins les marges de 20 px, aligné à gauche : un titre qui ne se coupe pas au même endroit
              dans les deux langues n&apos;est jamais centré.
            </p>
            <p className="type-small font-medium">
              Règle d&apos;affichage (français) : {rule.words} mots sur 4 au plus, mot le plus long « {rule.longest} » ({rule.longest.length}{" "}
              caractères sur 10) · {rule.ok ? "conforme" : "non conforme"}
            </p>
          </div>
          <div className="col-span-12 flex flex-wrap gap-24">
            {(["fr", "en"] as const).map((l) => (
              <div key={l} className="w-phone max-w-full rounded-panel border border-ink px-20 py-32">
                <MeasuredHeadline text={headline[l]} lang={l} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
