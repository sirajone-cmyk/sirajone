import React from 'react';
import { cn } from '../../utils/cn';
import { ArabicText } from './ArabicText';

export function QuranVerse({ arabic, translation, reference, className, ...props }) {
  return (
    <div className={cn('border-l-2 border-[#D4A843] pl-5 py-3 bg-[rgba(212,168,67,0.04)] rounded-r-xl', className)} {...props}>
      {arabic && <ArabicText size="lg" color="gold" className="block text-center mb-3">{arabic}</ArabicText>}
      {translation && <p className="text-[#86EFAC] text-sm italic leading-relaxed">"{translation}"</p>}
      {reference && <p className="text-[rgba(134,239,172,0.55)] text-xs mt-2 font-medium">— {reference}</p>}
    </div>
  );
}
