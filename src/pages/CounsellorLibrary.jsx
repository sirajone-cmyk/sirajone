/**
 * CounsellorLibrary — Part 4 of the Counsellor Experience Redesign.
 *
 * Route: /counsellor-library
 * Access: Counsellor role only (guarded in App.jsx)
 *
 * Separate from the client-facing CounsellingLibrary.
 * 8 sections specifically for counsellor professional reading:
 *  1. Handbook
 *  2. Prophetic Counselling
 *  3. Islamic Psychology
 *  4. Marriage & Family
 *  5. Parenting
 *  6. Crisis Intervention
 *  7. Emotional Wellbeing
 *  8. Professional Practice
 *
 * Resources come from Firestore (counsellorLibrary collection).
 * Falls back gracefully to empty state per section.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, FileText, Video, Headphones, Search,
  ExternalLink, ArrowLeft, ShieldCheck, Heart, Users,
  Lock, AlertTriangle, Smile, BookMarked, Briefcase,
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

/* ─── Library sections ─────────────────────────────────────── */
const LIBRARY_SECTIONS = [
  {
    id: 'handbook',
    label: 'Counsellor Handbook',
    description: 'Core procedures, ethics, and policies for SirajOne counsellors.',
    icon: BookMarked,
    colour: 'emerald',
  },
  {
    id: 'prophetic-counselling',
    label: 'Prophetic Counselling',
    description: 'Methods of the Prophet ﷺ — listening, mercy, gradual guidance.',
    icon: BookOpen,
    colour: 'amber',
  },
  {
    id: 'islamic-psychology',
    label: 'Islamic Psychology',
    description: 'The nafs, spiritual diseases, tazkiyah, and classical frameworks.',
    icon: Heart,
    colour: 'rose',
  },
  {
    id: 'marriage',
    label: 'Marriage & Family',
    description: 'Islamic approaches to marital support, communication, and reconciliation.',
    icon: Users,
    colour: 'sky',
  },
  {
    id: 'parenting',
    label: 'Parenting',
    description: 'Guidance on Islamic parenting, child development, and family dynamics.',
    icon: Users,
    colour: 'sky',
  },
  {
    id: 'crisis',
    label: 'Crisis Intervention',
    description: 'Safeguarding, suicide risk, self-harm response, and emergency procedures.',
    icon: AlertTriangle,
    colour: 'rose',
  },
  {
    id: 'emotional-wellbeing',
    label: 'Emotional Wellbeing',
    description: 'Grief, anxiety, depression, trauma — Islamic and evidence-based perspectives.',
    icon: Smile,
    colour: 'sky',
  },
  {
    id: 'professional-practice',
    label: 'Professional Practice',
    description: 'Documentation, boundaries, supervision, referral, and professional ethics.',
    icon: Briefcase,
    colour: 'slate',
  },
];

/* ─── Colour config ────────────────────────────────────────── */
const COLOUR = {
  emerald: { badge: 'bg-emerald-400/15 text-emerald-300', icon: 'text-emerald-400', border: 'border-emerald-400/20' },
  amber:   { badge: 'bg-amber-400/15 text-amber-300',     icon: 'text-amber-400',   border: 'border-amber-400/20'   },
  sky:     { badge: 'bg-sky-400/15 text-sky-300',         icon: 'text-sky-400',     border: 'border-sky-400/20'     },
  rose:    { badge: 'bg-rose-400/15 text-rose-300',       icon: 'text-rose-400',    border: 'border-rose-400/20'    },
  slate:   { badge: 'bg-white/8 text-slate-400',          icon: 'text-slate-500',   border: 'border-white/8'        },
};

/* ─── Type config ──────────────────────────────────────────── */
const TYPE_CONFIG = {
  article: { label: 'Article', icon: FileText,   color: 'text-blue-400',   bg: 'bg-blue-900/20'   },
  pdf:     { label: 'PDF',     icon: FileText,   color: 'text-rose-400',   bg: 'bg-rose-900/20'   },
  video:   { label: 'Video',   icon: Video,      color: 'text-purple-400', bg: 'bg-purple-900/20' },
  audio:   { label: 'Audio',   icon: Headphones, color: 'text-amber-400',  bg: 'bg-amber-900/20'  },
};

