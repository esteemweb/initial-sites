"use client";

import type { ReactElement } from "react";
import type { Colourway } from "@/data/products";

interface ColourwaySwatchProps {
  colourway: Colourway;
  /** Shared across the group so the browser gives arrow-key selection for free. */
  name: string;
  checked: boolean;
  onSelect: () => void;
  /** Pointer devices change the image on hover (DESIGN.md §4). */
  onPreview?: () => void;
  soldOut?: boolean;
}

/**
 * One colourway swatch (DESIGN.md §4, §8).
 *
 * The visible square is 24px and the control around it is 48px, so adjacent
 * swatches sit 24px apart with a 48px pitch and a 48px hit area that never
 * overlaps its neighbour. Garment colour is content, not palette, so the square
 * carries the true hex from the catalogue; a 1px `rule` border keeps the pale
 * colourways — Bone, Rinse — from disappearing into the paper ground.
 *
 * Built on a native radio: keyboard selection, arrow keys and group semantics
 * come from the browser rather than from re-implemented key handling.
 */
export default function ColourwaySwatch({
  colourway,
  name,
  checked,
  onSelect,
  onPreview,
  soldOut = false,
}: ColourwaySwatchProps): ReactElement {
  return (
    <label
      className="relative flex size-48 cursor-pointer items-center justify-center"
      onMouseEnter={onPreview}
    >
      <input
        type="radio"
        name={name}
        value={colourway.slug}
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />

      {/* Selection marker. A border rather than a ring, because rings are drawn
          with box-shadow and this site has no UI depth (DESIGN.md §6). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute size-40 border-2 border-ink opacity-0 peer-checked:opacity-100"
      />

      <span
        aria-hidden="true"
        style={{ backgroundColor: colourway.hex }}
        className="size-24 border border-rule peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ultra"
      />

      <span className="sr-only">
        {colourway.name}
        {soldOut ? ", sold out" : ""}
      </span>
    </label>
  );
}
