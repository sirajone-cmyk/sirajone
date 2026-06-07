import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Star, Users, BookOpen, TrendingUp, HandHeart,
  Shield, MessageCircle, Home, Phone, Monitor, MapPin,
  ChevronRight, ArrowRight, CheckCircle, Sparkles,
  HeartHandshake, Leaf, Brain, Moon,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../lib/AuthContext';

/* ─── Data ───────────────────────────────────────────────────────────────── */
const SERVICES = [
  { title: 'Marriage Counselling',          icon: Heart,        cat: 'Relationship', desc: 'Navigate challenges and strengthen your marriage through Islamic guidance.' },
  { title: 'Pre-Marital Guidance',          icon: Star,         cat: 'Relationship', desc: 'Prepare for a healthy, grounded marriage before you say "I do".' },
  { title: 'Family Counselling',            icon: Home,         cat: 'Family',       desc: 'Restore harmony, trust, and communication within the family unit.' },
  { title: 'Parenting Support',             icon: Users,        cat: 'Family',       desc: 'Guidance for raising confident, spiritually grounded children.' },
  { title: 'Teen Counselling',              icon: TrendingUp,   cat: 'Youth',        desc: 'Safe space for teenagers navigating identity, pressure, and purpose.' },
  { title: 'Youth Mentorship',              icon: Star,         cat: 'Youth',        desc: 'Structured mentorship to guide young people toward their potential.' },
  { title: 'Student Support',               icon: BookOpen,     cat: 'Youth',        desc: 'Academic stress, identity, and life transitions — supported Islamically.' },
  { title: 'Adult Counselling',             icon: Heart,        cat: 'Adult',        desc: 'Personal support for life challenges, transitions, and inner growth.' },
  { title: 'Islamic Spiritual Support',     icon: Moon,         cat: 'Spiritual',    desc: 'Reconnect with your purpose, your deen, and your Lord.' },
  { title: 'Personal Development',          icon: TrendingUp,   cat: 'Growth',       desc: 'Build discipline, resilience, and meaningful personal goals.' },
  { title: 'Grief & Bereavement Support',   icon: HandHeart,    cat: 'Wellbeing',    desc: 'Compassionate support through loss — rooted in sabr and tawakkul.' },
  { title: 'Lifestyle & Wellbeing Support', icon: Leaf,         cat: 'Wellbeing',    desc: 'Holistic wellbeing: sleep, routine, nutrition, and spiritual balance.' },
];

const PROGRAMMES = [
  {
    title: '6-Week Pre-Marital Preparation',
    sub: 'For Males & Females',
    accent: 'teal',
    desc: 'A structured, confidential programme to help couples prepare for a successful Islamic marriage.',
    modules: [
      { week: 1, title: 'Foundations of Marriage',   desc: 'The Islamic perspective on nikāḥ — its purpose, beauty, and spiritual weight.' },
      { week: 2, title: 'Rights & Responsibilities', desc: 'Mutual obligations rooted in Qur\'an and Sunnah for a just partnership.' },
      { week: 3, title: 'Communication Skills',      desc: 'Speaking with hikma, listening with patience, understanding with mercy.' },
      { week: 4, title: 'Conflict Resolution',       desc: 'The Sunnah of reconciliation — repair before damage becomes permanent.' },
      { week: 5, title: 'Financial Planning',        desc: 'Money, trust, transparency, and Islamic principles of household finance.' },
      { week: 6, title: 'Islamic Family Life',       desc: 'Building a home on taqwā — honouring parents and raising righteous children.' },
    ],
  },
  {
    title: 'Marriage & Family Support',
    sub: 'Ongoing Programme',
    accent: 'violet',
    desc: 'Sustained support for couples and families working through challenges together.',
    modules: [],
  },
  {
    title: 'Youth Emotional Wellbeing',
    sub: 'Ages 13–25',
    accent: 'amber',
    desc: 'Group and individual support for young people navigating modern pressures with an Islamic compass.',
    modules: [],
  },
  {
    title: 'Islamic Personal Development',
    sub: 'Individual Programme',
    accent: 'emerald',
    desc: 'A structured path for character, discipline, and spiritual growth aligned with Islamic values.',
    modules: [],
  },
  {
    title: 'Parenting Guidance',
    sub: 'For Parents & Guardians',
    accent: 'sky',
    desc: 'Practical, Islamically-grounded guidance for navigating the challenges of raising children today.',
    modules: [],
  },
  {
    title: 'Community Workshops',
    sub: 'Group Learning',
    accent: 'rose',
    desc: 'Short, impactful workshops on marriage, mental health, parenting, and community wellbeing.',
    modules: [],
  },
];

