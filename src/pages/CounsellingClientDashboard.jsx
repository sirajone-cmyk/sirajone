import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, FileText, Inbox, MessageCircle, ShieldCheck } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';

function EmptyState({ icon: Icon = Inbox, title, text }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <Icon className="mx-auto h-9 w-9 text-slate-500" />
      <h3 className="mt-4 font-serif text-2xl font-black text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
  const date = toDate(value);
  if (!date) return 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

function sortByNewest(a, b) {
  return (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0);
}

function InfoCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <Icon className="h-6 w-6 text-emerald-300" />
      <p className="mt-4 text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-400">{title}</p>
    </div>
  );
}

export default function CounsellingClientDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return undefined;
    const watchers = [
      ['counsellingRequests', setRequests],
      ['counsellingSessions', setSessions],
      ['counsellingMessages', setMessages],
      ['counsellingResources', setResources],
    ].map(([collectionName, setter]) => onSnapshot(
      query(collection(db, collectionName), where('clientId', '==', user.uid)),
      (snapshot) => {
        setter(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).sort(sortByNewest));
        setLoading(false);
      },
      () => setLoading(false),
    ));
    return () => watchers.forEach((unsubscribe) => unsubscribe());
  }, [user?.uid]);

  const now = Date.now();
  const upcomingSessions = useMemo(() => sessions.filter((session) => {
    const date = toDate(session.sessionDate || session.date);
    return session.status !== 'completed' && (!date || date.getTime() >= now);
  }), [sessions, now]);

  const pastSessions = useMemo(() => sessions.filter((session) => {
    const date = toDate(session.sessionDate || session.date);
    return session.status === 'completed' || (date && date.getTime() < now);
  }), [sessions, now]);

  const counsellorName = requests[0]?.counsellorName || sessions[0]?.counsellorName || messages[0]?.counsellorName || 'your counsellor';

  return (
    <div className="min-h-screen bg-[#06170f] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-emerald-400/20 bg-[#10261a] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">Counselling Client Dashboard</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-black text-white sm:text-5xl">Private Support Space</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
                View your counselling sessions, messages from {counsellorName}, and any private resources shared with you. This area contains no learning stages, recordings, or lesson progress.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-200">
              {loading ? 'Loading support record...' : `${requests.length} support request${requests.length === 1 ? '' : 's'}`}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard title="Upcoming Sessions" value={upcomingSessions.length} icon={CalendarDays} />
          <InfoCard title="Counsellor Messages" value={messages.length} icon={MessageCircle} />
          <InfoCard title="Shared Resources" value={resources.length} icon={FileText} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-serif text-3xl font-black text-white">Upcoming Sessions</h2>
              <div className="mt-5 space-y-4">
                {upcomingSessions.length ? upcomingSessions.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-emerald-400/15 bg-[#0b1f15] p-5">
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">{session.sessionType || 'Counselling Session'}</p>
                    <h3 className="mt-2 text-xl font-bold text-white">{formatDate(session.sessionDate || session.date)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{session.notes || 'Your counsellor will confirm any preparation notes if needed.'}</p>
                  </article>
                )) : <EmptyState icon={CalendarDays} title="No upcoming sessions" text="When a session is scheduled, it will appear here with the date, type, and any notes from your counsellor." />}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-serif text-3xl font-black text-white">Past Sessions</h2>
              <div className="mt-5 space-y-4">
                {pastSessions.length ? pastSessions.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-white/10 bg-[#0b1f15] p-5">
                    <h3 className="text-xl font-bold text-white">{formatDate(session.sessionDate || session.date)}</h3>
                    <p className="mt-2 text-sm font-semibold text-emerald-200">{session.sessionType || 'Counselling Session'}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{session.notes || 'No public session notes were shared.'}</p>
                  </article>
                )) : <EmptyState icon={ShieldCheck} title="No past sessions yet" text="Completed session summaries and shared notes will appear here after your counselling meetings." />}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-serif text-3xl font-black text-white">Messages</h2>
              <div className="mt-5 space-y-4">
                {messages.length ? messages.map((message) => (
                  <article key={message.id} className="rounded-2xl border border-white/10 bg-[#0b1f15] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-white">{message.senderName || message.counsellorName || 'SirajOne Support'}</p>
                      <span className="text-xs text-slate-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{message.body}</p>
                  </article>
                )) : <EmptyState icon={MessageCircle} title="No messages yet" text="Private messages from your counsellor will appear here once your support request is active." />}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="font-serif text-3xl font-black text-white">Resources & Notes</h2>
              <div className="mt-5 space-y-4">
                {resources.length ? resources.map((resource) => (
                  <article key={resource.id} className="rounded-2xl border border-white/10 bg-[#0b1f15] p-4">
                    <p className="font-bold text-white">{resource.title || 'Shared Resource'}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{resource.note || resource.description || 'A resource has been shared by your counsellor.'}</p>
                    {resource.url && (
                      <a className="mt-3 inline-flex text-sm font-bold text-emerald-300 hover:text-emerald-200" href={resource.url} target="_blank" rel="noreferrer">Open resource</a>
                    )}
                  </article>
                )) : <EmptyState icon={FileText} title="No resources shared" text="If your counsellor shares worksheets, guidance notes, or helpful links, they will appear here." />}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
