import QRCode from "qrcode";
import { brand, event, eveningLabels, org, sponsors, type Evenings } from "@/content/event";

export interface PassData {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
}

export const PREVIEW_ID = "RWS26-XXXXXX";

export const PASS_W = 1080;
export const PASS_H = 2010;

/** The poster's palette, fixed: a pass is a printed object and looks the same everywhere. */
const C = {
  cream: "#f6efe0",
  paper: "#fbf7ee",
  ink: "#26301a",
  muted: "#5b6250",
  maroon: "#8a1c24",
  gold: "#b48d3c",
  sage: "#e2e7d1",
  sageDeep: "#c5cfa9",
  rose: "#e8c6bf",
  olive: "#566b30",
};

const images = new Map<string, Promise<HTMLImageElement>>();
function load(src: string): Promise<HTMLImageElement> {
  let p = images.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    images.set(src, p);
  }
  return p;
}

const qrCache = new Map<string, HTMLCanvasElement>();
async function qrFor(text: string): Promise<HTMLCanvasElement> {
  const hit = qrCache.get(text);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  // Level Q survives glare, a cracked screen or a crumpled printout.
  await QRCode.toCanvas(canvas, text, { margin: 0, width: 420, color: { dark: C.ink, light: C.paper }, errorCorrectionLevel: "Q" });
  qrCache.set(text, canvas);
  return canvas;
}