const BENEFITS = [
  { icon: Shield,          title: 'Fully Confidential',          desc: 'Everything shared stays private. Your trust is our covenant.' },
  { icon: Moon,            title: 'Islamic Foundation',           desc: 'Every approach is rooted in Qur\'an, Sunnah, and Islamic scholarship.' },
  { icon: Brain,           title: 'Islamic Psychology',           desc: 'Understanding the nafs, the heart, and emotional wellbeing through an Islamic lens.' },
  { icon: Monitor,         title: 'Private Online & In-Person',   desc: 'Flexible, private sessions wherever you are — no compromise on comfort.' },
  { icon: TrendingUp,      title: 'Personal Development Focus',   desc: 'Not just talking — building real, lasting change in your life.' },
  { icon: Heart,           title: 'Family & Marriage Support',    desc: 'Specialised support for the most important relationships in your life.' },
  { icon: CheckCircle,     title: 'Structured Follow-Up',         desc: 'Sessions, reminders, and follow-ups so nothing falls through the cracks.' },
  { icon: HeartHandshake,  title: 'Trusted Counsellors',          desc: 'Verified, approved practitioners who understand your faith and culture.' },
];

const ACCENT = {
  teal:    { ring: 'ring-teal-400/30',    bg: 'bg-teal-400/10',    text: 'text-teal-300',    dot: 'bg-teal-400'    },
  violet:  { ring: 'ring-violet-400/30',  bg: 'bg-violet-400/10',  text: 'text-violet-300',  dot: 'bg-violet-400'  },
  amber:   { ring: 'ring-amber-400/30',   bg: 'bg-amber-400/10',   text: 'text-amber-300',   dot: 'bg-amber-400'   },
  emerald: { ring: 'ring-emerald-400/30', bg: 'bg-emerald-400/10', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  sky:     { ring: 'ring-sky-400/30',     bg: 'bg-sky-400/10',     text: 'text-sky-300',     dot: 'bg-sky-400'     },
  rose:    { ring: 'ring-rose-400/30',    bg: 'bg-rose-400/10',    text: 'text-rose-300',    dot: 'bg-rose-400'    },
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-teal-300">{children}</p>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-3xl font-black text-white sm:text-4xl">{children}</h2>
  );
}

