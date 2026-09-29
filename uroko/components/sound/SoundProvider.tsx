"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { site } from "@/lib/content/site";

type SoundStatus = "off" | "loading" | "on" | "unavailable";

type SoundContextValue = {
  status: SoundStatus;
  toggle: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "uroko:sound";
const TARGET_VOLUME = 0.4;
const FADE_MS = 1200;

function fadeTo(el: HTMLAudioElement, to: number, done?: () => void) {
  const from = el.volume;
  const start = performance.now();
  let raf = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / FADE_MS);
    const eased = 1 - Math.pow(1 - t, 3);
    el.volume = from + (to - from) * eased;
    if (t < 1) raf = requestAnimationFrame(step);
    else done?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/**
 * Sound is OFF by default and nothing is fetched until the visitor turns it
 * on. The `<audio>` element is created lazily on the first toggle. The
 * choice is remembered, but a remembered "on" still waits for a click:
 * browsers block audio without a gesture, and we do not want to surprise
 * anyone arriving from a link.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SoundStatus>("off");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cancelFade = useRef<() => void>(() => {});

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    el.src = site.audio.src;
    el.addEventListener("error", () => {
      setStatus("unavailable");
    });
    audioRef.current = el;
    return el;
  }, []);

  const turnOn = useCallback(async () => {
    const el = ensureAudio();
    setStatus("loading");
    try {
      await el.play();
      cancelFade.current();
      cancelFade.current = fadeTo(el, TARGET_VOLUME);
      setStatus("on");
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {}
    } catch {
      setStatus("unavailable");
    }
  }, [ensureAudio]);

  const turnOff = useCallback(() => {
    const el = audioRef.current;
    setStatus("off");
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch {}
    if (!el) return;
    cancelFade.current();
    cancelFade.current = fadeTo(el, 0, () => {
      el.pause();
      el.currentTime = 0;
    });
  }, []);

  const toggle = useCallback(() => {
    if (status === "on" || status === "loading") turnOff();
    else if (status === "off") void turnOn();
  }, [status, turnOn, turnOff]);

  // Pause when the tab is hidden; resume only if it was on.
  useEffect(() => {
    const onVisibility = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) el.pause();
      else if (status === "on") void el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [status]);

  useEffect(() => {
    return () => {
      cancelFade.current();
      audioRef.current?.pause();
    };
  }, []);

  const value = useMemo(() => ({ status, toggle }), [status, toggle]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
}
