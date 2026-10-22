"use client";

import { useEffect, useRef, useState } from "react";

/** Pulls a pass number out of whatever the QR holds: the pass URL, or a bare number. */
export function passIdFrom(text: string): string | null {
  const m = /RWS26-?([2-9A-HJ-NP-Z]{6})/i.exec(text);
  return m ? `RWS26-${m[1].toUpperCase()}` : null;
}

/**
 * Camera QR reader for the gate. jsQR decodes frames in the browser, so it works on iPhones as well
 * as Android (the built-in BarcodeDetector is not on iOS). Stops the camera as soon as it reads a pass.
 */
export function Scanner({ onPass, onClose }: { onPass: (id: string) => void; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

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
      {error && <p className="absolute inset-x-4 bottom-20 rounded-xl bg-paper p-3 text-sm text-ink">{error}</p>}
      <button type="button" onClick={onClose} className="btn btn-secondary absolute bottom-4 left-1/2 -translate-x-1/2 !bg-paper">
        Stop camera
      </button>
    </div>
  );
}
