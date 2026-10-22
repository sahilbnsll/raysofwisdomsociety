import QRCode from "qrcode";
import { brand, event, eveningLabels, org, type Evenings } from "@/content/event";
import { fmtDate } from "@/lib/format";

export interface PassData {
  id: string;
  name: string;
  guests: number;
  days: Evenings;
}

export const PREVIEW_ID = "RWS26-XXXXXX";

export const PASS_W = 1080;
export const PASS_H = 1640;

const C = {
  paper: "#fcf8ee",
  cream: "#f8f1e1",
  maroon: "#7d1d22",
  maroonDeep: "#5a1217",
  olive: "#566a2f",
  ink: "#27321a",
  muted: "#5d6650",
  gold: "#b98a2f",
  goldSoft: "#dcc287",
  sage: "#e3e9cd",
};

let logo: HTMLImageElement | null = null;
async function loadLogo(): Promise<HTMLImageElement> {
  if (logo) return logo;
  const img = new Image();
  img.src = brand.logo.src;
  await img.decode();
  logo = img;
  return img;
}

const qrCache = new Map<string, HTMLCanvasElement>();
async function qrFor(text: string): Promise<HTMLCanvasElement> {
  const hit = qrCache.get(text);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, text, { margin: 0, width: 320, color: { dark: C.ink, light: C.paper }, errorCorrectionLevel: "M" });
  qrCache.set(text, canvas);
  return canvas;
}

export function passUrl(id: string, origin: string): string {
  return `${origin}/pass/${id}`;
}

function fonts() {
  const root = getComputedStyle(document.documentElement);
  const display = `${root.getPropertyValue("--font-cormorant").trim() || "Georgia"}, "Iowan Old Style", Georgia, serif`;
  const sans = `${root.getPropertyValue("--font-geist").trim() || "system-ui"}, system-ui, sans-serif`;
  return { display, sans };
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

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, sans: string, align: CanvasTextAlign = "left", color = C.olive) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = `700 22px ${sans}`;
  ctx.letterSpacing = "5px";
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.restore();
}

