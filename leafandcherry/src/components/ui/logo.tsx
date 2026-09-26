/* pattern: the Leaf & Cherry mark. A coffee cherry — slightly oval, with a
   coffee bean's S-crease running through it, which is what makes it coffee
   rather than a fruit cherry — hanging from a stem with one pointed coffee
   leaf. Cherry in --color-accent, leaf in --color-leaf, crease and leaf rib in
   linen. Drawn on a 48-unit grid; legible from 16px (the favicon, which
   mirrors these paths in src/app/icon.svg) upward.

   Every part carries data-part, and the stroked ones pathLength=1, so the
   loading screen can animate the mark without measuring anything. */
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0 overflow-visible", className)}
    >
      <path
        data-part="stem"
        pathLength={1}
        d="M21 19.6 C21 13.6 23.6 9.4 28.2 6.9"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        className="stroke-leaf"
      />
      <path
        data-part="leaf"
        d="M28.2 6.9 C31.2 2.4 39.4 0.4 46.2 2.9 C42.2 9.6 33.6 11.6 28.2 6.9 Z"
        className="fill-leaf"
      />
      <path
        data-part="rib"
        pathLength={1}
        d="M30.4 6.5 C35.2 5.7 40 4.4 43.6 3.5"
        fill="none"
        strokeWidth="0.7"
        strokeLinecap="round"
        className="stroke-surface"
      />
      <ellipse
        data-part="cherry"
        cx="21"
        cy="32.2"
        rx="12.2"
        ry="13"
        className="fill-accent"
      />
      <path
        data-part="crease"
        pathLength={1}
        d="M23.4 20.6 C17.2 25.6 26.4 37 19.2 43.6"
        fill="none"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="stroke-surface"
      />
    </svg>
  );
}
