// Adds photographs to the gallery viewers without touching any code:  npm run gallery
//
//   1. Drop photographs (any size, JPG / PNG / WebP / TIFF) into  gallery-inbox/<folder>/
//      <folder> is a performance id (mantra-bhasha, bharatanatyam, kuchipudi, kathak-sudarushka,
//      santoor-rabab, vocal) or "award" for Madhavi Mudgal.
//   2. Run  npm run gallery  (it also runs by itself before  npm run dev  and  npm run build).
//   3. Optional: say what a picture shows in  src/content/gallery-captions.json:
//        { "award/with-pt-durga-lal.jpg": "In duet with the Kathak maestro Pandit Durga Lal" }
//
// Each inbox photograph is shrunk to a web size (2200 px long edge) and saved in public/images/gallery/<folder>/,
// then src/content/gallery.generated.json is rebuilt from everything in that folder. The inbox is not
// published or committed (originals can be huge); public/images/gallery is.
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const INBOX = path.join(ROOT, "gallery-inbox");
const OUT = path.join(ROOT, "public", "images", "gallery");
const MANIFEST = path.join(ROOT, "src", "content", "gallery.generated.json");
const CAPTIONS = path.join(ROOT, "src", "content", "gallery-captions.json");
const IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });

const list = (dir) => readdir(dir, { withFileTypes: true }).catch(() => []);

// The folders that are allowed: every performance id in the content file, plus the award.
const content = await readFile(path.join(ROOT, "src", "content", "event.ts"), "utf8");
const valid = new Set([...content.matchAll(/\bid: "([a-z0-9-]+)",\s*\n\s*(?:time|title):/g)].map((m) => m[1]).concat("award"));

const slug = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "photo";

/* 1. inbox -> web-sized files */
let converted = 0;
for (const folder of await list(INBOX)) {
  if (!folder.isDirectory()) continue;
  if (!valid.has(folder.name)) {
    console.warn(`gallery-inbox/${folder.name}: not a performance id or "award", skipped (valid: ${[...valid].join(", ")})`);
    continue;
  }
  const outDir = path.join(OUT, folder.name);
  await mkdir(outDir, { recursive: true });
  const taken = new Set((await list(outDir)).map((e) => e.name));
  for (const file of await list(path.join(INBOX, folder.name))) {
    if (!file.isFile() || !IMAGE.test(file.name)) continue;
    const from = path.join(INBOX, folder.name, file.name);
    let name = `${slug(file.name)}.jpg`;
    const to = path.join(outDir, name);
    if (taken.has(name) && (await stat(to)).mtimeMs >= (await stat(from)).mtimeMs) continue; // already converted
    try {
      await sharp(from, { failOn: "none" })
        .rotate()
        .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(to);
      converted++;
      console.log(`  ${folder.name}/${name}`);
    } catch (error) {
      console.warn(`  ${folder.name}/${file.name}: could not read this file (${error.message}). Save it as JPG and try again.`);
    }
  }
}

/* 2. everything in public/images/gallery -> manifest */
const captions = JSON.parse((await readFile(CAPTIONS, "utf8").catch(() => "{}")) || "{}");
const manifest = {};
const seenCaptionKeys = new Set();
for (const folder of (await list(OUT)).filter((e) => e.isDirectory()).sort((a, b) => natural(a.name, b.name))) {
  const files = (await list(path.join(OUT, folder.name))).filter((e) => e.isFile() && IMAGE.test(e.name)).map((e) => e.name).sort(natural);
  if (!files.length) continue;
  manifest[folder.name] = [];
  for (const file of files) {
    const meta = await sharp(path.join(OUT, folder.name, file)).metadata();
    const key = `${folder.name}/${file}`;
    seenCaptionKeys.add(key);
    const entry = { src: `/images/gallery/${folder.name}/${file}`, w: meta.width, h: meta.height };
    const c = captions[key];
    if (typeof c === "string") entry.caption = c;
    else if (c && typeof c === "object") Object.assign(entry, { caption: c.caption, alt: c.alt });
    manifest[folder.name].push(entry);
  }
}
for (const key of Object.keys(captions)) if (!seenCaptionKeys.has(key)) console.warn(`gallery-captions.json: no photograph called "${key}" (check the folder and file name)`);

const next = JSON.stringify(manifest, null, 2) + "\n";
if ((await readFile(MANIFEST, "utf8").catch(() => "")) !== next) await writeFile(MANIFEST, next);

const counts = Object.entries(manifest).map(([k, v]) => `${k}: ${v.length}`);
console.log(counts.length ? `Gallery: ${counts.join(", ")}${converted ? ` (${converted} new)` : ""}` : "Gallery: no extra photographs yet.");
