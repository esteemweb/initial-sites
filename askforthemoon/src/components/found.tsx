import Image from "next/image";
import type { CSSProperties } from "react";

/* A found object from Thea's world — built by scripts/make-objects.mjs, placed
   slightly off-angle. Quiet: never louder than what it sits beside. */
export const FOUND = {
  pad: { w: 300, h: 400, alt: "A legal pad: “Graham — 6.00”, boxed, then crossed out. Under it: “who says six?”, “8.00 → theirs”, “ask the forty”." },
  log: { w: 360, h: 250, alt: "A printed call log for the family line. The last call, 16.40, lasting four seconds, is circled by hand: “no speech”." },
  letter: { w: 300, h: 390, alt: "A solicitor’s letter, folded in three: a clause 14.2 drag-along notice. The recipient’s name and the signature are blacked out." },
  notepad: { w: 260, h: 330, alt: "A hotel notepad from Lagos, room 412, in capitals: “SAY NOTHING.” “WHAT WOULD HE NEED TO SEE?” “2ND MAN — YOUNGER”." },
  "note-never-first-chalk": { w: 190, h: 90, alt: "Handwritten in the margin: “never first”." },
  "note-never-first-night": { w: 190, h: 90, alt: "Handwritten in the margin: “never first”." },
  "note-who-set-it-chalk": { w: 190, h: 90, alt: "Handwritten in the margin: “who set it?”" },
  "note-who-set-it-night": { w: 190, h: 90, alt: "Handwritten in the margin: “who set it?”" },
  "note-never-asks-chalk": { w: 230, h: 90, alt: "Handwritten in the margin: “she never asks”." },
  "note-never-asks-night": { w: 230, h: 90, alt: "Handwritten in the margin: “she never asks”." },
} as const;

export function Found({
  name,
  width,
  rotate = 0,
  className = "",
  decorative = false,
}: {
  name: keyof typeof FOUND;
  /** display width in CSS px; height follows the object */
  width: number;
  rotate?: number;
  className?: string;
  /** true when the same object is already described nearby (e.g. the inert copy in a Split) */
  decorative?: boolean;
}) {
  const o = FOUND[name];
  const style: CSSProperties = { transform: `rotate(${rotate}deg)`, width, height: "auto" };
  return (
    <Image
      src={`/objects/${name}.webp`}
      width={o.w}
      height={o.h}
      alt={decorative ? "" : o.alt}
      sizes={`${width}px`}
      loading="lazy"
      className={`found ${className}`}
      style={style}
    />
  );
}
