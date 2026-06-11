import { useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import LetterDrawer from '../components/LetterDrawer';
import useLetterAudio from '../hooks/useLetterAudio';
import AudioPractice from '../components/AudioPractice';
import { LETTERS } from '../data/tajweedData';
import {
  BookOpen,
  Filter,
  GraduationCap,
  Library,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';

const bookLetters = LETTERS.filter((letter) => letter.num <= 28);

const theoryCards = [
  {
    title: 'What is Tajwid?',
    icon: BookOpen,
    text:
      'Tajwid means to make something beautiful and excellent. In Qur’anic recitation, it means giving every letter its full right.',
  },
  {
    title: 'Why Makhraj Matters',
    icon: GraduationCap,
    text:
      'A makhraj is the exact place where a letter is produced. If the place changes, the sound and meaning can change.',
  },
  {
    title: 'What are Sifaat?',
    icon: Sparkles,
    text:
      'Sifaat describe how each sound is made: voiced or whispered, stopped or flowing, heavy or light, open or sealed.',
  },
];

const sifaatColors = {
  'Jahr': 'bg-emerald-100 text-emerald-800',
  'Hams': 'bg-sky-100 text-sky-800',
  'Shiddah': 'bg-red-100 text-red-800',
  'Rikhwah': 'bg-orange-100 text-orange-800',
  'Tawassut': 'bg-yellow-100 text-yellow-800',
  'Tawassuṭ': 'bg-yellow-100 text-yellow-800',
  'Istifal': 'bg-purple-100 text-purple-800',
  'Istifāl': 'bg-purple-100 text-purple-800',
  "Isti'la": 'bg-pink-100 text-pink-800',
  'Istiʿlā': 'bg-pink-100 text-pink-800',
  'Infitah': 'bg-indigo-100 text-indigo-800',
  'Infitāḥ': 'bg-indigo-100 text-indigo-800',
  'Itbaq': 'bg-rose-100 text-rose-800',
  'Iṭbāq': 'bg-rose-100 text-rose-800',
  'Ithlaq': 'bg-teal-100 text-teal-800',
  'Ithlāq': 'bg-teal-100 text-teal-800',
  'Ismaat': 'bg-slate-100 text-slate-700',
  'Iṣmāt': 'bg-slate-100 text-slate-700',
  'Qalqalah': 'bg-amber-100 text-amber-800',
  'Safir': 'bg-cyan-100 text-cyan-800',
  'Ṣafīr': 'bg-cyan-100 text-cyan-800',
  'Ghunnah': 'bg-violet-100 text-violet-800',
  'Tafashshi': 'bg-lime-100 text-lime-800',
  'Takrir': 'bg-fuchsia-100 text-fuchsia-800',
  'Takrīr': 'bg-fuchsia-100 text-fuchsia-800',
  'Inhiraf': 'bg-green-100 text-green-800',
  'Inḥirāf': 'bg-green-100 text-green-800',
  'Lin': 'bg-blue-100 text-blue-800',
  'Līn': 'bg-blue-100 text-blue-800',
  'Istitalah': 'bg-red-100 text-red-800',
  'Isṭilāh': 'bg-red-100 text-red-800',
  'Isṭilāta': 'bg-red-100 text-red-800',
};

const glossary = [
  { name: 'Jahr', meaning: 'Voiced', detail: 'The breath is withheld and the vocal cords vibrate.' },
  { name: 'Hams', meaning: 'Whispered', detail: 'The breath flows freely with a soft, breathy sound.' },
  { name: 'Shiddah', meaning: 'Full stop', detail: 'The sound is completely blocked at the makhraj before release.' },
  { name: 'Rikhwah', meaning: 'Flowing', detail: 'The sound flows continuously through the makhraj.' },
  { name: 'Qalqalah', meaning: 'Echo bounce', detail: 'A slight bounce heard when one of its letters has sukun.' },
  { name: 'Safir', meaning: 'Whistle', detail: 'A natural hissing or whistling quality.' },
];

function sifahName(item) {
  return (item.name || '').split('—')[0].split('/')[0].trim();
}

function colorForSifah(name) {
  return sifaatColors[name] || 'bg-white/10 text-slate-200';
}

function letterSearchText(letter) {
  return [
    letter.arabic,
    letter.name,
    letter.makhraj?.desc,
    ...(letter.makhraj?.how || []),
    ...(letter.makhraj?.notes || []),
    ...(letter.sifaat || []).flatMap((item) => [item.name, item.arabic, item.exp]),
  ]
    .join(' ')
    .toLowerCase();
}

export default function LetterCatalog() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterSifah, setFilterSifah] = useState('');
  const [practiceMode, setPracticeMode] = useState(null);
  const { playLetterAudio, isLoadingCurrent, isPlayingCurrent, isErrorCurrent } = useLetterAudio();

  const allSifaat = useMemo(() => {
    return [...new Set(bookLetters.flatMap((letter) => letter.sifaat.map(sifahName)))].sort();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookLetters.filter((letter) => {
      const matchSearch = query ? letterSearchText(letter).includes(query) : true;
      const matchSifah = filterSifah
        ? letter.sifaat.some((item) => sifahName(item) === filterSifah)
        : true;
      return matchSearch && matchSifah;
    });
  }, [filterSifah, search]);

  const openPractice = (letter) => {
    setPracticeMode({
      ...letter,
      makhraj: letter.makhraj?.desc || '',
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      {practiceMode && <AudioPractice letter={practiceMode} onClose={() => setPracticeMode(null)} />}

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.045] to-emerald-950/50 p-6 sm:p-8 mb-6 shadow-2xl shadow-black/20">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
          <div className="relative">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Master Your Makhraj</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight text-white">
                Makhraj & Sifaat
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-slate-300">
                A book-style interactive guide based on the Makhraj theory notes: learn where each letter comes from, how it is produced, its sifaat, and the practical steps for correction.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3 mb-6">
          {theoryCards.map(({ title, text, icon: Icon }) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <Icon className="mb-3 h-5 w-5 text-emerald-300" />
              <h2 className="font-bold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 sm:p-5 mb-6">
          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <label className="relative block">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by letter, name, makhraj, or sifah..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>

            <label className="relative block">
              <Filter className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                value={filterSifah}
                onChange={(event) => setFilterSifah(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="" className="bg-slate-950 text-white">All Sifaat</option>
                {allSifaat.map((sifah) => (
                  <option key={sifah} value={sifah} className="bg-slate-950 text-white">
                    {sifah}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 mb-8">
          {filtered.map((letter) => (
            <article key={letter.num} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition hover:border-emerald-300/35 hover:bg-emerald-400/10">
              <button
                type="button"
                onClick={() => setSelected(letter)}
                className="w-full p-4 text-center transition hover:bg-white/5"
              >
                <div className="font-arabic text-5xl font-bold leading-none text-white" dir="rtl" lang="ar">
                  {letter.arabic}
                </div>
                <div className="mt-2 text-sm font-bold text-white">{letter.name}</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Letter {letter.num}
                </div>
              </button>

              <div className="grid grid-cols-2 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => playLetterAudio(letter)}
                  disabled={isLoadingCurrent(letter)}
                  title={
                    isErrorCurrent(letter) ? 'Audio unavailable' :
                    isPlayingCurrent(letter) ? 'Playing' :
                    isLoadingCurrent(letter) ? 'Loading…' : 'Listen'
                  }
                  className={`flex items-center justify-center gap-1 py-2 text-xs transition-colors border-r border-white/8 ${
                    isErrorCurrent(letter)
                      ? 'text-red-400/60 cursor-not-allowed'
                      : isPlayingCurrent(letter)
                        ? 'bg-emerald-900/40 text-emerald-300'
                        : 'text-slate-500 hover:bg-emerald-900/20 hover:text-emerald-300'
                  }`}
                >
                  {isLoadingCurrent(letter) ? (
                    <span className="flex h-3.5 w-3.5 items-center justify-center">
                      <span className="block h-2.5 w-2.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                    </span>
                  ) : (
                    <Volume2 className={`h-3.5 w-3.5 ${isErrorCurrent(letter) ? 'opacity-40' : ''}`} />
                  )}
                  <span className="hidden sm:inline text-[10px]">
                    {isLoadingCurrent(letter)
                      ? 'Loading…'
                      : isErrorCurrent(letter)
                        ? 'Unavailable'
                        : isPlayingCurrent(letter)
                          ? 'Playing'
                          : 'Listen'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openPractice(letter)}
                  title="Practice"
                  className="flex items-center justify-center gap-1 py-2 text-xs text-slate-500 transition-colors hover:bg-amber-900/20 hover:text-amber-300"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-[10px]">Practise</span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6 mb-8">
          <div className="mb-5 flex items-center gap-3">
            <Library className="h-5 w-5 text-emerald-300" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Glossary of Sifaat</p>
              <h2 className="mt-1 text-2xl font-black text-white">Core qualities from the book</h2>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {glossary.map((item) => (
              <article key={item.name} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${colorForSifah(item.name)}`}>
                  {item.name}
                </span>
                <h3 className="mt-3 font-bold text-white">{item.meaning}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Source Note</p>
          <p className="mt-2 text-sm leading-7 text-emerald-50/80">
            Content is adapted into app format from <strong>Master Your Makhraj: Sounds of the Qur’an</strong>, based on al-Muqaddimah al-Jazariyyah by Imam Ibn al-Jazari. This app guide remains a companion to teacher-led correction.
          </p>
        </section>
      </main>

      <LetterDrawer letter={selected} onClose={() => setSelected(null)} colorForSifah={colorForSifah} />
    </div>
  );
}

