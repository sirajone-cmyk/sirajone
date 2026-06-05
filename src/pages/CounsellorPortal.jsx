import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { CalendarDays, ClipboardList, MessageCircle, Send, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { ROLES } from '@/lib/roles';

const sessionTypes = ['Online', 'In-Person', 'Phone', 'WhatsApp', 'Group Session'];

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = toDate(value);
  if (!date) return 'No session yet';
  return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
}

function sortRecent(a, b) {
  return (toDate(b.createdAt || b.sessionDate)?.getTime() || 0) - (toDate(a.createdAt || a.sessionDate)?.getTime() || 0);
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
      <ClipboardList className="mx-auto h-8 w-8 text-slate-500" />
      <h3 className="mt-4 font-serif text-2xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, tone = 'emerald' }) {
  const toneClass = tone === 'amber' ? 'text-amber-300' : tone === 'sky' ? 'text-sky-300' : 'text-emerald-300';
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <Icon className={`h-6 w-6 ${toneClass}`} />
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-400">{title}</p>
    </div>
  );
}

function clientStatus(client) {
  if (client.followUpPending) return 'Needs Follow-up';
  if (client.requestStatus === 'pending') return 'New';
  return 'Active';
}

function statusClasses(label) {
  if (label === 'Needs Follow-up') return 'border-amber-400/30 bg-amber-400/10 text-amber-200';
  if (label === 'New') return 'border-sky-400/30 bg-sky-400/10 text-sky-200';
  return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200';
}

