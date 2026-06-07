import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Calendar, CalendarDays, ChevronRight, ExternalLink,
  FileText, HandHeart, Heart, Headphones, Home, Inbox,
  MapPin, MessageCircle, Monitor, Phone, Star, TrendingUp,
  Users, Video,
} from 'lucide-react';
import {
  addDoc, collection, onSnapshot, query,
  serverTimestamp, updateDoc, doc, where,
} from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function toDate(v) {
  if (!v) return null;
  if (typeof v.toDate === 'function') return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
function fmtDate(v) {
  const d = toDate(v);
  if (!d) return 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(d);
}
function fmtShortDate(v) {
  const d = toDate(v);
  if (!d) return 'TBC';
  return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}
function newestFirst(a, b) {
  return (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0);
}

/* ─── Static data ─────────────────────────────────────────────────────────── */
const JOURNEY_STAGES = [
  { id: 1, label: 'Request Support',        icon: HandHeart,   desc: 'Submit your initial support request',           status: 'pending'  },
  { id: 2, label: 'Initial Assessment',     icon: BookOpen,    desc: 'A brief consultation to understand your needs', status: 'assessed' },
  { id: 3, label: 'Counselling Sessions',   icon: Calendar,    desc: 'Regular one-on-one or group sessions',          status: 'active'   },
  { id: 4, label: 'Ongoing Growth',         icon: TrendingUp,  desc: 'Follow-up, reflection and continued support',   status: 'on_hold'  },
  { id: 5, label: 'Community & Development',icon: Users,       desc: 'Programmes, gatherings and workshops',          status: 'complete' },
];

const SERVICES = [
  { title: 'Marriage Counselling',         icon: Heart,       cat: 'Relationship' },
  { title: 'Pre-Marital Guidance',         icon: Star,        cat: 'Relationship' },
  { title: 'Family Counselling',           icon: Home,        cat: 'Family'       },
  { title: 'Parenting Support',            icon: Users,       cat: 'Family'       },
  { title: 'Teen Counselling',             icon: TrendingUp,  cat: 'Youth'        },
  { title: 'Youth Mentorship',             icon: Star,        cat: 'Youth'        },
  { title: 'Student Support',              icon: BookOpen,    cat: 'Youth'        },
  { title: 'Adult Counselling',            icon: Heart,       cat: 'Adult'        },
  { title: 'Islamic Spiritual Support',    icon: HandHeart,   cat: 'Spiritual'    },
  { title: 'Personal Development',         icon: TrendingUp,  cat: 'Growth'       },
  { title: 'Grief & Bereavement Support',  icon: Heart,       cat: 'Wellbeing'    },
  { title: 'Lifestyle & Wellbeing Support',icon: Star,        cat: 'Wellbeing'    },
];

const PREMARITAL_MODULES = [
  { week: 1, title: 'Foundations of Marriage',   desc: 'The Islamic perspective on nikāḥ, its purpose and spiritual significance.' },
  { week: 2, title: 'Rights & Responsibilities', desc: 'Mutual obligations drawn from Qur\'an and Sunnah for a just marriage.' },
  { week: 3, title: 'Communication Skills',      desc: 'Speaking with hikma, listening with patience, understanding with mercy.' },
  { week: 4, title: 'Conflict Resolution',       desc: 'The Sunnah of reconciliation — repair before damage becomes permanent.' },
  { week: 5, title: 'Financial Planning',        desc: 'Money, trust, transparency, and Islamic principles of household finance.' },
  { week: 6, title: 'Islamic Family Life',       desc: 'Building a home upon taqwā — raising children and honouring parents.' },
];

const SUPPORT_OPTIONS = [
  { label: 'Online Counselling', icon: Monitor, desc: 'Video-based private sessions from anywhere.' },
  { label: 'Voice Sessions',     icon: Phone,   desc: 'Telephone counselling — no video required.' },
  { label: 'In-Person Sessions', icon: MapPin,  desc: 'Face-to-face at our counselling centre.'   },
  { label: 'Group Workshops',    icon: Users,   desc: 'Community group sessions with guided support.' },
];

const PILLARS = [
  { title: 'Qur\'an & Sunnah',      desc: 'Our foundation is divine guidance — every approach is rooted in revelation.' },
  { title: 'Islamic Psychology',    desc: 'Understanding the nafs, the heart, and the soul through an Islamic lens.' },
  { title: 'Emotional Wellbeing',   desc: 'Tending to the heart is an act of worship — we take it seriously.' },
  { title: 'Character Development', desc: '"I was sent to perfect noble character." — Our Prophet ﷺ.' },
  { title: 'Family Strengthening',  desc: 'Your family is your first community — we help build it with love and wisdom.' },
  { title: 'Personal Accountability', desc: 'Muḥāsabah: honest, compassionate self-reflection as a tool for growth.' },
];

const RESOURCE_ICONS = {
  pdf: FileText, video: Video, audio: Headphones,
  worksheet: BookOpen, reflection: Star,
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */
function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-xs font-black uppercase tracking-[0.28em] text-teal-300">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{title}</h2>
      {sub && <p className="mt-2 text-sm leading-6 text-slate-400">{sub}</p>}
    </div>
  );
}

