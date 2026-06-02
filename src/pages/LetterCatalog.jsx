import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import LetterDrawer from '../components/LetterDrawer';
import AudioPractice from '../components/AudioPractice';
import { letters, sifaatColors } from '../lib/lettersData';
import { Volume2, BookOpen } from 'lucide-react';

function useArabicSpeech() {
  const [speaking, setSpeaking] = useState(null);
  const speak = useCallback((text, id) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speaking === id) { setSpeaking(null); return; }
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ar-SA'; utt.rate = 0.65;
    utt.onstart = () => setSpeaking(id);
    utt.onend = () => setSpeaking(null);
    utt.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(utt);
  }, [speaking]);
  return { speak, speaking };
}

export default function LetterCatalog() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterSifah, setFilterSifah] = useState('');
  const [practiceMode, setPracticeMode] = useState(null);
  const { speak, speaking } = useArabicSpeech();

  const allSifaat = [...new Set(letters.flatMap(l => l.sifaat))].sort();
  const filtered = letters.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.arabic.includes(search);
    const matchSifah = filterSifah ? l.sifaat.includes(filterSifah) : true;
    return matchSearch && matchSifah;
  });

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      {practiceMode && <AudioPractice letter={practiceMode} onClose={() => setPracticeMode(null)} />}

      <div className="text-center py-10 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Interactive Guide</span>
        <h1 className="text-4xl font-bold mt-3 mb-2">Makhraj & Sifaat</h1>
        <p className="text-slate-400 text-lg">Arabic Letter Articulation Guide · 28 Letters</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Search by letter or name..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <select value={filterSifah} onChange={e => setFilterSifah(e.target.value)}
          className="bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">All Sifaat</option>
          {allSifaat.map(s => <option key={s} value={s} className="text-black bg-white">{s}</option>)}
        </select>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-8">
          {filtered.map(l => (
            <div key={l.arabic} className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all overflow-hidden">
              <button onClick={() => setSelected(l)} className="w-full p-3 text-center hover:bg-white/5 transition-colors">
                <div className="text-3xl font-bold mb-1">{l.arabic}</div>
                <div className="text-xs text-slate-400">{l.name}</div>
              </button>
              <div className="border-t border-white/8 grid grid-cols-2">
                <button onClick={() => speak(l.arabic, l.arabic)} title="Listen"
                  className={`py-1.5 flex items-center justify-center gap-1 text-xs transition-colors border-r border-white/8 ${speaking === l.arabic ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-900/20'}`}>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Listen</span>
                </button>
                <button onClick={() => setPracticeMode(l)} title="Practice"
                  className="py-1.5 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-amber-400 hover:bg-amber-900/20 transition-colors">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Practise</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h3 className="text-center text-slate-500 text-xs uppercase tracking-widest mb-4">Filter by Sifah</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {allSifaat.map(s => (
              <button key={s} onClick={() => setFilterSifah(filterSifah === s ? '' : s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition-all ${filterSifah === s ? 'border-emerald-400 scale-105' : 'border-transparent'} ${sifaatColors[s] || 'bg-gray-100 text-gray-700'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <LetterDrawer letter={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