export default function CounsellorPortal() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [privateData, setPrivateData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [noteClient, setNoteClient] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sessionForm, setSessionForm] = useState({ sessionDate: '', sessionType: 'Online', notes: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', note: '', url: '' });
  const [busy, setBusy] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;

  useEffect(() => {
    if (!user?.uid) return undefined;
    let active = true;
    async function loadProfile() {
      const publicSnap = await getDoc(doc(db, 'counsellors', user.uid));
      const privateSnap = await getDoc(doc(db, 'counsellors', user.uid, 'private_data', 'verification'));
      if (!active) return;
      setProfile(publicSnap.exists() ? { id: publicSnap.id, ...publicSnap.data() } : null);
      setPrivateData(privateSnap.exists() ? privateSnap.data() : null);
    }
    loadProfile();
    return () => { active = false; };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const scoped = (name) => (isAdmin ? collection(db, name) : query(collection(db, name), where('counsellorId', '==', user.uid)));
    const watchers = [
      onSnapshot(scoped('counsellingRequests'), (snap) => setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingSessions'), (snap) => setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingMessages'), (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
      onSnapshot(scoped('counsellingResources'), (snap) => setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(sortRecent))),
    ];
    return () => watchers.forEach((unsub) => unsub());
  }, [isAdmin, user?.uid]);

  const clients = useMemo(() => {
    const map = new Map();
    const ensure = (id, data = {}) => {
      if (!id) return null;
      if (!map.has(id)) map.set(id, { id, name: 'Counselling Client', email: '', requestId: '', requestStatus: 'active', followUpPending: false, sessionCount: 0, lastSessionDate: null });
      const item = map.get(id);
      item.name = data.name || item.name;
      item.email = data.email || item.email;
      item.requestId = data.requestId || item.requestId;
      item.requestStatus = data.requestStatus || item.requestStatus;
      item.followUpPending = Boolean(data.followUpPending || item.followUpPending);
      return item;
    };
    requests.forEach((request) => ensure(request.clientId || request.studentId, {
      name: request.clientName || request.studentName,
      email: request.clientEmail || request.studentEmail,
      requestId: request.id,
      requestStatus: request.status,
      followUpPending: request.followUpPending,
    }));
    sessions.forEach((session) => {
      const client = ensure(session.clientId || session.studentId, { name: session.clientName || session.studentName, email: session.clientEmail || session.studentEmail });
      if (!client) return;
      client.sessionCount += 1;
      const date = toDate(session.sessionDate || session.date);
      if (date && (!client.lastSessionDate || date > client.lastSessionDate)) client.lastSessionDate = date;
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [requests, sessions]);

  const selectedClient = clients.find((client) => client.id === selectedClientId) || clients[0];
  const selectedSessions = sessions.filter((session) => (session.clientId || session.studentId) === noteClient?.id);
  const selectedMessages = messages.filter((message) => (message.clientId || message.studentId) === noteClient?.id);
  const selectedResources = resources.filter((resource) => (resource.clientId || resource.studentId) === noteClient?.id);

  const sessionsThisWeek = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return sessions.filter((session) => {
      const date = toDate(session.sessionDate || session.date);
      return date && date >= start && date <= end;
    }).length;
  }, [sessions]);

  const unread = messages.filter((message) => message.senderId !== user?.uid && !message.readByCounsellor).length;
  const followUps = clients.filter((client) => client.followUpPending).length;
  const counsellorName = profile?.displayName || profile?.fullName || user?.full_name || user?.email || 'SirajOne Counsellor';

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
    } finally {
      setBusy(false);
    }
  }

  async function logSession() {
    if (!selectedClient || !sessionForm.sessionDate) return;
    setBusy(true);
    try {
      await addDoc(collection(db, 'counsellingSessions'), {
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        counsellorId: user.uid,
        counsellorName,
        sessionDate: new Date(sessionForm.sessionDate),
        sessionType: sessionForm.sessionType,
        notes: sessionForm.notes.trim(),
        status: new Date(sessionForm.sessionDate).getTime() < Date.now() ? 'completed' : 'upcoming',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSessionForm({ sessionDate: '', sessionType: 'Online', notes: '' });
    } finally {
      setBusy(false);
    }
  }

  async function flagFollowUp(client = selectedClient) {
    if (!client?.requestId) return;
    await updateDoc(doc(db, 'counsellingRequests', client.requestId), {
      followUpPending: true,
      followUpStatus: 'Needs Follow-up',
      updatedAt: serverTimestamp(),
    });
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setResourceForm({ title: '', note: '', url: '' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06170f] text-white">
      <Navbar />
      <main className="mx-auto max-w-[95rem] px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-emerald-400/20 bg-[#10261a] p-6 shadow-2xl shadow-black/30">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">Counsellor Workspace</p>
          <h1 className="mt-4 font-serif text-4xl font-black text-white sm:text-5xl">Case Management</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">Manage clients, sessions, follow-ups, messages, and shared resources without any Qur'an learning stage or recording UI.</p>
          <p className="mt-4 text-sm text-slate-500">{privateData?.highestQualification || profile?.highestQualification || 'Verification profile ready'}</p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Active Clients" value={clients.length} icon={Users} />
          <StatCard title="Sessions This Week" value={sessionsThisWeek} icon={CalendarDays} tone="sky" />
          <StatCard title="Follow-ups Pending" value={followUps} icon={ClipboardList} tone="amber" />
          <StatCard title="New Messages Unread" value={unread} icon={MessageCircle} tone="sky" />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.25fr_0.9fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-serif text-3xl font-black text-white">Client List</h2>
            <div className="mt-5 space-y-4">
              {clients.length ? clients.map((client) => {
                const label = clientStatus(client);
                return (
                  <article key={client.id} className={`rounded-2xl border p-4 ${selectedClient?.id === client.id ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-[#0b1f15]'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => setSelectedClientId(client.id)} className="text-left">
                        <h3 className="font-bold text-white">{client.name}</h3>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </button>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusClasses(label)}`}>{label}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-400">
                      <p><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Last Session</span>{client.lastSessionDate ? formatDate(client.lastSessionDate) : 'None yet'}</p>
                      <p><span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Sessions</span>{client.sessionCount}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setNoteClient(client)} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200">View Notes</button>
                      <button type="button" onClick={() => setSelectedClientId(client.id)} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-[#03140c]">Send Message</button>
                    </div>
                  </article>
                );
              }) : <EmptyState title="No clients yet" text="Approved counselling clients and assigned support requests will appear here." />}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="font-serif text-3xl font-black text-white">Upcoming & Recent Sessions</h2>
            <div className="mt-5 space-y-4">
              {sessions.length ? sessions.slice(0, 8).map((session) => (
                <article key={session.id} className="rounded-2xl border border-white/10 bg-[#0b1f15] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">{session.sessionType || 'Session'}</p>
                      <h3 className="mt-2 text-xl font-bold text-white">{session.clientName || session.studentName || 'Counselling Client'}</h3>
                      <p className="mt-1 text-sm text-slate-400">{formatDate(session.sessionDate || session.date)}</p>
                    </div>
                    <button type="button" onClick={() => setNoteClient(clients.find((client) => client.id === (session.clientId || session.studentId)) || null)} className="rounded-xl border border-emerald-400/30 px-4 py-2 text-sm font-bold text-emerald-200">Add Notes</button>
                  </div>
                  {session.notes && <p className="mt-4 text-sm leading-6 text-slate-300">{session.notes}</p>}
                </article>
              )) : <EmptyState title="No sessions logged" text="Use Quick Actions to log sessions. Upcoming and recent sessions will collect here." />}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-serif text-3xl font-black text-white">Quick Actions</h2>
              <label className="mt-5 block text-xs font-black uppercase tracking-[0.24em] text-slate-400">Selected client</label>
              <select value={selectedClient?.id || ''} onChange={(e) => setSelectedClientId(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-[#081b12] px-4 py-3 text-white outline-none focus:border-emerald-400">
                {clients.length ? clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>) : <option value="">No clients available</option>}
              </select>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1f15] p-4">
                <p className="flex items-center gap-2 text-sm font-black text-white"><Send className="h-4 w-4 text-emerald-300" /> Message a client</p>
                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} rows={3} placeholder="Write a private message..." className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
                <button type="button" disabled={busy || !selectedClient || !messageText.trim()} onClick={sendMessage} className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-[#03140c] disabled:opacity-50">Send Message</button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1f15] p-4">
                <p className="flex items-center gap-2 text-sm font-black text-white"><CalendarDays className="h-4 w-4 text-emerald-300" /> Log a session</p>
                <input type="datetime-local" value={sessionForm.sessionDate} onChange={(e) => setSessionForm((v) => ({ ...v, sessionDate: e.target.value }))} className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400" />
                <select value={sessionForm.sessionType} onChange={(e) => setSessionForm((v) => ({ ...v, sessionType: e.target.value }))} className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400">
                  {sessionTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                <textarea value={sessionForm.notes} onChange={(e) => setSessionForm((v) => ({ ...v, notes: e.target.value }))} rows={3} placeholder="Session note..." className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
                <button type="button" disabled={busy || !selectedClient || !sessionForm.sessionDate} onClick={logSession} className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-[#03140c] disabled:opacity-50">Log Session</button>
              </div>

              <button type="button" disabled={!selectedClient?.requestId} onClick={() => flagFollowUp(selectedClient)} className="mt-4 w-full rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-black text-amber-200 disabled:opacity-40">Flag Client for Follow-up</button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <h2 className="font-serif text-2xl font-black text-white">Share Resource</h2>
              <input value={resourceForm.title} onChange={(e) => setResourceForm((v) => ({ ...v, title: e.target.value }))} placeholder="Resource title" className="mt-4 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
              <input value={resourceForm.url} onChange={(e) => setResourceForm((v) => ({ ...v, url: e.target.value }))} placeholder="Optional link" className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
              <textarea value={resourceForm.note} onChange={(e) => setResourceForm((v) => ({ ...v, note: e.target.value }))} rows={3} placeholder="Short note" className="mt-3 w-full rounded-xl border border-white/10 bg-[#06170f] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-400" />
              <button type="button" disabled={busy || !selectedClient || !resourceForm.title.trim()} onClick={shareResource} className="mt-3 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-[#03140c] disabled:opacity-50">Share Resource</button>
            </div>
          </aside>
        </section>

        {noteClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setNoteClient(null)}>
            <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#10261a] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">Client Notes</p><h2 className="mt-2 font-serif text-3xl font-black text-white">{noteClient.name}</h2></div>
                <button type="button" onClick={() => setNoteClient(null)} className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-300">Close</button>
              </div>
              <div className="mt-6 space-y-4">
                {selectedSessions.length || selectedMessages.length || selectedResources.length ? (
                  <>
                    {selectedSessions.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#06170f] p-4"><p className="font-bold text-white">{formatDate(item.sessionDate || item.date)}</p><p className="mt-2 text-sm text-slate-300">{item.notes || 'No note captured.'}</p></article>)}
                    {selectedMessages.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#06170f] p-4"><p className="font-bold text-white">Message</p><p className="mt-2 text-sm text-slate-300">{item.body}</p></article>)}
                    {selectedResources.map((item) => <article key={item.id} className="rounded-2xl border border-white/10 bg-[#06170f] p-4"><p className="font-bold text-white">{item.title}</p><p className="mt-2 text-sm text-slate-300">{item.note}</p></article>)}
                  </>
                ) : <EmptyState title="No notes for this client" text="Messages, sessions, and shared resources for this client will appear here." />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
