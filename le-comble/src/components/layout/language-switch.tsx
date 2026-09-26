"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LOCALES, href, isLang, resolve, type Lang } from "@/lib/i18n";
import { UI } from "@/content/site";
import { cn } from "@/lib/cn";

/* FR / EN, both visible, keeps the same page and query.
   pattern: switcher keeps context — REFERENCE-AUTOPSY §10; both options
   shown because there are only two (design-system §8). */

export function useAlternate(target: Lang, lang: Lang): string {
  const pathname = usePathname() ?? `/${lang}`;
  const search = useSearchParams();
  const [, maybeLang, ...rest] = pathname.split("/");
  if (!isLang(maybeLang)) return `/${target}`;
  const hit = resolve(lang, rest.filter(Boolean));
  const base = hit ? href(target, hit.key, hit.params) : `/${target}`;
  const qs = search?.toString();
  return qs ? `${base}?${qs}` : base;
}

function Option({ target, lang }: { target: Lang; lang: Lang }) {
  const to = useAlternate(target, lang);
  const current = target === lang;
  return current ? (
    <span aria-current="true" className="underline decoration-2 underline-offset-4">
      {target.toUpperCase()}
    </span>
  ) : (
    <Link
      href={to}
      hrefLang={target}
      lang={target}
      className="no-underline hover:underline"
    >
      {target.toUpperCase()}
    </Link>
  );
}

export function LanguageSwitch({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <nav aria-label={UI.language[lang]} className={cn("type-small font-medium flex items-center gap-8", className)}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-8">
          {i > 0 && <span aria-hidden>/</span>}
          <Option target={l} lang={lang} />
        </span>
      ))}
    </nav>
  );
}
