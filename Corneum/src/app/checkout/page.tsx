import type { Metadata } from "next";
import { CheckoutForm } from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = { title: "Checkout — Corneum", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
