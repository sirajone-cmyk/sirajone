/**
 * AdhkarCard — displays a single adhkar item with Arabic, transliteration,
 * translation, benefit, source, repetition count, and a completion toggle.
 */

import { CheckCircle, Circle } from 'lucide-react';

export default function AdhkarCard({ item, done, onToggle }) {
  const { arabicText, transliteration, translation, benefit, source, repetitions } = item;

  return (
    <div
      className={`rounded-xl border transition-all ${
        done
          ? 'border-emerald-500/30 bg-emerald-900/15'
          : 'border-white/8 bg-white/4 hover:bg-white/6'
      }`}
    >
      <div className="p-4">
        {/* Arabic text */}
        <p
          className="mb-2 font-arabic text-xl leading-loose text-right text-white"
          dir="rtl"
          lang="ar"
        >
          {arabicText}
        </p>

        {/* Transliteration */}
        <p className="mb-1 text-sm italic text-emerald-300/80">{transliteration}</p>

        {/* Translation */}
        <p className="mb-3 text-sm text-slate-300 leading-relaxed">{translation}</p>

        {/* Benefit + source row */}
        <div className="mb-3 rounded-lg bg-white/5 px-3 py-2">
          <p className="text-xs text-slate-400 leading-relaxed">{benefit}</p>
          <p className="mt-1 text-[10px] text-slate-500">{source}</p>
        </div>

        {/* Footer: repetitions + done button */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            × {repetitions} {repetitions === 1 ? 'time' : 'times'}
          </span>
          <button
            type="button"
            onClick={onToggle}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              done
                ? 'bg-emerald-700/40 text-emerald-300'
                : 'bg-white/8 text-slate-300 hover:bg-emerald-700/30 hover:text-emerald-300'
            }`}
          >
            {done ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Done
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5" />
                Mark done
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
