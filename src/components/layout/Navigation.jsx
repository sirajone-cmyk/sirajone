import React from 'react';
import { BookOpen, LifeBuoy, LogOut, MessageCircle, Users } from 'lucide-react';
import { usePlatform } from '../../state/PlatformContext';

const NAV_GROUPS = [
  {
    label: 'Learning',
    links: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'learn', label: 'Learn' },
      { id: 'teachers', label: 'Teachers' },
      { id: 'library', label: 'Library' },
      { id: 'rules', label: 'Rules' },
    ],
  },
  {
    label: 'Support',
    links: [
      { id: 'messages', label: 'Messages' },
      { id: 'support', label: 'Support' },
      { id: 'contact', label: 'Contact' },
    ],
  },
  {
    label: 'Community',
    links: [{ id: 'programs', label: 'Programs' }],
  },
];

function NavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
        active
          ? 'bg-emerald-400/20 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.28)]'
          : 'text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-100'
      }`}
    >
      {label}
    </button>
  );
}

export function Navigation({ page, onNavigate }) {
  const { currentUser, logout } = usePlatform();
  const quickActions = [
    { id: 'learn', label: 'Start Lesson', icon: BookOpen },
    { id: 'teachers', label: 'Choose Teacher', icon: Users },
    { id: 'messages', label: 'Contact Support', icon: MessageCircle },
    { id: 'support', label: 'Support Access', icon: LifeBuoy },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-300/12 bg-slate-950/78 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 text-left transition hover:bg-emerald-400/8"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/38 bg-emerald-400/10 text-sm font-bold text-emerald-200">
            S
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200/90">
              SirajOne
            </span>
            <span className="block text-xs font-bold text-emerald-100 sm:text-sm">
              {currentUser?.name || 'Student App'}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-3 rounded-xl border border-emerald-300/10 bg-slate-900/40 px-3 py-2 lg:flex">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="flex items-center gap-1.5">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/70">
                {group.label}
              </span>
              {group.links.map((item) => (
                <NavButton
                  key={item.id}
                  active={page === item.id}
                  label={item.label}
                  onClick={() => onNavigate(item.id)}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('letters')}
            className="rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-3.5 py-2 text-xs font-extrabold text-slate-900 shadow-[0_12px_30px_-14px_rgba(16,185,129,0.85)] transition hover:from-emerald-200 hover:to-emerald-300"
          >
            Letter Guide
          </button>
          <button
            type="button"
            onClick={logout}
            className="hidden items-center gap-1 rounded-xl border border-emerald-300/30 bg-slate-900/60 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-slate-900/90 md:inline-flex"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      <div className="border-t border-emerald-300/8 bg-slate-950/55">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  page === item.id
                    ? 'border-emerald-300/40 bg-emerald-500/10 text-emerald-100'
                    : 'border-emerald-300/15 bg-slate-900/35 text-slate-300 hover:border-emerald-300/30 hover:text-emerald-100'
                }`}
              >
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
