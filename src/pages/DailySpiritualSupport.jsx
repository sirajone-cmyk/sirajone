/**
 * DailySpiritualSupport — daily ibadah hub for counselling clients and counsellors.
 *
 * Scope: COUNSELLING_CLIENT and COUNSELLOR roles only.
 * App.jsx must guard this route with isCounsellingUser before rendering.
 *
 * Tabs:
 *   1. Salah      — daily 5-prayer tracker
 *   2. Dhikr      — tap counters (istighfar / durood / tahleel)
 *   3. Quran      — daily recitation log
 *   4. Morning    — morning adhkar session
 *   5. Evening    — evening adhkar session
 *   6. Sessions   — live dhikr/dua sessions (Firestore: liveSessions)
 *   7. Updates    — ta'leem & programme announcements (Firestore: counsellingAnnouncements)
 *   8. Support    — optional counsellor link (gentle, non-pressured)
 */

import { useState, useEffect } from 'react';
import {
  Sunset,
  Moon,
  BookOpen,
  Heart,
  Radio,
  Megaphone,
  HeartHandshake,
  Sun,
} from 'lucide-react';
import { collection, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isCounsellorRole, isCounsellingClientRole } from '@/lib/roles';

import SalahTracker from '@/components/spiritual/SalahTracker';
import DhikrTracker from '@/components/spiritual/DhikrTracker';
import QuranLog from '@/components/spiritual/QuranLog';
import AdhkarSession from '@/components/spiritual/AdhkarSession';
import LiveSessionCard from '@/components/spiritual/LiveSessionCard';
import AnnouncementCard from '@/components/spiritual/AnnouncementCard';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'salah',     label: 'Salah',     icon: Sun        },
  { id: 'dhikr',    label: 'Dhikr',     icon: Heart      },
  { id: 'quran',    label: 'Quran',     icon: BookOpen   },
  { id: 'morning',  label: 'Morning',   icon: Sunset     },
  { id: 'evening',  label: 'Evening',   icon: Moon       },
  { id: 'sessions', label: 'Sessions',  icon: Radio      },
  { id: 'updates',  label: 'Updates',   icon: Megaphone  },
  { id: 'support',  label: 'Support',   icon: HeartHandshake },
];

// ─── Live Sessions tab ────────────────────────────────────────────────────────

function LiveSessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'liveSessions'),
      orderBy('scheduledAt', 'asc'),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleJoin = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/5 h-32" />
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/4 p-8 text-center">
        <Radio className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <p className="text-sm font-semibold text-slate-300">No sessions scheduled yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Live dhikr and dua sessions will appear here when scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400">
        Join live dhikr and dua sessions hosted by SirajOne counsellors.
      </p>
      {sessions.map((s) => (
        <LiveSessionCard key={s.id} session={s} onJoin={handleJoin} />
      ))}
    </div>
  );
}

// ─── Announcements tab ────────────────────────────────────────────────────────

function UpdatesTab() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'counsellingAnnouncements'),
      orderBy('publishedAt', 'desc'),
      limit(30)
    );
    const unsub = onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/5 h-28" />
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/4 p-8 text-center">
        <Megaphone className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <p className="text-sm font-semibold text-slate-300">No updates yet</p>
        <p className="mt-1 text-xs text-slate-500">
          Programme announcements and ta'leem will appear here.
        </p>
      </div>
    );
  }

  // Pinned first, then by date
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="space-y-3">
      {sorted.map((a) => (
        <AnnouncementCard key={a.id} announcement={a} />
      ))}
    </div>
  );
}

// ─── Optional Counsellor Support tab ─────────────────────────────────────────

function SupportTab() {
  const { user } = useAuth();
  const isCounsellor = isCounsellorRole(user?.role);

  if (isCounsellor) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/4 p-6 text-center">
        <HeartHandshake className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
        <p className="text-sm font-semibold text-white">You are a counsellor</p>
        <p className="mt-1 text-xs text-slate-400">
          This section is for clients seeking additional support.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/8 bg-white/4 p-5">
        <h3 className="text-sm font-semibold text-white mb-2">
          Need extra support?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Your spiritual journey is between you and Allah. This tracker is private —
          no one else can see it. If you feel you would benefit from speaking to
          someone, our counsellors are here with compassion and confidentiality.
          This is entirely your choice.
        </p>
        <a
          href="/counsellors"
          className="inline-block rounded-lg bg-emerald-700/30 border border-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-700/50"
        >
          Choose a counsellor
        </a>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/4 p-5">
        <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
          Remember
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed italic">
          "Verily, with hardship comes ease." — Surah Al-Inshirah 94:6
        </p>
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Seeking help is a sign of wisdom, not weakness. May Allah make your
          path easy and your heart at peace.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DailySpiritualSupport() {
  const [activeTab, setActiveTab] = useState('salah');

  useEffect(() => {
    document.title = `Daily Spiritual Support — SirajOne`;
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'salah':    return <SalahTracker />;
      case 'dhikr':   return <DhikrTracker />;
      case 'quran':   return <QuranLog />;
      case 'morning': return <AdhkarSession session="morning" />;
      case 'evening': return <AdhkarSession session="evening" />;
      case 'sessions':return <LiveSessionsTab />;
      case 'updates': return <UpdatesTab />;
      case 'support': return <SupportTab />;
      default:        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1a12] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Daily Connection to Allah</h1>
          <p className="mt-1 text-sm text-slate-400">
            Private. Personal. Between you and Allah.
          </p>
        </div>

        {/* Tab navigation — scrollable on mobile */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === id
                    ? 'bg-emerald-700/50 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div>{renderTab()}</div>

        {/* Privacy reminder */}
        <p className="mt-8 text-center text-xs text-slate-600">
          Your ibadah is private. No counsellor or administrator can view your personal tracker.
        </p>
      </div>
    </div>
  );
}
