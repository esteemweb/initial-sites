"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* The home hero loop — user request (24 Sep 2026), built to avoid what the
   reference got wrong (REFERENCE-AUTOPSY §5.3, §7.4: 23 MB on load, no
   poster, no pause, no reduced-motion):
   - a still frame shows first (and is all that reduced-motion or data-saver
     visitors ever get);
   - the video is attached only after the page's own `load` event;
   - portrait screens get a portrait crop (0.5 MB), landscape 1080p (1.6 MB);
   - the first and last frames match, so `loop` is seamless;
   - a pause button, always visible. The video is decorative (aria-hidden);
     the still carries the alt text. */

const COPY = {
  alt: {
    fr: "La salle de Navette à l'heure bleue : la longue salle sous les poutres, des bougies sur les tables dressées, Fourvière illuminée derrière les hautes fenêtres.",
    en: "Navette's dining room at blue hour: the long room under the beams, candles on the laid tables, Fourvière lit up beyond the tall windows.",
  },
  pause: { fr: "Mettre la vidéo en pause", en: "Pause the video" },
  play: { fr: "Lire la vidéo", en: "Play the video" },
};

export function HeroVideo({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const onPlay = () => {
      setPlaying(true);
      setShown(true);
    };
    const onPause = () => setPlaying(false);
    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const start = () => {
      if (reduce || saveData) return;
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      v.src = portrait ? "/video/hero-portrait.mp4?v=2" : "/video/hero-1080.mp4?v=2";
      v.play().catch(() => {});
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
      window.removeEventListener("load", start);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (!v.src) {
      // reduced-motion / data-saver visitors can still choose to play it
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      v.src = portrait ? "/video/hero-portrait.mp4?v=2" : "/video/hero-1080.mp4?v=2";
    }
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div className="absolute inset-0">
      <div className="hero-parallax absolute inset-0">
      <picture>
        <source media="(orientation: portrait)" srcSet="/video/hero-poster-portrait.webp?v=2" />
        <img
          src="/video/hero-poster.webp?v=2"
          alt={COPY.alt[lang]}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      <video
        ref={ref}
        aria-hidden
        muted
        loop
        playsInline
        preload="none"
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-(--duration-slow) ease-standard",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? COPY.pause[lang] : COPY.play[lang]}
        aria-pressed={!playing}
        className="absolute right-20 top-20 z-10 flex size-48 items-center justify-center rounded-full border border-ink bg-ground text-ink hover:bg-ink hover:text-ground lg:bottom-96 lg:right-48 lg:top-auto"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="size-16" fill="currentColor">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
    </div>
  );
}
