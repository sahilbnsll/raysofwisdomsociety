"use client";

import { useEffect, useRef, useState } from "react";

const ID = "RWS26-?([2-9A-HJ-NP-Z]{6})";

/**
 * Pulls a pass number out of what a QR holds: a bare pass number, or our pass link (/p/ID or /pass/ID).
 * Anything else (a website, a Wi-Fi code, someone else's ticket) is not a pass, even if it happens to
 * contain something that looks like one.
 */
export function passIdFrom(text: string): string | null {
  const t = text.trim();
  let m = new RegExp(`^${ID}$`, "i").exec(t);
  if (!m) {
    try {
      m = new RegExp(`^/(?:p|pass)/${ID}/?$`, "i").exec(decodeURIComponent(new URL(t).pathname));
    } catch {
      m = null;
    }
  }
  return m ? `RWS26-${m[1].toUpperCase()}` : null;
}

/**
 * Camera QR reader for the gate. jsQR decodes frames in the browser, so it works on iPhones as well
 * as Android (the built-in BarcodeDetector is not on iOS). Stops the camera as soon as it reads a pass.
 */
export function Scanner({ onPass, onClose }: { onPass: (id: string) => void; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  // A QR code was read but it is not a festival pass: say so, and keep looking.
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let lastWrong = { text: "", at: 0 };
    let hideWrong = 0;

    (async () => {
      try {
        const { default: jsQR } = await import("jsqr");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        const v = video.current;
        if (!v || stopped) return;
        v.srcObject = stream;
        await v.play();
        const tick = () => {
          if (stopped || !ctx) return;
          if (v.readyState >= 2 && v.videoWidth) {
            // Decode a smaller frame: fast enough for older phones, plenty for a pass held up to the camera.
            const scale = Math.min(1, 640 / v.videoWidth);
            canvas.width = Math.round(v.videoWidth * scale);
            canvas.height = Math.round(v.videoHeight * scale);
            ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
            const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
            const id = code && passIdFrom(code.data);
            if (id) {
              stopped = true;
              if (navigator.vibrate) navigator.vibrate(30);
              onPass(id);
              return;
            }
            // A different QR code: warn once, then again only if it is a new code or a few seconds later.
            if (code && code.data && (code.data !== lastWrong.text || performance.now() - lastWrong.at > 4000)) {
              lastWrong = { text: code.data, at: performance.now() };
              setWrong(true);
              if (navigator.vibrate) navigator.vibrate([60, 50, 60]);
              clearTimeout(hideWrong);
              hideWrong = window.setTimeout(() => setWrong(false), 3500);
            }
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        setError("The camera could not start. Allow camera access for this site, or type the pass number below.");
      }
    })();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(hideWrong);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onPass]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink">
      <video ref={video} className="aspect-[3/4] w-full object-cover sm:aspect-video" muted playsInline aria-label="Camera view for scanning passes" />
      {/* Aiming frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="size-[min(62vw,16rem)] rounded-3xl shadow-[0_0_0_9999px_rgb(0_0_0/0.35)] ring-2 ring-paper/90" />
      </div>
      <p className="absolute inset-x-0 top-4 text-center text-sm font-semibold text-paper">Point at the QR code on the pass</p>
      {wrong && (
        <p role="alert" className="absolute inset-x-4 bottom-20 rounded-xl bg-maroon p-3 text-center text-sm font-semibold text-paper shadow-e2">
          That QR code is not a festival e-pass. Ask the guest to open their e-pass and hold the code up.
        </p>
      )}
      {error && <p className="absolute inset-x-4 bottom-20 rounded-xl bg-paper p-3 text-sm text-ink">{error}</p>}
      <button type="button" onClick={onClose} className="btn btn-secondary absolute bottom-4 left-1/2 -translate-x-1/2 !bg-paper">
        Stop camera
      </button>
    </div>
  );
}
