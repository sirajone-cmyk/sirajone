import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, LayoutDashboard, Phone, Menu, X, Library, Users, MessageCircle, DollarSign, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/programs', label: 'Programs', icon: BookOpen },
  { to: '/enroll', label: 'Enroll', icon: BookOpen },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/teachers', label: 'Teachers', icon: Users },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/contact', label: 'Contact', icon: Phone },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';

  return (
    <header className="sticky top-0 z-50 bg-[#0b1a12]/90 backdrop-blur-md border-b border-white/8">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4 h-16">
        <Link to="/" className="mr-6 flex flex-shrink-0 items-center gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative w-9 h-9 flex-shrink-0">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="#34d399" strokeWidth="1.5"/>
                <polygon points="18,7 29,13 29,23 18,29 7,23 7,13" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.5"/>
                <circle cx="18" cy="18" r="3" fill="#34d399"/>
              </svg>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="whitespace-nowrap text-sm font-bold tracking-tight text-white">SirajOne</div>
              <div className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.07em] text-emerald-400 sm:text-[10px]">Faith. Knowledge. Action.</div>
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 md:flex">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === to
                  ? 'bg-emerald-900/60 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
          <Link
            to={isAdmin ? '/admin/messages' : '/messages'}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.includes('messages') ? 'bg-emerald-900/60 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/8'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Messages
          </Link>
          {isAdmin && (
            <>
              <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin' ? 'bg-emerald-900/60 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin
              </Link>
              <Link to="/admin/finance" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/admin/finance' ? 'bg-emerald-900/60 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
                <DollarSign className="w-3.5 h-3.5" /> Finance
              </Link>
            </>
          )}
          <Link to="/letters" className="ml-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold transition-all">
            Letter Guide
          </Link>
          <button onClick={logout} className="ml-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/8 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/8 bg-[#0b1a12] px-4 py-3 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === to ? 'bg-emerald-900/60 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
          <Link to="/letters" onClick={() => setOpen(false)} className="mt-1 px-4 py-2.5 rounded-lg bg-emerald-700 text-white text-sm font-semibold text-center">Letter Guide</Link>
          <Link to={isAdmin ? '/admin/messages' : '/messages'} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/8">
            <MessageCircle className="w-4 h-4" /> Messages
          </Link>
          {isAdmin && (
            <Link to="/admin/finance" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/8">
              <DollarSign className="w-4 h-4" /> Finance
            </Link>
          )}
          <button onClick={() => { logout(); setOpen(false); }} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/8">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