function diamond(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draws the e-pass into `canvas` (1080 x 1560). The same picture is shown live in the form and downloaded. */
export async function drawPass(canvas: HTMLCanvasElement, pass: PassData, origin: string, isStale?: () => boolean): Promise<void> {
  const { display, sans } = fonts();
  await Promise.all([
    document.fonts.load(`600 80px ${display}`),
    document.fonts.load(`italic 500 40px ${display}`),
    document.fonts.load(`700 24px ${sans}`),
    document.fonts.load(`500 30px ${sans}`),
  ]).catch(() => {});

  const [img, qr] = await Promise.all([loadLogo(), qrFor(passUrl(pass.id, origin))]);
  if (isStale?.()) return; // a newer draw has started; don't paint over it

  canvas.width = PASS_W;
  canvas.height = PASS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.clearRect(0, 0, PASS_W, PASS_H);

  const PERF = 1180; // perforation line

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, PASS_W, PASS_H, 56);
  ctx.clip();

  // Paper
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, PASS_W, PASS_H);

  // Maroon header with a soft light behind the emblem
  const band = ctx.createLinearGradient(0, 0, 0, 470);
  band.addColorStop(0, C.maroonDeep);
  band.addColorStop(1, C.maroon);
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, PASS_W, 470);

  ctx.save();
  ctx.translate(PASS_W / 2, 225);
  ctx.strokeStyle = C.goldSoft;
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const long = i % 2 === 0;
    ctx.globalAlpha = long ? 0.35 : 0.18;
    ctx.lineWidth = long ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 190, Math.sin(a) * 190);
    ctx.lineTo(Math.cos(a) * (long ? 470 : 380), Math.sin(a) * (long ? 470 : 380));
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;

  ctx.fillStyle = C.paper;
  ctx.beginPath();
  ctx.arc(PASS_W / 2, 225, 168, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.drawImage(img, PASS_W / 2 - 138, 225 - 138, 276, 276);

  ctx.textAlign = "center";
  ctx.fillStyle = C.goldSoft;
  ctx.font = `700 24px ${sans}`;
  ctx.letterSpacing = "7px";
  ctx.fillText(`E-PASS  ·  ${event.edition.toUpperCase()} EDITION`, PASS_W / 2, 438);
  ctx.letterSpacing = "0px";

  // Title
  ctx.fillStyle = C.ink;
  ctx.font = `600 84px ${display}`;
  ctx.fillText("International Ancient", PASS_W / 2, 590);
  ctx.fillText("Arts Festival 2026", PASS_W / 2, 676);

  ctx.fillStyle = C.maroon;
  ctx.font = `italic 500 38px ${display}`;
  ctx.fillText(event.motto.join("   ·   "), PASS_W / 2, 742);

  // Divider
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PASS_W / 2 - 230, 790);
  ctx.lineTo(PASS_W / 2 - 22, 790);
  ctx.moveTo(PASS_W / 2 + 22, 790);
  ctx.lineTo(PASS_W / 2 + 230, 790);
  ctx.stroke();
  diamond(ctx, PASS_W / 2, 790, 9, C.gold);

  // Attendee
  label(ctx, "Admit", PASS_W / 2, 858, sans, "center");
  ctx.fillStyle = C.ink;
  fit(ctx, pass.name, (px) => `600 ${px}px ${display}`, 92, PASS_W - 200, 40);
  ctx.textAlign = "center";
  ctx.fillText(pass.name, PASS_W / 2, 950);

  ctx.fillStyle = C.muted;
  ctx.font = `500 32px ${sans}`;
  ctx.fillText(`${pass.guests} ${pass.guests === 1 ? "person" : "people"}  ·  ${eveningLabels[pass.days].short}`, PASS_W / 2, 1005);

  // Facts
  const cols: [string, string, string][] = [
    ["Date", `${fmtDate(event.startDate, { day: "numeric" })} to ${fmtDate(event.endDate, { day: "numeric", month: "short" })}`, "2026"],
    ["Time", event.start, "onwards"],
    ["Venue", event.venue.name, event.venue.area],
  ];
  const colW = (PASS_W - 160) / 3;
  cols.forEach(([k, v, v2], i) => {
    const cx = 80 + colW * i + colW / 2;
    label(ctx, k, cx, 1078, sans, "center");
    ctx.fillStyle = C.ink;
    ctx.textAlign = "center";
    ctx.font = `600 30px ${sans}`;
    ctx.fillText(v, cx, 1120);
    ctx.fillStyle = C.muted;
    ctx.font = `500 26px ${sans}`;
    ctx.fillText(v2, cx, 1156);
  });

  // Stub background
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
  ctx.strokeStyle = C.olive;
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 14]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(60, PERF);
  ctx.lineTo(PASS_W - 60, PERF);
  ctx.stroke();
  ctx.setLineDash([]);

  // QR
  const q = 300;
  ctx.fillStyle = C.paper;
  ctx.beginPath();
  ctx.roundRect(70, PERF + 60, q + 40, q + 40, 20);
  ctx.fill();
  ctx.drawImage(qr, 90, PERF + 80, q, q);

  // Stub text
  const tx = 70 + q + 40 + 60;
  label(ctx, "Pass number", tx, PERF + 110, sans);
  ctx.fillStyle = C.ink;
  ctx.textAlign = "left";
  ctx.font = `700 46px ${sans}`;
  ctx.letterSpacing = "3px";
  ctx.fillText(pass.id, tx, PERF + 170);
  ctx.letterSpacing = "0px";

  ctx.fillStyle = C.muted;
  ctx.font = `500 28px ${sans}`;
  const lines = ["Show this pass at the gate.", "Scanning the QR code opens a", "page that confirms it is valid."];
  lines.forEach((l, i) => ctx.fillText(l, tx, PERF + 232 + i * 40));

  ctx.fillStyle = C.maroon;
  ctx.font = `600 28px ${display}`;
  ctx.fillText(`${org.name}`, tx, PERF + 380);

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
