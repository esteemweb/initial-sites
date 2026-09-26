import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

/* The styleguide is its own root: no site header, footer or booking chrome —
   only the foundation (colour and type) it documents. */

export const metadata: Metadata = {
  title: "Styleguide · Le Comble",
  robots: { index: false, follow: false },
};

export default function StyleguideLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
