/**
 * CounsellingLibrary — 13-category spiritual and guidance resource library.
 *
 * Scope: COUNSELLING_CLIENT and COUNSELLOR roles only.
 * App.jsx must guard this route with isIslamic GuidanceUser.
 *
 * Firestore: guidanceResources collection
 * Resource shape:
 *   {
 *     id: string,
 *     title: string,
 *     description: string,
 *     category: string,       // one of LIBRARY_CATEGORIES
 *     type: 'article' | 'pdf' | 'video' | 'audio',
 *     url: string,
 *     author: string | null,
 *     durationLabel: string | null,  // e.g. '12 min read'
 *     publishedAt: Timestamp | null,
 *     featured: boolean,
 *   }
 */

import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Headphones,
  Search,
  ExternalLink,
  Heart,
  Users,
  Sparkles,
  ShieldCheck,
  Wind,
  Smile,
  Flower2,
  Flame,
  Moon,
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';

// ─── Category definitions ─────────────────────────────────────────────────────

export const LIBRARY_CATEGORIES = [
  { id: 'all',               label: 'All Resources',    icon: BookOpen     },
  { id: 'client-guidance',   label: 'Guidance Seeker Support',  icon: Heart        },
  { id: 'support provider-guidance', label: 'Support Provider Guidance', icon: Users   },
  { id: 'marriage',          label: 'Marriage',         icon: Heart        },
  { id: 'parenting',         label: 'Parenting',        icon: Users        },
  { id: 'anxiety',           label: 'Anxiety',          icon: Wind         },
  { id: 'emotional-wellbeing', label: 'Emotional Wellbeing', icon: Smile   },
  { id: 'grief',             label: 'Grief',            icon: Moon         },
  { id: 'tawbah',            label: 'Tawbah',           icon: Flame        },
  { id: 'sabr',              label: 'Sabr',             icon: ShieldCheck  },
  { id: 'shukr',             label: 'Shukr',            icon: Sparkles     },
  { id: 'dhikr',             label: 'Dhikr',            icon: Flower2      },
  { id: 'dua',               label: "Du'a",             icon: Moon         },
  { id: 'tazkiyah',          label: 'Tazkiyah',         icon: Sparkles     },
];

// ─── Resource type config ─────────────────────────────────────────────────────

const TYPE_CONFIG = {
  article: { label: 'Article',  icon: FileText,    color: 'text-blue-400',   bg: 'bg-blue-900/20'    },
  pdf:     { label: 'PDF',      icon: FileText,    color: 'text-rose-400',   bg: 'bg-rose-900/20'    },
  video:   { label: 'Video',    icon: Video,       color: 'text-purple-400', bg: 'bg-purple-900/20'  },
  audio:   { label: 'Audio',    icon: Headphones,  color: 'text-amber-400',  bg: 'bg-amber-900/20'   },
};

// ─── Resource card ────────────────────────────────────────────────────────────

function ResourceCard({ resource }) {
  const {
    title,
    description,
    type = 'article',
    url,
    author,
    durationLabel,
    featured = false,
  } = resource;

  const typeConf = TYPE_CONFIG[type] ?? TYPE_CONFIG.article;
  const TypeIcon = typeConf.icon;

  const categoryConf = LIBRARY_CATEGORIES.find((c) => c.id === resource.category);
  const CategoryIcon = categoryConf?.icon ?? BookOpen;

  return (
    <div
      className={`flex flex-col rounded-xl border transition-all hover:border-white/15 ${
        featured
          ? 'border-emerald-500/30 bg-emerald-900/10'
          : 'border-white/8 bg-white/4'
      }`}
    >
      <div className="flex flex-1 flex-col p-4">
        {/* Type badge */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${typeConf.bg} ${typeConf.color}`}>
            <TypeIcon className="h-3 w-3" />
            {typeConf.label}
          </span>
          {featured && (
            <span className="rounded-lg bg-emerald-700/30 px-2 py-1 text-[11px] font-semibold text-emerald-400">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-1.5 text-sm font-semibold text-white leading-snug">{title}</h3>

        {/* Description */}
        {description && (
          <p className="mb-3 flex-1 text-xs text-slate-400 leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          {author && <span>{author}</span>}
          {durationLabel && (
            <>
              {author && <span>·</span>}
              <span>{durationLabel}</span>
            </>
          )}
          {categoryConf && categoryConf.id !== 'all' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <CategoryIcon className="h-2.5 w-2.5" />
                {categoryConf.label}
              </span>
            </>
          )}
        </div>

        {/* Action */}
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
          <div className="rounded-lg bg-white/4 px-3 py-2 text-center text-xs text-slate-600">
            Coming soon
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ category, searchQuery }) {
  return (
    <div className="col-span-full rounded-xl border border-white/8 bg-white/4 py-16 text-center">
      <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-600" />
      {searchQuery ? (
        <>
          <p className="text-sm font-semibold text-slate-300">No results for "{searchQuery}"</p>
          <p className="mt-1 text-xs text-slate-500">Try a different search term.</p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-300">No resources yet in this category</p>
          <p className="mt-1 text-xs text-slate-500">
            Resources will be added here by the SirajOne team.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CounsellingLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = `Islamic Guidance Library — SirajOne`;
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'guidanceResources'),
      orderBy('publishedAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error('[CounsellingLibrary] onSnapshot error:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let list = resources;

    if (activeCategory !== 'all') {
      list = list.filter((r) => r.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.author?.toLowerCase().includes(q)
      );
    }

    // Featured first
    return [...list].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [resources, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0b1a12]">
      <Navbar />
      <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Islamic Guidance Library</h1>
          <p className="mt-1 text-sm text-slate-400">
            Curated Islamic resources for healing, growth, and spiritual strength.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources…"
            className="w-full rounded-xl border border-white/10 bg-white/6 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 sm:max-w-sm"
          />
        </div>

        {/* Category pills — horizontal scroll on mobile */}
        <div className="-mx-4 mb-6 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap sm:flex-nowrap">
            {LIBRARY_CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === id
                    ? 'bg-emerald-700/50 text-emerald-300 ring-1 ring-emerald-500/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/8 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3 w-3 flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Resource grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white/5 h-52" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length > 0 ? (
              filtered.map((r) => <ResourceCard key={r.id} resource={r} />)
            ) : (
              <EmptyState category={activeCategory} searchQuery={searchQuery} />
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-slate-600">
          All resources are vetted by the SirajOne guidance team.
          For personal support, visit the Support tab in Daily Spiritual.
        </p>
      </div>
      </div>
    </div>
  );
}
