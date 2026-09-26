import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = {
  title: "Privacy — Leaf & Cherry",
  description: "Leaf & Cherry is a demo site. Nothing you do here is collected.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      label="Nothing collected"
      paragraphs={[
        "Leaf & Cherry is a demo site, made to show design and build work. There is no real café, roastery or subscription behind it.",
        "Nothing you do here is collected. There is no sign-up, no form that sends anything, no cookies and no analytics. The host keeps the standard request logs every web host keeps.",
        "The subscription and account pages are a working mock-up. Choices you make there live only in the page in front of you, and are gone when you leave it.",
      ]}
    />
  );
}
