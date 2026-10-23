// Builds the small icons from the festival emblem: node scripts/prepare-icons.mjs (npm run icons).
// The emblem itself is 500 KB, far too heavy for a favicon, so each size is made separately.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const logo = "public/images/brand/iaaf-logo.png";
const cream = { r: 246, g: 239, b: 224, alpha: 1 };

/** The emblem on a transparent square, with a little breathing room. */
const emblem = (size, pad = 0.06) => {
  const inner = Math.round(size * (1 - pad * 2));
  return sharp(logo)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: Math.floor((size - inner) / 2), bottom: Math.ceil((size - inner) / 2), left: Math.floor((size - inner) / 2), right: Math.ceil((size - inner) / 2), background: { r: 0, g: 0, b: 0, alpha: 0 } });
};

await mkdir("src/app", { recursive: true });
await mkdir("public/icons", { recursive: true });

// Browser tab and search results
await emblem(192, 0.02).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("src/app/icon.png");
// iPhone home screen: no transparency allowed, so cream behind the emblem
await emblem(180, 0.12).flatten({ background: cream }).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("src/app/apple-icon.png");
// Installable web app icons
await emblem(192, 0.04).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("public/icons/icon-192.png");
await emblem(512, 0.04).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("public/icons/icon-512.png");
await emblem(512, 0.18).flatten({ background: cream }).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile("public/icons/maskable-512.png");

// /favicon.ico: crawlers and old browsers still ask for it. A 48 px PNG inside an ICO wrapper.
const png = await emblem(48, 0.02).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile("src/app/favicon.ico", Buffer.concat([header, png]));

console.log("Icons written.");
