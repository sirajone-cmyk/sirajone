import React from 'react';
import { BookOpen, Camera, Users, PlayCircle, Send } from 'lucide-react';
import { cn } from '../../utils/cn';

const QUICK_LINKS = [{ label: 'Home', href: '#home' },{ label: 'Programs', href: '#programs' },{ label: 'Teachers', href: '#teachers' },{ label: 'Enroll', href: '#enroll' },{ label: 'Dashboard', href: '#dashboard' },{ label: 'Contact', href: '#contact' }];
const PROGRAMMES  = [{ label: "Qa'idah & Reading", href: '#programs' },{ label: 'Tajwid Foundations', href: '#programs' },{ label: 'Hifz Programme', href: '#programs' },{ label: 'Advanced Recitation', href: '#programs' }];
const CONTACT_INFO= [{ label: 'Overport, Durban, KwaZulu-Natal, South Africa' },{ label: '+27 67 634 0225' },{ label: 'sirajone7@gmail.com' },{ label: 'sirajone.co.za' }];
const SOCIALS     = [{ Icon: Camera, href: '#', label: 'Instagram' },{ Icon: Users, href: '#', label: 'Facebook' },{ Icon: PlayCircle, href: '#', label: 'YouTube' },{ Icon: Send, href: '#', label: 'Twitter' }];

const FooterLink    = ({ href, children }) => <a href={href} className="block text-sm text-[rgba(134,239,172,0.55)] hover:text-[#86EFAC] transition-colors duration-200 py-0.5">{children}</a>;
const FooterHeading = ({ children }) => <h4 className="text-[#F0FDF4] font-semibold text-sm tracking-wide mb-5 uppercase">{children}</h4>;

export function Footer({ className }) {
  return (
    <footer className={cn('bg-[#060D09] border-t-2 border-[rgba(34,197,94,0.2)]', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <a href="#home" className="flex items-center gap-2.5 mb-5 w-fit">
              <div className="w-9 h-9 rounded-xl bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center"><BookOpen size={17} className="text-[#22C55E]" /></div>
              <div className="leading-none">
                <span className="block text-[#F0FDF4] text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>SirajOne</span>
                <span className="block text-[#D4A843] text-xs" style={{ fontFamily: "'Amiri', serif" }} dir="rtl" lang="ar">سِرَاج وَن</span>
              </div>
            </a>
            <p className="text-sm text-[rgba(134,239,172,0.55)] leading-relaxed max-w-[220px]">A journey through the Qur'an — precise, structured, and guided by qualified teachers.</p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#111A15] border border-[#1E2D24] text-[rgba(134,239,172,0.55)] hover:border-[rgba(34,197,94,0.4)] hover:text-[#22C55E] hover:bg-[rgba(34,197,94,0.06)] transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div><FooterHeading>Quick Links</FooterHeading><div className="space-y-1">{QUICK_LINKS.map(l => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}</div></div>
          <div><FooterHeading>Programmes</FooterHeading><div className="space-y-1">{PROGRAMMES.map(l => <FooterLink key={l.label} href={l.href}>{l.label}</FooterLink>)}</div></div>
          <div><FooterHeading>Contact</FooterHeading><div className="space-y-2">{CONTACT_INFO.map(item => <p key={item.label} className="text-sm text-[rgba(134,239,172,0.55)]">{item.label}</p>)}</div></div>
        </div>
      </div>
      <div className="border-t border-[#1E2D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[rgba(134,239,172,0.35)]">© {new Date().getFullYear()} SirajOne · All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[rgba(134,239,172,0.35)]">Built for the Ummah</span>
            <span className="text-sm text-[#D4A843]" style={{ fontFamily: "'Amiri', serif" }} dir="rtl" lang="ar">· بُنِيَ لِلْأُمَّة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
