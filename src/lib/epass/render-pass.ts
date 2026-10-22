import QRCode from "qrcode";
import { brand, event, eveningLabels, org, sponsors, type Evenings } from "@/content/event";
import { fmtDate } from "@/lib/format";

export interface PassData {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
}

export const PREVIEW_ID = "RWS26-XXXXXX";

export const PASS_W = 1080;
export const PASS_H = 1840;

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

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}

/** Line, diamond, lotus, diamond, line: the rule under the poster's title. */
function lotusRule(ctx: CanvasRenderingContext2D, cx: number, y: number) {
  ctx.save();
  ctx.strokeStyle = C.gold;
  ctx.fillStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 300, y);
  ctx.lineTo(cx - 60, y);
  ctx.moveTo(cx + 60, y);
  ctx.lineTo(cx + 300, y);
  ctx.stroke();
  diamond(ctx, cx - 48, y, 8);
  diamond(ctx, cx + 48, y, 8);
  // lotus
  ctx.beginPath();
  ctx.moveTo(cx, y - 22);
  ctx.bezierCurveTo(cx + 12, y - 10, cx + 10, y + 2, cx, y + 10);
  ctx.bezierCurveTo(cx - 10, y + 2, cx - 12, y - 10, cx, y - 22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, y + 10);
  ctx.bezierCurveTo(cx - 14, y + 8, cx - 26, y - 2, cx - 28, y - 12);
  ctx.bezierCurveTo(cx - 14, y - 10, cx - 5, y - 2, cx, y + 10);
  ctx.moveTo(cx, y + 10);
  ctx.bezierCurveTo(cx + 14, y + 8, cx + 26, y - 2, cx + 28, y - 12);
  ctx.bezierCurveTo(cx + 14, y - 10, cx + 5, y - 2, cx, y + 10);
  ctx.stroke();
  ctx.restore();
}

