import { notFound } from "next/navigation";
import { MotifDetail } from "@/components/motifs/MotifDetail";
import { MotifPanel } from "@/components/motifs/MotifPanel";
import { getMotif } from "@/lib/content/motifs";

// Intercepts /motifs/[slug] when navigated to from inside the app, so the
// motif opens as a side panel over the library. A hard load of the same URL
// renders app/motifs/[slug]/page.tsx as a full page.
export default async function MotifModal({ params }: PageProps<"/motifs/[slug]">) {
  const { slug } = await params;
  const motif = getMotif(slug);
  if (!motif) notFound();
  return (
    <MotifPanel title={`${motif.name} (${motif.ja})`}>
      <MotifDetail motif={motif} variant="panel" />
    </MotifPanel>
  );
}
