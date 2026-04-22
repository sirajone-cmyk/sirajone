import React from 'react';
import { CalendarClock, Radio, Video } from 'lucide-react';
import { Button } from '../ui/Button';

function formatSessionTime(isoDate) {
  try {
    return new Date(isoDate).toLocaleString('en-ZA', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}

const STATUS_STYLES = {
  upcoming: 'text-[#bfdbfe] bg-[rgba(37,99,235,0.22)] border-[rgba(37,99,235,0.4)]',
  live: 'text-[#bbf7d0] bg-[rgba(22,163,74,0.24)] border-[rgba(22,163,74,0.42)]',
  completed: 'text-[#d1d5db] bg-[rgba(75,85,99,0.34)] border-[rgba(75,85,99,0.45)]',
};

export function SessionCard({ session, onJoin }) {
  return (
    <article className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-lg font-semibold text-white">{session.title}</h4>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[session.status] || STATUS_STYLES.upcoming}`}>
          {session.status}
        </span>
      </div>

      <p className="mt-1 text-sm text-[rgba(217,251,232,0.72)]">Teacher: {session.teacher}</p>
      <p className="text-sm text-[rgba(217,251,232,0.72)]">Student: {session.student}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[rgba(217,251,232,0.65)]">
        <span className="inline-flex items-center gap-1"><CalendarClock size={13} /> {formatSessionTime(session.start)}</span>
        <span className="inline-flex items-center gap-1">{session.mode === 'video' ? <Video size={13} /> : <Radio size={13} />} {session.mode}</span>
        <span>{session.durationMinutes} min</span>
      </div>

      <div className="mt-4">
        <Button
          variant={session.status === 'live' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onJoin(session)}
          className="w-full justify-center"
        >
          {session.status === 'live' ? 'Join Live Session' : 'Open Session Room'}
        </Button>
      </div>
    </article>
  );
}
