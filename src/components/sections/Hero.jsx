import React from 'react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden" style={{ paddingTop: '68px' }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=2200&q=80"
          alt="Open Quran pages"
          className="h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[rgba(2,14,10,0.72)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(2,14,10,0.50)] via-[rgba(2,14,10,0.58)] to-[#07110d]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(2,14,10,0.35)] via-transparent to-[rgba(2,14,10,0.35)]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-68px)] items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[860px] text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.48)] bg-[rgba(2,14,10,0.56)] px-5 py-2.5 shadow-[0_0_0_1px_rgba(34,197,94,0.16)]">
            <MapPin size={16} className="text-[#30d986]" />
            <span className="text-[14px] font-medium text-[#30d986] sm:text-[16px]">Durban, South Africa • In-Person & Online Learning</span>
          </div>

          <h1 className="font-bold leading-[1.02] text-[#f3fff8]" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2.2rem, 6.6vw, 5.2rem)' }}>
            Faith. Knowledge. Action.
          </h1>

          <p className="mx-auto mt-6 max-w-[780px] leading-relaxed text-[#d7e9df]" style={{ fontSize: 'clamp(1rem, 1.75vw, 2.05rem)' }}>
            Islamic learning, Qur'an studies, weekly classes, and digital resources for children, adults, families, and communities.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" href="#programs" className="group min-w-[240px] justify-center rounded-2xl">
              Explore Programs
              <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#contact"
              className="min-w-[240px] justify-center rounded-2xl border-[rgba(226,232,240,0.3)] bg-[rgba(31,41,55,0.42)] text-[#f3f8f6]"
            >
              <CalendarDays size={18} /> Join a Class
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const HeroSection = Hero;
