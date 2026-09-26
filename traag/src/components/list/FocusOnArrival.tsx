"use client";

import { useEffect, useRef } from "react";

/** A heading that takes focus when its page arrives, so keyboard and
 *  screen reader users start where the new content starts. */
export default function FocusOnArrival({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <h1 ref={ref} tabIndex={-1} className={className} style={{ outline: "none" }}>
      {children}
    </h1>
  );
}
