"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { VesselFlight } from "./VesselFlight";

/* The home page's one orchestrated moment (build prompt, "the adapted
   signature"): one pinned section, four viewports at most, where Vessel 01
   is assembled as you scroll until the dose line is understood, then
   released into normal flow.

   The vessel arrives here from the hero (VesselFlight: 90 frames rendered in
   Blender from the brief's spec, render/vessel.py --shot flight). The stage
   below is only its anchor: in the pin it turns to bring the etching round,
   fills to the 200 ML line, and the cap makes its quarter-turn.

   Server render, no JS and prefers-reduced-motion all get the static
   version: one still (front on, filled to the line) with all four steps
   listed. */

const STILL = "/frames/flight/lg/0090.webp";
const STILL_ALT =
  "Vessel 01: a clear, thick-walled glass cylinder with a brushed steel collar etched CORNEUM, a knurled steel cap and a weighted steel base. Graduation marks every 25 ml lead up to a single etched line marked 200 ML, and the vessel is filled with clear liquid exactly to that line.";

const STEPS = [
  { caption: "Borosilicate laboratory glass. You can see the fill level.", figure: "180 × 62 MM", label: "Height × diameter" },
  { caption: "Graduations every 25 ml, like a measuring cylinder.", figure: "25 ML", label: "Graduation" },
  { caption: "One line at 200 ML. The instruction is the object.", figure: "200 ML", label: "Dose line" },
  { caption: "Quarter-turn steel cap. No pump. Corneum pours.", figure: "90°", label: "Cap, quarter-turn" },
];

function StaticVessel() {
  return (
    <div className="grid-page gap-y-40">
      <div className="relative col-span-10 col-start-2 aspect-4/5 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5 lg:row-span-4">
        <Image src={STILL} alt={STILL_ALT} fill sizes="(min-width: 1024px) 33vw, 80vw" className="rounded-none object-cover" />
      </div>
      <ol className="col-span-12 border-b border-hairline lg:col-span-4 lg:col-start-9 lg:row-start-1">
        {STEPS.map((s, i) => (
          <li key={s.figure} className="grid gap-8 border-t border-hairline py-16">
            <span className="type-data text-ink-muted">
              {String(i + 1).padStart(2, "0")} / 04 · {s.label}
            </span>
            <span className="type-body max-w-measure">{s.caption}</span>
            <span className="type-data text-green">{s.figure}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function VesselPin() {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPinned(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return pinned ? <Pinned /> : <StaticVessel />;
}

function Pinned() {
  const track = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(track);

  const step = Math.min(3, Math.floor(p * 4));
  const current = STEPS[step];

  return (
    <div ref={track} data-vessel-track className="pin-track relative">
      <VesselFlight />
      {/* Screen readers get the four steps as a list, not a caption that
          rewrites itself while scrolling. */}
      <ol className="sr-only">
        {STEPS.map((s) => (
          <li key={s.figure}>
            {s.caption} {s.label}: {s.figure}.
          </li>
        ))}
      </ol>

      <div aria-hidden className="grid-page sticky top-0 h-svh content-center gap-y-24">
        <div className="col-span-12 grid content-start gap-16 lg:col-span-4 lg:self-center">
          <span className="type-data text-ink-muted">{String(step + 1).padStart(2, "0")} / 04</span>
          <p key={step} className="type-h3 max-w-measure transition-opacity duration-720 ease-enter starting:opacity-0">
            {current.caption}
          </p>
        </div>

        <div className="col-span-10 col-start-2 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5 lg:row-start-1">
          <div data-vessel-anchor="pin" className="aspect-4/5 w-full" />
        </div>

        <div className="col-span-12 grid content-start gap-8 lg:col-span-3 lg:col-start-9 lg:row-start-1 lg:self-center">
          <span key={step} className="type-h3 font-mono font-regular uppercase text-green transition-opacity duration-720 ease-enter starting:opacity-0">
            {current.figure}
          </span>
          <span className="type-data text-ink-muted">{current.label}</span>
        </div>
      </div>
    </div>
  );
}
