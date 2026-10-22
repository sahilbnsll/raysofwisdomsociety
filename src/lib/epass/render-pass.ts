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

/** Arch outline: straight sides, a round top, square feet. */
function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

/** Draws an image to fill a box, cropped around a focal point (CSS object-position, in %). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, position = "50% 50%") {
  const [px, py] = position.split(" ").map((v) => parseFloat(v) / 100);
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.naturalWidth - sw) * (Number.isFinite(px) ? px : 0.5);
  const sy = (img.naturalHeight - sh) * (Number.isFinite(py) ? py : 0.5);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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

/** The front edge of the hills, drawn over the arches' feet so they stand in the landscape. */
function hillFront(ctx: CanvasRenderingContext2D, top: number) {
  const curve = () => {
    ctx.moveTo(0, top + 40);
    ctx.bezierCurveTo(260, top - 2, 560, top + 32, 780, top + 6);
    ctx.bezierCurveTo(900, top - 8, 1000, top + 6, PASS_W, top);
  };
  ctx.save();
  ctx.fillStyle = C.paper;
  ctx.beginPath();
  curve();
  ctx.lineTo(PASS_W, top + 120);
  ctx.lineTo(0, top + 120);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2;
  ctx.beginPath();
  curve();
  ctx.stroke();
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

  const [logo, rays, s1, s2, qr, ...arcadeImgs] = await Promise.all([
    load(brand.logo.src),
    load(brand.rays.src),
    load(sponsors[0].src),
    load(sponsors[1].src),
    qrFor(passUrl(pass.id, origin)),
    ...event.arcade.map((a) => load(a.photo.src)),
  ]);
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

  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, PASS_W, PERF);
  sprig(ctx, 30, 34, false);
  sprig(ctx, PASS_W - 30, 34, true);

  // Logo row, as on the printed pass: the festival, the sponsors, the organiser
  drawLogoRow(ctx, [logo, s1, s2, rays], [128, 84, 58, 110], 70);

  // Title with the poster's big "9th"
  ctx.fillStyle = C.ink;
  ctx.textBaseline = "alphabetic";
  const t1 = "International";
  ctx.font = `400 98px ${display}`;
  const tw = ctx.measureText(t1).width;
  ctx.font = `400 156px ${display}`;
  const nine = ctx.measureText("9").width;
  ctx.font = `400 50px ${display}`;
  const th = ctx.measureText("th").width;
  const startX = (PASS_W - (nine + th + 18 + tw)) / 2;
  ctx.textAlign = "left";
  ctx.font = `400 156px ${display}`;
  ctx.fillText("9", startX, 384);
  ctx.font = `400 50px ${display}`;
  ctx.fillText("th", startX + nine + 2, 296);
  ctx.font = `400 98px ${display}`;
  ctx.fillText(t1, startX + nine + th + 18, 384);
  ctx.textAlign = "center";
  fit(ctx, "Ancient Arts Festival 2026", (px) => `400 ${px}px ${display}`, 94, PASS_W - 140, 60);
  ctx.fillText("Ancient Arts Festival 2026", PASS_W / 2, 488);

  lotusRule(ctx, PASS_W / 2, 540);

  // Date and venue in the poster's maroon: "November 25 – 26, 2026 | Kamani Auditorium, New Delhi"
  ctx.fillStyle = C.maroon;
  const dates = `${fmtDate(event.startDate, { month: "long" })} ${fmtDate(event.startDate, { day: "numeric" })} – ${fmtDate(event.endDate, { day: "numeric" })}, ${fmtDate(event.endDate, { year: "numeric" })}`;
  const dateLine = `${dates}  |  ${event.venue.name}, ${event.venue.area}`;
  fit(ctx, dateLine, (px) => `500 ${px}px ${serif}`, 38, PASS_W - 130, 26);
  ctx.fillText(dateLine, PASS_W / 2, 612);

  ctx.fillStyle = C.ink;
  ctx.font = `400 32px ${serif}`;
  ctx.fillText(`Festival Director: ${event.director}`, PASS_W / 2, 662);

  // Motto with gold diamonds
  ctx.font = `400 32px ${serif}`;
  const ww = event.motto.map((w) => ctx.measureText(w).width);
  const mGap = 54;
  let mx = (PASS_W - (ww.reduce((a, b) => a + b, 0) + mGap * (event.motto.length - 1))) / 2;
  ctx.textAlign = "left";
  event.motto.forEach((w, i) => {
    ctx.fillStyle = C.ink;
    ctx.fillText(w, mx, 714);
    mx += ww[i];
    if (i < event.motto.length - 1) {
      ctx.fillStyle = C.gold;
      diamond(ctx, mx + mGap / 2, 704, 6);
      mx += mGap;
    }
  });
  ctx.textAlign = "center";

  // Five arches standing on the hills: the traditions on stage, like the dancers on the poster
  hills(ctx, 900, 200);
  const aw = 172;
  const gap = 22;
  const ax0 = (PASS_W - (aw * 5 + gap * 4)) / 2;
  const drop = [34, 14, 0, 14, 34];
  arcadeImgs.forEach((img, i) => {
    const x = ax0 + i * (aw + gap);
    const y = 772 + drop[i];
    const h = 270 - drop[i];
    ctx.save();
    archPath(ctx, x, y, aw, h);
    ctx.clip();
    ctx.fillStyle = C.sageDeep;
    ctx.fillRect(x, y, aw, h);
    drawCover(ctx, img, x, y, aw, h, event.arcade[i].photo.position);
    ctx.restore();
    ctx.save();
    archPath(ctx, x - 7, y - 7, aw + 14, h + 7);
    ctx.strokeStyle = C.gold;
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });
  hillFront(ctx, 1020);

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
  fit(ctx, pass.name, (px) => `400 ${px}px ${display}`, 100, PASS_W - 160, 44);
  ctx.fillText(pass.name, PASS_W / 2, 1226);

  // Three tiles: how many it admits, and which evenings it is valid for
  const tw3 = 296;
  const tg = 26;
  const tx0 = (PASS_W - (tw3 * 3 + tg * 2)) / 2;
  const valid1 = pass.days === "both" || pass.days === "day1";
  const valid2 = pass.days === "both" || pass.days === "day2";
  tile(ctx, tx0, 1270, tw3, 128, true, "ADMITS", `${pass.guests} ${pass.guests === 1 ? "person" : "people"}`, f);
  tile(ctx, tx0 + tw3 + tg, 1270, tw3, 128, valid1, `25 NOV · ${event.days[0].theme.toUpperCase()}`, valid1 ? "Valid" : "Not valid", f);
  tile(ctx, tx0 + (tw3 + tg) * 2, 1270, tw3, 128, valid2, `26 NOV · ${event.days[1].theme.toUpperCase()}`, valid2 ? "Valid" : "Not valid", f);

  ctx.fillStyle = C.muted;
  ctx.font = `500 27px ${sans}`;
  fit(ctx, `${event.timeLabel}  ·  ${event.venue.address}`, (px) => `500 ${px}px ${sans}`, 27, PASS_W - 120, 20);
  ctx.fillText(`${event.timeLabel}  ·  ${event.venue.address}`, PASS_W / 2, 1450);

  // Gold double frame around the printed part, like a ticket
  ctx.save();
  ctx.strokeStyle = C.gold;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(22, 22, PASS_W - 44, PERF - 44, 30);
  ctx.stroke();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.roundRect(32, 32, PASS_W - 64, PERF - 64, 24);
  ctx.stroke();
  ctx.restore();

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
