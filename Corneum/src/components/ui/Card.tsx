import Link from "next/link";
import { ViewTransition } from "react";
import type { Product } from "@/data/products";
import { ProductImage } from "./ProductImage";

/* The one card design. The whole card is a single link; hover and focus
   follow the link rules (opacity 0.72, ink focus ring). Percentages in
   green, everything else ink. */
export function Card({ product }: { product: Product }) {
  const actives = product.actives.value;
  return (
    <Link href={`/range/${product.slug}`} className="grid content-start gap-16">
      {/* Same name as the product page's hero: the image morphs between them */}
      <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
        <ProductImage src={product.image.src} alt={product.image.alt} sizes="(min-width: 1024px) 25vw, 50vw" />
      </ViewTransition>
      <span className="grid gap-8">
        <span className="type-data text-ink-muted">
          {product.index} · {product.purpose.value}
        </span>
        <span className="type-h4">{product.name}</span>
        {actives.length > 0 && (
          <span className="type-data">
            {actives.map((a, i) => (
              <span key={a.name}>
                {i > 0 && " · "}
                {a.name} <span className="text-green">{a.pct}</span>
              </span>
            ))}
          </span>
        )}
        <span className="type-data">
          ${product.price.value} <span className="text-ink-muted">{product.priceNote}</span>
        </span>
      </span>
    </Link>
  );
}
