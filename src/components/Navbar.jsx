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

const baseLinkClass = 'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const getLinkClass = (active) =>
  `${baseLinkClass} ${
    active
      ? 'bg-emerald-900/60 text-emerald-400'
      : 'text-slate-400 hover:bg-white/8 hover:text-white'
  }`;

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0b1a12]/90 backdrop-blur-md">
      <nav className="flex items-center justify-between w-full h-16 px-6 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center space-x-3 flex-shrink-0 z-10" onClick={() => setOpen(false)}>
          <div className="relative h-9 w-9 flex-shrink-0">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="#34d399" strokeWidth="1.5" />
              <polygon points="18,7 29,13 29,23 18,29 7,23 7,13" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.5" />
              <circle cx="18" cy="18" r="3" fill="#34d399" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="whitespace-nowrap text-sm font-bold tracking-tight text-white sm:text-base">SirajOne</div>
            <div className="whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-400 sm:text-[10px]">
              Faith. Knowledge. Action.
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-1 sm:space-x-4 ml-auto flex-shrink-0">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className={getLinkClass(pathname === to)}>
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}

          <Link to={isAdmin ? '/admin/messages' : '/messages'} className={getLinkClass(pathname.includes('messages'))}>
            <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">Messages</span>
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin" className={getLinkClass(pathname === '/admin')}>
                <LayoutDashboard className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Admin</span>
              </Link>
              <Link to="/admin/finance" className={getLinkClass(pathname === '/admin/finance')}>
                <DollarSign className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Finance</span>
              </Link>
            </>
          )}

          <Link to="/letters" className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition-all hover:bg-emerald-600">
            Letter Guide
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-400 transition-colors hover:bg-white/8 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="ml-auto rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-white/8 bg-[#0b1a12] px-4 py-3 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                pathname === to ? 'bg-emerald-900/60 text-emerald-400' : 'text-slate-400 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link to="/letters" onClick={() => setOpen(false)} className="mt-1 rounded-lg bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white">
            Letter Guide
          </Link>
          <Link
            to={isAdmin ? '/admin/messages' : '/messages'}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Messages
          </Link>
          {isAdmin && (
            <Link
              to="/admin/finance"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/8 hover:text-white"
            >
              <DollarSign className="h-4 w-4" />
              Finance
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-white/8"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
