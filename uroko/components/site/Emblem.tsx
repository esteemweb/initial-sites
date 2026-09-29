import { emblemPath, emblemViewBox } from "@/lib/content/emblem-path";

/** The studio emblem as inline SVG; colour follows `currentColor`. */
export function Emblem({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox={emblemViewBox} className={className} aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" fillRule="evenodd" d={emblemPath} />
    </svg>
  );
}
