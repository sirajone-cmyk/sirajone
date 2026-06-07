import { useEffect, useMemo, useState } from 'react';
import {
  addDoc, collection, doc, getDoc, onSnapshot,
  query, serverTimestamp, updateDoc, where,
} from 'firebase/firestore';
import {
  AlertTriangle, Bell, BookOpen, Calendar, CalendarCheck,
  CheckCircle2, ChevronRight, ClipboardList, Clock, ExternalLink,
  FileText, Inbox, MessageCircle, Plus, Send, Shield,
  Users, X, Zap,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { ROLES } from '@/lib/roles';

/* ─── Constants ─────────────────────────────────────────────── */
const SESSION_TYPES = ['Online', 'In-Person', 'Phone', 'WhatsApp', 'Group Session'];
const RESOURCE_TYPES = ['Article', 'Video', 'PDF', 'Audio', 'Du\'a', 'Qur\'an', 'Other'];
const NOTE_CATEGORIES = ['Session', 'Assessment', 'Crisis', 'Progress', 'Referral', 'Closure'];
const FOLLOW_UP_TYPES = ['Check-in Call', 'Document Request', 'Referral', 'Crisis Review', 'General'];
const CLIENT_TABS = ['Overview', 'Sessions', 'Notes', 'Messages', 'Resources', 'Follow-Ups'];

/* ─── Helpers ────────────────────────────────────────────────── */
function toDate(v) {
  if (!v) return null;
  if (typeof v.toDate === 'function') return v.toDate();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(v, opts = {}) {
  const d = toDate(v);
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: opts.time ? '2-digit' : undefined,
    minute: opts.time ? '2-digit' : undefined,
    ...opts,
  }).format(d);
}

function sortRecent(a, b) {
  return (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0);
}

function isToday(v) {
  const d = toDate(v);
  if (!d) return false;
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

/* ─── Sub-components ─────────────────────────────────────────── */
function EmptyState({ icon: Icon = ClipboardList, title, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
      <Icon className="mx-auto h-7 w-7 text-slate-600" />
      <p className="mt-3 font-bold text-white">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone = 'sky', pulse }) {
  const cls = tone === 'amber' ? 'text-amber-300' : tone === 'emerald' ? 'text-emerald-300' : tone === 'rose' ? 'text-rose-300' : 'text-sky-300';
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${cls}`} />
        {pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />}
      </div>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</p>
    </div>
  );
}

function Badge({ label, tone = 'slate' }) {
  const cls = {
    sky: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
    amber: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    rose: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
    slate: 'border-white/10 bg-white/[0.04] text-slate-400',
  }[tone] || 'border-white/10 bg-white/[0.04] text-slate-400';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-black ${cls}`}>{label}</span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0d1b29] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-black text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>}
      <input {...props} className="w-full rounded-xl border border-white/10 bg-[#08121a] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>}
      <select {...props} className="w-full rounded-xl border border-white/10 bg-[#08121a] px-4 py-2.5 text-sm text-white outline-none focus:border-sky-400">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">{label}</label>}
      <textarea {...props} className="w-full rounded-xl border border-white/10 bg-[#08121a] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400" />
    </div>
  );
}

