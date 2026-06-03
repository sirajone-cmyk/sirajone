import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { AlertCircle, ArrowLeft, BookOpen, Download, FileText, Link as LinkIcon, Megaphone, Plus, Send, ShieldCheck, UploadCloud } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { ROLES } from '@/lib/roles';
import { getSubjectLabel } from '@/lib/subjects';

const inputClass = 'w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-500/30';

const formatDate = (value) => {
  if (!value) return 'Just now';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
};

const normaliseFormat = (format = '') => {
  const value = format.trim().toLowerCase();
  if (value === 'pdf') return 'PDF';
  if (value === 'doc' || value === 'docx') return 'Doc';
  if (value === 'link' || value === 'url') return 'Link';
  return value ? value.toUpperCase() : 'Link';
};

function AccessNotice({ subjectLabel }) {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-700/70 bg-amber-950/40 text-amber-300">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">Classroom Protected</p>
        <h1 className="mt-3 text-3xl font-black text-white">{subjectLabel}</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          Active enrollment required to enter this classroom space.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/enroll" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
            View Enrollment
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

function AnnouncementComposer({ subjectId, user }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const postAnnouncement = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'classrooms', subjectId, 'announcements'), {
        body: body.trim(),
        authorId: user.uid,
        authorName: user.full_name || user.email || 'SirajOne Teacher',
        authorRole: user.role,
        created_at: serverTimestamp(),
      });
      setBody('');
    } catch (error) {
      console.error(error);
      alert('Unable to post bulletin. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={postAnnouncement} className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
      <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
        <Megaphone className="h-4 w-4" />
        Teacher Bulletin
      </label>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        placeholder="Post a class update, reminder, or instruction..."
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={submitting || !body.trim()}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? 'Posting...' : 'Post Bulletin'}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

function MediaComposer({ subjectId, user }) {
  const [form, setForm] = useState({ title: '', format: 'PDF', url: '' });
  const [submitting, setSubmitting] = useState(false);

  const submitMedia = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'classrooms', subjectId, 'media'), {
        title: form.title.trim(),
        format: normaliseFormat(form.format),
        url: form.url.trim(),
        uploadedBy: user.uid,
        uploadedByName: user.full_name || user.email || 'SirajOne Teacher',
        created_at: serverTimestamp(),
      });
      setForm({ title: '', format: 'PDF', url: '' });
    } catch (error) {
      console.error(error);
      alert('Unable to add resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitMedia} className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
        <UploadCloud className="h-4 w-4" />
        Add Resource
      </label>
      <div className="grid gap-3">
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Resource title or file name"
          className={inputClass}
        />
        <div className="grid grid-cols-[0.45fr_1fr] gap-2">
          <select
            value={form.format}
            onChange={(event) => setForm((current) => ({ ...current, format: event.target.value }))}
            className={inputClass}
          >
            <option value="PDF">PDF</option>
            <option value="Link">Link</option>
            <option value="Doc">Doc</option>
          </select>
          <input
            value={form.url}
            onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
            placeholder="Download URL or resource link"
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting || !form.title.trim()}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? 'Adding...' : 'Add to Hub'}
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}

