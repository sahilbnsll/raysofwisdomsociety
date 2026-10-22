"use client";

import QRCode from "qrcode";
import { forwardRef, useEffect, useState } from "react";
import { event, eveningLabels } from "@/content/event";
import { passUrl, type PassData } from "@/lib/epass/render-pass";

/**
 * Full-screen pass for the foyer: the QR as large as the phone allows, on plain paper so the
 * gate team's scanner reads it first time, with the details they ask for printed beside it.
 */
export const GateView = forwardRef<HTMLDialogElement, { pass: PassData }>(function GateView({ pass }, ref) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(passUrl(pass.id, window.location.origin), {
      margin: 2,
      width: 720,
      errorCorrectionLevel: "Q",
      color: { dark: "#1c2412", light: "#ffffff" },
    }).then((url) => alive && setSrc(url));
    return () => {
      alive = false;
    };
  }, [pass.id]);

  const close = () => (typeof ref === "object" ? ref?.current?.close() : undefined);

  return (
    <dialog
      ref={ref}
      aria-label="Your e-pass for the gate"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="sheet m-0 h-svh max-h-none w-full max-w-none bg-paper p-0 text-ink sm:m-auto sm:h-auto sm:max-h-[94svh] sm:w-[min(30rem,94vw)] sm:rounded-3xl"
    >
      <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-6 text-center">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-ink-muted">Show this at the gate</p>
          <button type="button" onClick={close} className="btn btn-secondary !min-h-10 !px-4 text-sm">
            Done
          </button>
        </div>

        <div className="mt-6 w-full max-w-[22rem] rounded-3xl bg-white p-4 shadow-e2 ring-1 ring-line">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={`QR code for pass ${pass.id}`} className="aspect-square w-full [image-rendering:pixelated]" />
          ) : (
            <div className="aspect-square w-full animate-pulse rounded-xl bg-sage" />
          )}
        </div>

        <p className="display mt-6 text-4xl leading-tight">{pass.name}</p>
        <p className="mt-2 text-lg">
          Admits <strong>{pass.guests}</strong> · {eveningLabels[pass.days].long}
        </p>
        <p className="mt-1 text-xl font-semibold tracking-[0.12em]">{pass.id}</p>

        <p className="mt-auto pt-8 text-sm text-ink-muted">
          Turn your screen brightness up. Gates open for the {event.timeLabel.replace(" onwards", "")} start at {event.venue.name}.
        </p>
      </div>
    </dialog>
  );
});
