"use client";

import dynamic from "next/dynamic";

// three.js is ~150 KB gzipped; load it after the page is interactive, client only.
const Emblem3D = dynamic(() => import("./Emblem3D").then((m) => m.Emblem3D), { ssr: false });

export function EmblemLoader() {
  return <Emblem3D />;
}
