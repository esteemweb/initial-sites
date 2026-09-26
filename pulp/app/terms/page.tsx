import type { Metadata } from "next";
import type { ReactElement } from "react";
import SmallPrintPage from "@/components/content/SmallPrintPage";
import { TERMS } from "@/lib/content/smallPrint";

export const metadata: Metadata = {
  title: "Terms — PULP",
  description:
    "The terms you agree to by ordering from this site.",
};

export default function Page(): ReactElement {
  return <SmallPrintPage content={TERMS} />;
}
