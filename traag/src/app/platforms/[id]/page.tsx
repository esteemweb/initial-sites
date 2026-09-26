import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlatformContent from "@/components/platform/PlatformContent";
import { PLATFORMS, type PlatformId } from "@/data/platforms";

/** The no-script and shareable version of each platform preview. */
export function generateStaticParams() {
  return Object.keys(PLATFORMS).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = PLATFORMS[id as PlatformId];
  return { title: p ? `traag on ${p.name}` : "not found", robots: { index: false } };
}

export default async function PlatformPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = PLATFORMS[id as PlatformId];
  if (!p) notFound();
  return (
    <main className="container page" style={{ maxWidth: 760 }}>
      <p className="t-record ghost">traag on</p>
      <h1 className="title-xl" style={{ marginBottom: "var(--s4)" }}>
        {p.name}
      </h1>
      <PlatformContent id={p.id} level={2} />
    </main>
  );
}
