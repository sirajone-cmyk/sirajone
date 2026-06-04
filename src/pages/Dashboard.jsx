import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Compass,
  GraduationCap,
  Home,
  Library,
  LayoutDashboard,
  MessageCircle,
  Mic,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const FOCUS_ITEMS = [
  {
    id: 'letter-guide',
    title: 'Practise one letter from the Letter Guide',
    description: 'Open the makhraj and sifaat notes, listen carefully, then repeat slowly.',
    route: '/letters',
  },
  {
    id: 'practical-workbook',
    title: 'Practise one line from the Practical Workbook',
    description: 'Listen first, record your recitation, replay it, and correct one point.',
    route: '/practice-workbook',
  },
  {
    id: 'teacher-note',
    title: 'Send one note or question',
    description: 'Use Messages if you need help, correction, or support from your teacher.',
    route: '/messages',
  },
];

const FEATURED_SHORTCUTS = [
  {
    label: 'Home',
    description: 'Return to the SirajOne welcome page.',
    to: '/',
    icon: Home,
  },
  {
    label: 'Explore Programs',
    description: 'Browse learning options and class pathways.',
    to: '/programs',
    icon: GraduationCap,
  },
  {
    label: 'Enroll',
    description: 'Start placement or join a class.',
    to: '/enroll',
    icon: ShieldCheck,
    featured: true,
  },
  {
    label: 'Letter Guide',
    description: 'Begin with Arabic letters and makharij.',
    to: '/letters',
    icon: BookOpen,
  },
  {
    label: 'Contact',
    description: 'Reach SirajOne for help or class guidance.',
    to: '/contact',
    icon: Phone,
  },
  {
    label: 'Library',
    description: 'Open books, notes, and study resources.',
    to: '/library',
    icon: Library,
  },
];

const BEGINNER_PATH = [
  {
    label: 'Letter Guide',
    description: 'Letters, sounds, makhraj, sifaat, listen and practise.',
    to: '/letters',
    icon: BookOpen,
    status: 'Start here',
  },
  {
    label: 'Practical Workbook',
    description: 'After letters: listen, read, record, replay, and correct.',
    to: '/practice-workbook',
    icon: Mic,
    status: 'Next step',
  },
  {
    label: 'Part Two',
    description: 'Lesson, rule, and Part Two examples in one guided reading flow.',
    to: '/part-two-workbook',
    icon: Award,
    status: 'Continue Practice',
  },
  {
    label: 'Tajwid Kitaab',
    description: 'Rules, lessons, and connected examples will be added later.',
    to: '/library',
    icon: Star,
    status: 'Coming soon',
    disabled: true,
  },
];

const SECONDARY_PATH = [
  {
    label: 'Teachers',
    description: 'Find approved teachers and guidance.',
    to: '/teachers',
    icon: Users,
  },
  {
    label: 'Messages',
    description: 'Contact support or continue a conversation.',
    to: '/messages',
    icon: MessageCircle,
  },
  {
    label: 'Programs',
    description: 'View learning paths and study options.',
    to: '/programs',
    icon: GraduationCap,
  },
];

const MILESTONES = [
  { label: 'Account', value: 'Ready', detail: 'Profile connected', icon: ShieldCheck },
  { label: 'Today', value: '3 tasks', detail: 'Small steps, steady growth', icon: CheckCircle2 },
  { label: 'Path', value: 'Tajwid', detail: 'Foundation building', icon: BookOpen },
  { label: 'Rhythm', value: 'Daily', detail: 'Consistency over intensity', icon: Star },
];

