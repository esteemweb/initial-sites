/* One entry in the transcript that runs down the page, one night of it,
   section by section. Never explained. N: is Nadia; the other party is a
   redaction block. */
export type LogEntry = { t: string; who?: "N" | "X"; text?: string; pause?: string };

/* onRule: the entry sits on its section's top rule, half on, half off, with a
   field-coloured ground so the rule passes behind it. */
export function LogLine({ entry, className = "", onRule = false }: { entry: LogEntry; className?: string; onRule?: boolean }) {
  const { t, who, text, pause } = entry;
  return (
    <p className={`log label quiet ${onRule ? "log-on-rule" : ""} ${className}`}>
      <span className="log-t">{t}</span>
      {who === "N" && <span className="log-who">N:</span>}
      {who === "X" && (
        <span className="log-who">
          <span className="redact" aria-hidden="true" />
          <span className="sr-only">[other party]:</span>
        </span>
      )}
      {text && <span>{text}</span>}
      {pause && <span className="log-pause">{pause}</span>}
    </p>
  );
}
