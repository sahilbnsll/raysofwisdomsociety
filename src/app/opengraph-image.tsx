import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { brand, event, org } from "@/content/event";

/**
 * The picture shown when the link is shared (WhatsApp, Facebook, X, LinkedIn, iMessage, Slack).
 * Drawn at build time at the standard 1200 x 630, then saved as a small JPEG: WhatsApp skips share
 * images over about 300 KB. It uses the festival's own colours and title face, the searched-for name
 * (IAAF26) and the artists' collage on the turning emblem, as in the hero: the picture says who performs.
 */
export const alt = `${event.edition} ${event.title} 2026, 25 and 26 November, Kamani Auditorium, New Delhi`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

const root = process.cwd();
const asPng = async (file: string, w: number) => {
  const png = await sharp(path.join(root, "public", file)).resize({ width: w }).png({ compressionLevel: 9 }).toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
};

const INK = "#26301a";
const MAROON = "#8a1c24";
const MUTED = "#5b6249";

export default async function Image() {
  const [font, logo, collage, emblem] = await Promise.all([
    readFile(path.join(root, "assets/fonts/DMSerifDisplay-Regular.ttf")),
    readFile(path.join(root, "public", brand.logo.src)).then((b) => `data:image/png;base64,${b.toString("base64")}`),
    asPng(brand.collage.src, 680),
    asPng(brand.emblem.src, 520),
  ]);
  const collageH = Math.round((680 * brand.collage.h) / brand.collage.w);

  const png = await new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6efe0", fontFamily: "DM Serif Display", position: "relative" }}>
        {/* sage hills along the foot, as on the poster */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: "#e2e7d1", display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 94, height: 5, background: "#b48d3c", opacity: 0.5, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", width: 560, padding: "50px 0 0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={60} height={60} alt="" />
            <div style={{ display: "flex", fontSize: 26, color: MUTED }}>{org.name} presents</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 66, lineHeight: 1.04, color: INK }}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <span style={{ fontSize: 100, lineHeight: 0.9 }}>9</span>
              <span style={{ fontSize: 36, marginLeft: 4, marginBottom: 44 }}>th</span>
              <span style={{ marginLeft: 14 }}>International</span>
            </div>
            <div style={{ display: "flex" }}>Ancient Arts</div>
            <div style={{ display: "flex" }}>Festival 2026</div>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, color: MAROON }}>25 and 26 November 2026</div>
          <div style={{ display: "flex", marginTop: 4, fontSize: 28, color: MAROON }}>Kamani Auditorium, New Delhi</div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: MUTED }}>{event.motto.join("  ·  ")}</div>
        </div>

        {/* the festival emblem, faint, behind the artists */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblem} width={520} height={520} alt="" style={{ position: "absolute", right: 28, top: 128, opacity: 0.5 }} />
        {/* the artists, standing on the hills */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={collage} width={680} height={collageH} alt="" style={{ position: "absolute", right: 14, bottom: 0 }} />

        {/* the name people search for */}
        <div
          style={{
            position: "absolute",
            right: 72,
            top: 40,
            display: "flex",
            padding: "6px 24px 8px",
            fontSize: 54,
            letterSpacing: 3,
            color: MAROON,
            border: `3px solid ${MAROON}`,
            borderRadius: 999,
          }}
        >
          {event.searchName}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "DM Serif Display", data: font, style: "normal", weight: 400 }] },
  ).arrayBuffer();

  const jpg = await sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
