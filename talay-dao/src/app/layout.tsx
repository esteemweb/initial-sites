import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";

/* Display: Cormorant Garamond. A high-contrast Garamond with genuine
   delicacy in the thin strokes — the register luxury hospitality actually
   uses, and it holds up at the 176px chapter numeral where a workhorse
   serif goes flat.

   Body and UI: Jost, a geometric sans. Its tracked uppercase is what makes
   the 13px labels read as considered rather than utilitarian, and it is the
   classic partner to a high-contrast serif.

   This replaces Caslon over Helvetica. On Windows that stack silently
   resolved to Arial — verified, Helvetica and Arial measured identically at
   289px — which is what made the body read as basic.

   Weight 400 only, keeping the single-weight discipline. */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-face",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talay Dao",
  description:
    "A twelve-villa sanctuary on Koh Yao Noi, between the light above and the dark water below.",
};

/* Matches --c-canvas. Single mode now, as on the reference, so this is
   static — there is no longer a theme for it to track. */
export const viewport: Viewport = {
  themeColor: "#f1ecde",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      /* Next 16 no longer forces an instant jump to the top on client
         navigation when the page uses scroll-behavior: smooth; this attribute
         asks it to keep doing so, exactly as Next 15 did. Upgrade guide,
         "Scroll Behavior Override". */
      data-scroll-behavior="smooth"
    >
      <body>
        {/* Audit fix: design-system.md §10 lists "no skip link" among the
            reference's rejected weaknesses, and the first build inherited it
            anyway. The page runs ~9 screens behind a fixed bar. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* Audit fix: every Reveal ships opacity-0 and is only un-hidden by
            IntersectionObserver, so without JS the whole essay is invisible.
            The copy is in the HTML either way; this makes it visible. */}
        <noscript>
          <style>{`[data-parallax]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>

        <Preloader />
        <Cursor />

        {children}
      </body>
    </html>
  );
}
