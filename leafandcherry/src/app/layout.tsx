import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageLoader } from "@/components/layout/page-loader";
import "./globals.css";

/* design-system §3 — Fraunces carries every heading at weight 400.
   opsz is requested so font-optical-sizing: auto has an axis to drive. */
const display = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display-loaded",
  display: "swap",
});

/* Measured as the nearest Google Fonts match to the reference's Switzer
   (x/cap 0.750 vs 0.779, set width +1.2%). design-system §3. */
const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-loaded",
  display: "swap",
});

/* Not a variable font — weights must be declared. Data role only. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leaf & Cherry — Sri Lankan coffee, grown and roasted here",
  description:
    "A specialty café and micro-roastery in Colombo and Ella. Everything we pour is grown in Sri Lanka and roasted within 200 km of the cup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-surface text-text antialiased">
        <PageLoader />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
