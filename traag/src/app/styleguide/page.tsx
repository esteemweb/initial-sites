import type { Metadata } from "next";
import Image from "next/image";
import { colours, contrast, grade, type ColourName } from "@/lib/colour";
import her01 from "@/photos/her-01-front.png";
import dt from "@/components/duotone.module.css";
import s from "./styleguide.module.css";

// a design reference for client presentations: reachable by link, kept out of search
export const metadata: Metadata = { title: "styleguide", robots: { index: false, follow: false } };

const names = Object.keys(colours) as ColourName[];

const pairs = names.flatMap((fg) =>
  names.filter((bg) => bg !== fg).map((bg) => ({ fg, bg, ratio: contrast(colours[fg], colours[bg]) })),
);

type Step = {
  token: string;
  cls: string;
  mobile: number;
  desktop: number;
  lh: string;
  face: string;
  sample: React.ReactNode;
};

const steps: Step[] = [
  {
    token: "mark",
    cls: "t-mark",
    mobile: 120,
    desktop: 288,
    lh: "0.82",
    face: "display · wdth 62 · 900",
    sample: "traag",
  },
  {
    token: "xl",
    cls: "t-xl",
    mobile: 64,
    desktop: 120,
    lh: "0.9",
    face: "display · wdth 62 · 900",
    sample: "nul is out",
  },
  {
    token: "lg",
    cls: "t-lg",
    mobile: 40,
    desktop: 64,
    lh: "0.95",
    face: "display · wdth 62 · 900",
    sample: "no guest list. ask anyway",
  },
  {
    token: "md",
    cls: "t-md",
    mobile: 26,
    desktop: 36,
    lh: "1",
    face: "display · wdth 62 · 800",
    sample: "vertraging — 2025 — 300 copies",
  },
  {
    token: "body",
    cls: "t-body",
    mobile: 17,
    desktop: 18,
    lh: "1.5",
    face: "display · wdth 100 · 300",
    sample: (
      <>
        <p>
          first bookings at eighteen, all warm-up slots. ten to midnight, empty room, nobody
          listening. so i played slow, because there is no point playing fast to twelve people.
        </p>
        <p>by the time someone offered me peak time i had worked out i did not want one.</p>
      </>
    ),
  },
  {
    token: "record",
    cls: "t-record",
    mobile: 15,
    desktop: 15,
    lh: "1.5",
    face: "record · 400",
    sample: (
      <>
        <p>04.04.2026&nbsp;&nbsp;ghent&nbsp;&nbsp;kompass&nbsp;&nbsp;doors 23:00</p>
        <p>TRG-002&nbsp;&nbsp;12&quot;&nbsp;&nbsp;45rpm&nbsp;&nbsp;6 tracks&nbsp;&nbsp;104 bpm</p>
        <p>A3&nbsp;&nbsp;ledeberg&nbsp;&nbsp;09:12</p>
      </>
    ),
  },
  {
    token: "record label",
    cls: "t-record-label",
    mobile: 15,
    desktop: 15,
    lh: "1.5",
    face: "record · 500 · +0.04em · caps",
    sample: (
      <>
        <p>next</p>
        <p>sold out</p>
        <p className="ink">● 04.04 kompass — ghent</p>
      </>
    ),
  },
];

const ramp = [8, 16, 24, 32, 48, 64, 96, 128, 192];

const states = [
  { name: "1 plain", cls: dt.plain, recipe: "grayscale · contrast 1.15 · brightness 0.85", grain: false },
  { name: "2 posterised", cls: dt.poster, recipe: "grayscale · 6 tones · black→ink · grain 12%", grain: true },
  { name: "3 threshold", cls: dt.threshold, recipe: "grayscale · contrast 2.2 · brightness 0.8 · cut 52% · black/ink", grain: false },
  { name: "4 inverted", cls: dt.inverted, recipe: "as 3, colours swapped", grain: false },
];