/** "sahil bansal" and "SAHIL BANSAL" print as "Sahil Bansal"; a name already in mixed case is left as typed. */
export function niceName(name: string): string {
  const letters = name.replace(/[^\p{L}]/gu, "");
  if (letters && (letters === letters.toLowerCase() || letters === letters.toUpperCase())) {
    return name.toLowerCase().replace(/(^|[\s\-'’.])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());
  }
  return name;
}

/** The short address in the QR: it opens the pass for guests and the check-in screen for gate staff. */
export function passUrl(id: string, origin: string): string {
  return `${origin}/p/${id}`;
}

function fonts() {
  const root = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) => `${root.getPropertyValue(name).trim() || fallback}, ${fallback}`;
  return {
    display: v("--font-dm-serif", "Georgia, serif"),
    serif: v("--font-newsreader", "Georgia, serif"),
    sans: v("--font-hanken", "system-ui, sans-serif"),
  };
}

function fit(ctx: CanvasRenderingContext2D, text: string, font: (px: number) => string, start: number, maxWidth: number, min = 28) {
  let px = start;
  ctx.font = font(px);
  while (ctx.measureText(text).width > maxWidth && px > min) {
    px -= 2;
    ctx.font = font(px);
  }
  return px;
}

/** Text set along an arc, centred on `angle` (radians, 0 = top). */
function arcText(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, r: number, angle: number, inward: boolean) {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const spacing = 3;
  const total = widths.reduce((a, b) => a + b + spacing, -spacing);
  let a = angle - (inward ? -1 : 1) * (total / 2) / r;
  for (let i = 0; i < chars.length; i++) {
    const w = widths[i];
    const half = (w / 2) / r;
    a += (inward ? -1 : 1) * half;
    ctx.save();
    ctx.translate(cx + Math.sin(a) * r, cy - Math.cos(a) * r);
    ctx.rotate(inward ? a + Math.PI : a);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
    a += (inward ? -1 : 1) * (half + spacing / r);
  }
}

/** The festival seal, stamped on the stub like a postmark. */
function seal(ctx: CanvasRenderingContext2D, logo: HTMLImageElement, cx: number, cy: number, r: number, sans: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.17);
  ctx.translate(-cx, -cy);
  ctx.strokeStyle = C.maroon;
  ctx.fillStyle = C.maroon;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(r * 0.15)}px ${sans}`;
  arcText(ctx, "ANCIENT ARTS FESTIVAL", cx, cy, r * 0.79, 0, false);
  arcText(ctx, "NEW DELHI · 2026", cx, cy, r * 0.8, Math.PI, true);
  ctx.globalAlpha = 1;
  ctx.drawImage(logo, cx - r * 0.52, cy - r * 0.52, r * 1.04, r * 1.04);
  ctx.restore();
}

/** Validity tile on the holder panel: what gate staff look at first. */
function tile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  on: boolean,
  top: string,
  main: string,
  f: { display: string; sans: string },
) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 22);
  ctx.fillStyle = on ? C.sage : C.cream;
  ctx.fill();
  ctx.lineWidth = on ? 3 : 2;
  ctx.strokeStyle = on ? C.olive : "rgba(38,48,26,0.18)";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = on ? C.muted : "rgba(91,98,80,0.6)";
  ctx.font = `600 24px ${f.sans}`;
  ctx.letterSpacing = "2px";
  ctx.fillText(top, x + w / 2, y + 44);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = on ? C.ink : "rgba(38,48,26,0.35)";
  ctx.font = `400 46px ${f.display}`;
  ctx.fillText(main, x + w / 2, y + 100);
  ctx.restore();
}

/** Draws the e-pass into `canvas`. The same picture is shown live in the form and downloaded. */
export async function drawPass(canvas: HTMLCanvasElement, pass: PassData, origin: string, isStale?: () => boolean): Promise<void> {
  const { display, serif, sans } = fonts();
  await Promise.all([
    document.fonts.load(`400 90px ${display}`),
    document.fonts.load(`400 36px ${serif}`),
    document.fonts.load(`italic 400 36px ${serif}`),
    document.fonts.load(`700 24px ${sans}`),
    document.fonts.load(`600 30px ${sans}`),
  ]).catch(() => {});

  const [logo, poster, qr] = await Promise.all([load(brand.logo.src), load(event.poster.src), qrFor(passUrl(pass.id, origin))]);
  if (isStale?.()) return; // a newer draw has started; don't paint over it

  canvas.width = PASS_W;
  canvas.height = PASS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.clearRect(0, 0, PASS_W, PASS_H);

  const PERF = 1500; // tear line
  const f = { display, sans };

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, PASS_W, PASS_H, 48);
  ctx.clip();

  /* ---------- the printed pass ---------- */

  // The festival's own poster, exactly as the client made it (1080 x 1080)
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, PASS_W, PERF);
  ctx.drawImage(poster, 0, 0, PASS_W, 1080);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  /* ---------- the holder ---------- */

  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 1080, PASS_W, PERF - 1080);

  ctx.fillStyle = C.maroon;
  ctx.beginPath();
  ctx.roundRect(PASS_W / 2 - 96, 1086, 192, 50, 25);
  ctx.fill();
  ctx.fillStyle = C.paper;
  ctx.font = `700 24px ${sans}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("E-PASS", PASS_W / 2 + 3, 1120);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = C.ink;
  const holder = niceName(pass.name);
  const nameFont = (px: number) => `400 ${px}px ${display}`;
  const nameMax = PASS_W - 160;
  const nameSize = fit(ctx, holder, nameFont, 100, nameMax, 56);
  if (ctx.measureText(holder).width <= nameMax) {
    ctx.fillText(holder, PASS_W / 2, 1226);
  } else {
    // Too long for one line even when smaller: break it in two, at the space nearest the middle.
    const words = holder.split(" ");
    let cut = Math.ceil(words.length / 2);
    let best = Infinity;
    for (let i = 1; i < words.length; i++) {
      ctx.font = nameFont(nameSize);
      const gap = Math.abs(ctx.measureText(words.slice(0, i).join(" ")).width - ctx.measureText(words.slice(i).join(" ")).width);
      if (gap < best) {
        best = gap;
        cut = i;
      }
    }
    const lines = words.length > 1 ? [words.slice(0, cut).join(" "), words.slice(cut).join(" ")] : [holder];
    const size = Math.min(
      52,
      ...lines.map((l) => fit(ctx, l, nameFont, 52, nameMax, 28)),
    );
    ctx.font = nameFont(size);
    if (lines.length === 1) {
      ctx.fillText(lines[0], PASS_W / 2, 1226);
    } else {
      ctx.fillText(lines[0], PASS_W / 2, 1204);
      ctx.fillText(lines[1], PASS_W / 2, 1204 + size * 0.98);
    }
  }

  // Three tiles: how many it admits, and which evenings it is valid for
  const tw3 = 296;
  const tg = 26;
  const tx0 = (PASS_W - (tw3 * 3 + tg * 2)) / 2;
  const valid1 = pass.days === "both" || pass.days === "day1";
  const valid2 = pass.days === "both" || pass.days === "day2";
  tile(ctx, tx0, 1270, tw3, 128, true, "ADMITS", `${pass.guests} ${pass.guests === 1 ? "person" : "people"}`, f);
  tile(ctx, tx0 + tw3 + tg, 1270, tw3, 128, valid1, `25 NOV · ${event.days[0].short.toUpperCase()}`, valid1 ? "Valid" : "Not valid", f);
  tile(ctx, tx0 + (tw3 + tg) * 2, 1270, tw3, 128, valid2, `26 NOV · ${event.days[1].short.toUpperCase()}`, valid2 ? "Valid" : "Not valid", f);

  ctx.fillStyle = C.muted;
  ctx.font = `500 27px ${sans}`;
  fit(ctx, `${event.timeLabel}  ·  ${event.venue.address}`, (px) => `500 ${px}px ${sans}`, 27, PASS_W - 120, 20);
  ctx.fillText(`${event.timeLabel}  ·  ${event.venue.address}`, PASS_W / 2, 1450);

  /* ---------- the stub ---------- */

  ctx.fillStyle = C.sage;
  ctx.fillRect(0, PERF, PASS_W, PASS_H - PERF);

  // Perforation with half-circle notches
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (const x of [0, PASS_W]) {
    ctx.beginPath();
    ctx.arc(x, PERF, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = C.muted;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 3;
  ctx.setLineDash([3, 13]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(56, PERF);
  ctx.lineTo(PASS_W - 56, PERF);
  ctx.stroke();
  ctx.restore();

  // QR on a white plate: plain contrast scans first time under foyer lights
  const q = 330;
  const qx = 66;
  const qy = PERF + 58;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(qx, qy, q + 36, q + 36, 22);
  ctx.fill();
  ctx.drawImage(qr, qx + 18, qy + 18, q, q);

  const tx = qx + q + 36 + 44;
  ctx.textAlign = "left";
  ctx.fillStyle = C.olive;
  ctx.font = `700 24px ${sans}`;
  ctx.letterSpacing = "4px";
  ctx.fillText("SCAN AT THE GATE", tx, qy + 40);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = C.ink;
  ctx.font = `700 46px ${sans}`;
  ctx.letterSpacing = "2px";
  ctx.fillText(pass.id, tx, qy + 100);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = C.muted;
  ctx.font = `400 28px ${serif}`;
  const lines = [`Admits ${pass.guests}, checked in`, pass.days === "both" ? "once each evening." : `on ${eveningLabels[pass.days].long.replace("Evening of ", "")}.`];
  lines.forEach((l, i) => ctx.fillText(l, tx, qy + 152 + i * 38));

  seal(ctx, logo, PASS_W - 150, qy + 290, 86, sans);

  // Credits line, as at the foot of the printed pass
  ctx.textAlign = "center";
  ctx.fillStyle = C.muted;
  ctx.font = `500 22px ${sans}`;
  ctx.fillText(`Presented by ${org.name}  ·  In association with ${sponsors.map((s) => s.name).join(" and ")}`, PASS_W / 2, PASS_H - 34);

  ctx.restore();
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create image"))), "image/png"),
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
