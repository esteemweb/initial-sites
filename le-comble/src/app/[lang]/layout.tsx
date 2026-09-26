import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BookingProvider } from "@/components/booking/booking-context";
import { MobileBookBar } from "@/components/booking/mobile-book-bar";
import { Lightbox } from "@/components/ui/lightbox";
import { Cloth } from "@/components/ui/cloth";
import { LOCALES, isLang } from "@/lib/i18n";
import { SITE } from "@/content/site";
import { fontVariables } from "../fonts";
import "../globals.css";

/* design-system §3 — Instrument Serif + Schibsted Grotesk, src/app/fonts.ts */

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/* The site's official address, for canonical and hreflang links —
   SECURITY-AUDIT.md A1 (26 Sep 2026). It used to be https://lecomble.fr, a
   domain this demo doesn't own, so search engines would have treated the
   deployed copy as a duplicate of someone else's site. On Vercel it is the
   project's production address (VERCEL_PROJECT_PRODUCTION_URL, set by Vercel
   at build time, host only); anywhere else, the local server. */
const SITE_URL = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3006",
);

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s · ${SITE.name}` },
  metadataBase: SITE_URL,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <BookingProvider lang={lang}>
          <SiteHeader lang={lang} />
          <main id="main">{children}</main>
          <SiteFooter lang={lang} />
          <MobileBookBar />
          <Lightbox lang={lang} />
          <Cloth />
        </BookingProvider>
      </body>
    </html>
  );
}
