import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import { STATS } from '../../data/stats';
import { cn } from '../../utils/cn';

function StatBlock({ stat, index }) {
  const [ref, display] = useCountUp(stat.value, 1800, stat.suffix);
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center text-center px-6 py-7 md:py-8 border-b border-[#1E2D24] lg:border-b-0 fade-up',
        index < 3 && 'lg:border-r lg:border-[#1E2D24]'
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <span className="text-4xl md:text-5xl font-bold text-[#34d399] leading-none mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        {display}
      </span>
      <span className="text-base font-semibold text-[#F0FDF4] mb-1">{stat.label}</span>
      <span className="text-sm text-[rgba(134,239,172,0.5)]">{stat.sublabel}</span>
    </div>
  );
}

export function Stats() {
  return (
    <section className="relative bg-[#0D1511] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.5) 30%, rgba(212,168,67,0.3) 70%, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.5) 30%, rgba(212,168,67,0.3) 70%, transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatBlock key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export const StatsSection = Stats;
