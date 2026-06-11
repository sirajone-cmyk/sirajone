import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, Search, SlidersHorizontal, Languages, MapPin, HeartHandshake, X, Send, Loader2, Users, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { COUNSELLOR_CATEGORIES } from '@/lib/roles';
import { COUNSELLOR_DELIVERY_MODES, normalizeCounsellorName } from '@/lib/counsellorSchema';

const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:bg-white/[0.06]';

const GUIDANCE_DISCLAIMER = 'SirajOne provides Islamic guidance, mentorship, spiritual support, and educational services. SirajOne does not provide emergency services, psychiatric treatment, psychological diagnosis, psychotherapy, or medical care.';

const EMERGENCY_WARNING = 'This form is not monitored as an emergency service. Do not use SirajOne for urgent danger, abuse, suicide risk, self-harm, violence, or medical emergencies. If your situation is urgent, contact your local emergency services, police, ambulance, or a qualified professional immediately.';

const PROVIDER_NOTE = 'This provider is not presented as a medical or psychological practitioner unless separately verified.';

const URGENT_TERMS = ['suicide', 'self-harm', 'self harm', 'kill myself', 'abuse', 'violence', 'immediate danger', 'urgent danger', 'medical emergency'];

function appearsUrgent(value = '') {
  const text = String(value).toLowerCase();
  return URGENT_TERMS.some((term) => text.includes(term));
}

function EmptyState({ title, body }) {
  useEffect(() => { document.title = `Islamic Counsellors | SirajOne — Faith-Based Support`; }, []);

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
  const name = normalizeCounsellorName(counsellor.displayName || counsellor.fullName || 'SirajOne Support Provider', { allowTitle: true });
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
        {counsellor.bio || 'Approved SirajOne support provider profile. More profile details will be added soon.'}
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

      <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-slate-400">{PROVIDER_NOTE}</p>

      <button
        type="button"
        onClick={() => onRequest(counsellor)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
      >
        Request Guidance Support
        <Send className="h-4 w-4" />
      </button>
    </article>
  );
}

/**
 * Two-path Islamic guidance support modal.
 *
 * Step 1 — Path choice:
 *   Path A (Direct)  → writes to `assignments` (status: pending_educator)
 *                    + `counsellingRequests` (backward compat for CounsellorPortal)
 *   Path B (Admin)   → writes to `assignments` (status: pending_admin) only
 *
 * Step 2 — Optional detail form (categories, contact preference, note).
 */
