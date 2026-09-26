"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function BagLink() {
  const { count } = useCart();
  return (
    <Link href="/bag" className="type-data inline-flex min-h-48 items-center" aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
      Bag ({count})
    </Link>
  );
}
