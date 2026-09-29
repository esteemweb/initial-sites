import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/content/site";

export const alt = `${site.name}, ${site.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ kanji: site.kanji, title: "Uroko", subtitle: "Traditional Japanese tattooing, by hand and by machine.", dark: true });
}
