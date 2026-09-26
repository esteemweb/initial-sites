/* The palette and its rules, as data — design-system §4.
   Hex values are the single source in src/app/globals.css; this file names
   the roles, the allowed pairings and the WCAG maths. palette.test.ts checks
   that these hexes match the CSS, and that every ratio stated below is what
   the formula actually gives. */

export type ColourId = "indigo" | "chaux" | "laque" | "or";

export const PALETTE: Record<ColourId, { hex: string; role: { fr: string; en: string }; utilities: string[] }> = {
  indigo: {
    hex: "#12266B",
    role: { fr: "Le fond, en velours froissé. Le libellé du bouton doré.", en: "The ground, in crushed velvet. The gold button's label." },
    utilities: ["bg-ground", "text-ground", "ground", "tone-field", "text-indigo"],
  },
  chaux: {
    hex: "#FFFFFF",
    role: { fr: "Tout le texte, sur l'indigo et la laque. L'aplat des boutons pleins.", en: "All text, on indigo and laque. The fill of solid buttons." },
    utilities: ["text-ink", "border-ink", "bg-ink"],
  },
  laque: {
    hex: "#A5231A",
    role: { fr: "La bande, une par page : un brocart garance au motif d'or.", en: "The band, one per page: a madder brocade with a gold figure." },
    utilities: ["band"],
  },
  or: {
    hex: "#DDA73F",
    role: { fr: "L'aplat du bouton d'appel, tous les repères, les titres d'accent ≥ 24 px. Jamais de texte courant.", en: "The call-to-action fill, every mark, accent headings ≥ 24px. Never body text." },
    utilities: ["bg-or", "border-or", "stroke-mark", "type-lg-accent"],
  },
};

/* WCAG 2.x relative luminance and contrast ratio. */
export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export type Verdict = "all" | "large" | "graphics" | "never";

/** What a ratio permits: 4.5 all text, 3 large text (≥24px here), 3 graphics. */
export function verdict(ratio: number): Verdict {
  if (ratio >= 4.5) return "all";
  if (ratio >= 3) return "large";
  return "never";
}

/* Every foreground/background pairing the system allows, and the one it
   refuses outright. `use` says what the pairing may carry. */
export const PAIRINGS: {
  fg: ColourId;
  bg: ColourId;
  use: { fr: string; en: string };
  allowed: boolean;
}[] = [
  { fg: "chaux", bg: "laque", allowed: true, use: { fr: "Tout texte", en: "Any text" } },
  { fg: "or", bg: "laque", allowed: true, use: { fr: "Repères et titres ≥ 24 px, jamais de texte courant", en: "Marks and headings ≥ 24px, never body text" } },
  { fg: "indigo", bg: "laque", allowed: false, use: { fr: "Jamais", en: "Never" } },
  { fg: "indigo", bg: "chaux", allowed: true, use: { fr: "Libellés des boutons pleins", en: "Labels on solid buttons" } },
  { fg: "or", bg: "chaux", allowed: false, use: { fr: "Jamais", en: "Never" } },
  { fg: "chaux", bg: "indigo", allowed: true, use: { fr: "Tout texte", en: "Any text" } },
  { fg: "or", bg: "indigo", allowed: true, use: { fr: "Repères et titres", en: "Marks and headings" } },
  { fg: "indigo", bg: "or", allowed: true, use: { fr: "Libellé du bouton doré", en: "The gold button's label" } },
  { fg: "chaux", bg: "or", allowed: false, use: { fr: "Jamais", en: "Never" } },
];

/* Display strings: four words at most, no word over ten characters, in
   French (design-system §3, the bilingual constraint). */
export function checkDisplay(french: string): { ok: boolean; words: number; longest: string } {
  const words = french.replace(/[.,:;!?«»“”]/g, "").split(/\s+/).filter(Boolean);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), "");
  return { ok: words.length <= 4 && longest.length <= 10, words: words.length, longest };
}
