import React from 'react';
import { cn } from '../../utils/cn';

const base = 'inline-flex items-center gap-1.5 font-semibold rounded-full tracking-wide border';
const variants = {
  green:  'bg-[rgba(34,197,94,0.12)] text-[#4ADE80] border-[rgba(34,197,94,0.25)]',
  blue:   'bg-[rgba(59,130,246,0.12)] text-[#93C5FD] border-[rgba(59,130,246,0.25)]',
  purple: 'bg-[rgba(168,85,247,0.12)] text-[#D8B4FE] border-[rgba(168,85,247,0.25)]',
  gold:   'bg-[rgba(212,168,67,0.12)] text-[#D4A843] border-[rgba(212,168,67,0.25)]',
  muted:  'bg-[rgba(134,239,172,0.08)] text-[rgba(134,239,172,0.55)] border-[rgba(134,239,172,0.12)]',
};
const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };
const dotColors = { green: 'bg-[#22C55E]', blue: 'bg-blue-400', purple: 'bg-purple-400', gold: 'bg-[#D4A843]', muted: 'bg-[rgba(134,239,172,0.4)]' };

export function Badge({ children, variant = 'green', size = 'sm', showDot = true, className, ...props }) {
  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {showDot && <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
