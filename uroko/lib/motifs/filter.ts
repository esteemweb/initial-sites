import { categories, methods, motifs, type Method, type Motif, type MotifCategory } from "@/lib/content/motifs";

export type MotifQuery = {
  q?: string;
  c?: MotifCategory;
  m?: Method;
};

const categoryIds = new Set(categories.map((c) => c.id));
const methodIds = new Set(methods.map((m) => m.id));

/** Reads and validates the library's URL state. Unknown values are dropped. */
export function parseMotifQuery(sp: Record<string, string | string[] | undefined>): MotifQuery {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const q = first(sp.q).trim().slice(0, 60);
  const c = first(sp.c);
  const m = first(sp.m);
  return {
    q: q || undefined,
    c: categoryIds.has(c as MotifCategory) ? (c as MotifCategory) : undefined,
    m: methodIds.has(m as Method) ? (m as Method) : undefined,
  };
}

function normalise(s: string) {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filterMotifs(query: MotifQuery): Motif[] {
  const q = query.q ? normalise(query.q) : "";
  return motifs.filter((m) => {
    if (query.c && m.category !== query.c) return false;
    if (query.m && query.m !== "both" && m.method !== query.m && m.method !== "both") return false;
    if (query.m === "both" && m.method !== "both") return false;
    if (!q) return true;
    const hay = [m.name, m.ja, m.reading, m.kanji, m.meaning, ...m.placements].map(normalise).join(" ");
    return hay.includes(q);
  });
}

export function motifQueryString(query: MotifQuery) {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  if (query.c) p.set("c", query.c);
  if (query.m) p.set("m", query.m);
  const s = p.toString();
  return s ? `?${s}` : "";
}
