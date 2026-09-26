"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { HOME } from "@/content/home";
import { UI } from "@/content/site";
import { href, type Lang } from "@/lib/i18n";
import { addDays, formatDate, formatTime, type ISODate } from "@/lib/dates";
import { servicesOn, sittingIsFuture, sittings } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { useToday } from "@/components/booking/use-today";
import { ButtonLink } from "@/components/ui/button";

/* The home hero's panel, and everything that moves in it — user request
   (25 Sep 2026): "the hero page is super still and boring. put some motion,
   interaction and fun elements".

   - Entrance: the headline rises word by word out of a mask, then the lines
     below follow (`rise`, staggered by --i).
   - The turning word: "On vient pour dîner. / trinquer. / Camille. /
     Navette." A gold thread is redrawn under each. Pauses while the pointer
     or focus is on the panel; screen readers get the real title only.
   - Candlelight: on a fine pointer, a gold pool of light follows the cursor
     over the video, the video drifts against it and the panel leans with it.
   - Tonight: the real dinner sittings still open (lib/booking), as chips that
     go straight to the table booking. Other guests book while you look.
   Reduced motion: no turning, no pointer effects, entrance instant (the
   global rule), the ribbon still. */

const T = HOME.hero;
const TURN_MS = 2800;
const TICK = { min: 9000, spread: 6000 };

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduce;
}

const at = (i: number) => ({ "--i": i }) as CSSProperties;

/* ── the headline ─────────────────────────────────────────────────────── */

function Headline({ lang, paused }: { lang: Lang; paused: boolean }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const endings = T.endings.map((e) => e[lang]);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % endings.length);
    }, TURN_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, endings.length]);

  const words = T.lead[lang].split(" ");
  return (
    <h1 id="hero-title" className="type-display">
      <span className="sr-only">{T.title[lang]}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <span key={w}>
            <span className="word-mask">
              <span className="word-rise" style={at(i)}>
                {w}
              </span>
            </span>{" "}
          </span>
        ))}
        {/* the turning word: every ending stacked in one cell, so the line
            never jumps; the current one in place, the last one leaving up */}
        <span className="word-mask relative">
          <span className="word-rise col-start-1 row-start-1 grid" style={at(words.length)}>
            {endings.map((e, i) => {
              const prev = (index - 1 + endings.length) % endings.length;
              return (
                <span
                  key={e}
                  className={cn(
                    "col-start-1 row-start-1 transition duration-(--duration-slow) ease-standard",
                    i === index ? "translate-y-0 opacity-100" : i === prev ? "-translate-y-full opacity-0" : "translate-y-full opacity-0",
                  )}
                >
                  {/* the gold thread, as wide as this word, redrawn each time it arrives */}
                  <span className="relative inline-block">
                    {e}
                    {i === index && <span key={index} className="thread absolute inset-x-0 bottom-0" />}
                  </span>
                </span>
              );
            })}
          </span>
        </span>
      </span>
    </h1>
  );
}

/* ── tonight's sittings ───────────────────────────────────────────────── */

function fill(s: string, v: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
}

