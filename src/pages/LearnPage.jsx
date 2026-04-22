import React, { useMemo, useState } from "react";
import { LETTERS } from "../data/tajweedData";

const SIFAAT_TAGS = ["Hams", "Jahr", "Shiddah", "Rikhwah", "Qalqalah", "Tafkhim", "Tarqiq", "Lin"];

function toSearchText(letter) {
  const sifaatText = (letter.sifaat || []).map((s) => `${s.name} ${s.arabic}`).join(" ").toLowerCase();
  return `${letter.arabic} ${letter.name} ${sifaatText}`.toLowerCase();
}

function hasTag(letter, tag) {
  const value = tag.toLowerCase();
  return (letter.sifaat || []).some((s) => s.name.toLowerCase().includes(value));
}

export default function LearnPage() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Sifaat");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredLetters = useMemo(() => {
    return LETTERS.filter((letter) => {
      const matchesQuery = toSearchText(letter).includes(query.toLowerCase());
      const matchesTag = selectedTag === "All Sifaat" || hasTag(letter, selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Interactive Guide</p>
        <h1 className="section-title">Makharij & Sifaat</h1>
        <p className="mt-3 text-muted">Arabic Letter Articulation Guide - 28 Letters</p>
      </div>

      <section className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by letter or name..."
          className="rounded-xl border border-emerald-300/20 bg-slate-900/65 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-emerald-300/45"
        />
        <select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value)}
          className="rounded-xl border border-emerald-300/20 bg-slate-900/65 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-300/45"
        >
          <option>All Sifaat</option>
          {SIFAAT_TAGS.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {filteredLetters.map((letter) => (
          <article key={letter.num} className="panel-base rounded-xl p-3">
            <button type="button" onClick={() => setSelectedLetter(letter)} className="w-full text-left">
              <p className="text-center text-4xl font-bold text-white">{letter.arabic}</p>
              <p className="mt-1 text-center text-sm font-semibold text-slate-200">{letter.name}</p>
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-2 py-1.5 text-xs font-semibold text-emerald-200">
                Listen
              </button>
              <button className="rounded-lg border border-slate-500/40 bg-slate-800/70 px-2 py-1.5 text-xs font-semibold text-slate-200">
                Practice
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="panel-base p-5">
        <h2 className="text-xl font-bold text-white">How to use the practice system</h2>
        <ol className="mt-4 space-y-2 text-sm text-slate-300">
          <li>1. Listen - hear the correct pronunciation.</li>
          <li>2. Repeat - recite immediately after listening.</li>
          <li>3. Record - capture your own voice.</li>
          <li>4. Compare - switch between model and your recording.</li>
          <li>5. Practise again - repeat until stable and clear.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <p className="section-eyebrow text-center">Filter by Sifah</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["All Sifaat", ...SIFAAT_TAGS].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                selectedTag === tag
                  ? "bg-emerald-300 text-slate-900"
                  : "border border-emerald-300/25 bg-slate-900/60 text-slate-200 hover:border-emerald-300/45"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="scroll-thin max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-300/30 bg-slate-950 p-6 shadow-[0_40px_80px_-38px_rgba(16,185,129,0.6)]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-5xl font-bold text-white">{selectedLetter.arabic}</p>
                <p className="mt-2 text-xl font-semibold text-emerald-200">{selectedLetter.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLetter(null)}
                className="rounded-lg border border-slate-500/45 px-3 py-2 text-sm text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <section className="panel-base p-4">
                <h3 className="text-base font-bold text-white">Makhraj Description</h3>
                <p className="mt-2 leading-7">{selectedLetter.makhraj?.desc}</p>
              </section>

              <section className="rounded-xl border border-amber-300/20 bg-amber-500/5 p-4">
                <h3 className="text-base font-bold text-white">Sifaat Description</h3>
                <ul className="mt-2 space-y-2">
                  {(selectedLetter.sifaat || []).map((sifah) => (
                    <li key={`${sifah.arabic}-${sifah.name}`}>
                      • {sifah.name}: {sifah.exp}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-4">
                <h3 className="text-base font-bold text-white">Pronunciation Steps</h3>
                <ol className="mt-2 space-y-2">
                  {(selectedLetter.steps || []).map((step, index) => (
                    <li key={step.label}>
                      #{index + 1} {step.label}: {step.desc}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-xl border border-slate-500/35 bg-slate-900/70 p-4">
                <h3 className="text-base font-bold text-white">Common Mistakes</h3>
                <p className="mt-2 leading-7">
                  Avoid rushing the articulation point. Keep the makhraj exact, do not substitute with nearby letters,
                  and keep the letter quality consistent from start to finish.
                </p>
              </section>

              <section className="rounded-xl border border-slate-500/35 bg-slate-900/70 p-4">
                <h3 className="text-base font-bold text-white">Practice Notes</h3>
                <p className="mt-2 leading-7">
                  Follow the loop: Listen to Record to Replay to Repeat. Use short daily repetitions with teacher
                  guidance for steady improvement.
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
