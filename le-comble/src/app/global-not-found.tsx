import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "./fonts";
import { NotFoundBody } from "@/components/pages/not-found-body";
import { SITE } from "@/content/site";
import "./globals.css";

/* URLs that match no route at all (outside /fr and /en). Renders without
   the [lang] layout, so it loads its own fonts and a minimal header. */


export const metadata: Metadata = { title: `404 · ${SITE.name}` };

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <header className="border-b border-ink">
          <div className="grid-page h-64 items-center lg:h-72">
            <Link href="/fr" className="type-md col-span-12 no-underline">
              {SITE.name}
            </Link>
          </div>
        </header>
        <main id="main">
          <NotFoundBody />
        </main>
      </body>
    </html>
  );
}
