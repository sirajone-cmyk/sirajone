import { useState } from 'react';
import { Toaster } from "react-hot-toast"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import SplashScreen from '@/components/SplashScreen';

// Pages — we will add these one by one
// For now they show a placeholder until copied from Base44
const Placeholder = ({ name }) => (
  <div className="flex items-center justify-center h-screen text-white text-2xl">{name} — coming soon</div>
);

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Programs from './pages/Programs';
import Contact from './pages/Contact';
import Library from './pages/Library';
import Teachers from './pages/Teachers';
import Messages from './pages/Messages';
import AdminMessages from './pages/AdminMessages';
import RoleManagement from './pages/RoleManagement';
import Enroll from './pages/Enroll';
import AdminFinance from './pages/AdminFinance';
import TeacherPortal from './pages/TeacherPortal';
import LetterCatalog from './pages/LetterCatalog';

const queryClient = new QueryClient();

// Login page — kept from original Rahla design
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

  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/letters" element={<LetterCatalog />} />
      <Route path="/programs" element={<Programs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/library" element={<Library />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/enroll" element={<Enroll />} />
      <Route path="/teacher-portal" element={<TeacherPortal />} />
      {isAdmin && <Route path="/admin" element={<AdminDashboard />} />}
      {isAdmin && <Route path="/admin/messages" element={<AdminMessages />} />}
      {isAdmin && <Route path="/admin/roles" element={<RoleManagement />} />}
      {isAdmin && <Route path="/admin/finance" element={<AdminFinance />} />}
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
          <AuthenticatedApp />
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
