import { EPassProvider } from "@/components/epass/EPassProvider";
import { EPassStudio } from "@/components/epass/EPassStudio";
import { About } from "@/components/sections/About";
import { Award } from "@/components/sections/Award";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Performers } from "@/components/sections/Performers";
import { Programme } from "@/components/sections/Programme";
import { StickyCta } from "@/components/sections/StickyCta";
import { Venue } from "@/components/sections/Venue";

export default function EventPage() {
  return (
    <EPassProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Programme />
        <Performers />
        <EPassStudio />
        <Award />
        <Gallery />
        <Venue />
        <Faq />
      </main>
      <Footer />
      <StickyCta />
    </EPassProvider>
  );
}
