/**
 * QuranLog — daily Quran recitation log form.
 *
 * Fields: pages, minutes, juz (optional), personal notes (private).
 * Saved to Firestore on submit. Loads today's log on mount.
 */

import { useState, useEffect } from 'react';
import { useQuranLog } from '@/hooks/useQuranLog';
import { useAuth } from '@/lib/AuthContext';

const JUZ_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function QuranLog() {
  const { user } = useAuth();
  const { log, fetchLog, saveLog, loading } = useQuranLog(user?.uid);

  const [pages, setPages] = useState('');
  const [minutes, setMinutes] = useState('');
  const [juz, setJuz] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Populate form when log loads
  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  useEffect(() => {
    setPages(log.pages > 0 ? String(log.pages) : '');
    setMinutes(log.minutes > 0 ? String(log.minutes) : '');
    setJuz(log.juz ? String(log.juz) : '');
    setNotes(log.notes ?? '');
  }, [log]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveLog({
      pages: parseInt(pages, 10) || 0,
      minutes: parseInt(minutes, 10) || 0,
      juz: juz ? parseInt(juz, 10) : null,
      notes: notes.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return <div className="animate-pulse rounded-2xl bg-white/5 p-6 h-48" />;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white">Quran Recitation</h3>
        <p className="text-xs text-slate-400 mt-0.5">Log today's tilawah — private to you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Pages */}
          <div>
            <label htmlFor="q-pages" className="mb-1 block text-xs font-medium text-slate-300">
              Pages
            </label>
            <input
              id="q-pages"
              type="number"
              min="0"
              max="604"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          {/* Minutes */}
          <div>
            <label htmlFor="q-minutes" className="mb-1 block text-xs font-medium text-slate-300">
              Minutes
            </label>
            <input
              id="q-minutes"
              type="number"
              min="0"
              max="1440"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Juz */}
        <div>
          <label htmlFor="q-juz" className="mb-1 block text-xs font-medium text-slate-300">
            Juz <span className="text-slate-500">(optional)</span>
          </label>
          <select
            id="q-juz"
            value={juz}
            onChange={(e) => setJuz(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0b1a12] px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
          >
            <option value="">— Select Juz —</option>
            {JUZ_OPTIONS.map((n) => (
              <option key={n} value={n}>
                Juz {n}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="q-notes" className="mb-1 block text-xs font-medium text-slate-300">
            Personal reflection <span className="text-slate-500">(private)</span>
          </label>
          <textarea
            id="q-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you reflect on today…"
            maxLength={500}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
        >
          {saved ? '✓ Saved' : 'Save Today\'s Log'}
        </button>
      </form>
    </div>
  );
}
