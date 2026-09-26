import type { Metadata } from "next";
import { BagView } from "@/components/commerce/BagView";

export const metadata: Metadata = { title: "Bag — Corneum", robots: { index: false, follow: false } };

export default function BagPage() {
  return <BagView />;
}
