"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/* The cover's device, and the only way inversion is done on this site: the same
   content lit on one side of a hard vertical line and in shadow on the other.
   The dark copy is the real one; the lit copy is a clipped, inert duplicate — so
   avoid ids inside `children`. Each layer uses exactly two colours, its field and
   the opposite, so every glyph that crosses the join inverts.

   The join is snapped to a whole device pixel (--at-px) so thin strokes are never
   cut mid-pixel; the percentage in --at is the no-JS fallback. If the element is
   animating --at, snapping waits for the animation to finish. */
export function Split({
  at,
  as: Tag = "div",
  className = "",
  layerClassName = "",
  children,
  ...rest
}: {
  at?: number;
  as?: ElementType;
  className?: string;
  layerClassName?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | number | undefined>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    const snap = () => {
      const pct = at ?? parseFloat(getComputedStyle(el).getPropertyValue("--at"));
      if (Number.isNaN(pct)) return;
      const dpr = window.devicePixelRatio || 1;
      const px = Math.round(el.getBoundingClientRect().width * (pct / 100) * dpr) / dpr;
      el.style.setProperty("--at-px", `${px}px`);
    };
    const ro = new ResizeObserver(snap);
    el.style.removeProperty("--at-px");
    Promise.all(el.getAnimations().map((a) => a.finished))
      .catch(() => undefined)
      .then(() => {
        if (!alive) return;
        snap();
        ro.observe(el);
      });
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [at]);

  const style = at === undefined ? undefined : ({ "--at": `${at}%` } as CSSProperties);
  return (
    <Tag ref={ref} className={`split ${className}`} style={style} {...rest}>
      <div className={`layer layer-dark ${layerClassName}`}>{children}</div>
      <div className={`layer layer-lit ${layerClassName}`} aria-hidden="true" inert>
        {children}
      </div>
    </Tag>
  );
}
