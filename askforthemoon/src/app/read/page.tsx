import type { Metadata } from "next";
import Link from "next/link";
import { book, chapterOne } from "@/lib/content";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Buy } from "@/components/buy";
import { ProgressMoon } from "@/components/progress-moon";
import { BuyRail } from "@/components/buy-rail";

export const metadata: Metadata = {
  title: "Chapter one — Ask for the Moon",
  description:
    "Read the first chapter of Ask for the Moon by Thea Brandt, complete and free. A kidnapping in Lagos, run from a borrowed boardroom in London.",
};

export default function ReadPage() {
  let first = true;
  return (
    <>
      <a href="#chapter" className="skip label">
        Skip to the chapter
      </a>
      <SiteHeader />
      <main>
        <article id="chapter" className="on-page bleed pt-32 pb-32 lg:pt-48" aria-labelledby="ch-h" data-at="100">
          <header className="reader text-center mb-16 lg:mb-24">
            <p className="label">
              {book.title} · Chapter {chapterOne.number}
            </p>
            <h1 id="ch-h" className="t-display mt-6">
              {chapterOne.title}
            </h1>
          </header>

          <div className="reader reader-body">
            {chapterOne.blocks.map((b, i) => {
              if (typeof b !== "string") {
                first = true;
                return (
                  <div key={i} className="break" role="separator" aria-label="Section break">
                    <HalfMoon />
                  </div>
                );
              }
              const cls = first ? "first" : undefined;
              first = false;
              return (
                <p key={i} className={cls}>
                  {b}
                </p>
              );
            })}
          </div>
        </article>

        <section id="buy" className="section on-night" aria-labelledby="after-h" data-at="0">
          <div className="grid-12 gap-y-6 mb-16 lg:mb-24">
            <h2 id="after-h" className="label quiet col-span-12 lg:col-span-3 pt-2">
              End of chapter one
            </h2>
            <div className="col-span-12 lg:[grid-column:4/span_8]">
              <p className="say-lg">Seven more rooms, and a kitchen table.</p>
              <p className="t-body quiet mt-4">
                <Link href="/#novel" className="tap underline underline-offset-4">
                  About the novel
                </Link>{" "}
                ·{" "}
                <Link href="/#author" className="tap underline underline-offset-4">
                  About Thea Brandt
                </Link>
              </p>
            </div>
          </div>
          <Buy headingLevel={3} />
        </section>
      </main>
      <SiteFooter />
      <ProgressMoon />
      <BuyRail />
    </>
  );
}

function HalfMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="inline-block">
      <circle cx="7" cy="7" r="6.25" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M7 .75 A6.25 6.25 0 0 0 7 13.25 Z" fill="currentColor" />
    </svg>
  );
}
