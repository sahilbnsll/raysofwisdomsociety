import { EPassProvider } from "@/components/epass/EPassProvider";
import { EventJsonLd } from "@/components/seo/EventJsonLd";
import { EPassStudio } from "@/components/epass/EPassStudio";
import { About } from "@/components/sections/About";
import { Award } from "@/components/sections/Award";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Programme } from "@/components/sections/Programme";
import { StickyCta } from "@/components/sections/StickyCta";
import { Visit } from "@/components/sections/Visit";

/**
 * The page reads in the order a visitor decides: what this is, who presents it, why it matters,
 * what's on (with the artists inside each performance), get the pass, the evening's special
 * honour, then how to get there. Each photograph appears once.
 */
export default function EventPage() {
  return (
    <EPassProvider>
      <Header />
      <EventJsonLd />
      <main id="main">
        <Hero />
        <Partners />
        <About />
        <Programme />
        <EPassStudio />
        <Award />
        <Visit />
      </main>
      <Footer />
      <StickyCta />
    </EPassProvider>
  );
}
