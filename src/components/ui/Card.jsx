import React from 'react';
import { cn } from '../../utils/cn';

const base = 'relative rounded-2xl border overflow-hidden bg-[#111A15] transition-all duration-250 ease-out';
const variants = {
  default: 'border-[#1E2D24] shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
  glow:    'border-[rgba(34,197,94,0.20)] shadow-[0_0_0_1px_rgba(34,197,94,0.20),0_4px_24px_rgba(0,0,0,0.4)] hover:border-[rgba(34,197,94,0.45)] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.40),0_0_40px_rgba(34,197,94,0.14)] hover:-translate-y-1',
  gold:    'border-[rgba(212,168,67,0.20)] shadow-[0_0_0_1px_rgba(212,168,67,0.20),0_4px_24px_rgba(0,0,0,0.4)] hover:border-[rgba(212,168,67,0.45)]',
  flat:    'border-[#1E2D24]',
};

export function Card({ children, variant = 'default', className, ...props }) {
  return <div className={cn(base, variants[variant], className)} {...props}>{children}</div>;
}
Card.Header = ({ children, className, ...props }) => <div className={cn('px-6 pt-6 pb-0', className)} {...props}>{children}</div>;
Card.Body   = ({ children, className, ...props }) => <div className={cn('p-6', className)} {...props}>{children}</div>;
Card.Footer = ({ children, className, ...props }) => <div className={cn('px-6 pb-6 pt-4 border-t border-[#1E2D24]', className)} {...props}>{children}</div>;
