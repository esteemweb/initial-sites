import type { MetadataRoute } from "next";
import { conditions } from "@/data/conditions";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/site";

/* Every public page. Bag, checkout and the styleguide are noindex and left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/range", "/how-it-works", "/science", "/conditions", "/founder", "/faq"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${SITE_URL}/range/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...conditions.map((c) => ({ url: `${SITE_URL}/conditions/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
