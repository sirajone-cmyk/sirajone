import React, { useState } from 'react';
import {
  Menu,
  X,
  BookOpen,
  Library,
  Users,
  LayoutDashboard,
  Phone,
  MessageCircle,
  GraduationCap,
  Shield,
  DollarSign,
} from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { cn } from '../../utils/cn';
import { usePlatform } from '../../state/PlatformContext';

const NAV_LINKS = [
  { label: 'Home', href: '#home', icon: BookOpen },
  { label: 'Programs', href: '#programs', icon: GraduationCap },
  { label: 'Enroll', href: '#enroll', icon: BookOpen },
  { label: 'Library', href: '#library', icon: Library },
  { label: 'Teachers', href: '#teachers', icon: Users },
  { label: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
  { label: 'Contact', href: '#contact', icon: Phone },
  { label: 'Messages', href: '#messages', icon: MessageCircle },
  { label: 'Roles', href: '#roles', icon: Shield },
  { label: 'Finance', href: '#finance', icon: DollarSign },
];

export function Navbar({ className }) {
  const scrollY = useScrollPosition();
  const [open, setOpen] = useState(false);
  const scrolled = scrollY > 24;
  const { isAdmin } = usePlatform();
  const visibleLinks = NAV_LINKS.filter(
    (item) => (item.label !== 'Roles' && item.label !== 'Finance') || isAdmin
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] border-b border-[rgba(34,197,94,0.18)] transition-all duration-300',
        scrolled
          ? 'bg-[rgba(6,14,11,0.96)] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
          : 'bg-[rgba(6,14,11,0.86)] backdrop-blur-md',
        className
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 xl:px-10">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <a href="#home" className="flex min-w-fit items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(34,197,94,0.48)] bg-[rgba(34,197,94,0.14)] shadow-[0_0_18px_rgba(34,197,94,0.22)]">
              <BookOpen size={18} className="text-[#30d986]" />
            </div>
            <div className="leading-[1.04]">
              <p className="text-[15px] font-semibold text-[#ecfff4]">SirajOne</p>
              <p className="text-[12px] font-medium text-[#30d986] sm:text-[13px]">Community • Learning • Service</p>
            </div>
          </a>

          <nav className="hidden items-center gap-1.5 md:flex xl:gap-2">
            {visibleLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[15px] font-medium transition-all xl:px-3',
                  label === 'Home'
                    ? 'bg-[rgba(34,197,94,0.20)] text-[#4AEA9A]'
                    : 'text-[rgba(227,246,236,0.86)] hover:bg-[rgba(34,197,94,0.10)] hover:text-[#e8fff2]'
                )}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon size={14} className="opacity-80" />
                {label}
              </a>
            ))}
          </nav>

          <a
            href="#letters"
            className="hidden min-w-[108px] items-center justify-center rounded-xl bg-[#27c978] px-3 py-2 text-[14px] font-semibold text-[#052012] transition-colors hover:bg-[#33d384] md:inline-flex"
          >
            Letter Guide
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-[#95ffc8] md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={cn('overflow-hidden border-t border-[rgba(34,197,94,0.16)] bg-[rgba(6,14,11,0.98)] transition-all duration-300 md:hidden', open ? 'max-h-[520px]' : 'max-h-0')}>
        <nav className="space-y-1 p-3">
          {visibleLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] text-[#d9fbe9] hover:bg-[rgba(34,197,94,0.12)]"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
          <a
            href="#letters"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex w-full justify-center rounded-lg bg-[#27c978] px-3 py-2.5 text-[14px] font-semibold text-[#052012]"
          >
            Letter Guide
          </a>
        </nav>
      </div>
    </header>
  );
}
