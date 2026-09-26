import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { CoverBack, CoverFront, Spine } from "@/components/cover";
import { InversionSpecimen } from "@/components/inversion-specimen";
import { over, palette, ratio } from "@/lib/contrast";
import { Moon, PHASES } from "@/components/moon";
import { Found } from "@/components/found";
import { LogLine } from "@/components/log-line";
import { log } from "@/lib/content";

export const metadata: Metadata = {
  title: "Styleguide — Ask for the Moon",
  robots: { index: false, follow: false },
};

const steps = [
  { name: "display", face: "Anton", big: 128, small: 48, cls: "t-display", sample: "Proof of Life" },
  { name: "xl", face: "Anton", big: 72, small: 36, cls: "t-xl", sample: "The Kitchen Table" },
  { name: "lg", face: "Anton", big: 40, small: 28, cls: "t-lg", sample: "Hardback" },
  { name: "xl · spoken", face: "Newsreader", big: 72, small: 36, cls: "say-xl", sample: "None of it will help you." },
  { name: "lg · spoken", face: "Newsreader", big: 40, small: 28, cls: "say-lg", sample: "Eight rooms. Different worlds." },
  { name: "read", face: "Newsreader", big: 21, small: 18, cls: "t-read", sample: "She held up one finger, then a second, the way you would count a child across a road." },
  { name: "body", face: "Newsreader", big: 17, small: 16, cls: "t-body", sample: "Any bookshop in the UK or Ireland can order it in a few days." },
  { name: "record", face: "JetBrains Mono", big: 12, small: 12, cls: "label", sample: "11.52 · N: I’m here · [4 sec] · p. 141 · £18.99" },
];

type Pair = { fg: string; fgName: string; bg: string; bgName: string; use: string; text: boolean };
const { night, page, chalk, signal } = palette;
const pairs: Pair[] = [
  { fg: page, fgName: "page", bg: night, bgName: "night", use: "Primary text on night", text: true },
  { fg: chalk, fgName: "chalk", bg: night, bgName: "night", use: "Quiet text on night", text: true },
  { fg: night, fgName: "night", bg: page, bgName: "page", use: "All text on page", text: true },
  { fg: over(page, night, 0.6), fgName: "page @ 60%", bg: night, bgName: "night", use: "Unread text (Phase 6)", text: true },
  { fg: over(chalk, night, 0.6), fgName: "chalk @ 60%", bg: night, bgName: "night", use: "Unread quiet text (Phase 6)", text: true },
  { fg: over(night, page, 0.6), fgName: "night @ 60%", bg: page, bgName: "page", use: "Unread text on page (Phase 6)", text: true },
  { fg: chalk, fgName: "chalk", bg: page, bgName: "page", use: "Never", text: false },
  { fg: signal, fgName: "signal", bg: night, bgName: "night", use: "Fills only — redaction, silence", text: false },
  { fg: signal, fgName: "signal", bg: page, bgName: "page", use: "Fills only — redaction, silence", text: false },
];

const spacing = [8, 16, 24, 32, 48, 64, 96, 128, 192];