/* ─── Resource card ────────────────────────────────────────── */
function ResourceCard({ resource }) {
  const { title, description, type = 'article', url, author, durationLabel, featured } = resource;
  const tc = TYPE_CONFIG[type] ?? TYPE_CONFIG.article;
  const TypeIcon = tc.icon;

  return (
    <div className={`flex flex-col rounded-xl border transition hover:border-white/15 ${
      featured ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-white/8 bg-white/[0.03]'
    }`}>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${tc.bg} ${tc.color}`}>
            <TypeIcon className="h-3 w-3" />
            {tc.label}
          </span>
          {featured && (
            <span className="rounded-lg bg-emerald-700/30 px-2 py-1 text-[11px] font-semibold text-emerald-400">
              Featured
            </span>
          )}
        </div>
        <h4 className="mb-1.5 text-sm font-semibold text-white leading-snug">{title}</h4>
        {description && (
          <p className="mb-3 flex-1 text-xs text-slate-400 leading-relaxed line-clamp-3">{description}</p>
        )}
        {(author || durationLabel) && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            {author && <span>{author}</span>}
            {author && durationLabel && <span>·</span>}
            {durationLabel && <span>{durationLabel}</span>}
          </div>
        )}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-emerald-700/30 hover:text-emerald-300"
          >
            <ExternalLink className="h-3 w-3" />
            Open resource
          </a>
        ) : (
          <div className="rounded-lg bg-white/4 px-3 py-2 text-center text-xs text-slate-600">Coming soon</div>
        )}
      </div>
    </div>
  );
}

/* ─── Section panel ────────────────────────────────────────── */
function SectionPanel({ section, resources }) {
  const c = COLOUR[section.colour] || COLOUR.slate;
  const Icon = section.icon;
  const sectionResources = resources.filter((r) => r.section === section.id);

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
      {/* Section header */}
      <div className="flex items-start gap-3 px-5 py-4">
        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${c.border} bg-white/[0.04]`}>
          <Icon className={`h-4.5 w-4.5 ${c.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-white">{section.label}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${c.badge}`}>
              {sectionResources.length || 0}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{section.description}</p>
        </div>
      </div>

      {/* Resources */}
      {sectionResources.length > 0 ? (
        <div className="border-t border-white/5 px-5 py-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectionResources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      ) : (
        <div className="border-t border-white/5 px-5 py-6 text-center">
          <BookOpen className="mx-auto mb-2 h-6 w-6 text-slate-700" />
          <p className="text-xs text-slate-600">
            Resources for this section will be added by the SirajOne team.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function CounsellorLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  useEffect(() => {
    document.title = 'Counsellor Library — SirajOne';
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'counsellorLibrary'),
      orderBy('publishedAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('[CounsellorLibrary] onSnapshot error:', err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return resources;
    const q = searchQuery.toLowerCase();
    return resources.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.author?.toLowerCase().includes(q),
    );
  }, [resources, searchQuery]);

  const sectionsToShow = activeSection === 'all'
    ? LIBRARY_SECTIONS
    : LIBRARY_SECTIONS.filter((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#08121a]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Back */}
        <Link
          to="/counsellor"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-7 rounded-2xl border border-sky-400/15 bg-gradient-to-br from-[#071318] to-[#08121a] px-6 py-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-sky-300">
              Counsellor Library
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-black text-white sm:text-4xl">
            Professional Reading & Resources
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Curated materials for counsellor development — Islamic and professional. For your eyes only.
          </p>

          {/* Confidentiality notice */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-400/15 bg-rose-400/5 px-4 py-3">
            <Lock className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <p className="text-xs text-slate-400 leading-5">
              This library is restricted to counsellors. Resources here support your professional practice
              and are not intended for distribution to clients without review.
            </p>
          </div>
        </header>

        {/* Search + section filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources…"
              className="w-full rounded-xl border border-white/10 bg-white/6 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeSection === 'all'
                  ? 'bg-sky-700/40 text-sky-200 ring-1 ring-sky-400/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/8'
              }`}
            >
              All Sections
            </button>
            {LIBRARY_SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeSection === s.id
                      ? 'bg-sky-700/40 text-sky-200 ring-1 ring-sky-400/20'
                      : 'bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3 w-3 flex-shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section panels */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white/5 h-32" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sectionsToShow.map((section) => (
              <SectionPanel
                key={section.id}
                section={section}
                resources={searchQuery.trim() ? filtered : resources}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-slate-600">
            Resources are added and reviewed by the SirajOne counselling team.
            Contact us to suggest a resource.
          </p>
          <div className="flex gap-3">
            <Link
              to="/counsellor-resources"
              className="flex items-center gap-1.5 rounded-lg border border-emerald-400/15 bg-emerald-400/8 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-400/12 transition"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Resource Centre
            </Link>
            <Link
              to="/counsellor"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
