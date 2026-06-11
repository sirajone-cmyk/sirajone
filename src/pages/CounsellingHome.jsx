import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Star, Users, BookOpen, TrendingUp, HandHeart,
  Shield, MessageCircle, Home, Phone, Monitor, MapPin,
  ChevronRight, ArrowRight, CheckCircle, Sparkles,
  HeartHandshake, Leaf, Brain, Moon, AlertTriangle,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Navbar from '../components/Navbar';
import ServiceModal from '../components/ServiceModal';
import WhatsAppButton from '../components/WhatsAppButton';
import DisclaimerGate from '../components/counselling/DisclaimerGate';
import { useAuth } from '../lib/AuthContext';
import { isCounsellingClientRole } from '../lib/roles';
import { PROGRAMMES } from '../data/counsellingProgrammes';

/* ─── Accent colour map (programme cards) ────────────────────────────────── */
const ACCENT = {
  teal:    { ring: 'ring-teal-400/30',    bg: 'bg-teal-400/10',    text: 'text-teal-300',    dot: 'bg-teal-400'    },
  violet:  { ring: 'ring-violet-400/30',  bg: 'bg-violet-400/10',  text: 'text-violet-300',  dot: 'bg-violet-400'  },
  amber:   { ring: 'ring-amber-400/30',   bg: 'bg-amber-400/10',   text: 'text-amber-300',   dot: 'bg-amber-400'   },
  emerald: { ring: 'ring-emerald-400/30', bg: 'bg-emerald-400/10', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  sky:     { ring: 'ring-sky-400/30',     bg: 'bg-sky-400/10',     text: 'text-sky-300',     dot: 'bg-sky-400'     },
  rose:    { ring: 'ring-rose-400/30',    bg: 'bg-rose-400/10',    text: 'text-rose-300',    dot: 'bg-rose-400'    },
};

// Hex values used for inline styles on week cards (left border, faded numeral)
const WEEK_HEX = {
  teal: '#2dd4bf', violet: '#a78bfa', amber: '#f59e0b',
  emerald: '#34d399', sky: '#38bdf8', rose: '#fb7185',
};

/* ─── Services data ──────────────────────────────────────────────────────── */
const SERVICES = [
  {
    title: 'Marriage Islamic Guidance & Support',
    icon: Heart,
    cat: 'Relationship',
    desc: 'Navigate challenges and strengthen your marriage through Islamic guidance.',
    fullDesc: 'Marriage guidance at SirajOne provides a confidential, Islamically-grounded space for couples to address communication challenges, restore trust, and rebuild their connection. Our support providers combine Islamic guidance, mentorship, Quranic wisdom, and Sunnah-based principles.',
    suitableFor: 'Married couples experiencing conflict, communication breakdown, or emotional distance. Also suitable for couples seeking to strengthen a healthy marriage.',
    benefits: [
      'Confidential one-to-one or couples sessions',
      'Islamic framework for conflict resolution and reconciliation',
      'Practical communication tools rooted in adab (etiquette)',
      'Structured follow-up support between sessions',
    ],
    sessionFormat: 'Online or in-person',
    duration: '6–12 sessions (tailored)',
  },
  {
    title: 'Pre-Marital Guidance',
    icon: Star,
    cat: 'Relationship',
    desc: 'Prepare for a healthy, grounded marriage before you say "I do".',
    fullDesc: 'Our Pre-Marital Guidance programme helps individuals and couples enter marriage with clarity, readiness, and an Islamic framework for a successful partnership. We address expectations, communication, finances, and family life before the nikāḥ.',
    suitableFor: 'Individuals considering marriage, engaged couples, or those recently married (within 1 year) seeking a strong foundation.',
    benefits: [
      'Understanding Islamic rights and responsibilities in marriage',
      'Communication and conflict prevention tools',
      'Financial and household planning from an Islamic perspective',
      'Personal values clarification and alignment',
    ],
    sessionFormat: 'Individual or couple sessions',
    duration: '4–6 sessions',
  },
  {
    title: 'Family Islamic Guidance & Support',
    icon: Home,
    cat: 'Family',
    desc: 'Restore harmony, trust, and communication within the family unit.',
    fullDesc: 'Family support addresses relationship dynamics, communication breakdowns, and conflict within the family unit. Guidance sessions are shaped by Islamic principles of consultation, mercy, and justice - helping families reconnect and grow together.',
    suitableFor: 'Families experiencing conflict, estrangement, or communication difficulties. Also suitable for families going through major life transitions.',
    benefits: [
      'Improved family communication and listening skills',
      'Conflict resolution grounded in Islamic principles',
      'Rebuilding trust and restoring family bonds',
      'Practical strategies for co-parenting and household harmony',
    ],
    sessionFormat: 'Family group or individual sessions',
    duration: '6–10 sessions',
  },
  {
    title: 'Parenting Support',
    icon: Users,
    cat: 'Family',
    desc: 'Guidance for raising confident, spiritually grounded children.',
    fullDesc: 'Parenting support sessions help parents navigate the challenges of raising children in today\'s world while maintaining an Islamic home. We address discipline, communication, teenage behaviour, and raising children with strong Islamic identity.',
    suitableFor: 'Parents of children of any age, guardians, or blended families seeking Islamic parenting guidance.',
    benefits: [
      'Islamic approaches to discipline, boundaries, and love',
      'Age-appropriate strategies for spiritual development',
      'Managing behavioural challenges with compassion',
      'Building a home environment grounded in taqwā',
    ],
    sessionFormat: 'Individual or couples parenting sessions',
    duration: '4–8 sessions',
  },
  {
    title: 'Teen Islamic Guidance & Support',
    icon: TrendingUp,
    cat: 'Youth',
    desc: 'Safe space for teenagers navigating identity, pressure, and purpose.',
    fullDesc: 'Youth mentorship provides a safe, respectful space for young Muslims aged 13-17 to explore their identity, manage pressure from peers and social media, and develop a strong sense of Islamic purpose. Guidance is handled with care and confidentiality.',
    suitableFor: 'Teenagers aged 13–17 experiencing anxiety, identity confusion, peer pressure, academic stress, or family conflict.',
    benefits: [
      'Confidential space to speak freely without judgment',
      'Islamic perspective on identity, purpose, and self-worth',
      'Practical tools for managing anxiety and social pressure',
      'Parent communication support where appropriate',
    ],
    sessionFormat: 'One-to-one sessions',
    duration: '6–8 sessions',
  },
  {
    title: 'Youth Mentorship',
    icon: Star,
    cat: 'Youth',
    desc: 'Structured mentorship to guide young people toward their potential.',
    fullDesc: 'Youth mentorship provides structured, goal-oriented guidance for young Muslims aged 16–25 who want to develop their character, purpose, and life direction — grounded in Islamic values and personal development principles.',
    suitableFor: 'Young adults aged 16–25 seeking direction, career guidance, character development, or Islamic mentorship.',
    benefits: [
      'Goal-setting and accountability from an Islamic framework',
      'Character and discipline development',
      'Life skills: time management, communication, decision-making',
      'Connecting personal ambition with Islamic purpose',
    ],
    sessionFormat: 'One-to-one mentorship sessions',
    duration: '8–12 sessions',
  },
  {
    title: 'Student Support',
    icon: BookOpen,
    cat: 'Youth',
    desc: 'Academic stress, identity, and life transitions — supported Islamically.',
    fullDesc: 'Student support sessions are tailored for Muslim students navigating the pressures of academic life, social identity, and personal growth. We help students manage stress, maintain their deen, and build resilience through their educational journey.',
    suitableFor: 'Muslim students at school, college, or university experiencing academic pressure, anxiety, homesickness, or identity challenges.',
    benefits: [
      'Managing academic stress and performance anxiety',
      'Maintaining Islamic identity in a non-Muslim environment',
      'Building study habits, routine, and self-discipline',
      'Support through major transitions (university, graduation, career)',
    ],
    sessionFormat: 'Online sessions (flexible for students)',
    duration: '4–6 sessions',
  },
  {
    title: 'Adult Islamic Guidance & Support',
    icon: Heart,
    cat: 'Adult',
    desc: 'Personal support for life challenges, transitions, and inner growth.',
    fullDesc: 'Adult guidance provides dedicated support for individuals navigating personal challenges, life transitions, and emotional wellbeing. Sessions are respectful, confidential, and grounded in Islamic guidance, mentorship, and practical support.',
    suitableFor: 'Adults experiencing anxiety, depression, life changes, relationship difficulties, low self-worth, or general emotional wellbeing challenges.',
    benefits: [
      'Safe, confidential space for personal exploration',
      'Evidence-informed approaches combined with Islamic values',
      'Tools for managing anxiety, low mood, and life stress',
      'Building resilience, self-awareness, and emotional regulation',
    ],
    sessionFormat: 'Individual sessions (online or in-person)',
    duration: '6–12 sessions',
  },
  {
    title: 'Islamic Spiritual Support',
    icon: Moon,
    cat: 'Spiritual',
    desc: 'Reconnect with your purpose, your deen, and your Lord.',
    fullDesc: 'Islamic spiritual support sessions help individuals who feel disconnected from their faith, struggling with doubts, or seeking to deepen their relationship with Allah. Our support providers guide guidance seekers through spiritual reflection, dua, and Islamic self-care.',
    suitableFor: 'Individuals experiencing a weakening of faith, spiritual emptiness, waswās, or seeking to rebuild their connection with Allāh and Islamic practice.',
    benefits: [
      'Exploring the root causes of spiritual disconnect',
      'Islamic self-care practices: dhikr, du\'ā, and worship routines',
      'Addressing doubts (waswās) with Islamic knowledge',
      'Building a sustainable, heart-centred spiritual life',
    ],
    sessionFormat: 'Individual sessions',
    duration: '4–8 sessions',
  },
  {
    title: 'Personal Development',
    icon: TrendingUp,
    cat: 'Growth',
    desc: 'Build discipline, resilience, and meaningful personal goals.',
    fullDesc: 'Personal development sessions help individuals identify their goals, build discipline, and create lasting positive change aligned with Islamic values — combining evidence-based coaching with Islamic principles of tawbah and self-accountability (muḥāsabah).',
    suitableFor: 'Individuals seeking self-improvement, goal clarity, habit formation, or personal growth with an Islamic framework.',
    benefits: [
      'Clarity on personal values, goals, and purpose',
      'Building discipline and consistent habits (\'azm)',
      'Islamic framework for self-accountability (muḥāsabah)',
      'Overcoming procrastination and self-limiting beliefs',
    ],
    sessionFormat: 'Individual coaching sessions',
    duration: '4–8 sessions',
  },
  {
    title: 'Grief & Bereavement Support',
    icon: HandHeart,
    cat: 'Wellbeing',
    desc: 'Compassionate support through loss — rooted in ṣabr and tawakkul.',
    fullDesc: 'Grief and bereavement support provides compassionate, confidential care for individuals navigating the pain of loss. Our Islamic framework acknowledges the deep spiritual dimensions of grief and supports the process of healing with ṣabr and professional care.',
    suitableFor: 'Individuals experiencing the loss of a loved one, pregnancy loss, relationship breakdown, or any significant loss. Suitable for all ages.',
    benefits: [
      'Safe space to grieve without time pressure or judgment',
      'Islamic perspective on death, loss, and the hereafter',
      'Practical tools for managing grief at different stages',
      'Support for complicated grief and unresolved loss',
    ],
    sessionFormat: 'Individual sessions (sensitive, unhurried)',
    duration: 'Flexible — as needed',
  },
  {
    title: 'Lifestyle & Wellbeing Support',
    icon: Leaf,
    cat: 'Wellbeing',
    desc: 'Holistic wellbeing: sleep, routine, nutrition, and spiritual balance.',
    fullDesc: 'Lifestyle and wellbeing support addresses the holistic dimensions of Muslim life - sleep, routine, nutrition, exercise, and spiritual practice. We help guidance seekers build sustainable daily habits that support emotional, physical, and spiritual wellbeing.',
    suitableFor: 'Individuals experiencing burnout, poor sleep, lack of routine, or seeking to build a balanced, Islamically-aligned lifestyle.',
    benefits: [
      'Identifying and addressing lifestyle imbalances',
      'Building a daily routine aligned with Islamic practice',
      'Sleep, nutrition, and energy management strategies',
      'Spiritual self-care integrated into daily life',
    ],
    sessionFormat: 'Individual sessions with follow-up support',
    duration: '4–6 sessions',
  },
];

const BENEFITS = [
  { icon: Shield,         title: 'Fully Confidential',         desc: 'Everything shared stays private. Your trust is our covenant.' },
  { icon: Moon,           title: 'Islamic Foundation',          desc: 'Every approach is rooted in Qur\'an, Sunnah, and Islamic scholarship.' },
  { icon: Brain,          title: 'Islamic Guidance',          desc: 'Understanding the nafs, the heart, and emotional wellbeing through an Islamic lens.' },
  { icon: Monitor,        title: 'Private Online & In-Person',  desc: 'Flexible, private sessions wherever you are — no compromise on comfort.' },
  { icon: TrendingUp,     title: 'Personal Development Focus',  desc: 'Not just talking — building real, lasting change in your life.' },
  { icon: Heart,          title: 'Family & Marriage Guidance',   desc: 'Specialised support for the most important relationships in your life.' },
  { icon: CheckCircle,    title: 'Structured Follow-Up',        desc: 'Sessions, reminders, and follow-ups so nothing falls through the cracks.' },
  { icon: HeartHandshake, title: 'Trusted Support Providers',         desc: 'Verified, approved practitioners who understand your faith and culture.' },
];

/* ─── Shared section headings ─────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-teal-300">{children}</p>;
}
function SectionHeading({ children }) {
  return <h2 className="text-3xl font-black text-white sm:text-4xl">{children}</h2>;
}
function SectionSub({ children }) {
  return <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">{children}</p>;
}

/* ─── Week accordion card ─────────────────────────────────────────────────── */
function WeekCard({ mod, totalWeeks, isExpanded, onToggle }) {
  const hex = WEEK_HEX[mod.accent] || '#2dd4bf';
  const progress = Math.round((mod.week / totalWeeks) * 100);
  const isLocked = mod.status === 'locked';
  const isComingSoon = mod.status === 'coming-soon';

  useEffect(() => { document.title = `Islamic Islamic Guidance & Support | SirajOne — Faith-Based Support`; }, []);

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/6 bg-[#090e1d] transition-colors hover:border-white/10"
      style={{ borderLeftColor: hex, borderLeftWidth: '3px' }}
    >
      {/* Faded background numeral */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-0 select-none font-black leading-none"
        style={{ fontSize: '7rem', color: hex, opacity: 0.045 }}
      >
        {mod.week}
      </span>

      {/* Card header — always visible, acts as toggle */}
      <button
        type="button"
        disabled={isLocked}
        onClick={() => onToggle(mod.week)}
        aria-expanded={isExpanded}
        className={`relative w-full p-4 text-left transition-colors ${isLocked ? 'cursor-default opacity-50' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Week number badge */}
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black"
              style={{ backgroundColor: `${hex}1a`, color: hex }}
            >
              {mod.week}
            </div>

            <div>
              {/* Label row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: hex, opacity: 0.85 }}
                >
                  Week {mod.week}
                </span>
                {isComingSoon && (
                  <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-400">
                    Coming Soon
                  </span>
                )}
                {isLocked && (
                  <span className="rounded-full bg-slate-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Locked
                  </span>
                )}
                {!isLocked && !isComingSoon && (
                  <span className="rounded-full bg-teal-400/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-teal-500">
                    Available
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="mt-0.5 text-sm font-bold text-white">{mod.title}</p>

              {/* Brief — hidden when expanded */}
              {!isExpanded && (
                <p className="mt-0.5 text-xs leading-5 text-slate-500">{mod.brief}</p>
              )}
            </div>
          </div>

          <ChevronRight
            size={14}
            className={`mt-1 shrink-0 text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Expandable content — smooth height + opacity transition */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4 border-t border-white/5 px-4 pb-5 pt-4">

          {/* Progress bar */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                Progress
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                Week {mod.week} of {totalWeeks}
              </span>
            </div>
            <div className="h-[2px] rounded-full bg-white/5">
              <div
                className="h-[2px] rounded-full"
                style={{ width: `${progress}%`, backgroundColor: hex, opacity: 0.7 }}
              />
            </div>
          </div>

          {/* Topics */}
          {mod.topics?.length > 0 && (
            <div>
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                Topics Covered
              </p>
              <ul className="space-y-1.5">
                {mod.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs leading-5 text-slate-400">
                    <span
                      className="mt-1.5 h-[5px] w-[5px] shrink-0 rounded-full"
                      style={{ backgroundColor: hex, opacity: 0.7 }}
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Islamic reference */}
          {mod.reference && (
            <div className="rounded-lg border border-white/5 bg-white/[0.018] p-3">
              <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                Islamic Reference
              </p>
              <p className="text-xs italic leading-5 text-slate-400">{mod.reference}</p>
            </div>
          )}

          {/* Format & Takeaway */}
          {(mod.format || mod.takeaway) && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {mod.format && (
                <div className="rounded-lg border border-white/5 bg-white/[0.018] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Session Format
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{mod.format}</p>
                </div>
              )}
              {mod.takeaway && (
                <div className="rounded-lg border border-white/5 bg-white/[0.018] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Takeaway
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{mod.takeaway}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function CounsellingHome() {
  const { user, isAuthenticated } = useAuth();
  const [activeService, setActiveService] = useState(null);
  const [expandedProg, setExpandedProg] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(null);

  // ── Disclaimer gate ──────────────────────────────────────────────────────
  // Only authenticated guidance seekers must accept. Public visitors skip.
  const isCounsellingClient = isAuthenticated && isCounsellingClientRole(user?.role);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(null); // null=loading

  useEffect(() => {
    if (!isCounsellingClient) return;
    getDoc(doc(db, 'users', user.uid))
      .then(snap => setDisclaimerAccepted(snap.data()?.disclaimerAccepted === true))
      .catch(() => setDisclaimerAccepted(false));
  }, [isCounsellingClient, user?.uid]);

  const firstName = user?.full_name?.split(' ')[0] || null;

  const openService = useCallback((svc) => setActiveService(svc), []);
  const closeService = useCallback(() => setActiveService(null), []);

  const handleProgToggle = (i) => {
    setExpandedProg(expandedProg === i ? null : i);
    setExpandedWeek(null); // reset week when programme changes
  };

  const handleWeekToggle = (weekNum) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  // Show gate for guidance seekers who have not accepted yet
  if (isCounsellingClient && disclaimerAccepted === false) {
    return <DisclaimerGate uid={user.uid} onAccept={() => setDisclaimerAccepted(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      {/* ══ CRISIS SUPPORT BANNER — always visible, non-dismissible ══════ */}
      <div className="border-b border-red-500/20 bg-red-950/40 px-4 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 text-center sm:px-6 lg:px-8">
          <AlertTriangle size={13} className="shrink-0 text-red-400" />
          <p className="text-xs text-red-300 leading-5">
            <strong>Crisis or immediate danger?</strong>{' '}
            Do not use this service —{' '}
            <a href="tel:10111" className="font-bold underline hover:text-red-200">Emergency: 10111</a>
            {' '}·{' '}
            <a href="tel:0800212223" className="font-bold underline hover:text-red-200">SADAG: 0800 21 22 23</a>
            {' '}(24-hour, free)
          </p>
        </div>
      </div>

      {/* Service detail modal */}
      {activeService && (
        <ServiceModal service={activeService} onClose={closeService} />
      )}

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#0d1533] via-[#080d1a] to-[#080d1a]">
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFhMmYyMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-4 py-1.5">
            <HeartHandshake size={13} className="text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">SirajOne Islamic Guidance & Support</span>
          </div>

          {firstName && (
            <p className="mb-2 text-sm font-semibold text-slate-400">
              As-salāmu ʿalaykum, <span className="text-teal-300">{firstName}</span>
            </p>
          )}

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
            Private Islamic{' '}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Islamic Guidance & Support
            </span>{' '}
            Support
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Access confidential support, guidance, and personal development through a trusted
            Islamic guidance pathway rooted in Qur'ān, Sunnah, adab, and practical mentorship.
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
              Explore Islamic Guidance & Support Support
            </a>
            <Link
              to="/counselling-client"
              className="inline-flex items-center gap-2 rounded-xl border border-teal-400/30 bg-teal-400/10 px-6 py-3 text-sm font-bold text-teal-200 transition hover:bg-teal-400/20"
            >
              <MessageCircle size={16} />
              Request Private Islamic Guidance & Support
            </Link>
            <WhatsAppButton
              label="Chat on WhatsApp"
              variant="outline"
              size="lg"
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { icon: Shield,  text: 'Fully Confidential' },
              { icon: Moon,    text: 'Islamic Approach'   },
              { icon: Monitor, text: 'Online & In-Person' },
              { icon: Heart,   text: 'Marriage & Family'  },
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

      {/* ══ SECTION 1 — GUIDANCE SERVICES ══════════════════════════════ */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Islamic Guidance & Support Support</SectionLabel>
            <SectionHeading>Islamic Guidance & Support Support Services</SectionHeading>
            <SectionSub>
              Every service is confidential, Islamically grounded, and delivered by verified practitioners.
              Select a service below to learn more or make a request.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <button
                  key={svc.title}
                  type="button"
                  onClick={() => openService(svc)}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-left transition hover:border-teal-400/30 hover:bg-teal-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
                      <Icon size={18} className="text-teal-400" />
                    </div>
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {svc.cat}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white transition group-hover:text-teal-200">{svc.title}</p>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{svc.desc}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-teal-400 opacity-0 transition group-hover:opacity-100">
                    Learn More <ChevronRight size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — GUIDANCE PROGRAMMES ════════════════════════════ */}
      <section id="programmes" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Structured Programmes</SectionLabel>
            <SectionHeading>Islamic Guidance & Support Programmes</SectionHeading>
            <SectionSub>
              Structured, time-bound programmes for specific life situations. Each is delivered by approved
              practitioners in a confidential, Islamically-grounded environment.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {PROGRAMMES.map((prog, i) => {
              const a = ACCENT[prog.accent] || ACCENT.teal;
              const isExpanded = expandedProg === i;
              const hasWeeks = prog.weeks?.length > 0;

              return (
                <div
                  key={prog.id}
                  className={`rounded-2xl border bg-white/[0.02] p-6 transition ring-1 ${a.ring}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${a.bg} ${a.text}`}>
                          {prog.sub}
                        </span>
                        {prog.badge && (
                          <span className="inline-block rounded-full border border-amber-400/20 bg-amber-400/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                            {prog.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white">{prog.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{prog.desc}</p>
                    </div>
                  </div>

                  {hasWeeks && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleProgToggle(i)}
                        className={`mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${a.text} transition hover:opacity-80`}
                      >
                        {isExpanded ? 'Hide' : 'View'} 6-Week Curriculum
                        <ChevronRight
                          size={12}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {/* Week accordion cards */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? 'max-h-[2400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="space-y-2">
                          {prog.weeks.map((mod) => (
                            <WeekCard
                              key={mod.week}
                              mod={mod}
                              totalWeeks={prog.weeks.length}
                              isExpanded={expandedWeek === mod.week}
                              onToggle={handleWeekToggle}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <WhatsAppButton
                      message={`As-salāmu ʿalaykum, I would like to register my interest in the ${prog.title} at SirajOne. Please could you provide more details?`}
                      label="Register Interest"
                      variant="outline"
                      size="sm"
                    />
                    <a
                      href={`https://wa.me/27676340225?text=${encodeURIComponent(`As-salāmu ʿalaykum, I would like to join the waiting list for the ${prog.title} at SirajOne.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      Join Waiting List
                    </a>
                    <a
                      href={`https://wa.me/27676340225?text=${encodeURIComponent(`As-salāmu ʿalaykum, I would like to request more details about the ${prog.title} at SirajOne.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                    >
                      Request Details
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — WHY SIRAJONE GUIDANCE ══════════════════════════ */}
      <section id="why" className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionLabel>Why Choose Us</SectionLabel>
            <SectionHeading>Why Choose SirajOne Islamic Guidance & Support?</SectionHeading>
            <SectionSub>
              We combine Islamic guidance support service with a deep Islamic foundation — so your
              support is both faith-informed and spiritually grounded.
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
            <SectionLabel>How We Meet</SectionLabel>
            <SectionHeading>Support Options</SectionHeading>
            <SectionSub>
              Choose how you'd like to receive your support. All options offer the same Islamic guidance, mentorship, and support standards.
            </SectionSub>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Monitor, label: 'Online Islamic Guidance & Support',  desc: 'Video-based private sessions from anywhere.'            },
              { icon: Phone,   label: 'Voice Sessions',      desc: 'Telephone guidance - no video required.'             },
              { icon: MapPin,  label: 'In-Person Sessions',  desc: 'Face-to-face support where available.'                },
              { icon: Users,   label: 'Group Workshops',     desc: 'Community group guidance with structured support.'          },
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

          {/* WhatsApp quick contact */}
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.015] px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-bold text-white">Not ready to book? Start with a message.</p>
              <p className="mt-0.5 text-sm text-slate-500">
                Send us a WhatsApp — we'll guide you to the right support at your own pace.
              </p>
            </div>
            <WhatsAppButton
              label="Chat on WhatsApp"
              variant="primary"
              size="md"
              className="shrink-0"
            />
          </div>
        </div>
      </section>

      {/* ══ SECTION 5 — MY SPACE CTA (logged in only) ════════════════════ */}
      {user && (
        <section className="border-t border-white/5 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
              <HeartHandshake size={20} className="text-teal-400" />
            </div>
            <SectionLabel>Your Private Space</SectionLabel>
            <h2 className="text-2xl font-black text-white sm:text-3xl">Access Your Support Dashboard</h2>
            <p className="mt-3 text-slate-400">
              View your sessions, messages from your support provider, shared resources, and upcoming reminders — all in one private space.
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

      {/* ══ SECTION 6 — ISLAMIC LEARNING (secondary) ═════════════════════ */}
      <section className="border-t border-white/5 bg-white/[0.01] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-8 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <BookOpen size={18} className="text-emerald-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Also Available at SirajOne</p>
            <h3 className="mt-3 text-xl font-bold text-white">Interested in Islamic Learning?</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
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
            All Islamic Guidance & Support services are subject to our{' '}
            <Link to="/counselling-disclaimer" className="text-teal-500 hover:text-teal-400">Islamic Guidance & Support Disclaimer</Link>
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
