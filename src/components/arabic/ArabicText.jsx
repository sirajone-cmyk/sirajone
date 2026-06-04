import React from 'react';
import { cn } from '../../utils/cn';

const sizes  = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl', xl: 'text-4xl', '2xl': 'text-5xl', '3xl': 'text-6xl' };
const colors = { gold: 'text-[#D4A843]', green: 'text-[#4ADE80]', muted: 'text-[rgba(134,239,172,0.55)]', primary: 'text-[#F0FDF4]' };

export function ArabicText({ children, size = 'md', color = 'primary', className, style, ...props }) {
  return (
    <span
      className={cn('inline-block leading-relaxed tracking-normal', sizes[size], colors[color], className)}
      style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl', ...style }}
      dir="rtl" lang="ar" {...props}
    >
      {children}
    </span>
  );
}
