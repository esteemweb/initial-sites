"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import s from "./videocard.module.css";

/**
 * A rounded 16:9 (or any ratio) card with a poster and a play button.
 * Nothing loads until it is pressed; then the clip plays muted and inline
 * with native controls. The clips have no sound: the site has no audio.
 */
export default function VideoCard({
  src,
  poster,
  title,
  ratio = "16 / 9",
  position = "50% 30%",
}: {
  src: string;
  poster: string;
  title: string;
  ratio?: string;
  position?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => {
      const v = ref.current;
      if (!v) return;
      v.play().catch(() => {});
      v.focus();
    });
  };

  return (
    <div className={`${s.card} card`} style={{ aspectRatio: ratio }}>
      {playing ? (
        <video
          ref={ref}
          className={s.media}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          controls
          preload="auto"
          aria-label={title}
          style={{ objectPosition: position }}
        />
      ) : (
        <button type="button" className={s.poster} onClick={play} aria-label={`play: ${title}`}>
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 1280px, 100vw" className={s.media} style={{ objectPosition: position }} />
          <span className={s.play} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M9 7v10l8-5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
