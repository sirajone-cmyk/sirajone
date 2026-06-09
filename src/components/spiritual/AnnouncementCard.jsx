/**
 * AnnouncementCard — displays a single ta'leem or programme announcement.
 *
 * Data shape (from Firestore counsellingAnnouncements collection):
 *   {
 *     id: string,
 *     title: string,
 *     body: string,
 *     category: 'taleem' | 'programme' | 'reminder' | 'event',
 *     publishedAt: Timestamp,
 *     authorName: string,
 *     pinned: boolean,
 *     link: string | null,
 *     linkLabel: string | null,
 *   }
 */

import { format } from 'date-fns';
import { Pin, BookOpen, Megaphone, Calendar, Bell } from 'lucide-react';

const CATEGORY_CONFIG = {
  taleem:     { label: 'Ta\'leem',    icon: BookOpen,   color: 'text-amber-400',   bg: 'bg-amber-900/15' },
  programme:  { label: 'Programme',  icon: Calendar,   color: 'text-blue-400',    bg: 'bg-blue-900/15'  },
  reminder:   { label: 'Reminder',   icon: Bell,       color: 'text-purple-400',  bg: 'bg-purple-900/15'},
  event:      { label: 'Event',      icon: Megaphone,  color: 'text-rose-400',    bg: 'bg-rose-900/15'  },
};

export default function AnnouncementCard({ announcement }) {
  const {
    title,
    body,
    category = 'taleem',
    publishedAt,
    authorName,
    pinned = false,
    link,
    linkLabel,
  } = announcement;

  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.taleem;
  const Icon = config.icon;

  const publishedDate = publishedAt?.toDate
    ? publishedAt.toDate()
    : publishedAt
    ? new Date(publishedAt)
    : null;

  return (
    <div
      className={`rounded-xl border border-white/8 p-4 transition-all hover:border-white/12 ${
        pinned ? 'bg-white/6' : 'bg-white/4'
      }`}
    >
      {/* Header row */}
      <div className="mb-2 flex items-start gap-2">
        <span className={`mt-0.5 flex-shrink-0 rounded-lg p-1.5 ${config.bg}`}>
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {pinned && <Pin className="h-3 w-3 text-slate-400 flex-shrink-0" />}
            <h4 className="text-sm font-semibold text-white truncate">{title}</h4>
          </div>
          <p className={`text-[10px] font-semibold uppercase tracking-wide ${config.color}`}>
            {config.label}
          </p>
        </div>
      </div>

      {/* Body */}
      <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 mb-3">{body}</p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-500">
          {authorName && <span>{authorName}</span>}
          {publishedDate && (
            <span className="ml-2">{format(publishedDate, 'd MMM yyyy')}</span>
          )}
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/12 hover:text-white"
          >
            {linkLabel || 'View'}
          </a>
        )}
      </div>
    </div>
  );
}
