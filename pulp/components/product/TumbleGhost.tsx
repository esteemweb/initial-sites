"use client";

import { useEffect, type ReactElement } from "react";

export interface TumbleFlight {
  /** Bumped on every add, so repeat adds of the same garment each fly. */
  id: number;
  from: DOMRect;
  to: DOMRect;
  colour: string;
}

interface TumbleGhostProps {
  flight: TumbleFlight | null;
  onDone: () => void;
}

/**
 * The garment tumbling into the basket icon (DESIGN.md §9, 400ms).
 *
 * A fixed-position square in the chosen garment colour, flying from the button
 * that was pressed to wherever the header's basket icon was at that instant.
 * Neither position is knowable ahead of time, so **both are measured in the
 * click handler** — one event, one moment, no layout read racing a render — and
 * arrive here as plain rectangles. This component only turns them into a delta
 * for CSS via `--tumble-x` / `--tumble-y`; the rotation and shrink are the
 * tumble itself.
 *
 * Always `aria-hidden` and `pointer-events-none`: it is decoration over the top
 * of a confirmation already given in words, and it must not swallow the click
 * of somebody adding a second one quickly.
 *
 * Nothing renders under `prefers-reduced-motion` — the caller never starts a
 * flight, and shows the static confirmation instead. §9 asks for a static
 * equivalent, not an animation quietly removed.
 */

const GHOST_SIZE = 48;

export default function TumbleGhost({
  flight,
  onDone,
}: TumbleGhostProps): ReactElement | null {
  // `animationend` does the tidying, but a tab backgrounded mid-flight never
  // fires it and the ghost would sit there for good. This is the backstop.
  useEffect(() => {
    if (!flight) return;
    const timer = window.setTimeout(onDone, 800);
    return () => window.clearTimeout(timer);
  }, [flight, onDone]);

  if (!flight) return null;

  const startX = flight.from.left + flight.from.width / 2 - GHOST_SIZE / 2;
  const startY = flight.from.top + flight.from.height / 2 - GHOST_SIZE / 2;
  const endX = flight.to.left + flight.to.width / 2 - GHOST_SIZE / 2;
  const endY = flight.to.top + flight.to.height / 2 - GHOST_SIZE / 2;

  return (
    <span
      key={flight.id}
      aria-hidden="true"
      onAnimationEnd={onDone}
      style={{
        left: startX,
        top: startY,
        width: GHOST_SIZE,
        height: GHOST_SIZE,
        backgroundColor: flight.colour,
        ["--tumble-x" as string]: `${endX - startX}px`,
        ["--tumble-y" as string]: `${endY - startY}px`,
      }}
      className="pointer-events-none fixed z-50 animate-tumble border-2 border-ink"
    />
  );
}
