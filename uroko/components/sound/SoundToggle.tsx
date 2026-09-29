"use client";

import { useSound } from "./SoundProvider";
import { site } from "@/lib/content/site";

const labels = {
  off: "Sound off",
  loading: "Starting",
  on: "Sound on",
  unavailable: "No audio",
} as const;

/** A plain labelled toggle. Sound only ever starts from here. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const { status, toggle } = useSound();
  const pressed = status === "on" || status === "loading";
  const disabled = status === "unavailable";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={pressed}
      disabled={disabled}
      title={disabled ? "The ambience track is not installed yet" : site.audio.label}
      className={`inline-flex h-11 items-center whitespace-nowrap px-2 text-xs underline-offset-4 hover:underline disabled:opacity-40 ${
        pressed ? "text-text" : "text-text-muted"
      } ${className}`}
    >
      {labels[status]}
    </button>
  );
}
