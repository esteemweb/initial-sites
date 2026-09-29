import { ogContentType, ogImage, ogSize } from "@/lib/og";
import { getMotif, motifs } from "@/lib/content/motifs";

export const alt = "Motif at Uroko";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return motifs.map((m) => ({ slug: m.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMotif(slug);
  return ogImage({
    kanji: m?.kanji ?? "鱗",
    title: m ? `${m.name} · ${m.ja}` : "Motifs",
    subtitle: m ? `${m.meaning} ${m.sessions[0]}–${m.sessions[1]} sessions.` : undefined,
    dark: m?.tone === "ink",
  });
}
