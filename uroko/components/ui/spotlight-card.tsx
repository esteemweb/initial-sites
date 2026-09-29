"use client";

// Spotlight card: a border and fill glow that follow the pointer.
// Pasted third-party component, kept close to the original. Changes for this
// codebase: "use client" (it uses effects in the App Router), the inline style
// object is typed so custom properties and width/height compile, red has no hue
// drift, and touch scrolling is not blocked. For grids of many cards (motifs):
// one shared pointer listener, throttled to one write per frame and only to
// cards on screen; the pseudo-element styles are emitted once (React 19 dedupes
// <style href>); the backdrop blur is dropped (no visible effect on a flat
// background, real cost per card). Used on the artist and motif cards (the
// user's choice); the home page stays free of glow.
import React, {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "blue" | "purple" | "green" | "red" | "orange";
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
  /** Glow on its own: a light travels around the border continuously instead of following the pointer */
  autoGlow?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 10, spread: 0 }, // vermilion (朱), no hue drift
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

// One pointer listener for every card on the page
const visible = new Set<HTMLElement>();
const mounted = new Set<HTMLElement>();
const pointer = { x: 0, y: 0, known: false };
let frame = 0;
let observer: IntersectionObserver | null = null;

function write(el: HTMLElement) {
  if (!pointer.known) return;
  el.style.setProperty("--x", pointer.x.toFixed(2));
  el.style.setProperty("--xp", (pointer.x / window.innerWidth).toFixed(2));
  el.style.setProperty("--y", pointer.y.toFixed(2));
  el.style.setProperty("--yp", (pointer.y / window.innerHeight).toFixed(2));
}

function onPointer(e: PointerEvent) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.known = true;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    visible.forEach(write);
  });
}

function track(el: HTMLElement) {
  if (mounted.size === 0) {
    document.addEventListener("pointermove", onPointer, { passive: true });
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          visible.add(card);
          write(card); // catch up with a pointer that moved while it was off screen
        } else visible.delete(card);
      }
    });
  }
  mounted.add(el);
  observer?.observe(el);
  return () => {
    mounted.delete(el);
    visible.delete(el);
    observer?.unobserve(el);
    if (mounted.size === 0) {
      document.removeEventListener("pointermove", onPointer);
      observer?.disconnect();
      observer = null;
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

// Auto glow: one shared frame loop moves a light around the border of every
// visible auto card, each at its own point in the lap so they never pulse together.
// Under reduced motion the light is placed once and stays still.
const LAP_MS = 7000;
const autoPhase = new Map<HTMLElement, number>();
const autoVisible = new Set<HTMLElement>();
let autoFrame = 0;
let autoObserver: IntersectionObserver | null = null;
let autoCount = 0;

function onPerimeter(r: DOMRect, p: number) {
  const inset = 1; // ride the border itself
  const w = r.width - 2 * inset, h = r.height - 2 * inset;
  let d = (((p % 1) + 1) % 1) * 2 * (w + h);
  if (d < w) return { x: r.left + inset + d, y: r.top + inset };
  d -= w;
  if (d < h) return { x: r.right - inset, y: r.top + inset + d };
  d -= h;
  if (d < w) return { x: r.right - inset - d, y: r.bottom - inset };
  d -= w;
  return { x: r.left + inset, y: r.bottom - inset - d };
}

function placeAuto(el: HTMLElement, now: number) {
  const r = el.getBoundingClientRect();
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { x, y } = onPerimeter(r, (still ? 0 : now / LAP_MS) + (autoPhase.get(el) ?? 0));
  el.style.setProperty("--x", x.toFixed(2));
  el.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
  el.style.setProperty("--y", y.toFixed(2));
  el.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
}

function autoTick(now: number) {
  autoFrame = 0;
  autoVisible.forEach((el) => placeAuto(el, now));
  if (autoVisible.size && !matchMedia("(prefers-reduced-motion: reduce)").matches) autoFrame = requestAnimationFrame(autoTick);
}

function trackAuto(el: HTMLElement) {
  if (!autoObserver) {
    autoObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        if (entry.isIntersecting) autoVisible.add(card);
        else autoVisible.delete(card);
      }
      if (autoVisible.size && !autoFrame) autoFrame = requestAnimationFrame(autoTick);
    });
  }
  autoPhase.set(el, (autoCount++ * 0.37) % 1);
  autoObserver.observe(el);
  return () => {
    autoPhase.delete(el);
    autoVisible.delete(el);
    autoObserver?.unobserve(el);
    if (autoPhase.size === 0) {
      autoObserver?.disconnect();
      autoObserver = null;
      cancelAnimationFrame(autoFrame);
      autoFrame = 0;
      autoCount = 0;
    }
  };
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = false,
  autoGlow = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) return autoGlow ? trackAuto(cardRef.current) : track(cardRef.current);
  }, [autoGlow]);

  const { base, spread } = glowColorMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ""; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = (): CSSProperties => {
    const baseStyles: Record<string, string | number> = {
      "--base": base,
      "--spread": spread,
      "--radius": "14",
      "--border": "3",
      "--backdrop": "hsl(0 0% 60% / 0.12)",
      "--backup-border": "var(--backdrop)",
      "--size": "200",
      "--outer": "1",
      "--border-size": "calc(var(--border, 2) * 1px)",
      "--spotlight-size": "calc(var(--size, 150) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize:
        "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative",
      // The original set touch-action: none, which stops a phone scroll that starts on the card
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles as CSSProperties;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: fixed;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
      );
      filter: brightness(2);
    }

    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
      );
    }

    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }

    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style href="glow-card" precedence="medium">
        {beforeAfterStyles}
      </style>
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? "aspect-[3/4]" : ""}
          rounded-2xl
          relative
          grid
          grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4
          gap-4
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard };
