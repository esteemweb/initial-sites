import type { Metadata } from "next";
import type { ReactElement } from "react";
import SmallPrintPage from "@/components/content/SmallPrintPage";
import { PRIVACY } from "@/lib/content/smallPrint";

export const metadata: Metadata = {
  title: "Privacy — PULP",
  description:
    "What we collect when you order, why, and how long we keep it.",
};

export default function Page(): ReactElement {
  return <SmallPrintPage content={PRIVACY} />;
}
