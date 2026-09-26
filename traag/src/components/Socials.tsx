import { platformHref, type PlatformId } from "@/data/platforms";
import s from "./socials.module.css";

/** Simple drawn glyphs, not brand marks. Each link names its platform. */
const ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.8" cy="7.2" r="1.1" fill="currentColor" />
    </svg>
  ),
  bandcamp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h13l-5 10H3z" fill="currentColor" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 15v-2M6 16v-5M9 16V9M12 16V8h3a5 5 0 0 1 4.6 3A3 3 0 1 1 19 17h-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  ),
};

export const SOCIALS: { id: PlatformId; label: string }[] = [
  { id: "instagram", label: "instagram" },
  { id: "bandcamp", label: "bandcamp" },
  { id: "soundcloud", label: "soundcloud" },
  { id: "youtube", label: "youtube" },
];

export default function Socials({ className }: { className?: string }) {
  return (
    <ul className={`${s.list} ${className ?? ""}`}>
      {SOCIALS.map((x) => (
        <li key={x.id}>
          <a href={platformHref(x.id)} data-platform={x.id} className={s.icon} aria-label={`traag on ${x.label}`}>
            {ICONS[x.id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
