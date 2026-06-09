/**
 * AdhkarSession — full morning or evening adhkar session view.
 *
 * Shows all adhkar items as AdhkarCards. Reads completions from Firestore
 * via useAdhkarCompletions. Includes "Mark all complete" shortcut.
 */

import { useAuth } from '@/lib/AuthContext';
import { useAdhkarCompletions } from '@/hooks/useAdhkarCompletions';
import { MORNING_ADHKAR } from '@/data/adhkar/morning';
import { EVENING_ADHKAR } from '@/data/adhkar/evening';
import AdhkarCard from './AdhkarCard';

export default function AdhkarSession({ session }) {
  const { user } = useAuth();
  const { completions, markItem, unmarkItem, markAll, loading } =
    useAdhkarCompletions(user?.uid);

  const adhkarList = session === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;
  const sessionCompletions = completions[session] ?? {};
  const allDone =
    session === 'morning' ? completions.morningCompleted : completions.eveningCompleted;

  const doneCount = adhkarList.filter((a) => sessionCompletions[a.id]).length;
  const total = adhkarList.length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/5 h-40" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Session header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white capitalize">
            {session} Adhkar
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {doneCount}/{total} completed
          </p>
        </div>

        {!allDone && (
          <button
            type="button"
            onClick={() => markAll(session)}
            className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-800/30"
          >
            Mark all done
          </button>
        )}

        {allDone && (
          <span className="rounded-lg bg-emerald-700/30 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            ✓ All complete
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-500"
          style={{ width: `${(doneCount / total) * 100}%` }}
        />
      </div>

      {/* Adhkar list */}
      <div className="space-y-3">
        {adhkarList.map((item) => {
          const done = !!sessionCompletions[item.id];
          return (
            <AdhkarCard
              key={item.id}
              item={item}
              done={done}
              onToggle={() =>
                done ? unmarkItem(session, item.id) : markItem(session, item.id)
              }
            />
          );
        })}
      </div>

      {allDone && (
        <p className="mt-6 text-center text-sm text-emerald-400/80 italic">
          Bārakallāhu fīk — may Allah bless you in your remembrance.
        </p>
      )}
    </div>
  );
}
