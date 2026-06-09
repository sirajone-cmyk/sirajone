import { useState, lazy, Suspense } from 'react';
import { Toaster } from "react-hot-toast"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ROLES, USER_STATUS, isCounsellorRole, isCounsellingClientRole } from '@/lib/roles';
import SplashScreen from '@/components/SplashScreen';
import PendingApproval from '@/components/auth/PendingApproval';
import SuspendedAccount from '@/components/auth/SuspendedAccount';
import SecurityWrapper from '@/components/SecurityWrapper';
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider';
import { StudentNotificationToast } from '@/components/StudentNotificationToast';
import { AuthGateway } from './components/auth/AuthGateway';

// ── Lazy-loaded page routes ────────────────────────────────────────────────
// Each page loads only when first visited — keeps the initial bundle small.
const Home                       = lazy(() => import('./pages/Home'));
const CounsellingHome            = lazy(() => import('./pages/CounsellingHome'));
const PrivacyPolicy              = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService             = lazy(() => import('./pages/TermsOfService'));
const CounsellingDisclaimer      = lazy(() => import('./pages/CounsellingDisclaimer'));
const Dashboard                  = lazy(() => import('./pages/Dashboard'));
const AdminDashboard             = lazy(() => import('./pages/AdminDashboard'));
const Programs                   = lazy(() => import('./pages/Programs'));
const Contact                    = lazy(() => import('./pages/Contact'));
const Library                    = lazy(() => import('./pages/Library'));
const Teachers                   = lazy(() => import('./pages/Teachers'));
const Counsellors                = lazy(() => import('./pages/Counsellors'));
const CounsellorPortal           = lazy(() => import('./pages/CounsellorPortal'));
const CounsellingClientDashboard = lazy(() => import('./pages/CounsellingClientDashboard'));
const Messages                   = lazy(() => import('./pages/Messages'));
const AdminMessages              = lazy(() => import('./pages/AdminMessages'));
const RoleManagement             = lazy(() => import('./pages/RoleManagement'));
const Enroll                     = lazy(() => import('./pages/Enroll'));
const AdminFinance               = lazy(() => import('./pages/AdminFinance'));
const TeacherPortal              = lazy(() => import('./pages/TeacherPortal'));
const LetterCatalog              = lazy(() => import('./pages/LetterCatalog'));
const PracticalWorkbook          = lazy(() => import('./pages/PracticalWorkbook'));
const PartTwoWorkbook            = lazy(() => import('./pages/PartTwoWorkbook'));
const ClassroomPortal            = lazy(() => import('./pages/ClassroomPortal'));

const queryClient = new QueryClient();

// ── Shared page-level loading spinner ─────────────────────────────────────
const PageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#0a1a0f]">
    <div className="w-8 h-8 border-4 border-green-800 border-t-green-400 rounded-full animate-spin" />
  </div>
);

/**
 * SmartHome — renders the correct home page without requiring auth.
 * Unauthenticated visitors → public Home.
 * Counselling clients     → CounsellingHome.
 * Counsellors             → redirect to /counsellor portal.
 * All other logged-in users → Home.
 */
const SmartHome = () => {
  const { isLoadingAuth, user } = useAuth();
  if (isLoadingAuth) return <PageSpinner />;
  if (isCounsellingClientRole(user?.role)) return <CounsellingHome />;
  if (isCounsellorRole(user?.role)) return <Navigate to="/counsellor" replace />;
  return <Home />;
};

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();

  if (isLoadingAuth) return <PageSpinner />;

  if (!isAuthenticated) return <AuthGateway />;

  if (user?.status === USER_STATUS.PENDING)   return <PendingApproval />;
  if (user?.status === USER_STATUS.SUSPENDED) return <SuspendedAccount />;

  const isApproved = user?.status === USER_STATUS.APPROVED;
  const isAdmin = isApproved && (user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN);
  const canAccessTeacherPortal = isAdmin || (isApproved && user?.role === ROLES.TEACHER);
  const canAccessCounsellorPortal = isAdmin || (isApproved && isCounsellorRole(user?.role));
  const canAccessCounsellingClientDashboard = isApproved && isCounsellingClientRole(user?.role);

  const dashboardElement = (() => {
    if (isApproved && user?.role === ROLES.TEACHER) return <TeacherPortal />;
    if (isApproved && isCounsellorRole(user?.role)) return <CounsellorPortal />;
    if (canAccessCounsellingClientDashboard)        return <CounsellingClientDashboard />;
    return <Dashboard />;
  })();

  const protect = (element) => <SecurityWrapper>{element}</SecurityWrapper>;

  return (
    <Routes>
      {/* Authenticated-only routes */}
      <Route path="/dashboard"        element={protect(dashboardElement)} />
      <Route path="/letters"          element={protect(<LetterCatalog />)} />
      <Route path="/practice-workbook" element={protect(<PracticalWorkbook />)} />
      <Route path="/part-two-workbook" element={protect(<PartTwoWorkbook />)} />
      <Route path="/messages"         element={protect(<Messages />)} />
      <Route path="/enroll"           element={protect(<Enroll />)} />
      <Route path="/classroom/:subjectId" element={protect(<ClassroomPortal />)} />
      <Route
        path="/teacher-portal"
        element={canAccessTeacherPortal ? protect(<TeacherPortal />) : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/teacher"
        element={canAccessTeacherPortal ? protect(<TeacherPortal />) : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/counsellor"
        element={canAccessCounsellorPortal ? protect(<CounsellorPortal />) : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/counselling-client"
        element={canAccessCounsellingClientDashboard || isAdmin ? protect(<CounsellingClientDashboard />) : <Navigate to="/dashboard" replace />}
      />
      {isAdmin && <Route path="/admin"          element={protect(<AdminDashboard />)} />}
      {isAdmin && <Route path="/admin/messages" element={protect(<AdminMessages />)} />}
      {isAdmin && <Route path="/admin/roles"    element={protect(<RoleManagement />)} />}
      {isAdmin && <Route path="/admin/finance"  element={protect(<AdminFinance />)} />}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) return <SplashScreen onDone={() => setSplashDone(true)} />;

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <OnboardingProvider>
            <Suspense fallback={<PageSpinner />}>
              <Routes>
                {/* ── Truly public pages — no auth required ─────────────── */}
                <Route path="/"                      element={<SmartHome />} />
                <Route path="/programs"              element={<Programs />} />
                <Route path="/contact"               element={<Contact />} />
                <Route path="/library"               element={<Library />} />
                <Route path="/teachers"              element={<Teachers />} />
                <Route path="/counsellors"           element={<Counsellors />} />
                <Route path="/privacy"               element={<PrivacyPolicy />} />
                <Route path="/terms"                 element={<TermsOfService />} />
                <Route path="/counselling-disclaimer" element={<CounsellingDisclaimer />} />
                {/* ── Authenticated routes ───────────────────────────────── */}
                <Route path="/*" element={<AuthenticatedApp />} />
              </Routes>
            </Suspense>
            {/* Global student reminder toasts — gated by role inside the component */}
            <StudentNotificationToast />
          </OnboardingProvider>
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
