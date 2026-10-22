/**
 * Turns the client's original photographs (huge, some TIFF) into web-sized JPEGs and makes
 * transparent PNGs of the two logos. Re-run after adding or swapping a source photo:
 *
 *   node scripts/prepare-images.mjs
 *
 * Sources live in "IAAF (2026) artist photographs/" (not served). Output goes to public/images/.
 * Each entry matches a source file by a unique fragment of its file name, so renamed folders or
 * extra copies don't break anything. IMG_8186 / IMG_8188 are sponsor sheets and are NOT used.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "IAAF (2026) artist photographs");
const OUT = path.join(ROOT, "public", "images");

/** [output name, folder fragment, file-name fragment, long edge in px] */
const photos = [
  // Day 1
  ["mantra-temple", "Reela hota", "078A9277", 2200],
  ["mantra-duo", "Reela hota", "IMG_8324", 2200],
  ["mantra-pair", "Reela hota", "IMG_8325", 2200],
  ["reela-portrait", "Reela hota", "_J3A8990_pp", 1800],
  ["reela-seated", "Reela hota", "_J3A8859", 1800],
  ["reela-pose-a", "Reela hota", "_J3A8928_pp", 1800],
  ["reela-pose-b", "Reela hota", "_J3A8972_pp", 1800],
  ["arupa-bharatanatyam", "Arupa Lahiri", "IMG_8150", 1800],
  ["arupa-seated", "Arupa Lahiri", "IMG_8149", 918],
  ["amrita-red", "Amrita Lahiri", "p260619amrita1", 1800],
  ["amrita-leap", "Amrita Lahiri", "photo by Priyanka", 1800],
  ["amrita-rays", "Amrita Lahiri", "photo is by sai thejeswar rao", 1800],
  ["amrita-portrait", "Amrita Lahiri", "2nd (21)", 1600],
  ["gauri-twirl", "Gauri Diwakar", "1000023052", 1800],
  ["gauri-bend", "Gauri Diwakar", "1000023053", 1800],
  ["gauri-portrait", "Gauri Diwakar", "1000023038", 2000],
  ["sudarushka-stage", "Sudarushka", "IMG_8161", 2000],
  ["sudarushka-group", "Sudarushka", "IMG_8162", 1600],
  // Day 2
  ["abhay-santoor", "Abhay Sopori", "Rustum Sopori 01", 2000],
  ["abhay-portrait", "Abhay Sopori", "Rustum Sopori 03", 1800],
  ["mukesh-rabab", "Mukesh Sharma", "MS with Rabab", 1400],
  ["mishra-duo", "Ritesh Mishra", "J3A6814", 1800],
  // Ancient Arts Award laureate: recent colour, then archival black and white
  ["madhavi-color-a", "Madhavi Mudgal", "Madhavi Mudgal2 photoAjay", 1800],
  ["madhavi-color-b", "Madhavi Mudgal", "Ajay Lal 49", 1600],
  ["madhavi-color-c", "Madhavi Mudgal", "Ajay Lal 51", 1600],
  ["madhavi-1976", "Madhavi Mudgal", "3a.Madhavi 1976", 1400],
  ["madhavi-1977", "Madhavi Mudgal", "3e. Madhavi 1977", 1400],
  ["madhavi-1979", "Madhavi Mudgal", "4, Madhavi", 1400],
  ["madhavi-1981", "Madhavi Mudgal", "5b,. Madhavi", 1400],
  ["madhavi-1984", "Madhavi Mudgal", "6s. Madhavi Mudgal 1984", 1400],
  ["madhavi-duet", "Madhavi Mudgal", "Pasricha 31", 1400],
];

const listFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p];
  });

const all = listFiles(SRC).filter((f) => !/Logos/i.test(f));

fs.mkdirSync(path.join(OUT, "artists"), { recursive: true });
fs.mkdirSync(path.join(OUT, "brand"), { recursive: true });

for (const [name, folder, fragment, edge] of photos) {
  const hits = all.filter((f) => f.toLowerCase().includes(folder.toLowerCase()) && path.basename(f).toLowerCase().includes(fragment.toLowerCase()));
  if (hits.length !== 1) {
    console.error(`!! ${name}: expected 1 source, found ${hits.length}`);
    process.exitCode = 1;
    continue;
  }
  const file = path.join(OUT, "artists", `${name}.jpg`);
  const info = await sharp(hits[0], { failOn: "none" })
    .rotate()
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(file);
  console.log(`${name.padEnd(22)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
}

/** White background to transparency: fully white goes clear, fully coloured stays, soft edge between. */
async function cutOutWhite(input, output, width) {
  const { data, info } = await sharp(input).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const w = Math.min(data[i], data[i + 1], data[i + 2]);
    data[i + 3] = w >= 250 ? 0 : w <= 226 ? 255 : Math.round(((250 - w) / 24) * 255);
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ width, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(output);
  console.log(`${path.basename(output)} written`);
}

await cutOutWhite(path.join(SRC, "Logos", "IAAF logo.jpeg"), path.join(OUT, "brand", "iaaf-logo.png"), 900);
await cutOutWhite(path.join(SRC, "Logos", "rays logo.jpeg"), path.join(OUT, "brand", "rays-logo.png"), 700);

/* ---------------------------------------------------------------- */
/* Sponsors                                                          */
/* ---------------------------------------------------------------- */

// Chadha Papers: the supplied file is a phone screenshot; crop the mark and wordmark, drop the white.
{
  const crop = await sharp(path.join(SRC, "Logos", "IMG_8188.JPG")).rotate().extract({ left: 160, top: 340, width: 700, height: 440 }).toBuffer();
  await cutOutWhite(crop, path.join(OUT, "brand", "chadha-papers.png"), 600);
}

// Modi Groups: the supplied file is a photo of 3D wall lettering (glare, grey wall), so the mark is
// redrawn from it as a flat vector. Replace with the sponsor's official artwork when it arrives.
{
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1620 1010">
    <path fill="#2f8ae4" d="M560 700 L1020 296 Q1100 226 1180 296 L1520 700 L1316 700 L1100 470 L764 700 Z"/>
    <path fill="#2b22b4" d="M100 700 L560 296 Q640 226 720 296 L1060 700 L856 700 L640 470 L304 700 Z"/>
    <text x="810" y="955" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-weight="900"
      font-size="205" textLength="1420" lengthAdjust="spacingAndGlyphs" fill="#2d2d33">MODI GROUPS</text>
  </svg>`;
  const raster = await sharp(Buffer.from(svg), { density: 144 }).png().toBuffer();
  await sharp(raster).trim({ threshold: 1 }).resize({ width: 640 }).png({ compressionLevel: 9 }).toFile(path.join(OUT, "brand", "modi-groups.png"));
  console.log("modi-groups.png written");
}
