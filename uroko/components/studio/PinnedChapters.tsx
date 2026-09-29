"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Chapter = {
  id: string;
  ja: string;
  title: string;
  body: string;
  detail?: string;
  visual?: ReactNode;
  href?: { label: string; url: string };
};

/**
 * Desktop set piece: a sticky stage that stays on screen while the visitor
 * scrolls through N viewports; each chapter cross-fades in as its sentinel
 * crosses the middle of the screen. No animation library, no scroll
 * hijacking: native scroll, position: sticky, one IntersectionObserver.
 * On phones the same content renders as plain stacked sections.
 *
 * Pinned with CSS position: sticky, no animation library.
 */
export function PinnedChapters({ chapters, eyebrow }: { chapters: Chapter[]; eyebrow?: string }) {
  const [active, setActive] = useState(0);
  const sentinels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = sentinels.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [chapters.length]);

  return (
    <>
      {/* Phones and tablets: stacked */}
      <div className="grid gap-16 lg:hidden">
        {chapters.map((c) => (
          <article key={c.id} id={c.id} className="grid gap-5 border-t border-line pt-8">
            {c.visual ? <div className="aspect-[4/5] max-h-[70svh] overflow-hidden">{c.visual}</div> : null}
            <p lang="ja" className="font-display text-4xl leading-none text-accent">
              {c.ja}
            </p>
            <h2 className="text-3xl hyphens-auto">{c.title}</h2>
            <p className="max-w-prose text-lg text-text-muted">{c.body}</p>
            {c.detail ? <p className="max-w-prose text-text-muted">{c.detail}</p> : null}
            {c.href ? (
              <a href={c.href.url} className="text-sm">
                {c.href.label}
              </a>
            ) : null}
          </article>
        ))}
      </div>

      {/* Desktop: pinned */}
      <div className="relative hidden lg:block" style={{ height: `${chapters.length * 100}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center">
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="relative col-span-5 h-[70vh]">
              {chapters.map((c, i) => (
                <div
                  key={c.id}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-[opacity,translate,scale] duration-[700ms] ease-standard ${
                    i === active ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
                  }`}
                >
                  {c.visual ? (
                    <div className="relative h-full w-full overflow-hidden">
                      {c.visual}
                      <p lang="ja" className="absolute bottom-6 left-6 font-display text-5xl leading-none text-paper drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]">
                        {c.ja}
                      </p>
                    </div>
                  ) : (
                    <p lang="ja" className="flex h-full items-center font-display text-5xl leading-none text-accent">
                      {c.ja}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="relative col-span-6 col-start-7 h-[70vh]">
              {chapters.map((c, i) => (
                <article
                  key={c.id}
                  id={c.id}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 flex flex-col justify-center transition-[opacity,translate] duration-[700ms] ease-standard ${
                    i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                  }`}
                >
                  <p className="eyebrow">
                    {eyebrow ? `${eyebrow} · ` : ""}
                    {String(i + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
                  </p>
                  <h2 className="mt-4 text-3xl hyphens-auto">{c.title}</h2>
                  <p className="mt-6 max-w-prose text-xl font-normal text-text-muted">{c.body}</p>
                  {c.detail ? <p className="mt-4 max-w-prose text-text-muted">{c.detail}</p> : null}
                  {c.href ? (
                    <a href={c.href.url} className="mt-8 inline-block text-sm">
                      {c.href.label}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <ol className="absolute bottom-8 left-0 flex gap-2" aria-hidden="true">
            {chapters.map((c, i) => (
              <li
                key={c.id}
                className={`h-px transition-[width,background-color] duration-300 ease-standard ${
                  i === active ? "w-12 bg-text" : "w-6 bg-line"
                }`}
              />
            ))}
          </ol>
        </div>

        {chapters.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              sentinels.current[i] = el;
            }}
            data-index={i}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 h-screen w-px"
            style={{ top: `${i * 100}vh` }}
          />
        ))}
      </div>
    </>
  );
}
