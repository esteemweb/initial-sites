"use client";

import { useEffect, useRef, useState } from "react";
import { book, log } from "@/lib/content";
import { LogLine } from "./log-line";

/* The line that sells it, with a silence in the middle. The second sentence
   waits a few seconds after the first is in view — long enough to be felt. */
export function PauseLine() {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"shown" | "waiting">("shown");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.6) return; // already reached: don't hide it
    setState("waiting");
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => setState("shown"), 3200);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={ref} className="section on-night rule-t pause" data-state={state} data-at="0" aria-label="The book, in two sentences">
      <LogLine entry={log.pause} onRule />
      <p className="say-xl">{book.sellingLine[0]}</p>
      <p className="say-xl second">{book.sellingLine[1]}</p>
    </section>
  );
}
