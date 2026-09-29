import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";
import { motifs } from "@/lib/content/motifs";
import { artists } from "@/lib/content/artists";
import { guides } from "@/lib/content/aftercare";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();
  const statics = ["", "/motifs", "/artists", "/studio", "/aftercare", "/book", "/pieces"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  return [
    ...statics,
    ...motifs.map((m) => ({ url: `${base}/motifs/${m.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...artists.map((a) => ({ url: `${base}/artists/${a.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...guides.map((g) => ({ url: `${base}/aftercare/${g.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
