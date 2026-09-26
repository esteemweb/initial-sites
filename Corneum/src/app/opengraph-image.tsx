import { OG_SIZE, shareCard } from "./_og/card";

export const alt = "Corneum: Vessel 01, a glass-and-steel vessel filled to its etched 200 ML line.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return shareCard({
    kicker: "Clinical scalp care",
    title: "Hair is dead. The scalp is alive.",
    data: [{ text: "Vessel 01 · $65" }, { text: "· 30 ML →" }, { text: "200 ML", pct: true }],
    image: "images/vessel-01.jpg",
  });
}
