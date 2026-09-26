"use client";

import Image, { getImageProps, type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import her01 from "@/photos/her-01-front.png";
import her03 from "@/photos/her-03-eyes-closed.png";
import her04 from "@/photos/her-04-closeup.png";
import her05 from "@/photos/her-05-three-quarter.png";
import her06 from "@/photos/her-06-outside.png";
import Link from "next/link";
import LiveMarker from "./LiveMarker";
import dt from "./duotone.module.css";
import s from "./hero.module.css";

type Portrait = { src: StaticImageData; alt: string; position: string };

const PORTRAITS: Portrait[] = [
  {
    src: her01,
    alt: "Lore Verbeke straight on, black t-shirt, concrete wall, direct flash throwing a hard shadow to the right",
    position: "50% 32%",
  },
  {
    src: her05,
    alt: "Lore Verbeke turned three-quarters, looking back at the camera, same concrete wall",
    position: "50% 32%",
  },
  {
    src: her03,
    alt: "Lore Verbeke with her eyes closed, head tilted down, hair over one eye",
    position: "50% 36%",
  },
  {
    src: her06,
    alt: "Lore Verbeke outside a venue at night, brick wall, cigarette, looking away, a queue behind her",
    position: "55% 30%",
  },
  {
    src: her04,
    alt: "Lore Verbeke's face very close: eyes, brows and the flash hotspot on her forehead",
    position: "50% 42%",
  },
];

/**
 * Timing. Each state fades in over 400ms and holds for 900ms, so one
 * portrait runs 4 × 1300 = 5200ms before the next one fades in over it.
 * The four state layers of a portrait share one CSS timeline (see
 * hero.module.css), so every frame of the cycle is compositor work.
 *
 * The next portrait is mounted a full cycle early with its start time
 * pinned to the current one's clock. Chrome will not start a composited
 * animation until its layers are rasterised, and four SVG-filtered layers
 * take a second or two to raster on a phone; mounted early, that happens
 * while it is invisible, and it begins on the exact millisecond.
 *
 * Only the first portrait is React. It is server-rendered, so the page's
 * largest image paints before any script runs. Every later portrait is
 * built as plain DOM from image URLs computed once, and removed the same
 * way: React does no work at all after hydration. On a 4× throttled CPU
 * that is the difference between ~250ms and well under 150ms of main
 * thread per cycle.
 */
const PERIOD = 5200;
const FADE = 400;

const SIZES = "(min-width: 1024px) 50vw, 100vw";
const FILTERS = [dt.plain, dt.poster, dt.threshold, dt.inverted];
const LAYERS = [s.l1, s.l2, s.l3, s.l4];

// The exact attributes next/image would render for each portrait.
const IMG = PORTRAITS.map(
  (p) => getImageProps({ src: p.src, alt: "", fill: true, sizes: SIZES, quality: 70 }).props,
);

// Each portrait is built once and re-attached on later loops: its images
// are already chosen, fetched and decoded, and re-inserting a node
// restarts its CSS animations from zero, which is exactly what we want.
const built = new Map<number, HTMLDivElement>();
function portraitNode(index: number): HTMLDivElement {
  let node = built.get(index);
  if (!node) {
    node = buildPortrait(index);
    built.set(index, node);
  }
  return node;
}

function buildPortrait(index: number): HTMLDivElement {
  const p = PORTRAITS[index];
  const a = IMG[index];
  const root = document.createElement("div");
  root.className = `${s.portrait} ${s.scheduled}`;
  FILTERS.forEach((filter, k) => {
    const layer = document.createElement("div");
    layer.className = `${s.layer} ${LAYERS[k]}`;
    if (k > 0) layer.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.alt = k === 0 ? p.alt : "";
    img.decoding = "async";
    if (a.srcSet) img.srcset = a.srcSet;
    if (a.sizes) img.sizes = a.sizes;
    img.src = a.src;
    img.className = filter;
    Object.assign(img.style, a.style, { objectPosition: p.position });
    layer.appendChild(img);
    if (k === 1) {
      const grain = document.createElement("div");
      grain.className = dt.grain;
      layer.appendChild(grain);
    }
    root.appendChild(layer);
  });
  return root;
}

/** The first portrait, server-rendered: the same image four times, one filter per layer. */
function FirstPortrait({ rootRef }: { rootRef: React.RefObject<HTMLDivElement | null> }) {
  const p = PORTRAITS[0];
  const style = { objectPosition: p.position };
  return (
    <div ref={rootRef} className={`${s.portrait} ${s.first}`}>
      <div className={`${s.layer} ${s.l1}`}>
        <Image src={p.src} alt={p.alt} fill sizes={SIZES} quality={70} priority className={dt.plain} style={style} />
      </div>
      <div className={`${s.layer} ${s.l2}`} aria-hidden="true">
        <Image src={p.src} alt="" fill sizes={SIZES} quality={70} loading="eager" className={dt.poster} style={style} />
        <div className={dt.grain} />
      </div>
      <div className={`${s.layer} ${s.l3}`} aria-hidden="true">
        <Image src={p.src} alt="" fill sizes={SIZES} quality={70} loading="eager" className={dt.threshold} style={style} />
      </div>
      <div className={`${s.layer} ${s.l4}`} aria-hidden="true">
        <Image src={p.src} alt="" fill sizes={SIZES} quality={70} loading="eager" className={dt.inverted} style={style} />
      </div>
    </div>
  );
}

export default function Hero({ hasVideo }: { hasVideo: boolean }) {
  const [reduced, setReduced] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const dynRef = useRef<HTMLDivElement>(null);
  const crowdRef = useRef<HTMLVideoElement>(null);
  // With a showreel, the stills cycle is only the fallback: it runs when
  // there is no video, or the video errors, is refused autoplay, or has not
  // started playing within four seconds.
  const running = !reduced && !videoReady && (!hasVideo || videoFailed);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // The crowd behind: plays on screens wide enough to see it, and never
  // when motion is reduced (the poster frame stays).
  useEffect(() => {
    const v = crowdRef.current;
    if (!v) return;
    const wide = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      if (wide.matches && !reduced) {
        v.preload = "auto";
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    };
    sync();
    wide.addEventListener("change", sync);
    return () => wide.removeEventListener("change", sync);
  }, [reduced]);

  // The cycle engine. Plain DOM, no React state.
  useEffect(() => {
    const first = firstRef.current;
    const stage = dynRef.current;
    if (!running || !first || !stage) return;
    let alive = true;
    const timers: number[] = [];

    const started = (el: HTMLElement, index: number, begun: number) => {
      if (!alive) return;
      // once this one has faded in, drop everything underneath it
      // (the first portrait is outside the managed container, so there is
      // nothing under it to drop)
      if (el !== first) {
        timers.push(
          window.setTimeout(() => {
            for (const child of [...stage.children]) {
              if (child === el) break;
              child.remove();
            }
            first.style.display = "none";
          }, FADE + 50),
        );
      }
      // Queue the next portrait, pinned to start exactly one period later.
      // Done in idle time, not in the frame where this one is fading in.
      const queue = () => {
        if (!alive) return;
        const next = (index + 1) % PORTRAITS.length;
        const node = portraitNode(next);
        stage.appendChild(node);
        const startAt = Math.max(begun + PERIOD, performance.now() + 1500);
        node.getAnimations({ subtree: true }).forEach((a) => {
          a.startTime = startAt - PERIOD;
        });
        const l1 = node.firstElementChild as HTMLElement;
        const onStart = (e: AnimationEvent) => {
          if (e.target !== l1) return;
          l1.removeEventListener("animationstart", onStart);
          const a = l1.getAnimations()[0];
          started(node, next, a && a.startTime !== null ? Number(a.startTime) + PERIOD : performance.now());
        };
        l1.addEventListener("animationstart", onStart);
      };
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(queue, { timeout: 1200 });
        timers.push(-id);
      } else {
        timers.push(window.setTimeout(queue, FADE + 100));
      }
    };

    const a = (first.firstElementChild as HTMLElement | null)?.getAnimations()[0];
    a?.ready
      .then(() => started(first, 0, Number(a.startTime ?? performance.now())))
      .catch(() => {
        /* animation cancelled before it started: nothing to schedule */
      });

    return () => {
      alive = false;
      timers.forEach((t) => (t < 0 ? window.cancelIdleCallback(-t) : window.clearTimeout(t)));
      stage.replaceChildren();
      first.style.display = "";
    };
  }, [running]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const onPlaying = () => {
      window.clearTimeout(timer);
      setVideoReady(true);
    };
    const onError = () => setVideoFailed(true);
    const timer = window.setTimeout(() => {
      if (v.paused || v.readyState < 3) setVideoFailed(true);
    }, 4000);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("error", onError, true);
    v.play().catch(onError);
    return () => {
      window.clearTimeout(timer);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("error", onError, true);
    };
  }, [reduced, hasVideo]);

  return (
    <section className={s.hero} aria-label="traag" data-hero="">
      {/* the room behind her, tinted and dark */}
      <div className={s.bg} aria-hidden="true">
        {/* the crowd, headbanging. Darkened and blurred in the file itself;
            only wide screens load it, since on phones the portrait covers it */}
        <video
          ref={crowdRef}
          className={s.bgVideo}
          poster="/traag/crowd.jpg"
          muted
          loop
          playsInline
          preload="none"
        >
          <source src="/traag/crowd.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={s.stage}>
        {/* the stills stay underneath: they are the first paint, and the
            video fades in over them rather than over black */}
        <FirstPortrait rootRef={firstRef} />
        {/* later portraits live here, managed outside React */}
        <div ref={dynRef} className={s.dynamic} />
        {hasVideo && !reduced && (
          <video
            ref={videoRef}
            className={`${s.video} ${!videoFailed ? s.videoReady : ""}`}
            muted
            loop
            playsInline
            preload="auto"
            poster="/traag/poster.jpg"
            aria-hidden="true"
          >
            <source src="/traag/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      <div className={s.scrim} aria-hidden="true" />

      <div className={s.live}>
        <LiveMarker />
      </div>

      <div className={s.foot}>
        <h1 className={s.mark} aria-label="traag">
          {/* each letter slams in on a 16th note at 100 bpm, then the word
              kicks on every beat. Letters are hidden from screen readers;
              the heading reads as one word. */}
          <span className={s.word}>
            {"traag".split("").map((ch, i) => (
              <span key={i} className={s.letter} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
                {ch}
              </span>
            ))}
          </span>
        </h1>
        <Link href="/biography" className={`${s.cue} u-link t-record-label`}>
          read her story
        </Link>
      </div>
    </section>
  );
}
