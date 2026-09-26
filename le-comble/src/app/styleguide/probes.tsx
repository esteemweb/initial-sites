"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { contrast } from "@/lib/palette";

/* Live proof, read from the rendered page rather than asserted:
   1. the four token colours as the browser actually computes them, and the
      contrast between them measured from those computed values;
   2. the forbidden utilities: each probe carries the class and reports what
      colour the browser gave it. A class that does not exist leaves the
      element on its inherited transparent. */

function toHex(rgb: string): string {
  const m = rgb.match(/\d+/g);
  if (!m) return rgb;
  return "#" + m.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("").toUpperCase();
}

const noop = () => () => {};

export function LiveHex({ varName, fallback }: { varName: string; fallback: string }) {
  // Read the token from the rendered page; the static render shows the fallback.
  const hex = useSyncExternalStore(
    noop,
    () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim().toUpperCase();
      // The build minifies #ffffff to #fff; show the full six digits.
      return (/^#[0-9A-F]{3}$/.test(v) ? "#" + [...v.slice(1)].map((c) => c + c).join("") : v) || fallback;
    },
    () => fallback,
  );
  return (
    <span className="tabular-nums" title={`${varName} lu sur la page`}>
      {hex}
    </span>
  );
}

const PROBES: { cls: string; prop: "color" | "border-top-color" | "background-color"; expect: "missing" | "present"; note: string }[] = [
  { cls: "text-or", prop: "color", expect: "missing", note: "l'or ne porte jamais de texte courant" },
  { cls: "bg-vermillon", prop: "background-color", expect: "missing", note: "le vermillon a quitté la palette" },
  { cls: "text-ciel", prop: "color", expect: "missing", note: "le ciel a quitté la palette" },
  { cls: "border-ciel", prop: "border-top-color", expect: "missing", note: "le ciel a quitté la palette" },
  { cls: "text-ink", prop: "color", expect: "present", note: "tout le texte (chaux sur le velours indigo)" },
  { cls: "bg-or", prop: "background-color", expect: "present", note: "aplat" },
  { cls: "border-or", prop: "border-top-color", expect: "present", note: "repère, filet" },
];

export function ClassProbes() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [results, setResults] = useState<{ value: string; exists: boolean }[] | null>(null);

  useEffect(() => {
    // Each probe inherits `transparent`, so a class that exists shows up as an
    // opaque colour and a class that doesn't leaves it transparent.
    const opaque = (v: string) => {
      const m = v.match(/[\d.]+/g);
      return v !== "transparent" && !(m && m.length === 4 && Number(m[3]) === 0);
    };
    setResults(
      PROBES.map((p, i) => {
        const v = getComputedStyle(refs.current[i]!).getPropertyValue(p.prop);
        const exists = opaque(v);
        return { value: exists ? toHex(v) : "—", exists };
      }),
    );
  }, []);

  return (
    <table className="w-full border-t border-ink text-left">
      <thead>
        <tr className="border-b border-ink">
          <th className="type-label py-12 pr-16">Classe</th>
          <th className="type-label py-12 pr-16">Couleur calculée</th>
          <th className="type-label py-12 pr-16">Résultat</th>
          <th className="type-label hidden py-12 md:table-cell">Règle</th>
        </tr>
      </thead>
      <tbody>
        {PROBES.map((p, i) => {
          const r = results?.[i];
          const pass = r ? (p.expect === "missing" ? !r.exists : r.exists) : null;
          return (
            <tr key={p.cls} className="border-b border-ink">
              <td className="type-small py-12 pr-16 font-medium">
                <code>{p.cls}</code>
                {/* the probe itself: an element carrying the class */}
                <span aria-hidden style={{ color: "transparent" }}>
                  <span
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    className={`${p.cls} ml-8 inline-block border-t-2 border-solid`}
                  >
                    Aa
                  </span>
                </span>
              </td>
              <td className="type-small py-12 pr-16 tabular-nums">{r?.value ?? "…"}</td>
              <td className="type-small py-12 pr-16 font-medium">
                {r == null
                  ? "…"
                  : p.expect === "missing"
                    ? r.exists
                      ? "✗ existe — à corriger"
                      : "✓ n'existe pas"
                    : r.exists
                      ? "✓ existe"
                      : "✗ manquante"}
                {pass === false && <span className="sr-only"> (échec)</span>}
              </td>
              <td className="type-small hidden py-12 md:table-cell">{p.note}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* The bilingual headline: measured lines and characters, per language. */
export function MeasuredHeadline({ text, lang }: { text: string; lang: "fr" | "en" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current!;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      setLines(Math.round(el.getBoundingClientRect().height / lh));
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);
  return (
    <div className="flex flex-col gap-16">
      <p className="type-label">
        {lang === "fr" ? "Français" : "English"} · {text.length} {lang === "fr" ? "caractères" : "characters"} ·{" "}
        {lines ?? "…"} {lang === "fr" ? (lines === 1 ? "ligne" : "lignes") : lines === 1 ? "line" : "lines"}
      </p>
      <h3
        ref={ref}
        lang={lang}
        className="font-serif"
        style={{
          fontSize: "var(--type-display-sm)",
          lineHeight: "var(--leading-display)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {text}
      </h3>
    </div>
  );
}

export function RatioBadge({ fg, bg }: { fg: string; bg: string }) {
  return <span className="tabular-nums">{contrast(fg, bg).toFixed(2).replace(".", ",")}:1</span>;
}
