export const colours = {
  black: "#0B0B0B",
  paper: "#F0EDE6",
  ink: "#FF4A00",
  ghost: "#7A7A75",
} as const;

export type ColourName = keyof typeof colours;

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.x contrast ratio, rounded to two places. */
export function contrast(a: string, b: string) {
  const x = luminance(a);
  const y = luminance(b);
  const ratio = (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  return Math.round(ratio * 100) / 100;
}

export type Grade = "AA" | "AA large" | "fail";

/** AA: 4.5 for normal text, 3.0 for large text (24px, or 19px bold). */
export function grade(ratio: number): Grade {
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "fail";
}