function SectionSub({ children }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">{children}</p>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function CounsellingHome() {
  const { user } = useAuth();
  const [expandedProg, setExpandedProg] = useState(null);
  const firstName = user?.full_name?.split(' ')[0] || null;

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#0d1533] via-[#080d1a] to-[#080d1a]">
        {/* subtle grid */}
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMmYyMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          {/* badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5">
            <HeartHandshake size={13} className="text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">SirajOne Counselling</span>
          </div>

          {firstName && (
            <p className="mb-2 text-sm font-semibold text-slate-400">
              As-salāmu ʿalaykum, <span className="text-teal-300">{firstName}</span>
            </p>
          )}

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Private Islamic{' '}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Counselling
            </span>{' '}
            Support
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Access confidential support, guidance, and personal development through a trusted
            counselling pathway rooted in Qur'ān, Sunnah, and Islamic psychology.
          </p>

          <p className="mt-4 text-sm italic text-slate-500">
            "And whoever relies upon Allāh — then He is sufficient for him." — Sūrah aṭ-Ṭalāq 65:3
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:bg-teal-400"
            >
              <Sparkles size={16} />
              Explore Counselling Support
            </a>
            <Link
              to="/counselling-client"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400/10 px-6 py-3 text-sm font-bold text-teal-200 transition hover:bg-teal-400/20"
            >
              <MessageCircle size={16} />
              Request Private Counselling
            </Link>
          </div>

          {/* stat pills */}
          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { icon: Shield,   text: 'Fully Confidential' },
              { icon: Moon,     text: 'Islamic Approach' },
              { icon: Monitor,  text: 'Online & In-Person' },
              { icon: Heart,    text: 'Marriage & Family' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-xs font-semibold text-slate-300"
              >
                <Icon size={13} className="text-teal-400" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 1 — COUNSELLING SERVICES ══════════════════════════════ */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Counselling Support</SectionLabel>
            <SectionHeading>Counselling Support Services</SectionHeading>
            <SectionSub>
              Every service is confidential, Islamically grounded, and delivered by verified practitioners.
              Select a service below to learn more or make a request.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICES.map(({ title, icon: Icon, cat, desc }) => (
              <Link
                key={title}
                to="/counselling-client"
                className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-teal-400/30 hover:bg-teal-400/5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                    <Icon size={18} className="text-teal-400" />
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {cat}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white group-hover:text-teal-200 transition">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-teal-400 opacity-0 transition group-hover:opacity-100">
                  Request Support <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — COUNSELLING PROGRAMMES ════════════════════════════ */}
      <section id="programmes" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Structured Programmes</SectionLabel>
            <SectionHeading>Counselling Programmes</SectionHeading>
            <SectionSub>
              Structured, time-bound programmes for specific life situations. Each is delivered by approved
              practitioners in a confidential, Islamically-grounded environment.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {PROGRAMMES.map((prog, i) => {
              const a = ACCENT[prog.accent] || ACCENT.teal;
              const isExpanded = expandedProg === i;
              const isMain = prog.modules.length > 0;

              return (
                <div
                  key={prog.title}
                  className={`rounded-2xl border bg-white/[0.02] p-6 transition ${a.ring} ring-1`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${a.bg} ${a.text} mb-2`}>
                        {prog.sub}
                      </span>
                      <h3 className="text-lg font-bold text-white">{prog.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{prog.desc}</p>
                    </div>
                  </div>

                  {isMain && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedProg(isExpanded ? null : i)}
                        className={`mt-4 text-xs font-bold uppercase tracking-widest ${a.text} hover:opacity-80 flex items-center gap-1`}
                      >
                        {isExpanded ? 'Hide' : 'View'} 6-Week Curriculum
                        <ChevronRight size={12} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {prog.modules.map((m) => (
                            <div key={m.week} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${a.bg} text-xs font-black ${a.text}`}>
                                {m.week}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{m.title}</p>
                                <p className="mt-0.5 text-xs text-slate-500">{m.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      to="/counselling-client"
                      className={`rounded-lg px-4 py-2 text-xs font-bold ${a.bg} ${a.text} ring-1 ${a.ring} transition hover:opacity-80`}
                    >
                      Register Interest
                    </Link>
                    <Link
                      to="/counselling-client"
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      Join Waiting List
                    </Link>
                    <Link
                      to="/contact"
                      className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      Request Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — WHY SIRAJONE COUNSELLING ══════════════════════════ */}
      <section id="why" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Why Choose Us</SectionLabel>
            <SectionHeading>Why Choose SirajOne Counselling?</SectionHeading>
            <SectionSub>
              We combine professional counselling practice with a deep Islamic foundation — so your
              support is both clinically informed and spiritually grounded.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                  <Icon size={18} className="text-teal-400" />
                </div>
                <p className="font-bold text-white">{title}</p>
                <p className="mt-1.5 text-sm leading-5 text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 4 — SUPPORT OPTIONS ═══════════════════════════════════ */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <SectionLabel>How We Work</SectionLabel>
            <SectionHeading>Support Options</SectionHeading>
            <SectionSub>
              Choose how you'd like to receive your support. All options are fully confidential.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor,  label: 'Online Counselling', desc: 'Private video sessions from the comfort of your home.' },
              { icon: Phone,    label: 'Voice Sessions',     desc: 'Telephone support — no video required.' },
              { icon: MapPin,   label: 'In-Person Sessions', desc: 'Face-to-face at our counselling centre in Durban.' },
              { icon: Users,    label: 'Group Workshops',    desc: 'Facilitated group sessions for shared growth.' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                  <Icon size={20} className="text-teal-400" />
                </div>
                <p className="font-bold text-white">{label}</p>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — MY SPACE CTA (if logged in) ══════════════════════ */}
      {user && (
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
              <HeartHandshake size={20} className="text-teal-400" />
            </div>
            <SectionLabel>Your Private Space</SectionLabel>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Access Your Support Dashboard</h2>
            <p className="mt-3 text-slate-400">
              View your sessions, messages from your counsellor, shared resources, and upcoming reminders — all in one private space.
            </p>
            <Link
              to="/counselling-client"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/40 transition hover:bg-teal-400"
            >
              Go to My Support Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ══ SECTION 6 — OPTIONAL ISLAMIC LEARNING (secondary) ════════════ */}
      <section className="border-t border-white/5 bg-white/[0.01] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-8 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <BookOpen size={18} className="text-emerald-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Also Available at SirajOne</p>
            <h3 className="mt-3 text-xl font-bold text-white">Interested in Islamic Learning?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400 max-w-lg mx-auto">
              SirajOne also offers Qur'ān learning, Tajwīd, Ḥifẓ, and structured Islamic education
              programmes for students and families. Browse our learning programmes separately.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/20"
              >
                Explore Learning Programmes
              </Link>
              <Link
                to="/enroll"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10"
              >
                Join a Class
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER NOTE ═══════════════════════════════════════════════════ */}
      <div className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-600">
            All counselling services are subject to our{' '}
            <Link to="/counselling-disclaimer" className="text-teal-500 hover:text-teal-400">Counselling Disclaimer</Link>
            {' '}·{' '}
            <Link to="/privacy" className="text-teal-500 hover:text-teal-400">Privacy Policy</Link>
            {' '}·{' '}
            <Link to="/terms" className="text-teal-500 hover:text-teal-400">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
