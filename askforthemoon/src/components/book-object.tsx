"use client";

import { useState } from "react";
import { CoverBack, CoverFront, Spine } from "./cover";

/* The hardback, flat and front-on. "Turn it over" is a real rotation of the
   case — orthographic, so the spine sweeps past mid-turn and it lands flat on
   the back. With reduced motion there is nothing to turn: both faces are shown
   side by side instead. */
export function BookObject() {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div className="book-wrap">
      <div className="cover-turn grid gap-6">
        <div className="cover-stage">
          <div
            className="book"
            data-side={side}
            role="img"
            aria-label={
              side === "front"
                ? "Front cover of Ask for the Moon: a page of a negotiation transcript with a huge circle blacked out of it, a thin crescent left unredacted, and the word MOON struck through in red."
                : "Back cover of Ask for the Moon, with the jacket copy."
            }
          >
            <div className="face face-front" aria-hidden="true">
              <CoverFront />
            </div>
            <div className="face face-spine" aria-hidden="true">
              <Spine />
            </div>
            <div className="face face-edge" aria-hidden="true" />
            <div className="face face-back" aria-hidden="true">
              <CoverBack />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn"
          aria-pressed={side === "back"}
          onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
        >
          {side === "front" ? "Turn it over" : "Turn it back"}
        </button>
      </div>

      <div className="cover-sbs">
        <figure className="m-0">
          <div className="cover-flat" role="img" aria-label="Front cover of Ask for the Moon: a transcript page with the moon redacted out of it, and MOON struck through in red.">
            <div aria-hidden="true" className="h-full">
              <CoverFront />
            </div>
          </div>
          <figcaption className="label quiet mt-2">Front</figcaption>
        </figure>
        <figure className="m-0">
          <div className="cover-flat" role="img" aria-label="Back cover of Ask for the Moon, with the jacket copy.">
            <div aria-hidden="true" className="h-full">
              <CoverBack />
            </div>
          </div>
          <figcaption className="label quiet mt-2">Back</figcaption>
        </figure>
      </div>
    </div>
  );
}
