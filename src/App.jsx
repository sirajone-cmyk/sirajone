import React from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/Hero";
import { ProgramsSection } from "./components/sections/Programs";
import { FeatureBlocksSection } from "./components/sections/FeatureBlocks";
import { LetterGuideSection } from "./components/sections/LetterGuide";
import { StatsSection } from "./components/sections/Stats";
import { TestimonialsSection } from "./components/sections/Testimonials";
import { ContactSection } from "./components/sections/Contact";
import { CTASection } from "./components/sections/CTA";
import { SupportSystemsSection } from "./components/sections/SupportSystems";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ProgramsSection />
        <FeatureBlocksSection />
        <SupportSystemsSection />
        <TestimonialsSection />
        <LetterGuideSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
