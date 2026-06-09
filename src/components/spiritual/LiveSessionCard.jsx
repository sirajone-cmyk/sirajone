/**
 * LiveSessionCard — displays a single live dhikr/dua session.
 *
 * Shows: title, description, scheduled time, host name, participant count,
 * and a "Join" button (navigates to the session room or opens a link).
 *
 * Data shape (from Firestore liveSessions collection):
 *   {
 *     id: string,
 *     title: string,
 *     description: string,
 *     scheduledAt: Timestamp,
 *     hostName: string,
 *     hostUid: string,
 *     participantCount: number,
 *     isLive: boolean,
 *     meetingLink: string | null,
 *     createdBy: string,  // uid
 *   }
 */

import { format } from 'date-fns';
import { Users, Radio, Clock } from 'lucide-react';

export default function LiveSessionCard({ session, onJoin }) {
  const {
    title,
    description,
    scheduledAt,
    hostName,
    participantCount = 0,
    isLive = false,
  } = session;

  const scheduledDate = scheduledAt?.toDate ? scheduledAt.toDate() : new Date(scheduledAt);
  const formattedDate = format(scheduledDate, 'EEE, d MMM');
  const formattedTime = format(scheduledDate, 'h:mm a');

  return (
    <div
      className={`rounded-xl border transition-all ${
        isLive
          ? 'border-emerald-500/50 bg-emerald-900/15 ring-1 ring-emerald-500/20'
          : 'border-white/8 bg-white/4'
      }`}
    >
      <div className="p-4">
        {/* Live badge */}
        {isLive && (
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wide text-red-400">
              Live now
            </span>
          </div>
        )}

        {/* Title */}
        <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
          {!isLive && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedDate} at {formattedTime}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
          </span>
          <span className="flex items-center gap-1">
            <Radio className="h-3 w-3" />
            Hosted by {hostName || 'SirajOne'}
          </span>
        </div>

        {/* Join button */}
        <button
          type="button"
          onClick={() => onJoin?.(session)}
          className={`w-full rounded-lg py-2 text-sm font-semibold transition-all ${
            isLive
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-white/8 text-slate-300 hover:bg-emerald-700/30 hover:text-emerald-300'
          }`}
        >
          {isLive ? 'Join Session' : 'Set Reminder'}
        </button>
      </div>
    </div>
  );
}
