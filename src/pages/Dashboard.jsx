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
  GraduationCap,
  Library,
  MessageCircle,
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
    id: 'revision',
    title: "Revise yesterday's Tajwid point",
    description: 'Spend a few minutes strengthening what you already learned before adding more.',
    route: '/library',
  },
  {
    id: 'teacher-note',
    title: 'Send one note or question',
    description: 'Use Messages if you need help, correction, or support from your teacher.',
    route: '/messages',
  },
];

const LEARNING_PATH = [
  {
    label: 'Letter Guide',
    description: 'Makhraj, sifaat, and pronunciation support.',
    to: '/letters',
    icon: BookOpen,
  },
  {
    label: 'Programs',
    description: 'View learning paths and current study options.',
    to: '/programs',
    icon: GraduationCap,
  },
  {
    label: 'Library',
    description: 'Resources, notes, and study material.',
    to: '/library',
    icon: Library,
  },
  {
    label: 'Teachers',
    description: 'Find guidance and teacher information.',
    to: '/teachers',
    icon: Users,
  },
  {
    label: 'Enroll',
    description: 'Apply for a program or request placement.',
    to: '/enroll',
    icon: ShieldCheck,
  },
  {
    label: 'Messages',
    description: 'Contact support or continue a conversation.',
    to: '/messages',
    icon: MessageCircle,
  },
];

const MILESTONES = [
  { label: 'Account', value: 'Ready', detail: 'Profile connected', icon: ShieldCheck },
  { label: 'Today', value: '3 tasks', detail: 'Small steps, steady growth', icon: CheckCircle2 },
  { label: 'Path', value: 'Tajwid', detail: 'Foundation building', icon: BookOpen },
  { label: 'Rhythm', value: 'Daily', detail: 'Consistency over intensity', icon: Star },
];

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

  const toggleComplete = (id) => {
    setCompleted((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.045] to-emerald-950/50 p-6 sm:p-8 mb-6 shadow-2xl shadow-black/20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Student Dashboard
              </div>
              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Assalaamu alaykum, {studentName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
                Your SirajOne learning space is ready. Start with one focused lesson, revise with care, and keep your connection with your teacher simple and consistent.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/letters"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/messages"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Message Support
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Account</p>
                  <p className="mt-1 text-lg font-bold text-white">{roleLabel}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${isPending ? 'bg-amber-400/10 text-amber-200 border border-amber-300/20' : 'bg-emerald-400/10 text-emerald-200 border border-emerald-300/20'}`}>
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

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
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
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Learning Path</p>
                <h2 className="mt-2 text-2xl font-black text-white">Choose where to continue</h2>
              </div>
              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {LEARNING_PATH.map(({ label, description, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="group rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-emerald-300/40 hover:bg-emerald-400/10"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-emerald-300" />
                    <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-emerald-200" />
                  </div>
                  <h3 className="font-bold text-white">{label}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Teacher Connection</p>
            <h2 className="mt-2 text-2xl font-black text-white">
              {isPending ? 'Approval is pending' : 'Your learning account is active'}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {isPending
                ? 'Your account has been created. Once the madrasah approves your profile, your teacher connection and class details can be added.'
                : 'Use Messages when you need support, correction, class updates, or help with your current learning plan.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/messages" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50">
                Open Messages
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10">
                Contact Admin
              </Link>
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
