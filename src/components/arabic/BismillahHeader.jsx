import React from 'react';
import { cn } from '../../utils/cn';
import { ArabicText } from './ArabicText';

export function BismillahHeader({ className, animated = true, size = 'xl', ...props }) {
  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', animated && 'animate-fade-in', className)} {...props}>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,168,67,0.5)]" />
        <span style={{ fontFamily: "'Amiri', serif", color: '#D4A843', fontSize: '1rem' }}>✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,168,67,0.5)]" />
      </div>
      <ArabicText size={size} color="gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</ArabicText>
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(212,168,67,0.5)]" />
        <span style={{ fontFamily: "'Amiri', serif", color: '#D4A843', fontSize: '1rem' }}>✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(212,168,67,0.5)]" />
      </div>
    </div>
  );
}
