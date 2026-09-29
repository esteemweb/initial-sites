import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotifDetail } from "@/components/motifs/MotifDetail";
import { getMotif, motifs } from "@/lib/content/motifs";

export function generateStaticParams() {
  return motifs.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/motifs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMotif(slug);
  return m
    ? {
        title: `${m.name} (${m.ja}), motif`,
        description: `${m.meaning} ${m.sessions[0]}–${m.sessions[1]} sessions. Placements: ${m.placements.join(", ")}.`,
      }
    : {};
}

export default async function MotifPage({ params }: PageProps<"/motifs/[slug]">) {
  const { slug } = await params;
  const motif = getMotif(slug);
  if (!motif) notFound();

  return (
    <section className="stage">
      <div className="stage-inner">
        <Link href="/motifs" className="text-sm text-text-muted no-underline hover:underline">
          ← All motifs
        </Link>
        <div className="mt-6">
          <MotifDetail motif={motif} variant="page" />
        </div>
      </div>
    </section>
  );
}
