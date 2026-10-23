import Link from "next/link";
import { Seal } from "@/components/ui/Seal";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-svh place-items-center px-5 py-12">
      <section className="card w-full max-w-md px-6 py-10 text-center shadow-e3">
        <Seal className="mx-auto w-24 text-olive" />
        <h1 className="display mt-6 text-4xl">This page is not here</h1>
        <p className="reading mt-3">The link may be old or mistyped. The festival page has everything: the programme, the artists and your e-pass.</p>
        <Link href="/" className="btn btn-primary mt-7">
          Go to the festival page
        </Link>
      </section>
    </main>
  );
}
