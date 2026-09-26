"use client";

import { useState } from "react";
import { formats, type Format } from "@/lib/content";

/* Choosing a format really changes where you go: each format has its own shops. */
export function Buy({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const [id, setId] = useState<Format["id"]>("hardback");
  const current = formats.find((f) => f.id === id)!;
  const H = `h${headingLevel}` as "h2" | "h3";

  return (
    <div className="grid-12 gap-y-16">
      <fieldset className="formats col-span-12 lg:col-span-5">
        <legend className="label quiet">Choose a format</legend>
        {formats.map((f) => (
          <label key={f.id} className="format">
            <input
              type="radio"
              name="format"
              value={f.id}
              checked={f.id === id}
              onChange={() => setId(f.id)}
            />
            <span className="dot" aria-hidden="true" />
            <span className="name t-lg">{f.label}</span>
            <span className="price label">{f.price}</span>
            <span className="detail t-body quiet">{f.detail}</span>
          </label>
        ))}
      </fieldset>

      <div className="col-span-12 lg:[grid-column:7/span_6]" aria-live="polite">
        <H className="label quiet mb-6">Where to buy the {current.label.toLowerCase()}</H>
        <ul className="shops">
          {id === "hardback" && (
            <li>
              <div className="py-4">
                <span className="block t-read">Your local bookshop</span>
                <span className="block t-body quiet mt-2">
                  Any bookshop in the UK or Ireland can order it in a few days. Give them the
                  title and the publisher, Bramber Press.
                </span>
              </div>
            </li>
          )}
          {current.shops.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noopener noreferrer">
                <span className="n t-read">{s.name}</span>
                <span className="label" aria-hidden="true">
                  Open ↗
                </span>
                {s.note && <span className="note t-body quiet">{s.note}</span>}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="t-body quiet mt-6 measure">
          Published in the UK and Ireland by Bramber Press; prices in pounds. Elsewhere, the
          ebook and audiobook are in the same stores in your country, and any bookshop can order
          the hardback. Libraries buy what readers ask for — asking is free.
        </p>
      </div>
    </div>
  );
}