function ShortcutCard({ item }) {
  const Icon = item.icon;
  const className = item.featured
    ? 'group rounded-3xl border border-emerald-300/30 bg-emerald-600 p-5 text-white shadow-2xl shadow-emerald-950/30 transition hover:bg-emerald-500 sm:col-span-2 lg:col-span-1 lg:row-span-2'
    : 'group rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-emerald-300/40 hover:bg-emerald-400/10';

  return (
    <Link to={item.to} className={className}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className={`rounded-2xl p-3 ${item.featured ? 'bg-white/15 text-white' : 'bg-emerald-400/10 text-emerald-200'}`}>
          <Icon className="h-6 w-6" />
        </div>
        <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-1 ${item.featured ? 'text-white' : 'text-slate-600 group-hover:text-emerald-200'}`} />
      </div>
      <h3 className={`${item.featured ? 'text-2xl' : 'text-lg'} font-black text-white`}>{item.label}</h3>
      <p className={`mt-2 text-sm leading-6 ${item.featured ? 'text-emerald-50/90' : 'text-slate-400'}`}>{item.description}</p>
    </Link>
  );
}

function PathCard({ item, index }) {
  const Icon = item.icon;
  const content = (
    <div className={`h-full rounded-3xl border p-5 transition ${item.disabled ? 'border-white/10 bg-white/[0.025] opacity-80' : 'border-white/10 bg-black/10 hover:border-emerald-300/40 hover:bg-emerald-400/10'}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-black text-emerald-200">
            {index + 1}
          </span>
          <Icon className="h-5 w-5 text-emerald-300" />
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${item.disabled ? 'border-amber-300/20 bg-amber-400/10 text-amber-200' : 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'}`}>
          {item.status}
        </span>
      </div>
      <h3 className="font-black text-white">{item.label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
    </div>
  );

  if (item.disabled) return content;
  return <Link to={item.to}>{content}</Link>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const storageKey = `sirajone-dashboard-focus-${user?.uid || 'guest'}`;
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    setCompleted(saved ? JSON.parse(saved) : {});
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(completed));
  }, [completed, storageKey]);

  const studentName = useMemo(() => {
    const displayName = user?.full_name?.trim();
    if (displayName) return displayName.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  }, [user]);

  const completedCount = FOCUS_ITEMS.filter((item) => completed[item.id]).length;
  const focusProgress = Math.round((completedCount / FOCUS_ITEMS.length) * 100);
  const isPending = user?.status === 'pending';
  const roleLabel = user?.role || 'Student';
  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';

  const toggleComplete = (id) => {
    setCompleted((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.045] to-emerald-950/50 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                SirajOne Hub
              </div>
              <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Assalaamu alaykum, {studentName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your main navigation space. Choose a learning path, enroll in a program, open resources, or message SirajOne without crowding the top bar.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/enroll"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  Enroll Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/messages"
                  className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Messages
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-700 hover:text-white"
                  >
                    Admin Panel
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account</p>
                  <p className="mt-1 text-lg font-bold text-white">{roleLabel}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${isPending ? 'border border-amber-300/20 bg-amber-400/10 text-amber-200' : 'border border-emerald-300/20 bg-emerald-400/10 text-emerald-200'}`}>
                  {isPending ? 'Pending' : 'Approved'}
                </span>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Today&apos;s focus</span>
                  <span className="font-bold text-emerald-300">{focusProgress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${focusProgress}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {completedCount} of {FOCUS_ITEMS.length} focus items completed today.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Featured Navigation</p>
              <h2 className="mt-2 text-2xl font-black text-white">Choose your next step</h2>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
              <Compass className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_SHORTCUTS.map((item) => (
              <ShortcutCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MILESTONES.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <Icon className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="text-lg font-black text-white">{value}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Today&apos;s Focus</p>
                <h2 className="mt-2 text-2xl font-black text-white">Build one strong step today</h2>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              {FOCUS_ITEMS.map((item) => {
                const isDone = Boolean(completed[item.id]);
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition ${isDone ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 bg-black/10'}`}
                  >
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => toggleComplete(item.id)}
                        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition ${isDone ? 'border-emerald-300 bg-emerald-400 text-emerald-950' : 'border-slate-600 text-transparent hover:border-emerald-300'}`}
                        aria-label={isDone ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold leading-snug ${isDone ? 'text-emerald-100' : 'text-white'}`}>{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
                        <Link to={item.route} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300 hover:text-emerald-200">
                          Open
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Beginning Learning Path</p>
                <h2 className="mt-2 text-2xl font-black text-white">Letters to practicals</h2>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {BEGINNER_PATH.map((item, index) => (
                <PathCard key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">More SirajOne Tools</p>
            <h2 className="mt-2 text-2xl font-black text-white">Support around the learning path</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {SECONDARY_PATH.map(({ label, description, to, icon: Icon }) => (
                <Link key={label} to={to} className="rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/40 hover:bg-emerald-400/10">
                  <Icon className="mb-3 h-5 w-5 text-emerald-300" />
                  <h3 className="font-bold text-white">{label}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-300/15 p-3 text-emerald-100">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Gentle Reminder</p>
                <h2 className="mt-2 text-2xl font-black text-white">A little every day becomes a path.</h2>
                <p className="mt-3 text-sm leading-7 text-emerald-50/80">
                  Keep the dashboard simple: practise, revise, ask for help, and return tomorrow. SirajOne is being shaped around steady learning, not pressure.
                </p>
                {isAdmin && (
                  <Link to="/admin" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50">
                    Open Admin Panel
                    <LayoutDashboard className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


