/* Demo account data. Deliberately not tied to a named person — this is a
   placeholder dataset for building against, not a real subscriber record.
   Replace with the real API shape at integration time. */

import type { Cadence, LotId, Size } from "@/lib/pricing";

export type ShipmentStatus = "delivered" | "roasting" | "skipped" | "failed";

export type Shipment = {
  id: string;
  date: string; // already formatted; the API should send ISO and format here
  lot: string;
  size: string;
  amount: number;
  status: ShipmentStatus;
};

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  delivered: "Delivered",
  roasting: "Roasting",
  skipped: "Skipped",
  failed: "Payment failed",
};

/* Colour is never the only signal: every row shows a dot AND the word.
   --color-leaf is 4.67:1 and restricted to >=16px, so these are dot colours
   here, not text colours. */
export const STATUS_DOT: Record<ShipmentStatus, string> = {
  delivered: "bg-leaf",
  roasting: "bg-amber-ink",
  skipped: "bg-text-muted",
  failed: "bg-accent",
};

export const CURRENT_PLAN: {
  lot: LotId;
  size: Size;
  cadence: Cadence;
  nextShip: string;
  roastsOn: string;
  status: "active" | "paused";
} = {
  lot: "birds-eye-chinna",
  size: "500g",
  cadence: "4wk",
  nextShip: "03 Oct",
  roastsOn: "Tuesday 01 Oct",
  status: "active",
};

export const SHIPMENTS: Shipment[] = [
  { id: "LC-0418", date: "05 Sep", lot: "Bird's-eye Chinna", size: "500 g", amount: 9920, status: "delivered" },
  { id: "LC-0392", date: "08 Aug", lot: "Bird's-eye Chinna", size: "500 g", amount: 9920, status: "delivered" },
  { id: "LC-0361", date: "11 Jul", lot: "Two Houses", size: "500 g", amount: 7180, status: "delivered" },
  { id: "LC-0334", date: "13 Jun", lot: "Two Houses", size: "500 g", amount: 7180, status: "skipped" },
  { id: "LC-0301", date: "16 May", lot: "Hunasgiriya Natural", size: "250 g", amount: 4500, status: "failed" },
  { id: "LC-0276", date: "18 Apr", lot: "Hunasgiriya Natural", size: "250 g", amount: 4500, status: "delivered" },
];

export const ACCOUNT_NAV = [
  { lead: "01", label: "Plan", href: "#plan" },
  { lead: "02", label: "Shipments", href: "#shipments" },
  { lead: "03", label: "Delivery", href: "#delivery" },
  { lead: "04", label: "Payment", href: "#payment" },
] as const;