export default function Styleguide() {
  return (
    <>
      <SiteHeader initialAt={0} />
      <main>
        <section className="section on-night pt-32 lg:pt-48" data-at="0">
          <p className="label quiet">Ask for the Moon · system</p>
          <h1 className="t-display mt-6">Styleguide</h1>
          <p className="t-read measure mt-8">
            Two worlds. Night is the ground — the room at 3am with one lamp on. Page appears only
            where reading happens. Four colours, three voices, one division: a hard line at 58%.
          </p>
        </section>

        <section className="section on-night rule-t" data-at="0" aria-labelledby="c-h">
          <h2 id="c-h" className="label quiet">Colour</h2>
          <div className="grid-12 gap-y-4 mt-8">
            {Object.entries(palette).map(([name, hex]) => (
              <div key={name} className="col-span-6 lg:col-span-3">
                <div className="sg-swatch" style={{ background: hex }} />
                <p className="label mt-2">
                  {name} {hex}
                </p>
              </div>
            ))}
          </div>

          <table className="w-full mt-16 border-collapse">
            <caption className="label quiet text-left pb-4">Every pairing, measured (WCAG 2.x). Body needs 4.5, large 3.</caption>
            <thead>
              <tr className="label quiet text-left">
                <th className="py-2 pr-4 font-medium">Sample</th>
                <th className="py-2 pr-4 font-medium">Pair</th>
                <th className="py-2 pr-4 font-medium">Use</th>
                <th className="py-2 pr-4 font-medium text-right">Ratio</th>
                <th className="py-2 font-medium text-right">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p) => {
                const r = ratio(p.fg, p.bg);
                const verdict = !p.text ? "not for text" : r >= 4.5 ? "pass" : r >= 3 ? "large only" : "fail";
                return (
                  <tr key={p.fgName + p.bgName} className="rule-t">
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex items-center px-4 min-h-12 t-body"
                        style={{ background: p.bg, color: p.fg, textDecoration: p.text ? undefined : "line-through" } as CSSProperties}
                      >
                        {p.text ? "Aa — the room went quiet" : ""}
                        {!p.text && <span aria-hidden="true" style={{ display: "inline-block", width: 96, height: 16, background: p.fg }} />}
                      </span>
                    </td>
                    <td className="py-3 pr-4 label">
                      {p.fgName} on {p.bgName}
                    </td>
                    <td className="py-3 pr-4 t-body quiet">{p.use}</td>
                    <td className="py-3 pr-4 label text-right">{r.toFixed(2)}:1</td>
                    <td className="py-3 label text-right">{verdict}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="t-body quiet measure mt-6">
            Rules are 1px, decorative, and exempt from the text thresholds: chalk at 25% on night (
            {ratio(over(chalk, night, 0.25), night).toFixed(2)}:1), night at 15% on page (
            {ratio(over(night, page, 0.15), page).toFixed(2)}:1).
          </p>
        </section>

        <World name="Night" world="on-night" at={0} />
        <World name="Page" world="on-page" at={100} />

        <section className="section on-night rule-t" data-at="0" aria-labelledby="s-h">
          <h2 id="s-h" className="label quiet">Spacing · grid · rules</h2>
          <div className="mt-8 grid gap-4">
            {spacing.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="label w-16">{s}</span>
                <span style={{ width: s, height: 16, background: "var(--color-chalk)" }} aria-hidden="true" />
              </div>
            ))}
          </div>
          <p className="label quiet mt-16">12 columns · 1280 content box · 32px gutters ≥ 1024, 20px below</p>
          <div className="grid-12 sg-grid mt-4" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <p className="label quiet mt-16">Breakpoints 390 · 768 · 1024 · 1440 · radius 0 · no shadows · no gradients</p>
        </section>

        <section className="section on-page" data-at="100" aria-labelledby="i-h">
          <h2 id="i-h" className="label">The inversion, live</h2>
          <p className="t-body measure mt-4 mb-8">
            One primitive does every inversion on the site. Each side uses exactly two colours — its
            field and the opposite — and the join snaps to a whole device pixel.
          </p>
        </section>
        <div data-at="58">
          <InversionSpecimen />
        </div>

        <MoonSection world="on-night" at={0} />
        <MoonSection world="on-page" at={100} />

        <section className="section on-night rule-t" data-at="0" aria-labelledby="f-h">
          <h2 id="f-h" className="label quiet">Found objects · transcript</h2>
          <p className="t-body quiet measure mt-4">
            Built by <span className="label">scripts/make-objects.mjs</span>: night and page only,
            photocopy grain, one hand. Marginalia — never louder than what they sit beside.
          </p>
          <div className="mt-12 flex flex-wrap items-start gap-12">
            <Found name="pad" width={220} rotate={3.5} />
            <Found name="log" width={300} rotate={2.5} />
            <Found name="letter" width={220} rotate={-2} />
            <Found name="notepad" width={220} rotate={-3} />
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <Found name="note-never-first-chalk" width={150} />
            <Found name="note-who-set-it-chalk" width={150} />
            <Found name="note-never-asks-chalk" width={180} />
          </div>
          <div className="mt-16 grid gap-4">
            {Object.values(log).map((e) => (
              <LogLine key={e.t} entry={e} />
            ))}
          </div>
        </section>

        <section className="section on-night" data-at="0" aria-labelledby="k-h">
          <h2 id="k-h" className="label quiet">The cover · front, spine, back</h2>
          <div className="mt-8 flex flex-wrap items-start gap-6">
            <div className="cover-flat w-[240px] lg:w-[320px]">
              <CoverFront />
            </div>
            <div
              className="cover-flat relative bg-[var(--color-page)] text-[var(--color-night)]"
              style={{ width: 52, aspectRatio: "26 / 240", ["--t" as string]: "52px" } as CSSProperties}
            >
              <Spine />
            </div>
            <div className="cover-flat w-[240px] lg:w-[320px]">
              <CoverBack />
            </div>
          </div>
          <p className="label quiet mt-6">Case 240 × 159 mm · spine 26 mm (328 pp) · front: redacted-moon artwork, generated</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function World({ name, world, at }: { name: string; world: string; at: number }) {
  return (
    <section className={`section ${world} rule-t`} data-at={at} aria-label={`${name} world — type`}>
      <h2 className={`label ${world === "on-night" ? "quiet" : ""}`}>{name} · type</h2>
      <div className="mt-8">
        {steps.map((s) => (
          <div key={s.name} className="grid-12 gap-y-2 py-6 rule-t items-baseline">
            <p className="label col-span-12 lg:col-span-3">
              {s.name} · {s.face} · {s.big}/{s.small}
            </p>
            <p className={`${s.cls} col-span-12 lg:col-span-9 m-0`}>{s.sample}</p>
          </div>
        ))}
        <div className="grid-12 py-6 rule-t">
          <p className="label col-span-12 lg:col-span-3">measure · 66ch · 1.65</p>
          <p className="t-read measure col-span-12 lg:col-span-9 m-0">
            She had written the cards at six that morning in the hotel, in capitals, in black
            felt-tip, the way she had been taught in a Portakabin in Hendon nineteen years ago by a
            man who had since died of something ordinary. Each card had one sentence. Most of the
            sentences were questions. None of them contained a number.
          </p>
        </div>
      </div>
    </section>
  );
}

function MoonSection({ world, at }: { world: string; at: number }) {
  return (
    <section className={`section ${world} rule-t`} data-at={at} aria-label={`Moon phases on ${world === "on-night" ? "night" : "page"}`}>
      <h2 className={`label ${world === "on-night" ? "quiet" : ""}`}>
        Moon · eight phases, one per chapter · filled paths on a 24-unit grid
      </h2>
      {[12, 24, 48].map((size) => (
        <div key={size} className="grid-12 py-6 rule-t items-center mt-6">
          <p className="label col-span-12 lg:col-span-3">{size}px</p>
          <div className="col-span-12 lg:col-span-9 flex flex-wrap items-center gap-6">
            {PHASES.map((p, i) => (
              <span key={p.name} className="inline-flex items-center gap-2">
                <Moon lit={p.lit} waning={p.waning} size={size} label={`Chapter ${["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][i]}: ${p.name}`} />
                {size === 48 && <span className="label">{["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][i]}</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="grid-12 py-6 rule-t items-center mt-6">
        <p className="label col-span-12 lg:col-span-3">400px · III, waxing gibbous</p>
        <div className="col-span-12 lg:col-span-9">
          <Moon lit={0.75} size={400} className="max-w-full h-auto" label="Waxing gibbous at 400 pixels" />
        </div>
      </div>
    </section>
  );
}
