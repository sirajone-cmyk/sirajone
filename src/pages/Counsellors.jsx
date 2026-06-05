import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { Search, SlidersHorizontal, Languages, Video, MapPin, HeartHandshake, X, Send, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { COUNSELLOR_CATEGORIES } from '@/lib/roles';
import { COUNSELLOR_DELIVERY_MODES, normalizeCounsellorName } from '@/lib/counsellorSchema';

const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:bg-white/[0.06]';

function EmptyState({ title, body }) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-800/60 bg-white/[0.03] px-6 py-12 text-center">
      <HeartHandshake className="mx-auto mb-4 h-10 w-10 text-emerald-500/80" />
      <h3 className="font-serif text-2xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">{body}</p>
      <a
        href="mailto:sirajone7@gmail.com"
        className="mt-6 inline-flex rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
      >
        Contact SirajOne
      </a>
    </div>
  );
}

function readableDelivery(profile) {
  const modes = profile.serviceDeliveryModes || {};
  return COUNSELLOR_DELIVERY_MODES.filter((mode) => modes[mode.key]).map((mode) => mode.label);
}

function CounsellorCard({ counsellor, onRequest }) {
  const name = normalizeCounsellorName(counsellor.displayName || counsellor.fullName || 'SirajOne Counsellor', { allowTitle: true });
  const delivery = readableDelivery(counsellor);

  return (
    <article className="rounded-3xl border border-white/10 bg-[#102018] p-5 shadow-xl shadow-black/20 transition hover:border-emerald-600/60">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-700/50 bg-emerald-950/60 text-lg font-black text-emerald-300">
          {counsellor.profilePhoto ? (
            <img src={counsellor.profilePhoto} alt="" className="h-full w-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-white">{name}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
            {(counsellor.city || counsellor.country) && (
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {[counsellor.city, counsellor.country].filter(Boolean).join(', ')}</span>
            )}
            {Array.isArray(counsellor.languagesSpoken) && counsellor.languagesSpoken.length > 0 && (
              <span className="inline-flex items-center gap-1"><Languages className="h-3 w-3" /> {counsellor.languagesSpoken.join(', ')}</span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-300">
        {counsellor.bio || 'Approved SirajOne counsellor profile. More profile details will be added soon.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(counsellor.categories || []).slice(0, 4).map((category) => (
          <span key={category} className="rounded-full border border-emerald-800/70 bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            {category}
          </span>
        ))}
        {(counsellor.categories || []).length > 4 && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-400">
            +{counsellor.categories.length - 4} more
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {delivery.length > 0 ? delivery.map((mode) => (
          <span key={mode} className="rounded-full border border-sky-800/50 bg-sky-950/30 px-2.5 py-1 text-xs font-semibold text-sky-300">
            {mode}
          </span>
        )) : <span className="text-xs text-slate-500">Delivery modes not listed yet</span>}
      </div>

      <button
        type="button"
        onClick={() => onRequest(counsellor)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
      >
        Request Counselling Support
        <Send className="h-4 w-4" />
      </button>
    </article>
  );
}

function RequestModal({ counsellor, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ categories: [], preferredContact: 'WhatsApp', note: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!counsellor) return null;

  const toggleCategory = (category) => {
    setForm((prev) => {
      const current = new Set(prev.categories);
      if (current.has(category)) current.delete(category);
      else current.add(category);
      return { ...prev, categories: Array.from(current) };
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!user?.uid) {
      setError('Please sign in before requesting support.');
      return;
    }
    if (form.categories.length === 0) {
      setError('Choose at least one support category.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await addDoc(collection(db, 'counsellingRequests'), {
        studentId: user.uid,
        studentName: user.full_name || user.name || user.email || 'SirajOne Student',
        studentEmail: user.email || '',
        counsellorId: counsellor.id,
        counsellorName: normalizeCounsellorName(counsellor.displayName || counsellor.fullName || 'SirajOne Counsellor', { allowTitle: true }),
        categories: form.categories,
        preferredContact: form.preferredContact,
        note: form.note.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not submit counselling request.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#102018] shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Counselling Support</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{normalizeCounsellorName(counsellor.displayName || counsellor.fullName, { allowTitle: true })}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">Request Sent</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Your support request has been sent. SirajOne will help manage the next step.</p>
            <button type="button" onClick={onClose} className="mt-6 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5 p-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Support Categories</label>
              <div className="flex flex-wrap gap-2">
                {COUNSELLOR_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${form.categories.includes(category) ? 'border-emerald-500 bg-emerald-700/50 text-white' : 'border-white/10 bg-white/5 text-slate-400 hover:border-emerald-700 hover:text-white'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Preferred Contact</label>
              <select className={inputClass} value={form.preferredContact} onChange={(event) => setForm((prev) => ({ ...prev, preferredContact: event.target.value }))}>
                <option>WhatsApp</option>
                <option>Phone</option>
                <option>Email</option>
                <option>Online Session</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Short Note</label>
              <textarea className={inputClass} rows={4} value={form.note} onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))} placeholder="Briefly describe what support you need." />
            </div>
            {error && <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</div>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Counsellors() {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [delivery, setDelivery] = useState('all');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('name');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'counsellors'), (snapshot) => {
      setCounsellors(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const languages = useMemo(() => {
    const values = new Set();
    counsellors.forEach((item) => (item.languagesSpoken || []).forEach((lang) => values.add(lang)));
    return Array.from(values).sort();
  }, [counsellors]);

  const visibleCounsellors = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = counsellors
      .filter((item) => item.profileStatus === 'approved')
      .filter((item) => {
        const searchable = [item.displayName, item.fullName, item.bio, item.city, item.country, ...(item.categories || []), ...(item.languagesSpoken || [])].join(' ').toLowerCase();
        if (term && !searchable.includes(term)) return false;
        if (category !== 'all' && !(item.categories || []).includes(category)) return false;
        if (delivery !== 'all' && !item.serviceDeliveryModes?.[delivery]) return false;
        if (language && !(item.languagesSpoken || []).some((lang) => lang.toLowerCase() === language.toLowerCase())) return false;
        return true;
      });

    return filtered.sort((a, b) => {
      if (sort === 'city') return String(a.city || '').localeCompare(String(b.city || ''));
      return String(a.displayName || a.fullName || '').localeCompare(String(b.displayName || b.fullName || ''));
    });
  }, [counsellors, search, category, delivery, language, sort]);

  return (
    <div className="min-h-screen bg-[#07150d] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <section className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">Support Network</p>
          <h1 className="mt-3 font-serif text-4xl font-black text-white sm:text-5xl">Counsellors</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Browse approved SirajOne counsellors and request support in a protected, respectful pathway.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#102018] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_160px_150px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input className={`${inputClass} pl-11`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search counsellors, categories, languages..." />
            </div>
            <select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All Categories</option>
              {COUNSELLOR_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className={inputClass} value={delivery} onChange={(event) => setDelivery(event.target.value)}>
              <option value="all">All Delivery</option>
              {COUNSELLOR_DELIVERY_MODES.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
            <select className={inputClass} value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="">All Languages</option>
              {languages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className={inputClass} value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="name">Sort Name</option>
              <option value="city">Sort City</option>
            </select>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            {loading ? 'Loading counsellors...' : `${visibleCounsellors.length} approved counsellor profile${visibleCounsellors.length === 1 ? '' : 's'} shown`}
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>
          ) : visibleCounsellors.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleCounsellors.map((counsellor) => <CounsellorCard key={counsellor.id} counsellor={counsellor} onRequest={setSelected} />)}
            </div>
          ) : (
            <EmptyState title="No approved counsellors found" body="There are no approved counsellor profiles matching this filter yet. No placeholder records are shown here." />
          )}
        </section>
      </main>
      <RequestModal counsellor={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