export default function ClassroomPortal() {
  const { subjectId = '' } = useParams();
  const { user } = useAuth();
  const [access, setAccess] = useState({ loading: true, allowed: false, canPost: false, reason: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);

  const subjectLabel = useMemo(() => getSubjectLabel(subjectId), [subjectId]);
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;
  const isTeacher = user?.role === ROLES.TEACHER;

  useEffect(() => {
    if (!user?.uid || !subjectId) return;
    let cancelled = false;

    const resolveAccess = async () => {
      setAccess({ loading: true, allowed: false, canPost: false, reason: '' });

      try {
        if (isAdmin) {
          if (!cancelled) setAccess({ loading: false, allowed: true, canPost: true, reason: 'admin' });
          return;
        }

        if (isTeacher) {
          const teacherSnap = await getDoc(doc(db, 'teachers', user.uid));
          const teacherData = teacherSnap.data() || {};
          const assignedSubjects = Array.isArray(teacherData.assignedSubjects) ? teacherData.assignedSubjects : [];
          const approvedTeacher = teacherData.profileStatus === 'approved' && assignedSubjects.includes(subjectId);

          if (!cancelled) {
            setAccess({
              loading: false,
              allowed: approvedTeacher,
              canPost: approvedTeacher,
              reason: approvedTeacher ? 'assigned-teacher' : 'teacher-not-assigned',
            });
          }
          return;
        }

        const enrollmentQuery = query(
          collection(db, 'enrollments'),
          where('student_id', '==', user.uid),
          where('program_id', '==', subjectId),
          where('status', '==', 'active')
        );

        const unsubscribe = onSnapshot(enrollmentQuery, (snapshot) => {
          if (cancelled) return;
          const allowed = !snapshot.empty;
          setAccess({ loading: false, allowed, canPost: false, reason: allowed ? 'active-enrollment' : 'not-enrolled' });
        }, (error) => {
          console.error(error);
          if (!cancelled) setAccess({ loading: false, allowed: false, canPost: false, reason: 'enrollment-check-failed' });
        });

        return unsubscribe;
      } catch (error) {
        console.error(error);
        if (!cancelled) setAccess({ loading: false, allowed: false, canPost: false, reason: 'access-check-failed' });
      }
    };

    let unsubscribeEnrollment;
    resolveAccess().then((unsubscribe) => {
      if (typeof unsubscribe === 'function') unsubscribeEnrollment = unsubscribe;
    });

    return () => {
      cancelled = true;
      if (unsubscribeEnrollment) unsubscribeEnrollment();
    };
  }, [isAdmin, isTeacher, subjectId, user?.uid]);

  useEffect(() => {
    if (!access.allowed || !subjectId) return undefined;

    const announcementsQuery = query(
      collection(db, 'classrooms', subjectId, 'announcements'),
      orderBy('created_at', 'asc')
    );

    return onSnapshot(announcementsQuery, (snapshot) => {
      setAnnouncements(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, console.error);
  }, [access.allowed, subjectId]);

  useEffect(() => {
    if (!access.allowed || !subjectId) return undefined;

    const mediaQuery = query(
      collection(db, 'classrooms', subjectId, 'media'),
      orderBy('created_at', 'desc')
    );

    return onSnapshot(mediaQuery, (snapshot) => {
      setMediaItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    }, console.error);
  }, [access.allowed, subjectId]);

  if (access.loading) {
    return (
      <div className="min-h-screen bg-[#0b1a12] text-white">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-900 border-t-emerald-300" />
        </div>
      </div>
    );
  }

  if (!access.allowed) {
    return <AccessNotice subjectLabel={subjectLabel} />;
  }

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-emerald-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Dynamic Classroom</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-5xl">{subjectLabel}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Announcements, learning documents, and shared resources for this active SirajOne class space.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100">
            {access.canPost ? 'Teacher/Admin Access' : 'Student Access'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Teacher Bulletin Feed</h2>
                <p className="text-sm text-slate-500">Real-time updates ordered chronologically.</p>
              </div>
            </div>

            {access.canPost && <AnnouncementComposer subjectId={subjectId} user={user} />}

            <div className="mt-5 space-y-3">
              {announcements.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bold text-white">{item.authorName || 'SirajOne'}</div>
                    <div className="text-xs text-slate-500">{formatDate(item.created_at)}</div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">{item.body}</p>
                </article>
              ))}

              {announcements.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-slate-500">
                  No classroom bulletins yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Resource Downloads Hub</h2>
                <p className="text-sm text-slate-500">Documents, links, and study files for this subject.</p>
              </div>
            </div>

            {access.canPost && <MediaComposer subjectId={subjectId} user={user} />}

            <div className="mt-5 grid gap-3">
              {mediaItems.map((item) => {
                const format = normaliseFormat(item.format);
                const hasUrl = Boolean(item.url);
                return (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-200">
                            {format}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(item.created_at)}</span>
                        </div>
                        <h3 className="truncate font-bold text-white">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">Shared by {item.uploadedByName || 'SirajOne'}</p>
                      </div>
                      {hasUrl ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-950 transition hover:bg-emerald-50"
                        >
                          {format === 'Link' ? <LinkIcon className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                          Open
                        </a>
                      ) : (
                        <button disabled className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-500">
                          <FileText className="h-4 w-4" />
                          Listed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {mediaItems.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-slate-500">
                  No resources have been added yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-800/60 bg-amber-950/30 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            Resources are visible only after the classroom gate has approved access. Server rules should still be deployed before using this with live students.
          </p>
        </div>
      </main>
    </div>
  );
}