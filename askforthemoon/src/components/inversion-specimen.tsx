"use client";

import { useId, useState } from "react";
import { Split } from "./split";
import { MoonClips } from "./moon";
import { RoomTitle } from "./room-title";

/* The inversion, live: drag (or arrow-key) the join across a chapter row and
   watch every glyph change field at the exact pixel it crosses — including the
   first letter where it crosses the moon, and the numeral tab riding the join. */
export function InversionSpecimen() {
  const [at, setAt] = useState(58);
  const id = useId();
  return (
    <div className="grid gap-6 on-night pb-16">
      <MoonClips indices={[2]} />
      <div className="relative" style={{ ["--tab-at" as string]: `${at}%` }}>
        <Split at={at} className="room">
          <span className="room-n" aria-hidden="true" />
          <RoomTitle n="III" title="Room Nine" index={2} as="p" />
          <p className="room-where t-body">A family who cannot agree to let their father go.</p>
          <div className="room-knows">
            <p className="t-read m-0">Silence is a tool most people cannot survive four seconds of.</p>
          </div>
        </Split>
        <span className="room-tab label" aria-hidden="true">
          III
        </span>
      </div>
      <div className="grid gap-2 bleed">
        <label htmlFor={id} className="label">
          Move the join — {at}%
        </label>
        <input
          id={id}
          className="sg-range"
          type="range"
          min={0}
          max={100}
          value={at}
          onChange={(e) => setAt(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
