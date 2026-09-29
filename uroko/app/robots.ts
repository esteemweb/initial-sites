import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/book/deposit", "/book/confirmed", "/pieces/", "/pieces/lookup"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