/** Soft watercolour hills, as at the foot of the poster. */
function hills(ctx: CanvasRenderingContext2D, top: number, height: number) {
  const band = (color: string, alpha: number, pts: number[], blur = 0) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    if (blur) ctx.filter = `blur(${blur}px)`;
    ctx.beginPath();
    ctx.moveTo(0, top + height);
    ctx.lineTo(0, top + pts[0]);
    ctx.bezierCurveTo(PASS_W * 0.25, top + pts[1], PASS_W * 0.5, top + pts[2], PASS_W * 0.72, top + pts[3]);
    ctx.bezierCurveTo(PASS_W * 0.86, top + pts[4], PASS_W * 0.95, top + pts[5], PASS_W, top + pts[6]);
    ctx.lineTo(PASS_W, top + height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  band(C.rose, 0.55, [40, 0, 70, 30, 10, 30, 22], 6);
  band(C.sageDeep, 0.65, [70, 34, 96, 58, 44, 64, 50]);
  band(C.paper, 1, [96, 80, 112, 92, 82, 98, 90]);
}

function sprig(ctx: CanvasRenderingContext2D, x: number, y: number, flip: boolean) {
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.strokeStyle = C.gold;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.bezierCurveTo(40, 110, 90, 60, 160, 0);
  ctx.stroke();
  const leaves = [
    [30, 124, -0.9],
    [58, 96, -0.35],
    [84, 72, -1.05],
    [110, 48, -0.45],
    [136, 24, -1.15],
  ] as const;
  leaves.forEach(([lx, ly, r], i) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(r);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(10, -14, 30, -16, 44, -6);
    ctx.bezierCurveTo(30, 4, 10, 6, 0, 0);
    if (i % 2) {
      ctx.fillStyle = C.sageDeep;
      ctx.fill();
    }
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
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

function drawLogoRow(ctx: CanvasRenderingContext2D, imgs: HTMLImageElement[], heights: number[], y: number) {
  const gap = 56;
  const widths = imgs.map((img, i) => (img.naturalWidth / img.naturalHeight) * heights[i]);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (imgs.length - 1);
  let x = (PASS_W - total) / 2;
  const rowH = Math.max(...heights);
  imgs.forEach((img, i) => {
    ctx.drawImage(img, x, y + (rowH - heights[i]) / 2, widths[i], heights[i]);
    x += widths[i] + gap;
  });
}

/** Draws the e-pass into `canvas`. The same picture is shown live in the form and downloaded. */
export async function drawPass(canvas: HTMLCanvasElement, pass: PassData, origin: string, isStale?: () => boolean): Promise<void> {
  const { display, serif, sans } = fonts();
  await Promise.all([
    document.fonts.load(`400 90px ${display}`),
    document.fonts.load(`400 36px ${serif}`),
    document.fonts.load(`italic 400 36px ${serif}`),
    document.fonts.load(`700 24px ${sans}`),
    document.fonts.load(`500 30px ${sans}`),
  ]).catch(() => {});

  const [logo, rays, s1, s2, qr] = await Promise.all([
    load(brand.logo.src),
    load(brand.rays.src),
    load(sponsors[0].src),
    load(sponsors[1].src),
    qrFor(passUrl(pass.id, origin)),
  ]);
  if (isStale?.()) return; // a newer draw has started; don't paint over it

  canvas.width = PASS_W;
  canvas.height = PASS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.clearRect(0, 0, PASS_W, PASS_H);

  const PERF = 1250; // tear line

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, PASS_W, PASS_H, 48);
  ctx.clip();

  // Paper
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, PASS_W, PASS_H);
  sprig(ctx, 22, 20, false);
  sprig(ctx, PASS_W - 22, 20, true);

  // Logo row, as on the printed pass: the festival, the sponsors, the organiser
  drawLogoRow(ctx, [logo, s1, s2, rays], [118, 78, 56, 104], 64);

  // Title
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.ink;
  const t1 = "International";
  ctx.font = `400 96px ${display}`;
  const tw = ctx.measureText(t1).width;
  ctx.font = `400 150px ${display}`;
  const nine = ctx.measureText("9").width;
  ctx.font = `400 48px ${display}`;
  const th = ctx.measureText("th").width;
  const startX = (PASS_W - (nine + th + 16 + tw)) / 2;
  ctx.textAlign = "left";
  ctx.font = `400 150px ${display}`;
  ctx.fillText("9", startX, 368);
  ctx.font = `400 48px ${display}`;
  ctx.fillText("th", startX + nine + 2, 282);
  ctx.font = `400 96px ${display}`;
  ctx.fillText(t1, startX + nine + th + 16, 368);
  ctx.textAlign = "center";
  fit(ctx, "Ancient Arts Festival 2026", (px) => `400 ${px}px ${display}`, 92, PASS_W - 140, 60);
  ctx.fillText("Ancient Arts Festival 2026", PASS_W / 2, 470);

  lotusRule(ctx, PASS_W / 2, 524);

  // Date and venue in the poster's maroon
  ctx.fillStyle = C.maroon;
  // Written as on the poster: "November 25 – 26, 2026"
  const dates = `${fmtDate(event.startDate, { month: "long" })} ${fmtDate(event.startDate, { day: "numeric" })} – ${fmtDate(event.endDate, { day: "numeric" })}, ${fmtDate(event.endDate, { year: "numeric" })}`;
  fit(ctx, `${dates}  |  ${event.venue.name}, ${event.venue.area}`, (px) => `500 ${px}px ${serif}`, 38, PASS_W - 120, 26);
  ctx.fillText(`${dates}  |  ${event.venue.name}, ${event.venue.area}`, PASS_W / 2, 600);

  ctx.fillStyle = C.ink;
  ctx.font = `400 32px ${serif}`;
  ctx.fillText(`Festival Director: ${event.director}`, PASS_W / 2, 652);

  // Motto with gold diamonds
  ctx.font = `400 32px ${serif}`;
  const words = event.motto;
  const ww = words.map((w) => ctx.measureText(w).width);
  const mGap = 54;
  let mx = (PASS_W - (ww.reduce((a, b) => a + b, 0) + mGap * (words.length - 1))) / 2;
  ctx.textAlign = "left";
  words.forEach((w, i) => {
    ctx.fillStyle = C.ink;
    ctx.fillText(w, mx, 706);
    mx += ww[i];
    if (i < words.length - 1) {
      ctx.fillStyle = C.gold;
      diamond(ctx, mx + mGap / 2, 696, 6);
      mx += mGap;
    }
  });
  ctx.textAlign = "center";

  hills(ctx, 740, 130);

  // Holder panel
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 860, PASS_W, PERF - 860);

  ctx.fillStyle = C.maroon;
  ctx.beginPath();
  ctx.roundRect(PASS_W / 2 - 92, 888, 184, 50, 25);
  ctx.fill();
  ctx.fillStyle = C.paper;
  ctx.font = `700 24px ${sans}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("E-PASS", PASS_W / 2 + 3, 922);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = C.muted;
  ctx.font = `500 28px ${sans}`;
  ctx.fillText("Admit", PASS_W / 2, 1000);

  ctx.fillStyle = C.ink;
  fit(ctx, pass.name, (px) => `400 ${px}px ${display}`, 104, PASS_W - 160, 44);
  ctx.fillText(pass.name, PASS_W / 2, 1100);

  ctx.fillStyle = C.muted;
  ctx.font = `500 32px ${sans}`;
  ctx.fillText(
    `${pass.guests} ${pass.guests === 1 ? "person" : "people"}  ·  ${eveningLabels[pass.days].long}  ·  ${event.timeLabel}`,
    PASS_W / 2,
    1162,
  );

  // Stub
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
  ctx.strokeStyle = C.muted;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 3;
  ctx.setLineDash([3, 13]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(56, PERF);
  ctx.lineTo(PASS_W - 56, PERF);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // QR on a paper plate
  const q = 390;
  const qx = 70;
  const qy = PERF + 62;
  ctx.fillStyle = C.paper;
  ctx.beginPath();
  ctx.roundRect(qx, qy, q + 40, q + 40, 24);
  ctx.fill();
  ctx.drawImage(qr, qx + 20, qy + 20, q, q);

  // Stub text
  const tx = qx + q + 40 + 48;
  ctx.textAlign = "left";
  ctx.fillStyle = C.muted;
  ctx.font = `500 26px ${sans}`;
  ctx.fillText("Pass number", tx, qy + 44);
  ctx.fillStyle = C.ink;
  ctx.font = `700 44px ${sans}`;
  ctx.letterSpacing = "2px";
  ctx.fillText(pass.id, tx, qy + 98);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = C.muted;
  ctx.font = `400 28px ${serif}`;
  ["Show this code at the gate.", "One scan checks your party in", `for ${pass.days === "both" ? "each evening" : "the evening"}.`].forEach((l, i) =>
    ctx.fillText(l, tx, qy + 156 + i * 38),
  );

  seal(ctx, logo, PASS_W - 150, qy + 344, 92, sans);

  // Credits line, as at the foot of the printed pass
  ctx.textAlign = "center";
  ctx.fillStyle = C.muted;
  ctx.font = `500 22px ${sans}`;
  ctx.fillText(`Presented by ${org.name}  ·  In association with ${sponsors.map((s) => s.name).join(" and ")}`, PASS_W / 2, PASS_H - 46);

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
