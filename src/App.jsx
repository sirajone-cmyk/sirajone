import React from 'react';
import { AuthGateway } from './components/auth/AuthGateway';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/Hero';
import { ProgramsSection } from './components/sections/Programs';
import { FeatureBlocksSection } from './components/sections/FeatureBlocks';
import { LetterGuideSection } from './components/sections/LetterGuide';
import { StatsSection } from './components/sections/Stats';
import { TestimonialsSection } from './components/sections/Testimonials';
import { ContactSection } from './components/sections/Contact';
import { CTASection } from './components/sections/CTA';
import { SupportSystemsSection } from './components/sections/SupportSystems';
import { usePlatform } from './state/PlatformContext';

export default function App() {
  const { currentUser } = usePlatform();

  if (!currentUser) {
    return <AuthGateway />;
  }

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
