"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { buttonClass } from "./button";

/* The lightbox — design-system §5 (25 Sep 2026). One per page, mounted in the
   layout. It listens for clicks on any `[data-lightbox]` photo (see photo.tsx),
   so photographs stay server-rendered and need no client code of their own.
   Native <dialog> + showModal: focus is trapped and returned by the browser,
   Esc closes. ← → move through every photo on the page in reading order;
   clicking outside the photo closes. The page behind does not scroll. */

type Item = { src: string; alt: string; frame: string; el: HTMLElement };

const T = {
  close: { fr: "Fermer", en: "Close" },
  prev: { fr: "Photo précédente", en: "Previous photo" },
  next: { fr: "Photo suivante", en: "Next photo" },
  label: { fr: "Photographie agrandie", en: "Enlarged photograph" },
};

/* square 48px arrow buttons: an outline that turns gold on hover — the arrow
   is a gold mark, so the fill never inverts under it (or/chaux is 2.17) */
const ICON_BUTTON =
  "inline-flex size-48 items-center justify-center rounded-control border border-ink transition-colors duration-(--duration-fast) ease-standard hover:border-or";

function collect(): Item[] {
  return [...document.querySelectorAll<HTMLElement>("[data-lightbox]")].map((el) => ({
    src: el.dataset.src ?? "",
    alt: el.dataset.alt ?? "",
    frame: el.dataset.frame ?? "portrait",
    el,
  }));
}

export function Lightbox({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);

  const close = useCallback(() => ref.current?.close(), []);
  const step = useCallback((d: number) => setIndex((i) => (items.length ? (i + d + items.length) % items.length : 0)), [items.length]);

  // open on any photo click, anywhere on the page
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-lightbox]");
      if (!el) return;
      e.preventDefault();
      const all = collect();
      setItems(all);
      setIndex(Math.max(0, all.findIndex((i) => i.el === el)));
      ref.current?.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    d.addEventListener("close", onClose);
    d.addEventListener("keydown", onKey);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const item = items[index];
  const many = items.length > 1;

  return (
    <dialog
      ref={ref}
      aria-label={T.label[lang]}
      onClick={(e) => {
        // a click on the dialog itself (not on the photo or a control) closes it
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop !== undefined) close();
      }}
      className="ground fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none p-0 text-ink backdrop:bg-ground"
    >
      <div data-backdrop className="lightbox-stage">
        <div data-backdrop className="flex items-center justify-between">
          <p className="type-label tabular-nums" aria-live="polite">
            {many ? `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}` : ""}
          </p>
          <button type="button" onClick={close} className={buttonClass("secondary")} autoFocus>
            {T.close[lang]}
          </button>
        </div>

        <div data-backdrop className="flex min-h-0 flex-1 items-center justify-center">
          {item && (
            // eslint-disable-next-line @next/next/no-img-element -- the full file, shown as is
            <img
              key={item.src}
              src={item.src}
              alt={item.alt}
              className="lightbox-in max-h-full max-w-full rounded-image object-contain"
            />
          )}
        </div>

        <div data-backdrop className="flex flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-prose">{item?.alt}</p>
          {many && (
            <div className="flex shrink-0 gap-8">
              <button type="button" onClick={() => step(-1)} aria-label={T.prev[lang]} className={ICON_BUTTON}>
                <svg aria-hidden viewBox="0 0 16 16" className="size-16 shrink-0 rotate-180 stroke-mark" fill="none" strokeWidth="1.25">
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </button>
              <button type="button" onClick={() => step(1)} aria-label={T.next[lang]} className={ICON_BUTTON}>
                <svg aria-hidden viewBox="0 0 16 16" className="size-16 shrink-0 stroke-mark" fill="none" strokeWidth="1.25">
                  <path d="M2 8h11M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
