import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, Search, Plus, X, Loader } from 'lucide-react';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { STORY_BOOKS } from '../data/storyBooks';
import { DUA_BOOKS } from '../data/duaBooks';

const CATEGORIES = ['Story Books','Dua Books','Fiqh Books','Qaidah Books','Tajwid Books','Scholars of Hadith','Scholars of Tafsir','Sahabah Series','Life of the Prophet','Other'];
const ICONS = { 'Story Books':'📖','Dua Books':'🤲','Fiqh Books':'⚖️','Qaidah Books':'ق','Tajwid Books':'🎙️','Scholars of Hadith':'📜','Scholars of Tafsir':'📚','Sahabah Series':'⭐','Life of the Prophet':'🕌','Other':'📄' };

function UploadModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title:'', category:CATEGORIES[0], description:'', author:'', language:'English', audience:'All' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title) return;
    setLoading(true);
    let file_url = '';
    if (file) {
      const storageRef = ref(storage, `library/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      file_url = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db, 'library'), { ...form, file_url, is_published: true, created_at: serverTimestamp() });
    setLoading(false);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f2318] border border-emerald-900 rounded-3xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-lg">Upload Library Item</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <input className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Title *" value={form.title} onChange={e => set('title', e.target.value)} />
        <select className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0f2318]">{c}</option>)}
        </select>
        <input className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Author (optional)" value={form.author} onChange={e => set('author', e.target.value)} />
        <textarea className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none" rows={2} placeholder="Description (optional)" value={form.description} onChange={e => set('description', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <select className="bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none text-sm" value={form.language} onChange={e => set('language', e.target.value)}>
            {['English','Arabic','Urdu','Both'].map(l => <option key={l} value={l} className="bg-[#0f2318]">{l}</option>)}
          </select>
          <select className="bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 text-white focus:outline-none text-sm" value={form.audience} onChange={e => set('audience', e.target.value)}>
            {['All','Children','Adults','Brothers','Sisters'].map(a => <option key={a} value={a} className="bg-[#0f2318]">{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-2">Upload PDF / Document</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={e => setFile(e.target.files[0])} className="w-full text-sm text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:text-white file:text-xs file:cursor-pointer" />
        </div>
        <button onClick={handleSave} disabled={loading || !form.title} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><Loader className="w-4 h-4 animate-spin" /> Uploading...</> : 'Save to Library'}
        </button>
      </div>
    </div>
  );
}

function StoryReader({ book, onClose }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const sections = book.sections || [];
  const section = sections[sectionIndex] || sections[0];
  const canGoBack = sectionIndex > 0;
  const canGoNext = sectionIndex < sections.length - 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!section) return null;

  const isArabic = (text) => /[\u0600-\u06ff]/.test(text);
  const isMostlyArabic = (text) => {
    const arabicCount = (text.match(/[\u0600-\u06ff]/g) || []).length;
    const latinCount = (text.match(/[A-Za-z]/g) || []).length;
    return arabicCount > 0 && arabicCount >= latinCount;
  };
  const readerLines = section.paragraphs
    .flatMap((paragraph) => paragraph.split('\n').map((line) => line.trim()).filter(Boolean))
    .filter((line, index, lines) => line !== section.title && line !== lines[index - 1]);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-3 sm:p-5">
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-emerald-300/20 bg-[#0d1f16] shadow-2xl shadow-black/40">
        <header className="border-b border-white/10 bg-[#10271b] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{book.category || 'Library Book'}</p>
              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">{book.title}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {book.author} · {book.audience} · {sectionIndex + 1}/{sections.length}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close reader"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f7f2e8] px-4 py-6 text-slate-900 sm:px-8">
          <article className="mx-auto max-w-3xl rounded-2xl border border-amber-900/10 bg-[#fffaf0] px-5 py-7 shadow-xl shadow-amber-950/10 sm:px-10 sm:py-10">
            <div className="mx-auto mb-8 flex max-w-xs items-center justify-center gap-3 text-amber-700/60">
              <span className="h-px flex-1 bg-amber-700/30" />
              <span className="h-2 w-2 rotate-45 border border-amber-700/50" />
              <span className="h-px flex-1 bg-amber-700/30" />
            </div>
            <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-amber-700">
              {book.tone}
            </p>
            <h3 className="mt-3 text-center text-3xl font-black text-slate-950">{section.title}</h3>
            <div className="mt-8 space-y-5 text-lg leading-8 text-slate-800">
              {readerLines.map((line, index) => {
                const arabicLine = isMostlyArabic(line);
                return (
                  <p
                    key={`${section.title}-${index}`}
                    className={arabicLine ? 'text-right font-arabic text-2xl leading-[2.7rem] tracking-normal' : 'text-left'}
                    dir={arabicLine ? 'rtl' : 'ltr'}
                    lang={arabicLine ? 'ar' : 'en'}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </article>
        </main>

        <footer className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#10271b] px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSectionIndex((current) => Math.max(0, current - 1))}
            disabled={!canGoBack}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {sectionIndex + 1} of {sections.length}
          </span>
          <button
            type="button"
            onClick={() => setSectionIndex((current) => Math.min(sections.length - 1, current + 1))}
            disabled={!canGoNext}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function Library() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Co-Admin';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'library'), where('is_published', '==', true)));
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const libraryItems = [...STORY_BOOKS, ...DUA_BOOKS, ...items];

  const filtered = libraryItems.filter(i => {
    const matchCat = activeCategory ? i.category === activeCategory : true;
    const searchText = [i.title, i.author, i.description, i.tone].join(' ').toLowerCase();
    const matchSearch = search ? searchText.includes(search.toLowerCase()) : true;
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      {showUpload && isAdmin && <UploadModal onClose={() => setShowUpload(false)} onSaved={load} />}
      {selectedStory && <StoryReader book={selectedStory} onClose={() => setSelectedStory(null)} />}

      <div className="text-center py-12 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Digital Collection</span>
        <h1 className="text-4xl font-bold mt-3 mb-2">Islamic Library</h1>
        <p className="text-slate-400">Books, resources, and learning materials for students</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search books..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/8 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
          {isAdmin && (
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all">
              <Plus className="w-4 h-4" /> Upload Book
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setActiveCategory('')} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${!activeCategory ? 'bg-emerald-700 text-white' : 'bg-white/8 border border-white/10 text-slate-400 hover:text-white'}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(activeCategory === c ? '' : c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === c ? 'bg-emerald-700 text-white' : 'bg-white/8 border border-white/10 text-slate-400 hover:text-white'}`}>
              {ICONS[c]} {c}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-16"><Loader className="w-6 h-6 text-emerald-400 animate-spin mx-auto" /></div>}

        {!loading && libraryItems.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">Library is empty</p>
            {isAdmin ? <p className="text-sm">Click "Upload Book" to add your first resource.</p> : <p className="text-sm">Check back soon — resources will be added here.</p>}
          </div>
        )}

        <div className="space-y-10">
          {Object.entries(grouped).map(([cat, catItems]) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{ICONS[cat]}</span>
                <h2 className="font-bold text-lg text-white">{cat}</h2>
                <span className="text-xs text-slate-500">{catItems.length} item{catItems.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catItems.map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col hover:bg-white/8 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-lg flex-shrink-0">{ICONS[item.category]}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm leading-tight truncate">{item.title}</h3>
                        {item.author && <p className="text-slate-500 text-xs mt-0.5">{item.author}</p>}
                      </div>
                    </div>
                    {item.description && <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1">{item.description}</p>}
                    <div className="flex items-center gap-2 mt-auto">
                      {item.audience && item.audience !== 'All' && <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-slate-400">{item.audience}</span>}
                      {item.language && <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-slate-400">{item.language}</span>}
                      {item.sections?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedStory(item)}
                          className="ml-auto flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
                        >
                          Read <BookOpen className="w-3 h-3" />
                        </button>
                      )}
                      {item.file_url && (
                        <a href={item.file_url} target="_blank" rel="noreferrer" className={`${item.sections?.length > 0 ? '' : 'ml-auto'} flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors`}>
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
