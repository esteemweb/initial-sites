/* A statement that fills in as it is read: each word starts at 0.45 opacity (still 3:1 as large text)
   and reaches full ink in turn as the line scrolls up the viewport (the
   reference's scroll-scrubbed "reading" effect, autopsy §5). CSS only
   (globals.css, .reading-line): browsers without scroll-driven animations,
   and reduced motion, show it in full ink. The words are plain spans in one
   paragraph, so it reads as one sentence to a screen reader. */

// The fill runs while the line crosses the lower-middle of the viewport
const START = 20; // % of the line's cover range
const SPAN = 35;

export function ReadingLine({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  const n = words.length;
  return (
    <p className={`reading-line ${className}`}>
      {words.map((w, i) => {
        // each word fills over three words' worth of scroll, so the edge is soft
        const a = START + (SPAN * i) / n;
        const b = Math.min(START + SPAN, a + (SPAN * 3) / n);
        return (
          <span key={i} style={{ animationRange: `cover ${a.toFixed(1)}% cover ${b.toFixed(1)}%` }}>
            {w}
            {i < n - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
