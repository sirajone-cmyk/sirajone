import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuranVerse } from '../arabic/QuranVerse';
import { cn } from '../../utils/cn';

export function CTA() {
  return (
    <section className="relative bg-[#0A0F0D] py-24 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 65%)' }} />
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(34,197,94,0.4) 30%, rgba(212,168,67,0.35) 70%, transparent 95%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-lg mx-auto mb-10 fade-up">
          <QuranVerse arabic="وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا" translation="And recite the Qur'an with measured, distinct recitation." reference="Surah Al-Muzzammil, 73:4" />
        </div>
        <h2 className={cn('text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0FDF4] leading-tight mb-5 fade-up text-balance')} style={{ fontFamily: "'Playfair Display', serif", animationDelay: '150ms' }}>
          Begin Your <span className="gradient-text-green">Qur'anic Journey</span> Today
        </h2>
        <p className="text-base md:text-lg text-[#86EFAC] max-w-xl mx-auto mb-10 leading-relaxed fade-up" style={{ animationDelay: '250ms' }}>
          Join hundreds of students who have transformed their recitation with SirajOne's structured, teacher-guided approach.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 fade-up" style={{ animationDelay: '350ms' }}>
          <Button variant="primary" size="lg" href="#programs" className="group shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            Enrol Now <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
          <Button variant="secondary" size="lg" href="#programs"><BookOpen size={18} /> View Programmes</Button>
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent 5%, rgba(34,197,94,0.4) 30%, rgba(212,168,67,0.35) 70%, transparent 95%)' }} />
    </section>
  );
}

export const CTASection = CTA;
