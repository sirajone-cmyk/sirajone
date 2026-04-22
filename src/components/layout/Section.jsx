import React, { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-[#0A0F0D]',
  alt: 'bg-[#0D1511]',
  dark: 'bg-[#060D09]',
  pattern: 'bg-[#0A0F0D] pattern-subtle',
  elevated: 'bg-[#111A15]',
};

export function Section({
  children,
  id,
  variant = 'default',
  className,
  innerClass,
  animate = true,
  py = 'py-14 md:py-18 lg:py-20',
  ...props
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animate) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.fade-up, .fade-in').forEach((n) => n.classList.add('visible'));
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <section id={id} ref={sectionRef} className={cn(variants[variant], py, className)} {...props}>
      <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', innerClass)}>{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, eyebrowArabic, title, subtitle, centered = true, className }) {
  return (
    <div className={cn('mb-10 md:mb-12 fade-up', centered && 'text-center', className)}>
      {(eyebrow || eyebrowArabic) && (
        <div className={cn('flex items-center gap-3 mb-3', centered && 'justify-center')}>
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#22C55E]" />
          <div className="flex flex-col items-center gap-0.5">
            {eyebrowArabic && (
              <span style={{ fontFamily: "'Amiri', serif", color: '#D4A843', fontSize: '1.1rem' }} dir="rtl" lang="ar">
                {eyebrowArabic}
              </span>
            )}
            {eyebrow && <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#22C55E]">{eyebrow}</span>}
          </div>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#22C55E]" />
        </div>
      )}

      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F0FDF4] text-balance leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>

      {subtitle && <p className="mt-3 text-base md:text-lg text-[#86EFAC] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}
