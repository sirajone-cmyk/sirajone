/**
 * SalahTracker — daily 5-prayer tracker for counselling users.
 *
 * Fully private: data never shown to counsellors or admin.
 * No gamification, no streaks shown, no public comparison.
 * Calm, gentle, non-judgmental design.
 */

import { useSalahLog } from '@/hooks/useSalahLog';
import { useAuth } from '@/lib/AuthContext';

const PRAYERS = [
  { key: 'fajr',    label: 'Fajr',    time: 'Before sunrise' },
  { key: 'dhuhr',   label: 'Dhuhr',   time: 'Midday'         },
  { key: 'asr',     label: 'Asr',     time: 'Afternoon'      },
  { key: 'maghrib', label: 'Maghrib', time: 'Sunset'         },
  { key: 'isha',    label: 'Isha',    time: 'Night'          },
];

export default function SalahTracker() {
  const { user } = useAuth();
  const { log, markPrayer, unmarkPrayer, loading } = useSalahLog(user?.uid);

  const completedCount = PRAYERS.filter((p) => log[p.key]).length;

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl bg-white/5 p-6 h-48" />
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Daily Salah</h3>
          <p className="text-xs text-slate-400 mt-0.5">Your prayers today</p>
        </div>
        <span className="text-sm font-semibold text-emerald-400">
          {completedCount}/5
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {PRAYERS.map(({ key, label, time }) => {
          const done = !!log[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => (done ? unmarkPrayer(key) : markPrayer(key))}
              title={`${label} — ${time}`}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                done
                  ? 'bg-emerald-700/40 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {/* Prayer indicator circle */}
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-500'
                }`}
              >
                {done ? '✓' : label[0]}
              </span>
              <span className="text-[11px] font-medium leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {completedCount === 5 && (
        <p className="mt-4 text-center text-xs text-emerald-400/80 italic">
          Alhamdulillah — all five prayers completed today.
        </p>
      )}
    </div>
  );
}
