/**
 * DhikrTracker — tap-counter for Istighfar, Durood, and La ilaha illallah.
 *
 * Each counter resets daily. Tap to increment, tap the label area to see
 * Arabic text. No leaderboard, no streak pressure, no sharing.
 */

import { useDhikrLog, DHIKR_TYPES, DHIKR_TARGETS, DHIKR_LABELS } from '@/hooks/useDhikrLog';
import { useAuth } from '@/lib/AuthContext';

const DHIKR_ARABIC = {
  istighfar: 'أَسْتَغْفِرُ اللهَ',
  durood:    'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
  tahleel:   'لَا إِلَهَ إِلَّا اللهُ',
};

const DHIKR_TRANSLITERATION = {
  istighfar: 'Astaghfirullah',
  durood:    "Allahumma salli 'ala Muhammad",
  tahleel:   'Lā ilāha illallāh',
};

export default function DhikrTracker() {
  const { user } = useAuth();
  const { log, increment, loading } = useDhikrLog(user?.uid);

  if (loading) {
    return <div className="animate-pulse rounded-2xl bg-white/5 p-6 h-48" />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Daily Dhikr</h3>
        <p className="text-xs text-slate-400 mt-0.5">Tap to count — resets each day</p>
      </div>

      <div className="space-y-3">
        {DHIKR_TYPES.map((type) => {
          const count = log[type] ?? 0;
          const target = DHIKR_TARGETS[type];
          const done = count >= target;
          const pct = Math.min((count / target) * 100, 100);

          return (
            <div key={type} className="rounded-xl border border-white/8 bg-white/4 p-3">
              {/* Arabic + label row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p
                    className="font-arabic text-lg leading-snug text-emerald-300"
                    dir="rtl"
                    lang="ar"
                  >
                    {DHIKR_ARABIC[type]}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {DHIKR_TRANSLITERATION[type]}
                  </p>
                </div>
                {/* Count display */}
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`text-2xl font-bold tabular-nums leading-none ${
                      done ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {count}
                  </span>
                  <span className="text-xs text-slate-500">/{target}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    done ? 'bg-emerald-500' : 'bg-emerald-700'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Tap button */}
              <button
                type="button"
                onClick={() => increment(type)}
                disabled={done}
                className={`w-full rounded-lg py-2 text-sm font-semibold transition-all ${
                  done
                    ? 'bg-emerald-800/30 text-emerald-500 cursor-default'
                    : 'bg-emerald-700/30 text-emerald-300 hover:bg-emerald-700/50 active:scale-95'
                }`}
              >
                {done ? '✓ Completed' : `Tap — ${DHIKR_LABELS[type]}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
