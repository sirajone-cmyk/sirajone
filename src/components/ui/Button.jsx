import React from 'react';
import { cn } from '../../utils/cn';

const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-250 ease-out select-none cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary:   'bg-[#22C55E] text-[#0A0F0D] border-[#22C55E] hover:bg-[#16A34A] hover:border-[#16A34A] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.4),0_0_20px_rgba(34,197,94,0.25)] active:scale-95',
  secondary: 'bg-[#111A15] text-[#86EFAC] border-[rgba(34,197,94,0.35)] hover:bg-[#162018] hover:border-[rgba(34,197,94,0.65)] hover:text-[#F0FDF4] active:scale-95',
  ghost:     'bg-transparent text-[#86EFAC] border-[rgba(134,239,172,0.25)] hover:bg-[rgba(34,197,94,0.08)] hover:border-[rgba(34,197,94,0.45)] hover:text-[#F0FDF4] active:scale-95',
  gold:      'bg-[#D4A843] text-[#0A0F0D] border-[#D4A843] hover:bg-[#F0C060] hover:border-[#F0C060] active:scale-95',
  danger:    'bg-red-600 text-white border-red-600 hover:bg-red-700 active:scale-95',
};

const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };

export function Button({ children, variant = 'primary', size = 'md', className, disabled, type = 'button', onClick, href, ...props }) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) return <a href={href} className={classes} {...props}>{children}</a>;
  return <button type={type} disabled={disabled} onClick={onClick} className={classes} {...props}>{children}</button>;
}
