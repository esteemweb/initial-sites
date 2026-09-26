import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { BasketProvider } from "@/components/basket/BasketProvider";
import BasketSlideOver from "@/components/basket/BasketSlideOver";
import SiteFooter from "@/components/chrome/SiteFooter";
import SiteHeader from "@/components/chrome/SiteHeader";

// DESIGN.md §3 — three faces, subset and preloaded from the first commit.
// next/font self-hosts the files and injects a preload link for each subset.

// Bricolage is variable with an optical-size and a width axis. Only the 800
// weight is used (DESIGN.md §3), so it is pinned rather than shipping the whole
// range — the display face is the one that has to be preloaded and small.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "PULP",
  description: "Small runs, loud colours. Printed clothing in fluorescent spot inks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${bricolage.variable} ${inter.variable} ${spaceMono.variable} h-full`}
    >
      {/* Below 768 a fixed bar sits at the foot of the viewport holding the menu
          control (DESIGN.md §8). The padding lets the page scroll clear of it,
          so it never covers the end of the footer. */}
      <body className="plotted-sheet min-h-full pb-64 text-ink antialiased tablet:pb-0">
        {/* One provider around the whole tree: every surface that adds to the
            basket may also want to open it, and the slide-over is mounted once
            here rather than per page. */}
        <BasketProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <BasketSlideOver />
        </BasketProvider>
      </body>
    </html>
  );
}
