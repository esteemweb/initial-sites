import { Archivo, IBM_Plex_Mono, Unbounded } from "next/font/google";

/**
 * DISPLAY — Archivo, variable, width axis 62–125, weight axis 100–900.
 *
 * Why Archivo: a grotesque cut from late-nineteenth-century American wood
 * and metal type, the same lineage as the condensed gothics that Belgian
 * promoters were rubbing down from Letraset sheets in 1989. At the narrow
 * end of its width axis and the black end of its weight axis it is blunt,
 * tight and slightly ink-trapped, which reads as printed rather than
 * rendered. The same file gives a light weight at normal width for reading,
 * so the body text is genuinely the display family, not a lookalike.
 *
 * Rejected: Antonio (closest to Impact, but its light weights are spindly at
 * 17px and it has no width axis), Big Shoulders (too specifically Chicago
 * signage), Oswald (overused, softer shoulders), Bebas / League Gothic /
 * Anton (one weight each, no body text possible).
 */
export const display = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
  preload: true,
  variable: "--font-display",
});

/**
 * RECORD — IBM Plex Mono, 400 and 500.
 *
 * Why Plex Mono: it descends from IBM's typewriter and terminal faces, so
 * it carries the working-document feel of a promoter's fax without the
 * costume of Courier. Even colour on a black ground at 15px, a slashed
 * zero so catalogue numbers and times read unambiguously, and a real 500
 * for the live marker. Two static weights instead of a variable file keeps
 * the download small; nothing on the site needs a mono bold.
 *
 * Rejected: Courier Prime (reads as a screenplay), Space Mono (a brand of
 * its own), JetBrains Mono and Geist Mono (they say code editor, not
 * catalogue), DM Mono (too thin on black at small sizes).
 */
export const record = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: true,
  variable: "--font-record",
});

/**
 * HEAD — Unbounded, variable weight, set at 900.
 *
 * Why: a wide, rounded, heavy grotesque that reads as club music at a
 * glance, the way techno flyers and label sleeves use it now. Its width
 * gives the wordmark mass without height, so it hits like a kick. Used
 * for the wordmark and every heading. Body text stays Archivo.
 */
export const head = Unbounded({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  preload: true,
  variable: "--font-head",
});
