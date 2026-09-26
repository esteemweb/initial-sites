import type { Metadata } from "next";
import { Tangerine, Jost } from "next/font/google";
import "./globals.css";

/* design-system §3 — Tangerine carries every headline. Static font: only 400 and
   700 exist; headings run at 700. */
const tangerine = Tangerine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tangerine",
  display: "swap",
});

/* design-system §3 — Jost carries all running text and UI. Variable (wght). */
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Overprint — design studio, Manchester",
  description:
    "Overprint is a Manchester graphic design studio making identities, print and type, layered in live CMYK ink.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${tangerine.variable} ${jost.variable}`}>
      <body className="paper-grain">{children}</body>
    </html>
  );
}