function PrimaryBtn({ children, disabled, onClick, tone = 'sky', className = '' }) {
  const cls = tone === 'amber'
    ? 'bg-amber-400 text-[#0a0800] hover:bg-amber-300'
    : tone === 'emerald'
      ? 'bg-emerald-500 text-[#03140c] hover:bg-emerald-400'
      : tone === 'rose'
        ? 'bg-rose-500 text-white hover:bg-rose-400'
        : 'bg-sky-500 text-white hover:bg-sky-400';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3 text-sm font-black transition disabled:opacity-40 ${cls} ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function CounsellorPortal() {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;

  /* profile */
  const [profile, setProfile] = useState(null);

  /* live data */
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [sessionNotes, setSessionNotes] = useState([]);

  /* UI */
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [busy, setBusy] = useState(false);

  /* modals */
  const [modal, setModal] = useState(null); // 'session' | 'note' | 'resource' | 'broadcast' | 'followup' | 'close'

  /* forms */
  const [sessionForm, setSessionForm] = useState({ date: '', type: 'Online', notes: '', duration: '60' });
  const [noteForm, setNoteForm] = useState({ content: '', category: 'Session', mood: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', url: '', note: '', type: 'Article' });
  const [broadcastForm, setBroadcastForm] = useState({ title: '', body: '', audience: 'Clients' });
  const [followUpForm, setFollowUpForm] = useState({ note: '', type: 'Check-in Call', dueDate: '' });
  const [messageText, setMessageText] = useState('');

  /* ── Load profile ── */
  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    getDoc(doc(db, 'counsellors', user.uid)).then((snap) => {
      if (active && snap.exists()) setProfile({ id: snap.id, ...snap.data() });
    });
    return () => { active = false; };
  }, [user?.uid]);

  /* ── Live Firestore watchers ── */
  useEffect(() => {
    if (!user?.uid) return;
    const scoped = (col) => isAdmin
      ? collection(db, col)
      : query(collection(db, col), where('counsellorId', '==', user.uid));

    const unsubs = [
      onSnapshot(scoped('counsellingRequests'), (s) => setRequests(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingSessions'), (s) => setSessions(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingMessages'), (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingResources'), (s) => setResources(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('session_notes'), (s) => setSessionNotes(s.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
    ];
    return () => unsubs.forEach((u) => u());
  }, [isAdmin, user?.uid]);

  /* ── Derived: clients map ── */
  const clients = useMemo(() => {
    const map = new Map();
    const ensure = (id, patch = {}) => {
      if (!id) return null;
      if (!map.has(id)) map.set(id, {
        id,
        name: 'Counselling Client',
        email: '',
        requestId: null,
        requestStatus: 'active',
        followUpPending: false,
        sessionCount: 0,
        unreadMessages: 0,
        lastSessionDate: null,
        isPending: false,
      });
      const c = map.get(id);
      if (patch.name && patch.name !== 'Counselling Client') c.name = patch.name;
      if (patch.email) c.email = patch.email;
      if (patch.requestId) c.requestId = patch.requestId;
      if (patch.requestStatus) c.requestStatus = patch.requestStatus;
      if (patch.followUpPending) c.followUpPending = true;
      if (patch.isPending) c.isPending = true;
      return c;
    };
    requests.forEach((r) => {
      const id = r.clientId || r.studentId;
      const c = ensure(id, {
        name: r.clientName || r.studentName,
        email: r.clientEmail || r.studentEmail,
        requestId: r.id,
        requestStatus: r.status,
        followUpPending: r.followUpPending,
        isPending: r.status === 'pending',
      });
      if (c && r.status === 'pending' && !c.requestId) c.requestId = r.id;
    });
    sessions.forEach((s) => {
      const id = s.clientId || s.studentId;
      const c = ensure(id, { name: s.clientName || s.studentName, email: s.clientEmail || s.studentEmail });
      if (!c) return;
      c.sessionCount += 1;
      const d = toDate(s.sessionDate || s.date);
      if (d && (!c.lastSessionDate || d > c.lastSessionDate)) c.lastSessionDate = d;
    });
    messages.forEach((m) => {
      const id = m.clientId || m.studentId;
      const c = ensure(id, { name: m.clientName || m.studentName, email: m.clientEmail || m.studentEmail });
      if (c && m.senderId !== user?.uid && !m.readByCounsellor) c.unreadMessages += 1;
    });
    return Array.from(map.values()).sort((a, b) => {
      if (a.isPending && !b.isPending) return -1;
      if (!a.isPending && b.isPending) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [requests, sessions, messages, user?.uid]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || (clients.length ? clients[0] : null),
    [clients, selectedClientId],
  );

  /* ── Filtered data for active client ── */
  const clientId = selectedClient?.id;
  const clientSessions = useMemo(() => sessions.filter((s) => (s.clientId || s.studentId) === clientId), [sessions, clientId]);
  const clientMessages = useMemo(() => messages.filter((m) => (m.clientId || m.studentId) === clientId), [messages, clientId]);
  const clientResources = useMemo(() => resources.filter((r) => (r.clientId || r.studentId) === clientId), [resources, clientId]);
  const clientNotes = useMemo(() => sessionNotes.filter((n) => n.clientId === clientId), [sessionNotes, clientId]);

  /* ── Stats ── */
  const activeClients = clients.filter((c) => !c.isPending).length;
  const newRequests = clients.filter((c) => c.isPending).length;
  const sessionsToday = sessions.filter((s) => isToday(s.sessionDate || s.date)).length;
  const followUpsDue = clients.filter((c) => c.followUpPending).length;
  const totalUnread = clients.reduce((sum, c) => sum + c.unreadMessages, 0);
  const totalSessions = sessions.length;

  const counsellorName = profile?.displayName || profile?.fullName || user?.full_name || user?.email || 'Counsellor';

  /* ── Actions ── */
  async function acceptRequest(requestId) {
    if (!requestId) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'counsellingRequests', requestId), {
        status: 'active',
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } finally { setBusy(false); }
  }

  async function logSession() {
    if (!selectedClient || !sessionForm.date) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'counsellingSessions'), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        counsellorId: user.uid,
        counsellorName,
        sessionDate: new Date(sessionForm.date),
        sessionType: sessionForm.type,
        duration: Number(sessionForm.duration) || 60,
        notes: sessionForm.notes.trim(),
        status: new Date(sessionForm.date) < new Date() ? 'completed' : 'upcoming',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSessionForm({ date: '', type: 'Online', notes: '', duration: '60' });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function writeNote() {
    if (!selectedClient || !noteForm.content.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'session_notes'), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        counsellorId: user.uid,
        counsellorName,
        content: noteForm.content.trim(),
        category: noteForm.category,
        mood: noteForm.mood.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNoteForm({ content: '', category: 'Session', mood: '' });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function sendMessage() {
    if (!selectedClient || !messageText.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'counsellingMessages'), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        counsellorId: user.uid,
        counsellorName,
        senderId: user.uid,
        senderName: counsellorName,
        senderRole: user.role,
        body: messageText.trim(),
        readByClient: false,
        readByCounsellor: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setMessageText('');
    } finally { setBusy(false); }
  }

  async function shareResource() {
    if (!selectedClient || !resourceForm.title.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'counsellingResources'), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        counsellorId: user.uid,
        counsellorName,
        title: resourceForm.title.trim(),
        note: resourceForm.note.trim(),
        url: resourceForm.url.trim(),
        resourceType: resourceForm.type,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setResourceForm({ title: '', url: '', note: '', type: 'Article' });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function sendBroadcast() {
    if (!broadcastForm.title.trim() || !broadcastForm.body.trim()) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'inbox_messages'), {
        senderId: user.uid,
        senderName: counsellorName,
        senderRole: user.role,
        title: broadcastForm.title.trim(),
        body: broadcastForm.body.trim(),
        audience: broadcastForm.audience,
        type: 'broadcast',
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setBroadcastForm({ title: '', body: '', audience: 'Clients' });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function flagFollowUp() {
    if (!selectedClient?.requestId) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'counsellingRequests', selectedClient.requestId), {
        followUpPending: true,
        followUpNote: followUpForm.note.trim(),
        followUpType: followUpForm.type,
        followUpDueDate: followUpForm.dueDate ? new Date(followUpForm.dueDate) : null,
        updatedAt: serverTimestamp(),
      });
      setFollowUpForm({ note: '', type: 'Check-in Call', dueDate: '' });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function clearFollowUp() {
    if (!selectedClient?.requestId) return;
    await updateDoc(doc(db, 'counsellingRequests', selectedClient.requestId), {
      followUpPending: false,
      followUpNote: '',
      updatedAt: serverTimestamp(),
    });
  }

  async function closeCase() {
    if (!selectedClient?.requestId) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'counsellingRequests', selectedClient.requestId), {
        status: 'closed',
        closedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setModal(null);
    } finally { setBusy(false); }
  }

  async function markMessageRead(msgId) {
    await updateDoc(doc(db, 'counsellingMessages', msgId), { readByCounsellor: true, updatedAt: serverTimestamp() });
  }

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#08121a] text-white">
      <Navbar />

      <main className="mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Hero ── */}
        <header className="rounded-3xl border border-sky-400/15 bg-[#0d1b29] px-8 py-6 shadow-xl shadow-black/30">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-sky-400">Counsellor Workspace</p>
          <h1 className="mt-3 font-serif text-4xl font-black text-white sm:text-5xl">
            As-salāmu ʿalaykum, {profile?.displayName || profile?.fullName || 'Ustādh'}
          </h1>
          <p className="mt-2 font-serif text-lg text-sky-300/70 italic">
            وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ وَعَمِلَ صَالِحًا
          </p>
          <p className="mt-4 text-sm text-slate-400">
            {profile?.specialisation || profile?.qualification || 'Your case management centre — private, confidential, and secure.'}
          </p>
        </header>

        {/* ── Stat cards ── */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard title="Active Clients" value={activeClients} icon={Users} tone="sky" />
          <StatCard title="New Requests" value={newRequests} icon={Inbox} tone="amber" pulse={newRequests > 0} />
          <StatCard title="Sessions Today" value={sessionsToday} icon={CalendarCheck} tone="emerald" />
          <StatCard title="Follow-Ups Due" value={followUpsDue} icon={AlertTriangle} tone="amber" pulse={followUpsDue > 0} />
          <StatCard title="Unread Messages" value={totalUnread} icon={MessageCircle} tone="sky" pulse={totalUnread > 0} />
          <StatCard title="Total Sessions" value={totalSessions} icon={BookOpen} tone="slate" />
        </section>

        {/* ── 3-column layout ── */}
        <section className="mt-6 grid gap-4 xl:grid-cols-[300px_1fr_280px]">

          {/* ── LEFT: Client Roster ── */}
          <aside className="space-y-4">

            {/* Pending requests */}
            {clients.filter((c) => c.isPending).length > 0 && (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-amber-300">New Requests</p>
                <div className="space-y-3">
                  {clients.filter((c) => c.isPending).map((c) => (
                    <div key={c.id} className="rounded-xl border border-amber-400/20 bg-[#0d1b29] p-3">
                      <p className="font-bold text-white">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => acceptRequest(c.requestId)}
                        className="mt-2 w-full rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-black text-[#0a0800] disabled:opacity-40"
                      >
                        Accept Client
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active clients */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                Active Clients ({clients.filter((c) => !c.isPending).length})
              </p>
              <div className="space-y-2">
                {clients.filter((c) => !c.isPending).length ? clients.filter((c) => !c.isPending).map((c) => {
                  const isSelected = selectedClient?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedClientId(c.id); setActiveTab('Overview'); }}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? 'border-sky-400/40 bg-sky-400/10'
                          : 'border-white/5 bg-[#08121a] hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-white truncate">{c.name}</p>
                        <div className="flex shrink-0 items-center gap-1">
                          {c.followUpPending && <span className="h-2 w-2 rounded-full bg-amber-400" title="Follow-up due" />}
                          {c.unreadMessages > 0 && (
                            <span className="rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-black text-white">{c.unreadMessages}</span>
                          )}
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 truncate">{c.email}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-600">
                        <span>{c.sessionCount} session{c.sessionCount !== 1 ? 's' : ''}</span>
                        <span>·</span>
                        <span>{c.lastSessionDate ? fmt(c.lastSessionDate) : 'No session yet'}</span>
                      </div>
                    </button>
                  );
                }) : (
                  <EmptyState title="No active clients" text="Accept a request above to begin." />
                )}
              </div>
            </div>
          </aside>

          {/* ── CENTRE: Client panel ── */}
          <div className="min-w-0">
            {!selectedClient ? (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0d1b29] p-12">
                <div className="text-center">
                  <Users className="mx-auto h-10 w-10 text-slate-700" />
                  <p className="mt-4 font-serif text-2xl font-black text-white">Select a client</p>
                  <p className="mt-2 text-sm text-slate-500">Choose a client from the roster to view their case.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Client header */}
                <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-sky-400">Active Case</p>
                      <h2 className="mt-1 font-serif text-3xl font-black text-white">{selectedClient.name}</h2>
                      <p className="mt-1 text-sm text-slate-400">{selectedClient.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.followUpPending && <Badge label="Follow-up Due" tone="amber" />}
                      <Badge label={selectedClient.requestStatus === 'closed' ? 'Closed' : 'Active'} tone={selectedClient.requestStatus === 'closed' ? 'slate' : 'emerald'} />
                      <Badge label={`${selectedClient.sessionCount} sessions`} />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
                    {CLIENT_TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition ${
                          activeTab === tab
                            ? 'bg-sky-500 text-white'
                            : 'border border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab}
                        {tab === 'Messages' && selectedClient.unreadMessages > 0 && (
                          <span className="ml-1.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] text-[#0a0800]">
                            {selectedClient.unreadMessages}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Tab: Overview ── */}
                {activeTab === 'Overview' && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4 text-center">
                        <p className="text-3xl font-black text-sky-300">{selectedClient.sessionCount}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Sessions</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4 text-center">
                        <p className="text-3xl font-black text-emerald-300">{clientNotes.length}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Case Notes</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4 text-center">
                        <p className="text-3xl font-black text-amber-300">{clientResources.length}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Resources Shared</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-5">
                      <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Last 3 Sessions</p>
                      {clientSessions.slice(0, 3).length ? clientSessions.slice(0, 3).map((s) => (
                        <div key={s.id} className="flex items-center justify-between border-t border-white/5 py-3 first:border-0 first:pt-0">
                          <div>
                            <p className="text-sm font-bold text-white">{fmt(s.sessionDate || s.date, { time: true })}</p>
                            <p className="text-xs text-slate-500">{s.sessionType || 'Session'} · {s.duration || 60} min</p>
                          </div>
                          <Badge label={s.status || 'completed'} tone={s.status === 'upcoming' ? 'sky' : 'emerald'} />
                        </div>
                      )) : <p className="text-sm text-slate-500">No sessions logged yet.</p>}
                    </div>
                    {selectedClient.followUpPending && (
                      <div className="flex items-start justify-between gap-4 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
                          <p className="text-sm font-bold text-amber-200">Follow-up is due for this client.</p>
                        </div>
                        <button type="button" onClick={clearFollowUp} className="text-xs font-black text-amber-300 hover:text-amber-200">Mark Done</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Sessions ── */}
                {activeTab === 'Sessions' && (
                  <div className="space-y-3">
                    <button type="button" onClick={() => setModal('session')} className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-black text-sky-300 hover:bg-sky-400/15">
                      <Plus className="h-4 w-4" /> Schedule Session
                    </button>
                    {clientSessions.length ? clientSessions.map((s) => (
                      <div key={s.id} className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">{fmt(s.sessionDate || s.date, { time: true })}</p>
                            <p className="text-xs text-slate-500">{s.sessionType} · {s.duration || 60} min</p>
                          </div>
                          <Badge label={s.status || 'completed'} tone={s.status === 'upcoming' ? 'sky' : 'emerald'} />
                        </div>
                        {s.notes && <p className="mt-3 text-sm leading-6 text-slate-300">{s.notes}</p>}
                      </div>
                    )) : <EmptyState title="No sessions yet" text="Schedule the first session for this client." />}
                  </div>
                )}

                {/* ── Tab: Notes (counsellor-only) ── */}
                {activeTab === 'Notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <button type="button" onClick={() => setModal('note')} className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-black text-sky-300 hover:bg-sky-400/15">
                        <Plus className="h-4 w-4" /> Write Note
                      </button>
                      <div className="flex items-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-400/5 px-3 py-1.5">
                        <Shield className="h-3.5 w-3.5 text-rose-400" />
                        <p className="text-xs font-black text-rose-400">Counsellor Only</p>
                      </div>
                    </div>
                    {clientNotes.length ? clientNotes.map((n) => (
                      <div key={n.id} className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Badge label={n.category} tone="sky" />
                            {n.mood && <Badge label={n.mood} />}
                          </div>
                          <p className="text-xs text-slate-500">{fmt(n.createdAt)}</p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-200">{n.content}</p>
                      </div>
                    )) : <EmptyState icon={FileText} title="No case notes" text="Your private session notes appear here. Clients cannot see these." />}
                  </div>
                )}

                {/* ── Tab: Messages ── */}
                {activeTab === 'Messages' && (
                  <div className="space-y-3">
                    <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
                      {clientMessages.length ? [...clientMessages].reverse().map((m) => {
                        const isMine = m.senderId === user?.uid;
                        if (!m.readByCounsellor) markMessageRead(m.id);
                        return (
                          <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isMine ? 'bg-sky-500/20 text-sky-100' : 'bg-white/5 text-slate-200'}`}>
                              {!isMine && <p className="mb-1 text-[11px] font-black text-sky-400">{m.senderName}</p>}
                              <p className="leading-6">{m.body}</p>
                              <p className="mt-1 text-[10px] text-slate-500">{fmt(m.createdAt, { time: true })}</p>
                            </div>
                          </div>
                        );
                      }) : <EmptyState icon={MessageCircle} title="No messages" text="Start a conversation with this client." />}
                    </div>
                    <div className="flex gap-2">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={2}
                        placeholder="Write a message..."
                        className="flex-1 resize-none rounded-xl border border-white/10 bg-[#0d1b29] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400"
                      />
                      <button type="button" disabled={busy || !messageText.trim()} onClick={sendMessage} className="rounded-xl bg-sky-500 px-4 font-black text-white disabled:opacity-40">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Tab: Resources ── */}
                {activeTab === 'Resources' && (
                  <div className="space-y-3">
                    <button type="button" onClick={() => setModal('resource')} className="flex items-center gap-2 rounded-xl border border-sky-400/30 bg-sky-400/10 px-4 py-2.5 text-sm font-black text-sky-300 hover:bg-sky-400/15">
                      <Plus className="h-4 w-4" /> Share Resource
                    </button>
                    {clientResources.length ? clientResources.map((r) => (
                      <div key={r.id} className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">{r.title}</p>
                            {r.note && <p className="mt-1 text-sm text-slate-400">{r.note}</p>}
                            <p className="mt-1 text-xs text-slate-500">{r.resourceType} · {fmt(r.createdAt)}</p>
                          </div>
                          {r.url && (
                            <a href={r.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-sky-400/30 p-2 text-sky-300">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )) : <EmptyState icon={BookOpen} title="No resources shared" text="Share articles, du'a, or Qur'anic guidance with this client." />}
                  </div>
                )}

                {/* ── Tab: Follow-Ups ── */}
                {activeTab === 'Follow-Ups' && (
                  <div className="space-y-3">
                    <button type="button" onClick={() => setModal('followup')} className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm font-black text-amber-300 hover:bg-amber-400/15">
                      <Plus className="h-4 w-4" /> Add Follow-Up
                    </button>
                    {selectedClient.followUpPending ? (
                      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-amber-200">Follow-Up Required</p>
                          <button type="button" onClick={clearFollowUp} className="flex items-center gap-1 text-xs font-black text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Done
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-slate-400">
                          {requests.find((r) => r.id === selectedClient.requestId)?.followUpNote || 'No note recorded.'}
                        </p>
                        {requests.find((r) => r.id === selectedClient.requestId)?.followUpDueDate && (
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            Due: {fmt(requests.find((r) => r.id === selectedClient.requestId)?.followUpDueDate)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <EmptyState icon={CheckCircle2} title="No follow-ups due" text="All follow-ups for this client are clear." />
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ── RIGHT: Quick Actions ── */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Case Actions</p>
              <p className="mb-3 text-xs text-slate-500 truncate">
                {selectedClient ? selectedClient.name : 'Select a client'}
              </p>
              <div className="space-y-2">
                {[
                  { label: 'Schedule Session', icon: Calendar, act: () => setModal('session'), tone: 'sky' },
                  { label: 'Write Case Note', icon: FileText, act: () => setModal('note'), tone: 'sky' },
                  { label: 'Share Resource', icon: BookOpen, act: () => setModal('resource'), tone: 'sky' },
                  { label: 'Flag Follow-Up', icon: AlertTriangle, act: () => setModal('followup'), tone: 'amber' },
                ].map(({ label, icon: Icon, act, tone }) => (
                  <button
                    key={label}
                    type="button"
                    disabled={!selectedClient}
                    onClick={act}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-bold transition disabled:opacity-30 ${
                      tone === 'amber'
                        ? 'border-amber-400/20 bg-amber-400/5 text-amber-300 hover:bg-amber-400/10'
                        : 'border-white/10 text-slate-200 hover:border-sky-400/30 hover:text-sky-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={!selectedClient?.requestId || selectedClient?.requestStatus === 'closed'}
                  onClick={() => setModal('close')}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-2.5 text-sm font-bold text-rose-300 transition hover:bg-rose-400/10 disabled:opacity-30"
                >
                  <X className="h-4 w-4 shrink-0" />
                  Close Case
                </button>
              </div>
            </div>

            {/* Broadcast */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Broadcast</p>
              <button
                type="button"
                onClick={() => setModal('broadcast')}
                className="flex w-full items-center gap-2.5 rounded-xl border border-sky-400/20 bg-sky-400/5 px-4 py-2.5 text-sm font-bold text-sky-300 hover:bg-sky-400/10"
              >
                <Bell className="h-4 w-4 shrink-0" />
                Send Announcement
              </button>
            </div>

            {/* Upcoming sessions */}
            <div className="rounded-2xl border border-white/10 bg-[#0d1b29] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Upcoming Sessions</p>
              {sessions.filter((s) => s.status === 'upcoming').slice(0, 4).length ? (
                <div className="space-y-2">
                  {sessions.filter((s) => s.status === 'upcoming').slice(0, 4).map((s) => (
                    <div key={s.id} className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#08121a] p-3">
                      <CalendarCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">{s.clientName || 'Client'}</p>
                        <p className="text-[11px] text-slate-500">{fmt(s.sessionDate, { time: true })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No upcoming sessions scheduled.</p>
              )}
            </div>
          </aside>
        </section>
      </main>

      {/* ── Modal: Schedule Session ── */}
      {modal === 'session' && (
        <Modal title="Schedule Session" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Client: <strong className="text-white">{selectedClient?.name}</strong></p>
            <Input label="Date & Time" type="datetime-local" value={sessionForm.date} onChange={(e) => setSessionForm((v) => ({ ...v, date: e.target.value }))} />
            <Select label="Session Type" options={SESSION_TYPES} value={sessionForm.type} onChange={(e) => setSessionForm((v) => ({ ...v, type: e.target.value }))} />
            <Input label="Duration (minutes)" type="number" value={sessionForm.duration} onChange={(e) => setSessionForm((v) => ({ ...v, duration: e.target.value }))} />
            <Textarea label="Session Notes (optional)" rows={3} value={sessionForm.notes} onChange={(e) => setSessionForm((v) => ({ ...v, notes: e.target.value }))} placeholder="Initial agenda or notes..." />
            <PrimaryBtn disabled={busy || !sessionForm.date} onClick={logSession}>Log Session</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* ── Modal: Case Note ── */}
      {modal === 'note' && (
        <Modal title="Write Case Note" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3">
              <Shield className="h-4 w-4 shrink-0 text-rose-400" />
              <p className="text-xs text-rose-300">These notes are private. Clients cannot see them.</p>
            </div>
            <p className="text-xs text-slate-500">Client: <strong className="text-white">{selectedClient?.name}</strong></p>
            <Select label="Category" options={NOTE_CATEGORIES} value={noteForm.category} onChange={(e) => setNoteForm((v) => ({ ...v, category: e.target.value }))} />
            <Input label="Client Mood / Presenting State (optional)" value={noteForm.mood} onChange={(e) => setNoteForm((v) => ({ ...v, mood: e.target.value }))} placeholder="e.g. Anxious, Calm, Distressed" />
            <Textarea label="Note Content" rows={6} value={noteForm.content} onChange={(e) => setNoteForm((v) => ({ ...v, content: e.target.value }))} placeholder="Your confidential session observations..." />
            <PrimaryBtn disabled={busy || !noteForm.content.trim()} onClick={writeNote}>Save Note</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* ── Modal: Share Resource ── */}
      {modal === 'resource' && (
        <Modal title="Share Resource" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Client: <strong className="text-white">{selectedClient?.name}</strong></p>
            <Select label="Resource Type" options={RESOURCE_TYPES} value={resourceForm.type} onChange={(e) => setResourceForm((v) => ({ ...v, type: e.target.value }))} />
            <Input label="Title" value={resourceForm.title} onChange={(e) => setResourceForm((v) => ({ ...v, title: e.target.value }))} placeholder="Resource name..." />
            <Input label="Link (optional)" type="url" value={resourceForm.url} onChange={(e) => setResourceForm((v) => ({ ...v, url: e.target.value }))} placeholder="https://..." />
            <Textarea label="Note" rows={3} value={resourceForm.note} onChange={(e) => setResourceForm((v) => ({ ...v, note: e.target.value }))} placeholder="Why this resource is beneficial..." />
            <PrimaryBtn disabled={busy || !resourceForm.title.trim()} onClick={shareResource}>Share with Client</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* ── Modal: Broadcast ── */}
      {modal === 'broadcast' && (
        <Modal title="Send Announcement" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Select label="Audience" options={['Clients', 'All Users', 'Counsellors']} value={broadcastForm.audience} onChange={(e) => setBroadcastForm((v) => ({ ...v, audience: e.target.value }))} />
            <Input label="Title" value={broadcastForm.title} onChange={(e) => setBroadcastForm((v) => ({ ...v, title: e.target.value }))} placeholder="Announcement title..." />
            <Textarea label="Message" rows={5} value={broadcastForm.body} onChange={(e) => setBroadcastForm((v) => ({ ...v, body: e.target.value }))} placeholder="Your message..." />
            <PrimaryBtn disabled={busy || !broadcastForm.title.trim() || !broadcastForm.body.trim()} onClick={sendBroadcast} tone="amber">Send Announcement</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* ── Modal: Follow-Up ── */}
      {modal === 'followup' && (
        <Modal title="Flag Follow-Up" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-xs text-slate-500">Client: <strong className="text-white">{selectedClient?.name}</strong></p>
            <Select label="Follow-Up Type" options={FOLLOW_UP_TYPES} value={followUpForm.type} onChange={(e) => setFollowUpForm((v) => ({ ...v, type: e.target.value }))} />
            <Input label="Due Date (optional)" type="date" value={followUpForm.dueDate} onChange={(e) => setFollowUpForm((v) => ({ ...v, dueDate: e.target.value }))} />
            <Textarea label="Note" rows={3} value={followUpForm.note} onChange={(e) => setFollowUpForm((v) => ({ ...v, note: e.target.value }))} placeholder="What needs to happen..." />
            <PrimaryBtn disabled={busy} onClick={flagFollowUp} tone="amber">Flag for Follow-Up</PrimaryBtn>
          </div>
        </Modal>
      )}

      {/* ── Modal: Close Case ── */}
      {modal === 'close' && (
        <Modal title="Close Case" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <p className="text-sm text-rose-200">
                You are about to close the case for <strong>{selectedClient?.name}</strong>. This marks the counselling relationship as complete. You can always re-open a new request if needed.
              </p>
            </div>
            <PrimaryBtn disabled={busy} onClick={closeCase} tone="rose">Confirm — Close Case</PrimaryBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}