function RequestModal({ counsellor, onClose }) {
  const { user } = useAuth();

  // 'choice' | 'form' | 'success'
  const [stage,   setStage]   = useState('choice');
  const [path,    setPath]    = useState(null);    // 'direct' | 'admin'
  const [form,    setForm]    = useState({ categories: [], preferredContact: 'WhatsApp', note: '', urgentRisk: false, notEmergencyConfirmed: false });
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState('');

  if (!counsellor) return null;

  const counsellorName = normalizeCounsellorName(
    counsellor.displayName || counsellor.fullName || 'SirajOne Support Provider',
    { allowTitle: true },
  );

  const toggleCategory = (category) => {
    setForm((prev) => {
      const current = new Set(prev.categories);
      if (current.has(category)) current.delete(category);
      else current.add(category);
      return { ...prev, categories: Array.from(current) };
    });
  };

  function choosePath(chosen) {
    if (!user?.uid) {
      setError('Please sign in before requesting support.');
      return;
    }
    setPath(chosen);
    setStage('form');
    setError('');
  }

  async function submit(event) {
    event.preventDefault();
    if (!user?.uid) { setError('Please sign in.'); return; }
    if (form.categories.length === 0) { setError('Choose at least one area of guidance.'); return; }
    if (form.urgentRisk || appearsUrgent(form.note)) { setError('This request appears urgent or high-risk. SirajOne is not an emergency service. Please contact local emergency services, police, ambulance, or a qualified professional immediately.'); return; }
    if (!form.notEmergencyConfirmed) { setError('Please confirm this is not an emergency request before submitting.'); return; }

    setBusy(true);
    setError('');

    const isDirect    = path === 'direct';
    const clientName  = user.full_name || user.displayName || user.email || 'SirajOne Guidance Seeker';

    const assignmentPayload = {
      studentId:    user.uid,
      studentName:  clientName,
      assignedId:   isDirect ? counsellor.id   : null,
      assignedName: isDirect ? counsellorName  : null,
      type:         'counsellor',
      status:       isDirect ? 'pending_educator' : 'pending_admin',
      categories:   form.categories,
      preferredContact: form.preferredContact,
      note:         form.note.trim(),
      createdAt:    serverTimestamp(),
      updatedAt:    serverTimestamp(),
    };

    try {
      // Write to assignments (the new central collection)
      await addDoc(collection(db, 'assignments'), assignmentPayload);

      // Write to counsellingRequests (backward compat — CounsellorPortal reads this)
      if (isDirect) {
        await addDoc(collection(db, 'counsellingRequests'), {
          clientId:       user.uid,
          clientName,
          clientEmail:    user.email || '',
          studentId:      user.uid,
          studentName:    clientName,
          studentEmail:   user.email || '',
          requesterRole:  user.role || '',
          counsellorId:   counsellor.id,
          counsellorName,
          categories:     form.categories,
          preferredContact: form.preferredContact,
          note:           form.note.trim(),
          status:         'pending',
          createdAt:      serverTimestamp(),
          updatedAt:      serverTimestamp(),
        });
      }

      setStage('success');
    } catch (err) {
      console.error('[RequestModal] submit error:', err);
      setError(err.message || 'Could not submit your request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#102018] shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Islamic Guidance & Support</p>
            <h2 className="mt-1 text-2xl font-bold text-white">{counsellorName}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Stage: Path choice ── */}
        {stage === 'choice' && (
          <div className="space-y-4 p-5">
            <p className="text-sm leading-6 text-slate-300">
              Would you like to request support from <strong className="text-white">{counsellorName}</strong>{' '}
              directly, or have the Admin assign the best support provider for you?
            </p>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={form.urgentRisk}
                  onChange={(event) => setForm((prev) => ({ ...prev, urgentRisk: event.target.checked }))}
                  className="mt-1"
                />
                <span>I am reporting urgent danger, abuse, suicide risk, self-harm, violence, or a medical emergency.</span>
              </label>
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={form.notEmergencyConfirmed}
                  onChange={(event) => setForm((prev) => ({ ...prev, notEmergencyConfirmed: event.target.checked }))}
                  className="mt-1"
                />
                <span>I understand this is not an emergency service and this request is suitable for Islamic guidance and support.</span>
              </label>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Path A — Direct */}
            <button
              type="button"
              onClick={() => choosePath('direct')}
              className="flex w-full items-start gap-4 rounded-2xl border border-emerald-700/60 bg-emerald-950/50 px-5 py-4 text-left transition hover:border-emerald-600 hover:bg-emerald-950/70"
            >
              <HeartHandshake className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <p className="font-bold text-white">Request guidance from {counsellorName}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  Your request goes directly to this support provider for review and acceptance.
                </p>
              </div>
              <ArrowRight className="ml-auto mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
            </button>

            {/* Path B — Admin */}
            <button
              type="button"
              onClick={() => choosePath('admin')}
              className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/8"
            >
              <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
              <div>
                <p className="font-bold text-white">Let Admin find the best support provider for me</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  SirajOne admin will review your needs and match you with the most suitable support provider.
                </p>
              </div>
              <ArrowRight className="ml-auto mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
            </button>
          </div>
        )}

        {/* ── Stage: Detail form ── */}
        {stage === 'form' && (
          <form onSubmit={submit} className="space-y-5 p-5">
            <p className="text-xs text-slate-500">
              {path === 'direct'
                ? `Your request will be sent directly to ${counsellorName}.`
                : 'SirajOne admin will match you with the best available support provider.'}
            </p>


            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
                <div>
                  <p className="font-bold text-amber-50">Emergency warning</p>
                  <p className="mt-1">{EMERGENCY_WARNING}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-700/40 bg-emerald-950/20 p-4 text-sm leading-6 text-slate-300">
              {GUIDANCE_DISCLAIMER}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Areas of Guidance</label>
              <div className="flex flex-wrap gap-2">
                {COUNSELLOR_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      form.categories.includes(category)
                        ? 'border-emerald-500 bg-emerald-700/50 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-emerald-700 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Preferred Contact</label>
              <select
                className={inputClass}
                value={form.preferredContact}
                onChange={(event) => setForm((prev) => ({ ...prev, preferredContact: event.target.value }))}
              >
                <option>WhatsApp</option>
                <option>Phone</option>
                <option>Email</option>
                <option>Online Session</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Short Note</label>
              <textarea
                className={inputClass}
                rows={4}
                value={form.note}
                onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Briefly describe the Islamic guidance or support you are requesting."
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStage('choice')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {busy ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}

        {/* ── Stage: Success ── */}
        {stage === 'success' && (
          <div className="p-6 text-center">
            <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">
              {path === 'direct' ? 'Request Sent' : 'Matching Request Submitted'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {path === 'direct'
                ? 'Your guidance request has been sent. SirajOne will help manage the next step.'
                : 'The SirajOne team will review your needs and match you with the most suitable support provider.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Done
            </button>
          </div>
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
          <h1 className="mt-3 font-serif text-4xl font-black text-white sm:text-5xl">Islamic Guidance & Support</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-400">
            Browse approved SirajOne support providers and request Islamic guidance in a protected, respectful pathway.
          </p>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#102018] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_160px_150px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input className={`${inputClass} pl-11`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search providers, guidance areas, languages..." />
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
            {loading ? 'Loading support providers...' : `${visibleCounsellors.length} approved support provider profile${visibleCounsellors.length === 1 ? '' : 's'} shown`}
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
            <EmptyState title="No approved support providers found" body="There are no approved support provider profiles matching this filter yet. No placeholder records are shown here." />
          )}
        </section>
      </main>
      <RequestModal counsellor={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
