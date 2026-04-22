import React from 'react';
import { cn } from '../../utils/cn';

export function PageWrapper({ children, className, ...props }) {
  return (
    <div className={cn('min-h-screen bg-[#0A0F0D] text-[#F0FDF4] overflow-x-hidden', className)} {...props}>
      {children}
    </div>
  );
}
