import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Phone,
  Menu,
  X,
  Library,
  Users,
  MessageCircle,
  DollarSign,
  LogOut,
  PenTool,
  Compass,
  HeartHandshake,
  Heart,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { isCounsellorRole, isCounsellingClientRole } from '@/lib/roles';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

const primaryLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/programs', label: 'Programs', icon: BookOpen },
  { to: '/enroll', label: 'Enroll', icon: BookOpen, featured: true },
];

const hubLinks = [
  { to: '/library', label: 'Library', icon: Library },
  { to: '/teachers', label: 'Teachers', icon: Users },
  { to: '/counsellors', label: 'Counsellors', icon: HeartHandshake },
  { to: '/contact', label: 'Contact', icon: Phone },
  { to: '/letters', label: 'Letter Guide', icon: BookOpen },
  { to: '/practice-workbook', label: 'Practice Book', icon: PenTool },
];

const baseLinkClass = 'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors';
const getLinkClass = (active, featured = false) => {
  if (featured) {
    return `${baseLinkClass} ${
      active
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30'
        : 'bg-emerald-700 text-white hover:bg-emerald-600'
    }`;
  }

  return `${baseLinkClass} ${
    active
      ? 'bg-emerald-900/60 text-emerald-300'
      : 'text-slate-400 hover:bg-white/8 hover:text-white'
  }`;
};

function NotificationDot() {
  return (
    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b1a12] bg-emerald-400" />
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { count: unreadCount } = useUnreadMessages(user?.uid);

  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';
  const isCounsellor = isCounsellorRole(user?.role);
  const isCounsellingClient = isCounsellingClientRole(user?.role);
  const dashboardLink = useMemo(
    () =>
      isAdmin
        ? { to: '/admin', label: 'Admin Panel', icon: LayoutDashboard }
        : isCounsellor
          ? { to: '/counsellor', label: 'Counsellor', icon: HeartHandshake }
          : isCounsellingClient
            ? { to: '/counselling-client', label: 'My Support', icon: HeartHandshake }
            : { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    [isAdmin, isCounsellor, isCounsellingClient]
  );

  const messagePath = isAdmin ? '/admin/messages' : '/messages';

  // Counselling clients and counsellors must not see student learning links
  const isCounsellingUser = isCounsellingClient || isCounsellor;

  const counsellingDesktopLinks = [
    { to: '/',                    label: 'Home',      icon: Home           },
    dashboardLink,
    { to: '/daily-spiritual',     label: 'Daily',     icon: Heart          },
    { to: '/counselling-library', label: 'Library',   icon: Library        },
    { to: '/counsellors',         label: 'Counsellors', icon: HeartHandshake },
    { to: '/contact',             label: 'Contact',   icon: Phone          },
  ];

  const desktopLinks = isCounsellingUser
    ? counsellingDesktopLinks
    : [...primaryLinks, dashboardLink];

  const mobileLinks = isCounsellingUser
    ? [...counsellingDesktopLinks]
    : [...primaryLinks, dashboardLink, ...hubLinks];

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0b1a12]/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          to="/"
          className="z-10 flex min-w-[205px] flex-shrink-0 items-center space-x-3"
          onClick={() => setOpen(false)}
        >
          <div className="relative h-9 w-9 flex-shrink-0">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <polygon points="18,2 34,10 34,26 18,34 2,26 2,10" fill="none" stroke="#34d399" strokeWidth="1.5" />
              <polygon points="18,7 29,13 29,23 18,29 7,23 7,13" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.5" />
              <circle cx="18" cy="18" r="3" fill="#34d399" />
            </svg>
          </div>
          <div className="min-w-0 leading-tight">
            <div className="whitespace-nowrap text-base font-bold tracking-tight text-white">SirajOne</div>
            <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-400">
              Faith. Knowledge. Action.
            </div>
          </div>
        </Link>

        <div className="ml-auto hidden flex-shrink-0 items-center gap-1 lg:flex xl:gap-2">
          {desktopLinks.map(({ to, label, icon: Icon, featured }) => (
            <Link key={to} to={to} className={getLinkClass(pathname === to, featured)}>
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </Link>
          ))}

          <Link
            to={messagePath}
            className={`${getLinkClass(pathname.includes('messages'))} relative`}
            aria-label={`Messages${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            title="Messages"
          >
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span className="hidden whitespace-nowrap xl:inline">Messages</span>
            {unreadCount > 0 && <NotificationDot />}
          </Link>

          {!isCounsellingUser && (
            <Link
              to="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-700 hover:text-white xl:flex"
            >
              <Compass className="h-4 w-4" />
              Hub
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/finance" className={getLinkClass(pathname === '/admin/finance')}>
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span className="hidden whitespace-nowrap xl:inline">Finance</span>
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap text-slate-400 transition-colors hover:bg-white/8 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className="hidden xl:inline">Logout</span>
          </button>
        </div>

        <button
          type="button"
          className="ml-auto flex-shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/8 bg-[#0b1a12] px-4 py-3 lg:hidden">
          <div className="grid gap-1 sm:grid-cols-2">
            {mobileLinks.map(({ to, label, icon: Icon, featured }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  featured
                    ? 'bg-emerald-700 text-white hover:bg-emerald-600'
                    : pathname === to
                      ? 'bg-emerald-900/60 text-emerald-400'
                      : 'text-slate-400 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <Link
              to={messagePath}
              onClick={() => setOpen(false)}
              className="relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/8 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Messages
              {unreadCount > 0 && (
                <span className="ml-1 h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </Link>
            {isAdmin && (
              <Link
                to="/admin/finance"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/8 hover:text-white"
              >
                <DollarSign className="h-4 w-4" />
                Finance
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-400/15"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

