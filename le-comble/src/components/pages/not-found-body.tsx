import Link from "next/link";
import { NOT_FOUND } from "@/content/pages";
import { SITE } from "@/content/site";

/* 404 — both languages, because a missing page can't know which one you
   wanted. pattern: title cluster, design-system §7. */

export function NotFoundBody() {
  return (
    // pattern: title cluster on a chapter break — design-system §7
    <section className="section-pad-chapter" aria-labelledby="nf-title">
      <div className="grid-page">
        <div className="col-span-12 flex flex-col lg:col-span-8">
          <span aria-hidden className="warp-rule mb-24" />
          <p className="type-label mb-12 text-ink">404</p>
          <h1 id="nf-title" className="type-xl">
            {NOT_FOUND.title.fr}
          </h1>
          <p className="type-md mt-12 text-ink" lang="en">
            {NOT_FOUND.title.en}
          </p>
          <p className="mt-24 max-w-prose text-ink">{NOT_FOUND.body.fr}</p>
          <p className="max-w-prose text-ink" lang="en">
            {NOT_FOUND.body.en}
          </p>
          <div className="mt-32 flex flex-wrap gap-24">
            <Link href="/fr" className="type-small font-medium">
              {SITE.name} — Accueil
            </Link>
            <Link href="/en" className="type-small font-medium" lang="en">
              {SITE.name} — Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
