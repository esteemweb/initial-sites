import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Terms — Leaf & Cherry",
  description: "Leaf & Cherry is a demo site. Nothing here can be bought.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      label="Nothing for sale"
      paragraphs={[
        "Leaf & Cherry is a demo site. The café, the roastery, the lots and the prices are invented. Nothing here can be bought, and no subscription can be started.",
        "The addresses and the phone number are made up and do not reach anyone. The photographs were made for this demo and show no real place.",
        "Everything on the site is provided as it is, as an example of design and build work.",
      ]}
    />
  );
}
