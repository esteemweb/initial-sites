import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";

/* design-system §3 — two families, self-hosted by next/font at build time.
   subsets: "latin" covers every French character, including œ Œ « » ’ and
     all accented vowels (Google's latin range includes U+0152–0153).
   preload: the subset files are <link rel="preload">ed on every page.
   adjustFontFallback: next/font generates a metric-matched fallback face
     ("Instrument Serif Fallback" = Times New Roman at size-adjust 83.94%,
     "Schibsted Grotesk Fallback" = Arial at 104.49%) so the swap from
     fallback to web font does not shift the layout.
   Do NOT pass a `fallback` list: in Next 16 it replaces the generated
   metric-matched face instead of following it (checked in the build CSS). */

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-schibsted-grotesk",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const fontVariables = `${serif.variable} ${sans.variable}`;
