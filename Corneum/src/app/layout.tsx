import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { CartProvider } from "@/lib/cart";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* design-system §Type: Geist Sans is variable, so display 300 and body 400
   come from one file. Self-hosted at build, preloaded, metric-matched fallback. */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

/* design-system §Type: Geist Mono 400, uppercase, for data and labels. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Corneum",
  description: "Clinical scalp care from Boston. A glass-and-steel vessel you buy once; concentrate refills with every active and percentage on the front.",
};

/* No maximumScale, no userScalable: pinch zoom stays enabled. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {/* First focusable element: keyboard users skip the navigation */}
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