export default function Styleguide() {
  return (
    <main className={`container ${s.page}`}>
      <header className={s.head}>
        <h1 className="t-xl">styleguide</h1>
        <p className="t-record ghost">phase 2 · foundation</p>
      </header>

      {/* -------------------------------------------------- colour */}
      <section className={s.section} aria-labelledby="colour">
        <div className={s.head}>
          <h2 id="colour" className="t-lg">colour</h2>
          <p className="t-record ghost">four values. there is no fifth</p>
        </div>

        <div className={s.swatches}>
          {names.map((n) => (
            <div
              key={n}
              className={s.swatch}
              style={{ background: colours[n], color: n === "paper" || n === "ink" ? colours.black : colours.paper }}
            >
              <span className="t-record-label">{n}</span>
              <span className="t-record">{colours[n]}</span>
            </div>
          ))}
        </div>

        <div className={s.pairs}>
          {pairs.map(({ fg, bg, ratio }) => {
            const g = grade(ratio);
            return (
              <div key={`${fg}-${bg}`} className={s.pair} style={{ background: colours[bg], color: colours[fg] }}>
                <span className={`${s.pairSample} t-md`}>{fg} on {bg}</span>
                <span className={`${s.pairMeta} t-record`}>
                  <span>{ratio.toFixed(2)} : 1</span>
                  <span>{g}</span>
                </span>
              </div>
            );
          })}
        </div>

        <div className={`${s.note} t-body`} style={{ marginTop: "var(--s5)" }}>
          <p>
            Measured, not assumed. Two pairings the brief implies are not AA for text and will not be used as
            text: ink on paper and paper on ink sit under 3 : 1, so on paper surfaces ink is reserved for rules
            and marks. Ghost on paper passes only at large sizes, so muted text on paper is set in black. Ghost
            on black clears 4.5 : 1 with nothing to spare, which is fine for record text and wrong for body.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------- type */}
      <section className={s.section} aria-labelledby="type">
        <div className={s.head}>
          <h2 id="type" className="t-lg">type</h2>
          <p className="t-record ghost">archivo · ibm plex mono · switches once at 1024</p>
        </div>

        <div className={`${s.note} t-body`}>
          <p>
            Display is Archivo at the narrow end of its width axis and the black end of its weight axis: a
            grotesque from the same wood-type lineage as the condensed gothics on a 1989 flyer, blunt and
            slightly ink-trapped. Body is the same file at normal width and a light weight, so there is no
            third face. Record is IBM Plex Mono, typewriter and terminal by descent, with a slashed zero so
            catalogue numbers and door times read unambiguously.
          </p>
        </div>

        <div className={`${s.typeHead} t-record ghost`} aria-hidden="true">
          <span>step</span>
          <span>below 1024</span>
          <span>1024 and up</span>
        </div>

        {steps.map((st) => {
          const wide = st.token === "mark";
          return (
            <div key={st.token} className={`${s.typeRow} ${wide ? s.typeRowWide : ""}`}>
              <div className={`${s.typeMeta} t-record`}>
                <span className="t-record-label">{st.token}</span>
                <span className="ghost">{st.face}</span>
                <span className="ghost">
                  {st.mobile}px / {st.desktop}px · lh {st.lh}
                </span>
              </div>
              <div className={`${s.sample} ${st.cls}`} style={{ fontSize: st.mobile, lineHeight: st.lh }}>
                {st.sample}
              </div>
              <div
                className={`${s.sample} ${st.cls} ${wide ? s.sampleWide : ""}`}
                style={{ fontSize: st.desktop, lineHeight: st.lh }}
              >
                {st.sample}
              </div>
            </div>
          );
        })}

        <div className={`${s.note} t-body`} style={{ marginTop: "var(--s4)" }}>
          <p>
            Body never below 16px. Line length capped at 66 characters. Record text is 15px at both sizes: it
            is not body text, it is a label, and it stays the same size so a date row looks like the same
            document on a phone and on a desk.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------- spacing */}
      <section className={s.section} aria-labelledby="spacing">
        <div className={s.head}>
          <h2 id="spacing" className="t-lg">spacing</h2>
          <p className="t-record ghost">nine steps. nothing in between</p>
        </div>
        <div className={s.ramp}>
          {ramp.map((v, i) => (
            <div key={v} className={s.rampRow}>
              <span className="t-record ghost">
                s{i + 1} · {v}
              </span>
              <div className={s.rampBar} style={{ width: v }} />
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------- grid */}
      <section className={s.section} aria-labelledby="grid">
        <div className={s.head}>
          <h2 id="grid" className="t-lg">grid</h2>
          <p className="t-record ghost">12 columns · 1280 box · 32 gutters at 1024, 20 below</p>
        </div>
        <div className={`grid ${s.gridDemo}`} aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} />
          ))}
        </div>
        <p className="t-record ghost" style={{ marginTop: "var(--s2)" }}>
          breakpoints 390 · 768 · 1024 · 1440. base styles are written for 390.
        </p>
      </section>

      {/* -------------------------------------------------- duotone */}
      <section className={s.section} aria-labelledby="duotone">
        <div className={s.head}>
          <h2 id="duotone" className="t-lg">duotone</h2>
          <p className="t-record ghost">live. one image, four filter states</p>
        </div>

        <div className={s.states}>
          {states.map((st) => (
            <figure key={st.name} className={s.state}>
              <div className={`${dt.frame} ${s.stateFrame}`}>
                <Image
                  src={her01}
                  alt="Lore Verbeke, straight on, black t-shirt, against a concrete wall, lit by direct flash"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className={st.cls}
                  placeholder="empty"
                />
                {st.grain && <div className={dt.grain} aria-hidden="true" />}
              </div>
              <figcaption className="t-record">
                <span className="t-record-label">{st.name}</span>
                <br />
                <span className="ghost">{st.recipe}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={`${s.note} t-body`} style={{ marginTop: "var(--s5)" }}>
          <p>
            The blacks are crushed before the cut. Without that, the mid-grey concrete behind every studio
            portrait flips to ink at 52% and the silhouette is lost. With it, the wall goes to black and only
            the flash-lit skin survives, which is the photocopy the brief is asking for.
          </p>
        </div>
      </section>

      {/* -------------------------------------------------- rules */}
      <section className={s.section} aria-labelledby="rules">
        <div className={s.head}>
          <h2 id="rules" className="t-lg">everything else</h2>
        </div>
        <ul className={`${s.rules} t-record`}>
          <li>radius 0 everywhere. no exceptions</li>
          <li>no shadows. no gradients. no blur. depth is inversion and overlap</li>
          <li>orange is one thing per screen and never a field</li>
          <li>paper appears where reading happens</li>
          <li>nothing is pure #000000 or pure #FFFFFF</li>
          <li>link hover: opacity 0.7, 160ms</li>
          <li>focus: 2px ink outline, 3px offset. black on paper</li>
          <li>prefers-reduced-motion: final state, immediately</li>
          <li>touch targets 48px. nothing hover-only</li>
        </ul>
      </section>
    </main>
  );
}
