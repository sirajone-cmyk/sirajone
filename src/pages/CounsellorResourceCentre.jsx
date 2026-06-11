/**
 * CounsellorResourceCentre — Part 3 of the Support Provider Experience Redesign.
 *
 * Route: /support provider-resources
 * Access: Support Provider role only (guarded in App.jsx)
 *
 * Four expandable categories:
 *  1. Prophetic Islamic Guidance
 *  2. Khulafa al-Rashidun
 *  3. Classical Scholars
 *  4. Professional Islamic Guidance
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, ChevronDown, ChevronRight, Star, Crown, Shield, Lock,
  ArrowLeft, Heart,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { COUNSELLOR_RESOURCE_CATEGORIES } from '@/data/counsellorResources';

/* ─── Icon map ─────────────────────────────────────────────── */
const ICON_MAP = { Star, Crown, BookOpen, Shield };

/* ─── Colour map ───────────────────────────────────────────── */
const COLOUR = {
  amber:   { border: 'border-amber-400/20',  bg: 'bg-amber-400/8',  badge: 'bg-amber-400/15 text-amber-300',   icon: 'text-amber-300',   ring: 'ring-amber-400/20',  active: 'bg-amber-400/12' },
  emerald: { border: 'border-emerald-400/20', bg: 'bg-emerald-400/8', badge: 'bg-emerald-400/15 text-emerald-300', icon: 'text-emerald-300', ring: 'ring-emerald-400/20', active: 'bg-emerald-400/12' },
  sky:     { border: 'border-sky-400/20',     bg: 'bg-sky-400/8',     badge: 'bg-sky-400/15 text-sky-300',       icon: 'text-sky-300',     ring: 'ring-sky-400/20',    active: 'bg-sky-400/12' },
  rose:    { border: 'border-rose-400/20',    bg: 'bg-rose-400/8',    badge: 'bg-rose-400/15 text-rose-300',     icon: 'text-rose-300',    ring: 'ring-rose-400/20',   active: 'bg-rose-400/12' },
};

/* ─── LessonCard ───────────────────────────────────────────── */
function LessonCard({ lesson, colour }) {
  const [open, setOpen] = useState(false);
  const c = COLOUR[colour] || COLOUR.sky;

  if (lesson.status === 'coming_soon') {
    return (
      <div className={`rounded-xl border ${c.border} bg-white/[0.02] p-4 opacity-60`}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-400">{lesson.title}</p>
          <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] font-black text-slate-500">Coming Soon</span>
        </div>
        <p className="mt-1 text-xs text-slate-600">{lesson.summary}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${open ? `${c.border} ${c.active}` : 'border-white/8 bg-white/[0.03]'} transition`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-snug">{lesson.title}</p>
          <p className="mt-1 text-xs text-slate-400 leading-relaxed">{lesson.summary}</p>
        </div>
        {open
          ? <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 ${c.icon}`} />
          : <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
        }
      </button>

      {open && (
        <div className="border-t border-white/5 px-4 pb-5 pt-4">
          {lesson.body.split('\n\n').map((para, i) => (
            <p key={i} className="mb-3 text-sm leading-7 text-slate-300 last:mb-0">
              {para}
            </p>
          ))}
          {lesson.reference && (
            <p className="mt-3 text-[11px] text-slate-600 italic">
              Source: {lesson.reference}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── CategorySection ──────────────────────────────────────── */
function CategorySection({ category }) {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = ICON_MAP[category.icon] || BookOpen;
  const c = COLOUR[category.colour] || COLOUR.sky;

  return (
    <div className={`rounded-2xl border ${expanded ? c.border : 'border-white/8'} overflow-hidden transition`}>

      {/* Category header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition ${expanded ? c.bg : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg} ring-1 ${c.ring}`}>
            <IconComponent className={`h-5 w-5 ${c.icon}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">{category.title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-black ${c.badge}`}>
                {category.lessons.filter((l) => l.status !== 'coming_soon').length} lessons
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">{category.subtitle}</p>
            <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{category.description}</p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <p className="text-right font-serif text-sm text-slate-500 hidden sm:block">{category.arabic}</p>
          {expanded
            ? <ChevronDown className={`h-5 w-5 ${c.icon}`} />
            : <ChevronRight className="h-5 w-5 text-slate-600" />
          }
        </div>
      </button>

      {/* Lessons — expanded */}
      {expanded && (
        <div className="border-t border-white/5 px-6 py-5 space-y-3">
          {category.lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} colour={category.colour} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function CounsellorResourceCentre() {
  return (
    <div className="min-h-screen bg-[#08121a]">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

        {/* Back link */}
        <Link
          to="/support provider"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <header className="mb-8 rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-[#071310] to-[#08121a] px-6 py-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">
              Support Provider Resource Centre
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-black text-white sm:text-4xl">
            Foundations of Islamic Islamic Guidance
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-lg">
            Rooted in Prophetic wisdom, the Khulafā, classical scholarship, and professional ethics.
            Read deeply. Apply with sincerity.
          </p>

          {/* Amanah notice */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-400/15 bg-rose-400/5 px-4 py-3">
            <Lock className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <p className="text-xs text-slate-400 leading-5">
              These materials are for support providers only. They are part of your professional development
              and must not be shared publicly without authorisation.
            </p>
          </div>
        </header>

        {/* Resource categories */}
        <div className="space-y-4">
          {COUNSELLOR_RESOURCE_CATEGORIES.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-xl border border-white/8 bg-white/[0.02] p-5 text-center">
          <Heart className="mx-auto mb-2 h-5 w-5 text-emerald-500" />
          <p className="text-xs text-slate-500 leading-5">
            "The one who guides to good is like the one who does it."
            <span className="block mt-1 text-slate-600">— Prophet Muhammad ﷺ (Muslim)</span>
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              to="/support provider-library"
              className="flex items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-400/8 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-400/15 transition"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Support Provider Library
            </Link>
            <Link
              to="/support provider"
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
