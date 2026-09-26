import type { ReactNode } from "react";

/* Data type is uppercase, but some units are case-sensitive: "PH" is not
   pH. Wrap those so `text-transform: uppercase` leaves them alone. */
const KEEP = /(\bpH\b)/;

export function keepCase(node: ReactNode): ReactNode {
  if (typeof node !== "string" || !KEEP.test(node)) return node;
  return node.split(KEEP).map((part, i) =>
    KEEP.test(part) ? (
      <span key={i} className="normal-case">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
