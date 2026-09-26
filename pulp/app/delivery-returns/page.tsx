import type { Metadata } from "next";
import type { ReactElement } from "react";
import SmallPrintPage from "@/components/content/SmallPrintPage";
import { DELIVERY_RETURNS } from "@/lib/content/smallPrint";

export const metadata: Metadata = {
  title: "Delivery and returns — PULP",
  description:
    "What delivery costs, how long it takes, and how to send something back. Free returns for 30 days.",
};

export default function Page(): ReactElement {
  return <SmallPrintPage content={DELIVERY_RETURNS} />;
}
