import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* Social share card, 1200×630, in the site's own system: paper ground,
   ink type, Geist Light headline, Geist Mono data line, green only on the
   percentage, product image at radius 0. Rendered at build time. */

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#000000";
const MUTED = "rgba(0,0,0,0.6)";
const GREEN = "#00524A";

async function asset(path: string) {
  // Build-time read of files under the project root; keep Turbopack from tracing the whole tree
  return readFile(join(/*turbopackIgnore: true*/ process.cwd(), path));
}

export async function shareCard({
  kicker,
  title,
  data,
  image,
}: {
  kicker: string;
  title: string;
  /** Data line: plain parts, with `pct` parts set in green. */
  data: { text: string; pct?: boolean }[];
  /** Path under public/, e.g. "images/cleanse.jpg" */
  image: string;
}) {
  const [light, mono, img] = await Promise.all([
    asset("src/app/_og/GeistLight.ttf"),
    asset("src/app/_og/GeistMono.ttf"),
    asset(join("public", image)),
  ]);
  const src = `data:image/jpeg;base64,${img.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", padding: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 680 }}>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, color: INK, textTransform: "uppercase" }}>
            {`Corneum · ${kicker}`}
          </div>
          <div style={{ display: "flex", fontFamily: "Light", fontSize: 76, lineHeight: 1, letterSpacing: "-0.04em", color: INK }}>
            {title}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", height: 1, width: "100%", background: "rgba(0,0,0,0.12)" }} />
            <div style={{ display: "flex", fontFamily: "Mono", fontSize: 22, textTransform: "uppercase", color: MUTED, gap: 10 }}>
              {data.map((d, i) => (
                <span key={i} style={{ color: d.pct ? GREEN : i === 0 ? INK : MUTED }}>
                  {d.text}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img */}
          <img src={src} width={414} height={518} alt="" style={{ objectFit: "contain" }} />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Light", data: light, weight: 300, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