function EmptySlate({ icon: Icon = Inbox, title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
      <Icon className="mx-auto h-8 w-8 text-slate-600" />
      <p className="mt-4 font-bold text-slate-400">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function Badge({ label, tone = 'teal' }) {
  const cls = {
    teal:   'border-teal-400/30 bg-teal-400/10 text-teal-200',
    amber:  'border-amber-400/30 bg-amber-400/10 text-amber-200',
    slate:  'border-white/10 bg-white/5 text-slate-400',
    green:  'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  }[tone] || 'border-white/10 bg-white/5 text-slate-400';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function CounsellingClientDashboard() {
  const { user } = useAuth();

  /* Live data */
  const [requests,   setRequests]   = useState([]);
  const [sessions,   setSessions]   = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [resources,  setResources]  = useState([]);
  const [events,     setEvents]     = useState([]);
  const [programme,  setProgramme]  = useState(null);
  const [myReg,      setMyReg]      = useState(null);
  const [regBusy,    setRegBusy]    = useState(false);
  const [activeSection, setActiveSection] = useState('journey');

  useEffect(() => {
    if (!user?.uid) return;
    const uid = user.uid;
    const unsubs = [];

    /* counselling data scoped to this client */
    const clientQuery = (col) => query(collection(db, col), where('clientId', '==', uid));
    unsubs.push(onSnapshot(clientQuery('counsellingRequests'), (s) => setRequests(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst))));
    unsubs.push(onSnapshot(clientQuery('counsellingSessions'), (s) => setSessions(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst))));
    unsubs.push(onSnapshot(clientQuery('counsellingMessages'),  (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst))));
    unsubs.push(onSnapshot(clientQuery('counsellingResources'), (s) => setResources(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst))));

    /* community events — public */
    unsubs.push(onSnapshot(
      query(collection(db, 'community_events'), where('audience', 'in', ['all', 'clients'])),
      (s) => setEvents(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    ));

    /* pre-marital programme */
    unsubs.push(onSnapshot(
      query(collection(db, 'counselling_programmes'), where('slug', '==', 'pre-marital-6-week')),
      (s) => { if (!s.empty) setProgramme({ id: s.docs[0].id, ...s.docs[0].data() }); },
    ));

    /* my registration */
    unsubs.push(onSnapshot(
      query(collection(db, 'programme_registrations'), where('clientId', '==', uid)),
      (s) => { setMyReg(s.empty ? null : { id: s.docs[0].id, ...s.docs[0].data() }); },
    ));

    return () => unsubs.forEach((u) => u());
  }, [user?.uid]);

  /* derived */
  const now = Date.now();
  const upcoming = useMemo(() => sessions.filter((s) => {
    const d = toDate(s.sessionDate);
    return s.status !== 'completed' && (!d || d.getTime() >= now);
  }), [sessions, now]);

  const past = useMemo(() => sessions.filter((s) => {
    const d = toDate(s.sessionDate);
    return s.status === 'completed' || (d && d.getTime() < now);
  }), [sessions, now]);

  const unreadCount = messages.filter((m) => !m.isRead && m.recipientId === user?.uid).length;

  /* current journey stage */
  const activeStatus = requests[0]?.status || 'pending';
  const stageIndex   = JOURNEY_STAGES.findIndex((s) => s.status === activeStatus);
  const currentStage = stageIndex >= 0 ? stageIndex : 0;

  /* programme registration helper */
  async function registerForProgramme(type) {
    if (!user?.uid || !programme || regBusy) return;
    setRegBusy(true);
    try {
      await addDoc(collection(db, 'programme_registrations'), {
        programmeId: programme.id,
        clientId: user.uid,
        clientName: user.full_name || '',
        clientEmail: user.email || '',
        registrationType: type,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } finally {
      setRegBusy(false);
    }
  }

  /* event reservation */
  async function reserveEvent(eventId) {
    if (!user?.uid) return;
    await addDoc(collection(db, 'event_reservations'), {
      eventId,
      userId: user.uid,
      userName: user.full_name || '',
      userEmail: user.email || '',
      status: 'reserved',
      createdAt: serverTimestamp(),
    });
  }

  /* mark messages read on view */
  useEffect(() => {
    if (activeSection !== 'messages') return;
    messages.filter((m) => !m.isRead && m.recipientId === user?.uid).forEach((m) => {
      updateDoc(doc(db, 'counsellingMessages', m.id), { isRead: true }).catch(() => {});
    });
  }, [activeSection, messages, user?.uid]);

  /* programme button logic */
  const progStatus  = programme?.status || 'closed';
  const progFull    = programme?.maxParticipants && (programme.enrolledCount || 0) >= programme.maxParticipants;
  const regLabel    = myReg ? (myReg.registrationType === 'enrolled' ? 'Registered ✓' : myReg.registrationType === 'waitlist' ? 'On Waitlist ✓' : 'Interest Noted ✓') : null;
  const progBtn     = regLabel ? null : progStatus === 'open' && !progFull ? { label: 'Register Now', type: 'enrolled' }
    : (progStatus === 'upcoming' || progFull) ? { label: 'Join Waiting List', type: 'waitlist' }
    : { label: 'Register Interest', type: 'interest' };

  const NAV = [
    { id: 'journey',   label: 'My Journey'   },
    { id: 'sessions',  label: 'Sessions'      },
    { id: 'messages',  label: `Messages${unreadCount ? ` (${unreadCount})` : ''}` },
    { id: 'resources', label: 'Resources'     },
    { id: 'community', label: 'Community'     },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/5 bg-gradient-to-br from-[#0d1533] via-[#080d1a] to-[#080d1a]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
          <p className="text-xs font-black uppercase tracking-[0.32em] text-teal-300">SirajOne Counselling</p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            As-salāmu ʿalaykum,{' '}
            <span className="text-teal-300">{user?.full_name?.split(' ')[0] || 'dear seeker'}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            "And whoever relies upon Allāh — then He is sufficient for him." — Sūrah aṭ-Ṭalāq 65:3
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            How can we support you today?
          </p>
        </div>
      </header>

      {/* ── Section nav ───────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-[#080d1a]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2" aria-label="Dashboard sections">
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest transition ${
                  activeSection === id
                    ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">

        {/* ══ SECTION 1 — Support Journey (always visible) ════════════════ */}
        <section>
          <SectionHeader eyebrow="Your path" title="Support Journey" sub="Each step of your journey with SirajOne — from first contact to ongoing growth." />
          <div className="grid gap-3 sm:grid-cols-5">
            {JOURNEY_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive  = idx === currentStage;
              const isDone    = idx < currentStage;
              return (
                <div
                  key={stage.id}
                  className={`relative rounded-2xl border p-4 transition ${
                    isActive
                      ? 'border-teal-400/40 bg-teal-400/10 shadow-lg shadow-teal-900/20'
                      : isDone
                      ? 'border-emerald-400/20 bg-emerald-400/5'
                      : 'border-white/8 bg-white/[0.02]'
                  }`}
                >
                  <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${
                    isActive ? 'bg-teal-500/30' : isDone ? 'bg-emerald-500/20' : 'bg-white/5'
                  }`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-teal-300' : isDone ? 'text-emerald-300' : 'text-slate-600'}`} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? 'text-teal-300' : isDone ? 'text-emerald-400' : 'text-slate-600'
                  }`}>Step {stage.id}</p>
                  <h3 className={`mt-1 text-sm font-bold ${isActive ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-600'}`}>
                    {stage.label}
                  </h3>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">{stage.desc}</p>
                  {isActive && (
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-teal-400 shadow shadow-teal-400/50" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ SECTION 2 — Counselling Services (always visible) ════════════ */}
        <section>
          <SectionHeader eyebrow="What we offer" title="Counselling Services" sub="Choose the support that best fits your situation. Every service is grounded in Qur'an, Sunnah, and professional care." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ title, icon: Icon, cat }) => (
              <button
                key={title}
                type="button"
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-left transition hover:border-teal-400/30 hover:bg-teal-400/5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 transition group-hover:bg-teal-500/20">
                  <Icon className="h-5 w-5 text-teal-300" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{cat}</p>
                <h3 className="mt-1 text-sm font-bold leading-5 text-white">{title}</h3>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-teal-400 opacity-0 transition group-hover:opacity-100">
                  Learn more <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══ SECTION 3 — Pre-Marital Programme (always visible) ══════════ */}
        <section>
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-[#1a1200] via-[#0f0d1a] to-[#080d1a] p-6 sm:p-10 shadow-2xl shadow-black/30">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />

            <div className="relative">
              <Badge label="Flagship Programme" tone="amber" />
              <h2 className="mt-4 text-2xl font-black text-white sm:text-4xl">
                6 Week Pre-Marital<br />
                <span className="text-amber-300">Preparation Programme</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Equipping hearts and homes — for brothers and sisters separately. A structured programme built on Islamic principles to prepare you for the sacred covenant of marriage.
              </p>

              {/* Modules */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {PREMARITAL_MODULES.map(({ week, title, desc }) => (
                  <div key={week} className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Week {week}</p>
                    <h3 className="mt-1 text-sm font-bold text-white">{title}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{desc}</p>
                  </div>
                ))}
              </div>

              {/* Registration */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {regLabel ? (
                  <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-bold text-emerald-300">
                    {regLabel}
                  </span>
                ) : progBtn ? (
                  <button
                    type="button"
                    disabled={regBusy}
                    onClick={() => registerForProgramme(progBtn.type)}
                    className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-black uppercase tracking-widest text-black shadow-lg shadow-amber-900/30 transition hover:bg-amber-300 disabled:opacity-60"
                  >
                    {regBusy ? 'Please wait…' : progBtn.label}
                  </button>
                ) : (
                  <span className="text-sm text-slate-600">Programme details coming soon.</span>
                )}
                <p className="text-xs text-slate-600">Separate cohorts available for brothers and sisters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 4 — Support Options (always visible) ════════════════ */}
        <section>
          <SectionHeader eyebrow="How we meet" title="Support Options" sub="Choose the format that works best for you — all options offer the same quality of care." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUPPORT_OPTIONS.map(({ label, icon: Icon, desc }) => (
              <button
                key={label}
                type="button"
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-left transition hover:border-teal-400/30 hover:bg-teal-400/5"
              >
                <Icon className="h-8 w-8 text-teal-300 transition group-hover:scale-110" />
                <h3 className="mt-4 font-bold text-white">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ══ SECTION 5 — Islamic Foundation (always visible) ═════════════ */}
        <section>
          <SectionHeader eyebrow="Our approach" title="Built on Islamic Foundation" sub="Everything we do is grounded in divine guidance, not just clinical theory." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ title, desc }, i) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-teal-400/10 text-xs font-black text-teal-300">
                  {i + 1}
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ SECTION 6 — My Sessions ══════════════════════════════════════ */}
        {(activeSection === 'journey' || activeSection === 'sessions') && (
          <section id="sessions">
            <SectionHeader eyebrow="Your schedule" title="My Sessions" sub="All your upcoming and past counselling sessions in one place." />

            {/* Upcoming */}
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-teal-300">Upcoming</h3>
            <div className="space-y-3 mb-8">
              {upcoming.length ? upcoming.map((s) => (
                <article key={s.id} className="flex flex-col gap-4 rounded-2xl border border-teal-400/15 bg-teal-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge label={s.sessionType || 'Session'} tone="teal" />
                      {s.status === 'scheduled' && <Badge label="Confirmed" tone="green" />}
                    </div>
                    <h4 className="mt-2 font-bold text-white">{fmtDate(s.sessionDate)}</h4>
                    {s.counsellorName && <p className="mt-1 text-xs text-slate-500">with {s.counsellorName}</p>}
                  </div>
                  <button
                    type="button"
                    disabled
                    className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-600 cursor-not-allowed"
                    title="Video link will be shared before your session"
                  >
                    Join Session (coming soon)
                  </button>
                </article>
              )) : (
                <EmptySlate icon={Calendar} title="No upcoming sessions" text="Once a session is scheduled, it will appear here with full details." />
              )}
            </div>

            {/* Past */}
            {past.length > 0 && (
              <>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-600">Past Sessions</h3>
                <div className="space-y-3">
                  {past.slice(0, 5).map((s) => (
                    <article key={s.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
                      <div>
                        <p className="text-sm font-bold text-white">{fmtDate(s.sessionDate)}</p>
                        <p className="mt-0.5 text-xs text-slate-600">{s.sessionType || 'Counselling Session'}</p>
                      </div>
                      <Badge label="Completed" tone="slate" />
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* ══ SECTION 7 — Messages ═════════════════════════════════════════ */}
        {(activeSection === 'journey' || activeSection === 'messages') && (
          <section id="messages">
            <div className="flex items-center justify-between mb-6">
              <SectionHeader eyebrow="Private inbox" title="Messages" />
              {unreadCount > 0 && (
                <Badge label={`${unreadCount} unread`} tone="amber" />
              )}
            </div>
            <div className="space-y-3">
              {messages.length ? messages.map((m) => {
                const isUnread = !m.isRead && m.recipientId === user?.uid;
                return (
                  <article
                    key={m.id}
                    className={`rounded-2xl border p-5 ${
                      isUnread
                        ? 'border-teal-400/20 bg-teal-400/5'
                        : 'border-white/8 bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{m.senderName || m.counsellorName || 'SirajOne Support'}</p>
                        {m.type === 'broadcast' && <Badge label="Broadcast" tone="teal" />}
                        {m.type === 'announcement' && <Badge label="Announcement" tone="amber" />}
                        {isUnread && <Badge label="New" tone="amber" />}
                      </div>
                      <span className="text-[11px] text-slate-600">{fmtDate(m.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{m.body}</p>
                    {m.attachmentUrl && (
                      <a
                        href={m.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-teal-200"
                      >
                        <ExternalLink className="h-3 w-3" /> Open attachment
                      </a>
                    )}
                  </article>
                );
              }) : (
                <EmptySlate icon={MessageCircle} title="No messages yet" text="Messages from your counsellor will appear here once your support request is active." />
              )}
            </div>
          </section>
        )}

        {/* ══ SECTION 8 — My Resources ═════════════════════════════════════ */}
        {(activeSection === 'journey' || activeSection === 'resources') && (
          <section id="resources">
            <SectionHeader eyebrow="Tools for your journey" title="My Resources" sub="Worksheets, readings, audio, and reflections shared by your counsellor." />
            {resources.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {resources.map((r) => {
                  const Icon = RESOURCE_ICONS[r.resourceType] || FileText;
                  return (
                    <article key={r.id} className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10">
                        <Icon className="h-5 w-5 text-teal-300" />
                      </div>
                      <Badge label={r.resourceType || 'resource'} tone="slate" />
                      <h3 className="mt-2 font-bold text-white">{r.title || 'Shared Resource'}</h3>
                      <p className="mt-1 flex-1 text-xs leading-6 text-slate-500">{r.description || r.note || 'A resource has been shared by your counsellor.'}</p>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-teal-200"
                        >
                          <ExternalLink className="h-3 w-3" /> Open resource
                        </a>
                      )}
                      <p className="mt-2 text-[10px] text-slate-700">Shared {fmtShortDate(r.createdAt)}</p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptySlate icon={FileText} title="No resources yet" text="Worksheets, reflections, and helpful links from your counsellor will appear here." />
            )}
          </section>
        )}

        {/* ══ SECTION 9 — Community Development ═══════════════════════════ */}
        {(activeSection === 'journey' || activeSection === 'community') && (
          <section id="community">
            <SectionHeader
              eyebrow="Community & development"
              title="Gatherings & Programmes"
              sub="Educational events, workshops, and community gatherings — open to clients and the wider community."
            />
            {events.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((ev) => (
                  <article key={ev.id} className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge label={ev.eventType || 'Event'} tone="teal" />
                      {ev.format === 'online'    && <Badge label="Online"    tone="teal"  />}
                      {ev.format === 'in_person' && <Badge label="In-Person" tone="amber" />}
                      {ev.format === 'hybrid'    && <Badge label="Hybrid"    tone="slate" />}
                    </div>
                    <h3 className="font-bold text-white">{ev.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-6 text-slate-500">{ev.description}</p>
                    <div className="mt-4 space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        {ev.date ? fmtShortDate(ev.date) : 'Date to be confirmed'}
                        {ev.time && ` · ${ev.time}`}
                      </p>
                      {ev.location && (
                        <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{ev.location}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => reserveEvent(ev.id)}
                      className="mt-4 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-bold text-teal-300 transition hover:bg-teal-400/20"
                    >
                      Reserve My Place
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <EmptySlate
                icon={Users}
                title="No upcoming events"
                text="When community gatherings, workshops, or guest speaker events are published, they will appear here."
              />
            )}
          </section>
        )}

      </main>
    </div>
  );
}
