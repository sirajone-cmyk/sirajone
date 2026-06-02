import React, { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Lock, Search, Sparkles, Unlock } from 'lucide-react';
import { BookReaderModal } from '../components/platform/BookReaderModal';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

function tierBadge(tier) {
  if (tier === 'premium') return { label: 'Premium', tone: 'bg-amber-500/15 text-amber-200' };
  if (tier === 'basic') return { label: 'Basic', tone: 'bg-sky-500/15 text-sky-200' };
  return { label: 'Free', tone: 'bg-emerald-500/15 text-emerald-200' };
}

export default function LibraryPage({ libraryItems = [], onAddLibraryItem, canManage = false }) {
  const { currentUser, visibleLibraryBooks } = usePlatform();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    category: 'Tajweed',
    description: '',
  });

  const items = libraryItems.length > 0 ? libraryItems : visibleLibraryBooks;
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.mainCategory || item.subcategory).filter(Boolean))
    );
    return ['All', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const category = item.mainCategory || item.subcategory || '';
      const fullText = `${item.title} ${item.description} ${category}`.toLowerCase();
      const matchesText = fullText.includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [items, query, selectedCategory]);

  function submitItem(event) {
    event.preventDefault();
    if (!canManage || !draft.title.trim() || !draft.description.trim()) return;

    onAddLibraryItem?.({
      title: draft.title.trim(),
      mainCategory: draft.category,
      subcategory: draft.category,
      description: draft.description.trim(),
      author: 'SirajOne Admin',
      visibility: 'public',
      publishStatus: 'published',
      requiredTier: 'free',
      readerPages: [
        `${draft.title.trim()}\n\n${draft.description.trim()}`,
        'Admin-added resource. Replace with uploaded file or reader pages when backend uploads are connected.',
      ],
    });

    setDraft({ title: '', category: 'Tajweed', description: '' });
    setAdminOpen(false);
  }

  return (
    <div className="space-y-7">
      <div className="section-head">
        <p className="section-eyebrow">Digital Collection</p>
        <h1 className="section-title">Library and books</h1>
        <p className="mt-3 text-muted">
          Students can browse all visible books and resources here. Access level differences are
          explained clearly instead of hidden behind dead controls.
        </p>
      </div>

      <section className="panel-base space-y-4 p-5">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/18 bg-slate-900/50 px-4 py-3">
          <Search size={16} className="text-emerald-300" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search books, topics, and categories"
            className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === category
                  ? 'bg-emerald-300 text-slate-900'
                  : 'border border-emerald-300/25 bg-slate-900/60 text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {canManage ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setAdminOpen((value) => !value)}>
              {adminOpen ? 'Close admin upload' : 'Open admin upload'}
            </Button>

            {adminOpen ? (
              <form
                onSubmit={submitItem}
                className="grid gap-3 rounded-2xl border border-emerald-300/20 bg-slate-900/70 p-4"
              >
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Resource title"
                  className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                />
                <input
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, category: event.target.value }))
                  }
                  placeholder="Category"
                  className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                />
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={3}
                  placeholder="Description"
                  className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                />
                <Button type="submit" variant="primary" size="sm">
                  Save resource
                </Button>
              </form>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-emerald-300/18 bg-slate-950/30 px-4 py-3 text-sm text-slate-300">
            Free and plan-based books are visible here for all authenticated students. Locked items
            are still listed with clear access badges.
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-300/15 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Free content</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Open these resources immediately as part of your starter learning path.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/15 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Locked content</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Locked items still appear clearly so students understand what exists at higher plans.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-300/15 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Reader access</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              Open readable resources directly here instead of landing on placeholder cards.
            </p>
          </div>
        </div>
      </section>

      {filteredItems.length === 0 ? (
        <section className="panel-base p-6">
          <p className="text-lg font-bold text-white">No books match your search yet.</p>
          <p className="mt-2 text-sm text-slate-300">
            Try a different keyword or open the full library categories above.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const tier = tierBadge(item.requiredTier);
            const canOpenReader = Boolean(item.readerPages?.length || item.fileDataUrl || item.fileUrl);

            return (
              <article key={item.id} className="panel-base flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                      {item.mainCategory || item.subcategory || 'Library'}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">{item.author || 'SirajOne'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tier.tone}`}>
                    {tier.label}
                  </span>
                </div>

                <p className="mt-4 flex-1 text-sm leading-7 text-slate-200">{item.description}</p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/15 bg-slate-950/35 px-3 py-1 text-xs text-slate-300">
                    {item.requiredTier === 'free' ? <Unlock size={12} /> : <Lock size={12} />}
                    {item.requiredTier === 'free' ? 'Available now' : `Plan: ${tier.label}`}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tier.tone}`}
                  >
                    {item.requiredTier === 'free' ? 'Free content' : 'Locked until upgrade'}
                  </span>
                  {item.publishStatus === 'published' ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/15 bg-slate-950/35 px-3 py-1 text-xs text-slate-300">
                      <Sparkles size={12} />
                      Published
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {canOpenReader ? (
                    <Button variant="primary" size="sm" onClick={() => setSelectedBook(item)}>
                      <BookOpen size={14} />
                      Read now
                    </Button>
                  ) : null}
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-500/10"
                    >
                      <ExternalLink size={14} />
                      Open file
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}

      <BookReaderModal
        open={Boolean(selectedBook)}
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        currentUser={currentUser}
      />
    </div>
  );
}
