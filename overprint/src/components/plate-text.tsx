/* design-system §4 PlateText — the K plate is the readable text; C/M/Y are
   aria-hidden duplicates that multiply underneath it, offset by --plate-shift.
   `decorative` hides the whole stack (use when a sibling carries the words). */
type PlateTextProps = {
  children: string;
  className?: string;
  decorative?: boolean;
};

export function PlateText({ children, className = "", decorative = false }: PlateTextProps) {
  return (
    <span className={`plate-stack ${className}`} aria-hidden={decorative || undefined}>
      <span className="plate plate-y" aria-hidden="true">
        {children}
      </span>
      <span className="plate plate-c" aria-hidden="true">
        {children}
      </span>
      <span className="plate plate-m" aria-hidden="true">
        {children}
      </span>
      <span className="plate-k">{children}</span>
    </span>
  );
}

/* design-system §8 inline ink chip — two overlapping discs in a headline */
const chipInks = {
  cm: ["bg-cyan", "bg-magenta"],
  my: ["bg-magenta", "bg-yellow"],
  yc: ["bg-yellow", "bg-cyan"],
} as const;

export function InkChip({ inks }: { inks: keyof typeof chipInks }) {
  const [a, b] = chipInks[inks];
  return (
    <span className="ink-chip" aria-hidden="true">
      <span className={a} />
      <span className={b} />
    </span>
  );
}
