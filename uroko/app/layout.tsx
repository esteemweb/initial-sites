import type { Metadata, Viewport } from "next";
import { M_PLUS_1 } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/content/site";
import { SoundProvider } from "@/components/sound/SoundProvider";
import { Header } from "@/components/site/Header";
import { BottomBar } from "@/components/site/BottomBar";
import { Footer } from "@/components/site/Footer";
import { BootLoader } from "@/components/site/BootLoader";

// M PLUS 1: a Japanese foundry's family whose Latin is drawn to sit with kana.
const grotesk = M_PLUS_1({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-grotesk",
  display: "swap",
});

// Shippori Mincho B1 (OFL), self-hosted and subset to exactly the glyphs the
// site uses: two small files instead of ~30 unicode-range slices. After adding
// Japanese text anywhere, run `node scripts/subset-fonts.mjs`.
const shippori = localFont({
  src: [
    { path: "./fonts/shippori-mincho-b1-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/shippori-mincho-b1-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-shippori",
  display: "swap",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "serif"],
});

// The same family's Latin capitals, only for the hero masthead (5 KB).
const shipporiCaps = localFont({
  src: [{ path: "./fonts/shippori-mincho-b1-caps-400.woff2", weight: "400", style: "normal" }],
  variable: "--font-shippori-caps",
  display: "swap",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}, ${site.tagline}`,
    description: site.description,
    locale: "en_JP",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${shippori.variable} ${shipporiCaps.variable} h-full antialiased`}
      // The boot script adds a class and data attributes before hydration
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-surface text-text">
        <BootLoader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>
        <SoundProvider>
          <Header />
          <main id="main" className="flex-1 pb-[var(--bottombar-h)] lg:pb-16">
            {children}
          </main>
          <Footer />
          <BottomBar />
          {modal}
        </SoundProvider>
      </body>
    </html>
  );
}
