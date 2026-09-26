/* WCAG 2.x contrast, measured — the styleguide prints these, it does not assert them. */

export const palette = {
  night: "#12131A",
  page: "#F2F0EA",
  chalk: "#C9C7BF",
  signal: "#C8452D",
} as const;

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

export function luminance(hex: string) {
  const [r, g, b] = rgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ratio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/* A colour at `alpha` over a ground, as it actually renders. */
export function over(fg: string, bg: string, alpha: number) {
  const f = rgb(fg);
  const g = rgb(bg);
  return "#" + f.map((v, i) => Math.round(v * alpha + g[i] * (1 - alpha)).toString(16).padStart(2, "0")).join("").toUpperCase();
}
