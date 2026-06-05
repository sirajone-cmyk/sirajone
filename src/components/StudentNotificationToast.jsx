/**
 * StudentNotificationToast.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global floating toast for practice reminder notifications sent by teachers.
 *
 * Mounted once in App.jsx, inside <Router> so useNavigate works.
 * Only renders when:
 *   • The authenticated user's role is 'Student'
 *   • There is at least one undismissed 'practice_reminder' notification
 *
 * Toast behaviour
 * ───────────────
 * • Shows the most recent undismissed reminder (newest first from the hook).
 * • "Record Now" — dismisses the notification then navigates to the recording page.
 * • "Dismiss"    — dismisses the notification only (dismissed: true, dismissedAt).
 * • Auto-stacks: if multiple reminders exist, the next appears once the top one
 *   is dismissed (the hook re-renders with the remaining list).
 *
 * Firestore writes
 * ────────────────
 * Dismiss writes to `users/{studentId}/notifications/{notifId}`:
 *   { dismissed: true, dismissedAt: serverTimestamp() }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db }          from '@/lib/firebase';
import { useAuth }     from '@/lib/AuthContext';
import { ROLES }       from '@/lib/roles';
import { PIPELINE_STAGES, getStageLabel } from '@/lib/submissionPipeline';
import { useStudentNotifications } from '@/hooks/useStudentNotifications';

// ── Route mapping ─────────────────────────────────────────────────────────────

/**
 * Map a pipeline stage to the page where the student records that stage.
 * @param {string} stage
 * @returns {string}
 */
function stageToRoute(stage) {
  switch (stage) {
    case PIPELINE_STAGES.LETTER_GUIDE:       return '/letters';
    case PIPELINE_STAGES.PRACTICAL_WORKBOOK: return '/practice-workbook';
    case PIPELINE_STAGES.PART_TWO:           return '/part-two-workbook';
    default:                                 return '/practice-workbook';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function StudentNotificationToast() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  // Only subscribe for students — returns [] immediately for all other roles.
  const notifications = useStudentNotifications(
    user?.role === ROLES.STUDENT ? user?.uid : null,
  );

  // Filter to practice_reminder type only; hook already orders by createdAt desc.
  const reminders = notifications.filter((n) => n.type === 'practice_reminder');
  const latest    = reminders[0] ?? null;

  if (!latest) return null;

  // ── Actions ────────────────────────────────────────────────────────────────

  async function dismiss(notifId) {
    try {
      await updateDoc(
        doc(db, 'users', user.uid, 'notifications', notifId),
        { dismissed: true, dismissedAt: serverTimestamp() },
      );
    } catch (err) {
      console.error('[StudentNotificationToast] dismiss error:', err);
    }
  }

  async function handleTap() {
    await dismiss(latest.id);
    navigate(stageToRoute(latest.stage));
  }

  async function handleDismiss() {
    await dismiss(latest.id);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      role="alertdialog"
      aria-live="polite"
      aria-label="Practice reminder from your teacher"
      className="fixed bottom-5 left-4 right-4 z-[9999998] mx-auto max-w-md"
    >
      <div className="rounded-2xl border border-emerald-300/20 bg-[#07140d]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-sm">
        {/* ── Header ── */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-200">
              <Bell className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                Practice Reminder
              </p>
              <p className="text-[10px] text-slate-500">
                {getStageLabel(latest.stage)} · from {latest.teacherName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1 text-slate-500 transition hover:bg-white/10 hover:text-slate-300"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* ── Message ── */}
        <p className="text-sm leading-relaxed text-slate-200">
          {latest.message}
        </p>

        {/* ── Actions ── */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleTap}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-black transition hover:bg-emerald-400"
          >
            Tap to Record Now
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10"
          >
            Dismiss
          </button>
        </div>

        {/* Stack indicator when multiple reminders exist */}
        {reminders.length > 1 && (
          <p className="mt-2 text-[10px] text-slate-600">
            +{reminders.length - 1} more reminder{reminders.length - 1 > 1 ? 's' : ''} pending
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentNotificationToast;
