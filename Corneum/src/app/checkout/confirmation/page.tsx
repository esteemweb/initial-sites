import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/commerce/Confirmation";

export const metadata: Metadata = { title: "Order received — Corneum", robots: { index: false, follow: false } };

export default function ConfirmationPage() {
  return (
    <Suspense>
      <Confirmation />
    </Suspense>
  );
}
