"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { registerReveal } from "@/components/revealRegistry";

/* Per-character reveal — refs/tandjung-sari §8.

   TAKEN directly: the reference pre-splits every heading into `.word` and
   `.char` wrapper spans and reveals them individually. The autopsy recorded
   the split but the first build ignored it, which is a large part of why the
   page read static next to the reference.

   Each char rises and fades on the reference's own curve. Stagger is ours
   (--duration-stagger was `not measurable` on the reference, being applied
   from JS).

   Accessibility: the visible text is split into spans, so the whole string is
   also exposed once via an aria-label with the spans hidden from the
   accessibility tree. Screen readers read the sentence, not the letters. */

export function SplitText({
  text,
  as: Tag = "span",
  className = "",
  /** Delay before the first character, in stagger units. */
  offset = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    /* Scroll-driven, not IntersectionObserver: the rail moves panels with a
       transform, which IO does not reliably re-evaluate. See
       revealRegistry.ts. */
    return registerReveal(el, () => setShown(true));
  }, []);

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag
      ref={ref as never}
      className={className}
      aria-label={text}
      data-split={shown ? "shown" : "hidden"}
    >
      {words.map((word, w) => (
        /* The inter-word space MUST sit outside .split-word. That span is
           inline-block, and trailing whitespace inside an inline-block is
           collapsed — which rendered the wordmark as "TalayDao". */
        <Fragment key={`${word}-${w}`}>
          <span className="split-word" aria-hidden="true">
          {[...word].map((ch, c) => {
            const i = charIndex++;
            return (
              <span
                key={`${ch}-${c}`}
                className="split-char"
                style={{
                  transitionDelay: `calc(var(--duration-stagger) * ${(i + offset) * 0.14})`,
                }}
              >
                {ch}
              </span>
            );
          })}
          </span>
          {w < words.length - 1 ? <span aria-hidden="true"> </span> : null}
        </Fragment>
      ))}
    </Tag>
  );
}
