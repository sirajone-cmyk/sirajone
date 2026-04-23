import React, { useEffect, useMemo, useRef, useState } from 'react';
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

const ROUTES = {
  AUTH: '/',
  APP: '/app',
  ADMIN: '/admin',
};

function normalizePath(pathname) {
  if (!pathname || pathname === ROUTES.AUTH) return ROUTES.AUTH;
  if (pathname.startsWith(ROUTES.APP)) return ROUTES.APP;
  if (pathname.startsWith(ROUTES.ADMIN)) return ROUTES.ADMIN;
  return ROUTES.AUTH;
}

function navigateTo(path, replace = false) {
  const method = replace ? 'replaceState' : 'pushState';
  window.history[method]({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function PublicPlatformShell() {
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

function StudentAppPage() {
  return <PublicPlatformShell />;
}

function Phase4PlatformPage() {
  return <PublicPlatformShell />;
}

export default function App() {
  const { currentUser, isAdmin } = usePlatform();
  const [route, setRoute] = useState(() => normalizePath(window.location.pathname));
  const previousUserRef = useRef(currentUser);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (route === ROUTES.APP && !currentUser) {
      navigateTo(ROUTES.AUTH, true);
      return;
    }

    if (route === ROUTES.ADMIN && (!currentUser || !isAdmin)) {
      navigateTo(ROUTES.AUTH, true);
    }
  }, [route, currentUser, isAdmin]);

  useEffect(() => {
    const previousUser = previousUserRef.current;

    if (!previousUser && currentUser && route === ROUTES.AUTH) {
      navigateTo(currentUser.role === 'Admin' ? ROUTES.ADMIN : ROUTES.APP, true);
    }

    previousUserRef.current = currentUser;
  }, [currentUser, route]);

  const currentRoute = useMemo(() => normalizePath(window.location.pathname), [route]);

  if (currentRoute === ROUTES.APP) {
    return currentUser ? <StudentAppPage /> : <AuthGateway onAuthenticated={() => navigateTo(ROUTES.APP, true)} />;
  }

  if (currentRoute === ROUTES.ADMIN) {
    return currentUser && isAdmin ? (
      <Phase4PlatformPage />
    ) : (
      <AuthGateway onAuthenticated={() => navigateTo(ROUTES.ADMIN, true)} />
    );
  }

  return <AuthGateway onAuthenticated={() => navigateTo(ROUTES.APP, true)} />;
}
