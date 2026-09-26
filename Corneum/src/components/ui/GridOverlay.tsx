"use client";

import { useEffect, useState } from "react";

/* Styleguide tool: draws the 12 columns over the page so alignment can be
   checked by eye. Toggle with the button or the G key. */
export function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" className="link type-data inline-flex min-h-48 cursor-pointer items-center text-left whitespace-nowrap" aria-pressed={on} onClick={() => setOn((v) => !v)}>
        {on ? "Hide grid (G)" : "Show grid (G)"}
      </button>
      {on && (
        <div aria-hidden className="grid-page pointer-events-none fixed inset-0 z-40">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-hairline" />
          ))}
        </div>
      )}
    </>
  );
}
