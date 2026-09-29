import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { artists, getArtist } from "@/lib/content/artists";

export const alt = "Artist at Uroko";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArtist(slug);
  return ogImage({
    kanji: a?.seal ?? "鱗",
    title: a ? `${a.name} · ${a.ja}` : "Artists",
    subtitle: a ? `${a.role}. ${a.statement}` : undefined,
    dark: a?.tone === "ink",
  });
}
