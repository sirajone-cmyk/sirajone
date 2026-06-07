import { useState } from 'react';
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

import Home from './pages/Home';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CounsellingDisclaimer from './pages/CounsellingDisclaimer';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import Library from './pages/Library';
import Teachers from './pages/Teachers';
import Counsellors from './pages/Counsellors';
import CounsellorPortal from './pages/CounsellorPortal';
import CounsellingClientDashboard from './pages/CounsellingClientDashboard';
import Messages from './pages/Messages';
import AdminMessages from './pages/AdminMessages';
import RoleManagement from './pages/RoleManagement';
import Enroll from './pages/Enroll';
import AdminFinance from './pages/AdminFinance';
import TeacherPortal from './pages/TeacherPortal';
import LetterCatalog from './pages/LetterCatalog';
import PracticalWorkbook from './pages/PracticalWorkbook';
import PartTwoWorkbook from './pages/PartTwoWorkbook';
import ClassroomPortal from './pages/ClassroomPortal';

const queryClient = new QueryClient();

import { AuthGateway } from './components/auth/AuthGateway';

const AuthenticatedApp = () => {
  const { isAuthenticated, isLoadingAuth, user } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a1a0f]">
        <div className="w-8 h-8 border-4 border-green-800 border-t-green-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGateway />;
  }

  if (user?.status === USER_STATUS.PENDING) {
    return <PendingApproval />;
  }

  if (user?.status === USER_STATUS.SUSPENDED) {
    return <SuspendedAccount />;
  }

  const isApproved = user?.status === USER_STATUS.APPROVED;
  const isAdmin = isApproved && (user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN);
  const canAccessTeacherPortal = isAdmin || (isApproved && user?.role === ROLES.TEACHER);
  const canAccessCounsellorPortal = isAdmin || (isApproved && isCounsellorRole(user?.role));
  const canAccessCounsellingClientDashboard = isApproved && isCounsellingClientRole(user?.role);

  const dashboardElement = (() => {
    if (isApproved && user?.role === ROLES.TEACHER) return <TeacherPortal />;
    if (isApproved && isCounsellorRole(user?.role)) return <CounsellorPortal />;
    if (canAccessCounsellingClientDashboard) return <CounsellingClientDashboard />;
    return <Dashboard />;
  })();
  const protect = (element) => <SecurityWrapper>{element}</SecurityWrapper>;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={protect(dashboardElement)} />
      <Route path="/letters" element={protect(<LetterCatalog />)} />
      <Route path="/practice-workbook" element={protect(<PracticalWorkbook />)} />
      <Route path="/part-two-workbook" element={protect(<PartTwoWorkbook />)} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/library" element={<Library />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/counsellors" element={<Counsellors />} />
      <Route path="/messages" element={protect(<Messages />)} />
      <Route path="/enroll" element={protect(<Enroll />)} />
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
      {isAdmin && <Route path="/admin" element={protect(<AdminDashboard />)} />}
      {isAdmin && <Route path="/admin/messages" element={protect(<AdminMessages />)} />}
      {isAdmin && <Route path="/admin/roles" element={protect(<RoleManagement />)} />}
      {isAdmin && <Route path="/admin/finance" element={protect(<AdminFinance />)} />}
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
            <Routes>
              {/* Public legal pages — no auth required */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/counselling-disclaimer" element={<CounsellingDisclaimer />} />
              {/* All other routes handled by the authenticated app */}
              <Route path="/*" element={<AuthenticatedApp />} />
            </Routes>
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






