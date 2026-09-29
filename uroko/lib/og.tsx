import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/lib/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const paper = "#eceff0"; // gofun shell white
const ink = "#0f0f12"; // sumi
const shu = "#c23a1f"; // vermilion
const muted = "#55595c";

async function fonts() {
  const dir = path.join(process.cwd(), "app", "fonts");
  const [ja, latin] = await Promise.all([readFile(path.join(dir, "og-ja.ttf")), readFile(path.join(dir, "og-latin.ttf"))]);
  return [
    { name: "ShipporiJA", data: ja, weight: 700 as const, style: "normal" as const },
    { name: "ShipporiLatin", data: latin, weight: 700 as const, style: "normal" as const },
  ];
}

/**
 * Shared Open Graph frame: seal top-left, one large kanji, a title, and the
 * studio line. Same palette and type as the site, rendered with next/og.
 */
export async function ogImage({
  kanji,
  title,
  subtitle,
  dark = false,
}: {
  kanji: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  const bg = dark ? ink : paper;
  const fg = dark ? paper : ink;
  const sub = dark ? "#a9b0b4" : muted;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: fg,
          padding: 64,
          fontFamily: "ShipporiLatin",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: shu,
                color: "#f6f8f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "ShipporiJA",
                fontSize: 40,
              }}
            >
              鱗
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, letterSpacing: 4 }}>UROKO</div>
              <div style={{ fontSize: 20, color: sub }}>Motomachi, Yokohama</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 48 }}>
            <div style={{ fontFamily: "ShipporiJA", fontSize: 260, lineHeight: 1, color: dark ? paper : shu }}>{kanji}</div>
            <div style={{ display: "flex", flexDirection: "column", paddingBottom: 24, maxWidth: 700 }}>
              <div style={{ fontSize: 60, lineHeight: 1.05 }}>{title}</div>
              {subtitle ? <div style={{ fontSize: 28, lineHeight: 1.3, color: sub, marginTop: 20 }}>{subtitle}</div> : null}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: sub, borderTop: `1px solid ${dark ? "#2c2e33" : "#c9cfd2"}`, paddingTop: 20 }}>
            <div>{site.tagline}</div>
            <div style={{ fontFamily: "ShipporiJA" }}>手彫り · 機械彫り</div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
