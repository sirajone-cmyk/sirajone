import React, { useMemo, useState } from "react";
import { LIBRARY_CATEGORIES } from "../data/platformSeed";

export default function LibraryPage({ libraryItems, onAddLibraryItem }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [adminOpen, setAdminOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", category: LIBRARY_CATEGORIES[0], description: "" });

  const filteredItems = useMemo(() => {
    return libraryItems.filter((item) => {
      const fullText = `${item.title} ${item.description}`.toLowerCase();
      const matchesText = fullText.includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesText && matchesCategory;
    });
  }, [libraryItems, query, selectedCategory]);

  function submitItem(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;

    onAddLibraryItem({
      title: draft.title.trim(),
      category: draft.category,
      description: draft.description.trim(),
    });

    setDraft({ title: "", category: LIBRARY_CATEGORIES[0], description: "" });
    setAdminOpen(false);
  }

  return (
    <div className="space-y-7">
      <div className="section-head">
        <p className="section-eyebrow">Digital Collection</p>
        <h1 className="section-title">Islamic Library</h1>
        <p className="mt-3 text-muted">Books, resources, and learning materials for students and families.</p>
      </div>

      <section className="panel-base space-y-4 p-5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books..."
          className="w-full rounded-xl border border-emerald-300/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-emerald-300/45"
        />

        <div className="flex flex-wrap gap-2">
          {["All", ...LIBRARY_CATEGORIES].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategory === category
                  ? "bg-emerald-300 text-slate-900"
                  : "border border-emerald-300/25 bg-slate-900/60 text-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAdminOpen((value) => !value)}
          className="w-full rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-200"
        >
          {adminOpen ? "Close Admin Upload" : "Admin Upload"}
        </button>

        {adminOpen && (
          <form onSubmit={submitItem} className="grid gap-3 rounded-xl border border-emerald-300/20 bg-slate-900/70 p-4">
            <input
              value={draft.title}
              onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Resource title"
              className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <select
              value={draft.category}
              onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
              className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            >
              {LIBRARY_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <textarea
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              rows={3}
              placeholder="Description"
              className="rounded-lg border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
            />
            <button type="submit" className="rounded-lg bg-gradient-to-b from-emerald-300 to-emerald-400 px-4 py-2 text-sm font-extrabold text-slate-900">
              Save Resource
            </button>
          </form>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <article key={`${item.title}-${index}`} className="panel-base p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">{item.category}</p>
            <h2 className="mt-2 text-lg font-bold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
