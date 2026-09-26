"use client";

/* pattern: label text-scramble — autopsy §15.6. The reference's eyebrow
   labels decode left to right as they enter: resolved characters, then a
   short tail of random glyphs, then blank. Only ever used on the mono face,
   where every glyph is the same width, so the row never reflows.

   The real text is rendered by React and stays in the DOM for screen readers
   (sr-only); the visible copy is aria-hidden and its text node is rewritten
   in place. Rewriting the node React already owns, rather than swapping it,
   is what keeps reconciliation safe. No JS, reduced motion or an unmounted
   effect all leave the real text showing. */
import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion, useInViewOnce } from "@/lib/motion";

const GLYPHS = "#%&*+/<=>?_|~0123456789";
const TAIL = 4; // scrambling characters ahead of the resolved run
const NBSP = " ";

const blank = (s: string) => s.replace(/\S/g, NBSP);

export function ScrambleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const armed = useRef(false);
  const timer = useRef(0);

  const write = (s: string) => {
    const node = ref.current?.firstChild;
    if (node) node.nodeValue = s;
  };

  // Hide the text until it is in view — but only once we know we can play it.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    armed.current = true;
    write(blank(text));
    return () => {
      window.clearInterval(timer.current);
      write(text);
    };
  }, [text]);

  const play = useCallback(() => {
    if (!armed.current) return;
    const duration = Math.min(900, 300 + text.length * 35);
    const t0 = performance.now();
    timer.current = window.setInterval(() => {
      const t = (performance.now() - t0) / duration;
      if (t >= 1) {
        window.clearInterval(timer.current);
        write(text);
        return;
      }
      const head = t * (text.length + TAIL);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (/\s/.test(c) || i < head - TAIL) out += c;
        else if (i < head) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += NBSP;
      }
      write(out);
    }, 40);
  }, [text]);

  useInViewOnce(ref, play);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="whitespace-pre">
        {text}
      </span>
    </>
  );
}
