import { OG_SIZE, shareCard } from "../../_og/card";
import { getProduct, products } from "@/data/products";

export const alt = "A Corneum product on white: its name, active percentages and price.";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug)!;
  const actives = p.actives.value.flatMap((a) => [{ text: `· ${a.name}` }, { text: a.pct, pct: true }]);
  return shareCard({
    kicker: p.purpose.value,
    title: p.name,
    data: [{ text: `$${p.price.value}` }, ...(actives.length ? actives : [{ text: "· Glass and steel · bought once" }])],
    image: p.image.src!.replace(/^\//, ""),
  });
}
