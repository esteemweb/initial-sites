import type { Metadata, Viewport } from "next";
import { display, head, record } from "./fonts";
import DuotoneDefs from "@/components/DuotoneDefs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PlatformSheet from "@/components/platform/PlatformSheet";
import Reveal from "@/components/Reveal";

// Runs before first paint. Motion styles only apply when this attribute is
// present, so reduced motion and no-JS both get the final state at once.
// If the app script never starts, a three second fallback turns motion
// back off so nothing stays hidden.
const MOTION =
  "try{var h=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){h.setAttribute('data-motion','');setTimeout(function(){if(!h.hasAttribute('data-reveal-ready'))h.removeAttribute('data-motion')},3000)}}catch(e){}";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TRAAG",
    template: "%s — TRAAG",
  },
  description: "traag. 98 to 112 bpm. ghent.",
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${record.variable} ${head.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION }} />
      </head>
      <body>
        <DuotoneDefs />
        {/* Loader: pure CSS, runs on every full page load, stays finished
            across in-site navigation. 140 bpm slows to 100, then lifts. */}
        <div className="loader" aria-hidden="true">
          <div className="loader-inner">
            <p className="loader-bpm">
              <span className="loader-num" />
              <span className="loader-unit t-record-label">bpm</span>
            </p>
            <div className="loader-fader">
              <span />
            </div>
            <p className="loader-line t-record">slowing down</p>
          </div>
        </div>
        <a href="#content" className="skip t-record-label">
          skip to content
        </a>
        <SiteHeader />
        <div id="content">{children}</div>
        <SiteFooter />
        <PlatformSheet />
        <Reveal />
      </body>
    </html>
  );
}
