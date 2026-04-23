import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AuthGateway } from './components/auth/AuthGateway';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { FeatureBlocksSection } from './components/sections/FeatureBlocks';
import { SupportSystemsSection } from './components/sections/SupportSystems';
import { usePlatform } from './state/PlatformContext';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import ProgramsPage from './pages/ProgramsPage';
import EnrollPage from './pages/EnrollPage';
import LibraryPage from './pages/LibraryPage';
import TeachersPage from './pages/TeachersPage';
import ContactPage from './pages/ContactPage';
import MessagesPage from './pages/MessagesPage';

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

function StudentAppPage() {
  const { state } = usePlatform();
  const [page, setPage] = useState('dashboard');

  const studentLibraryBooks = useMemo(
    () =>
      (state.libraryBooks || []).filter(
        (book) => book.publishStatus === 'published' && book.visibility === 'public'
      ),
    [state.libraryBooks]
  );

  function renderStudentPage() {
    if (page === 'dashboard' || page === 'home') return <DashboardPage setPage={setPage} />;
    if (page === 'programs') return <ProgramsPage setPage={setPage} />;
    if (page === 'enroll') return <EnrollPage setPage={setPage} />;
    if (page === 'library')
      return <LibraryPage libraryItems={studentLibraryBooks} onAddLibraryItem={() => {}} canManage={false} />;
    if (page === 'teachers') return <TeachersPage setPage={setPage} />;
    if (page === 'contact') return <ContactPage />;
    if (page === 'messages') return <MessagesPage />;
    return <LearnPage />;
  }

  return (
    <div className="app">
      <Navigation page={page} onNavigate={setPage} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{renderStudentPage()}</main>
      <Footer />
    </div>
  );
}

function Phase4PlatformPage() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <SupportSystemsSection />
        <FeatureBlocksSection />
      </main>
      <Footer />
    </div>
  );
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
    return (
      <ProtectedRoute>
        <StudentAppPage />
      </ProtectedRoute>
    );
  }

  if (currentRoute === ROUTES.ADMIN) {
    return (
      <ProtectedRoute requireAdmin>
        <Phase4PlatformPage />
      </ProtectedRoute>
    );
  }

  return <AuthGateway onAuthenticated={() => navigateTo(ROUTES.APP, true)} />;
}
