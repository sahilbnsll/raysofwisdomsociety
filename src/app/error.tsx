"use client";

import { useEffect } from "react";
import { org } from "@/content/event";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-svh place-items-center px-5 py-12">
      <section className="card w-full max-w-md px-6 py-10 text-center shadow-e3">
        <h1 className="display text-4xl">Something went wrong</h1>
        <p className="reading mt-3">
          That was on our side. Try again, and if it keeps happening, call {org.mobile} or write to {org.email}.
        </p>
        <button type="button" onClick={reset} className="btn btn-primary mt-7">
          Try again
        </button>
      </section>
    </main>
  );
}