function Tonight({ lang, i }: { lang: Lang; i: number }) {
  const today = useToday();
  const [now] = useState(() => new Date());
  const [taken, setTaken] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const reduce = useReducedMotion();

  // the next evening with a dinner sitting still open, within a week
  let day: ISODate | null = null;
  let open: { time: string; left: number }[] = [];
  if (today) {
    for (let d = 0, iso = today; d < 8; d++, iso = addDays(today, d)) {
      if (!servicesOn(iso).includes("dinner")) continue;
      const list = sittings(iso, "dinner", today).filter((s) => s.left > 0 && sittingIsFuture(iso, s.time, today, now));
      if (list.length) {
        day = iso;
        open = list.slice(0, 4);
        break;
      }
    }
  }
  const live = open.map((s) => ({ ...s, left: Math.max(0, s.left - (taken[s.time] ?? 0)) }));
  const key = live.map((s) => `${s.time}|${s.left}`).join(",");

  // other guests booking while you look: now and then a table of two goes
  useEffect(() => {
    if (!key || reduce) return;
    const id = window.setTimeout(() => {
      const choices = key.split(",").map((k) => k.split("|")).filter(([, l]) => Number(l) >= 2);
      if (!choices.length) return;
      const [time] = choices[Math.floor(Math.random() * choices.length)];
      setTaken((t) => ({ ...t, [time]: (t[time] ?? 0) + 2 }));
      setFlash(time);
    }, TICK.min + Math.random() * TICK.spread);
    return () => window.clearTimeout(id);
  }, [key, reduce]);

  // the same height before and after the sittings arrive (no layout shift):
  // a label and at most two rows of two chips, at every width
  if (!today || !day) return <div className="rise mt-24 min-h-128" style={at(i)} />;

  const label =
    day === today
      ? T.tonight.today[lang]
      : fill(T.tonight.later[lang], {
          day: (([f, ...r]) => f.toUpperCase() + r.join(""))(formatDate(day, lang, { weekday: "long" })),
        });
  const book = (time: string) => `${href(lang, "bookTable")}?date=${day}&service=dinner&time=${time}&party=2&step=2`;

  return (
    <div className="rise mt-24 flex min-h-128 flex-col gap-12" style={at(i)}>
      <p className="type-small flex items-center gap-8 font-medium">
        <span aria-hidden className="live-dot" />
        <span className="sr-only">{T.tonight.live[lang]} · </span>
        {label}
      </p>
      <ul className="grid max-w-sheet grid-cols-2 gap-8">
        {live.map((s) => (
          <li key={s.time}>
            <Link
              href={book(s.time)}
              className={cn(
                "type-small flex w-full items-center justify-center gap-8 whitespace-nowrap rounded-full border px-12 py-8 font-medium tabular-nums no-underline transition-colors duration-(--duration-fast) ease-standard",
                s.left > 0 ? "border-ink hover:border-or hover:bg-or hover:text-indigo" : "pointer-events-none border-dashed border-ink line-through",
                flash === s.time && "chip-flash border-or",
              )}
              onAnimationEnd={() => setFlash(null)}
            >
              <span>{formatTime(s.time, lang)}</span>
              <span className="opacity-75">{fill(T.tonight.seats[lang], { n: s.left })}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {flash ? fill(T.tonight.booked[lang], { time: formatTime(flash, lang) }) : ""}
      </p>
    </div>
  );
}

/* ── the stage: pointer light, drift and lean ─────────────────────────── */

export function HeroStage({ lang, ribbon }: { lang: Lang; ribbon: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const section = panel.current?.closest("section");
    if (!section || reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      section.style.setProperty("--px", cur.x.toFixed(3));
      section.style.setProperty("--py", cur.y.toFixed(3));
      raf = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      target.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      section.style.setProperty("--gx", `${e.clientX - r.left}px`);
      section.style.setProperty("--gy", `${e.clientY - r.top}px`);
      section.style.setProperty("--glow", "1");
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      section.style.setProperty("--glow", "0");
      if (!raf) raf = requestAnimationFrame(loop);
    };
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  return (
    <>
      <div aria-hidden className="candle-glow" />
      <div className="grid-page relative w-full items-end pb-96 pt-20 lg:pb-72 lg:pt-24">
        <div
          ref={panel}
          onPointerEnter={() => setHold(true)}
          onPointerLeave={() => setHold(false)}
          onFocus={() => setHold(true)}
          onBlur={() => setHold(false)}
          className="hero-tilt col-span-12 lg:col-span-6"
        >
          <div className="ground rise rounded-panel p-24 lg:p-48" style={at(0)}>
            <p className="type-label rise mb-24 text-ink" style={at(0)}>
              {T.eyebrow[lang]}
            </p>
            <Headline lang={lang} paused={hold} />
            <p className="type-lg rise mt-12" style={at(5)}>
              {T.second[lang]}
            </p>
            <p className="type-body rise mt-24 border-t border-ink pt-16 font-medium tabular-nums" style={at(6)}>
              {T.fact[lang]}
            </p>
            <Tonight lang={lang} i={7} />
            <div className="rise mt-24 flex flex-wrap items-center gap-24" style={at(8)}>
              <ButtonLink href={href(lang, "bookTable")} variant="accent">
                {UI.bookTable[lang]}
              </ButtonLink>
              <ButtonLink href={href(lang, "rooms")} variant="text">
                {UI.seeRooms[lang]}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      {ribbon}
    </>
  );
}
