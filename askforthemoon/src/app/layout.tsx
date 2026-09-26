import type { Metadata, Viewport } from "next";
import { Anton, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

/* Three voices. Anton for titles; Newsreader for everything read; JetBrains
   Mono for the record — timestamps, labels, folios, prices. All self-hosted at
   build time, Latin subset, preloaded. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

/* Static 400 regular + italic rather than the variable font with its optical
   size axis: ~70KB instead of ~280KB preloaded, which brings first paint on a
   throttled phone under 2s. The one weight is all the site uses. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
  variable: "--font-newsreader",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-jetbrains",
  display: "swap",
});

const description =
  "Eight rooms. Eight negotiations. One she cannot win. The first novel by Thea Brandt, who spent eleven years as a crisis negotiator. Bramber Press, 2026.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3007"),
  title: "Ask for the Moon — a novel by Thea Brandt",
  description,
  openGraph: {
    title: "Ask for the Moon — a novel by Thea Brandt",
    description,
    type: "book",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Ask for the Moon — the cover, lit on one side and in shadow on the other." }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#12131A",
  colorScheme: "dark",
};

const INTRO_OFF = `window.__noIntro&&document.documentElement.classList.add("intro-off")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${anton.variable} ${newsreader.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* before first paint: the audit turns the moon intro off (see Intro) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_OFF }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
