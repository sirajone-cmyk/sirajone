/**
 * Teachers.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Public teacher directory with live enrollment request system.
 *
 * Changes from previous version:
 *   • Added "Request Enrollment" button to every approved teacher card.
 *   • Added <EnrollmentModal> with two paths:
 *       Path A — Direct: writes to `assignments` with status:'pending_educator'
 *       Path B — Admin:  writes to `assignments` with status:'pending_admin'
 *   • Removed external WhatsApp / email footer links (replaced by in-app flow).
 *   • All existing filter, sort, and display logic is preserved unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db }              from '@/lib/firebase';
import { useAuth }         from '@/lib/AuthContext';
import { FOUNDER_TEACHER_PROFILE } from '@/lib/teacherSchema';
import { getSubjectLabel, SUBJECTS } from '@/lib/subjects';

const APPROVED_PROFILE_STATUS = 'approved';

const FILTERS = Object.freeze([
  { id: 'all', label: 'All Teachers' },
  ...SUBJECTS,
]);

// ── Normalise teacher docs ────────────────────────────────────────────────────

function toPublicTeacher(docId, data = {}, options = {}) {
  const profile = data.publicProfile || data;
  return {
    id:                    docId,
    name:                  profile.name || profile.fullName || 'Unnamed Teacher',
    bio:                   profile.bio || '',
    personalityDescription: profile.personalityDescription || '',
    assignedSubjects:      Array.isArray(profile.assignedSubjects) ? profile.assignedSubjects : [],
    profileStatus:         profile.profileStatus || 'pending',
    isFallback:            Boolean(options.isFallback),
  };
}

function founderFallbackTeacher() {
  return toPublicTeacher(
    FOUNDER_TEACHER_PROFILE.uid || FOUNDER_TEACHER_PROFILE.id,
    FOUNDER_TEACHER_PROFILE,
    { isFallback: true },
  );
}

// ── Enrollment modal ──────────────────────────────────────────────────────────

/**
 * Two-path enrollment modal.
 * Path A — Direct request to the selected teacher (status: pending_educator).
 * Path B — Admin matching request (status: pending_admin, no assignedId).
 */
function EnrollmentModal({ teacher, onClose }) {
  const { user }               = useAuth();
  const [note, setNote]        = useState('');
  const [busy, setBusy]        = useState(false);
  const [error, setError]      = useState('');
  const [success, setSuccess]  = useState(null); // null | 'direct' | 'admin'

  if (!teacher) return null;

  async function submit(path) {
    if (!user?.uid) {
      setError('Please sign in to request enrollment.');
      return;
    }

    setBusy(true);
    setError('');

    const isDirect = path === 'direct';

    try {
      await addDoc(collection(db, 'assignments'), {
        studentId:    user.uid,
        studentName:  user.full_name || user.displayName || user.email || 'Student',
        assignedId:   isDirect ? teacher.id   : null,
        assignedName: isDirect ? teacher.name : null,
        type:         'teacher',
        status:       isDirect ? 'pending_educator' : 'pending_admin',
        note:         note.trim(),
        createdAt:    serverTimestamp(),
        updatedAt:    serverTimestamp(),
      });
      setSuccess(path);
    } catch (err) {
      console.error('[EnrollmentModal] error:', err);
      setError(err.message || 'Unable to submit request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#102018] shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Enrollment Request
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">{teacher.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">
              {success === 'direct' ? 'Request Sent to Teacher' : 'Admin Matching Requested'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {success === 'direct'
                ? `Your enrollment request has been sent directly to ${teacher.name}. You will be notified once they respond.`
                : 'The SirajOne team will review your profile and match you with the most suitable teacher.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5 p-5">
            {/* Context copy */}
            <p className="text-sm leading-6 text-slate-300">
              Would you like to register with <strong className="text-white">{teacher.name}</strong>{' '}
              directly, or have the Admin assign the best fit for you?
            </p>

            {/* Optional note */}
            <div>
              <label htmlFor="enrollment-note" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Short note <span className="normal-case font-normal text-slate-600">(optional)</span>
              </label>
              <textarea
                id="enrollment-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Tell us briefly about your level or learning goals…"
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Path A — Direct */}
            <button
              type="button"
              onClick={() => submit('direct')}
              disabled={busy}
              className="flex w-full items-start gap-4 rounded-2xl border border-emerald-700/60 bg-emerald-950/50 px-5 py-4 text-left transition hover:border-emerald-600 hover:bg-emerald-950/70 disabled:opacity-50"
            >
              <UserCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <p className="font-bold text-white">Register directly with {teacher.name}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  Your request goes directly to this teacher for review and acceptance.
                </p>
              </div>
              <ArrowRight className="ml-auto mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
            </button>

            {/* Path B — Admin matching */}
            <button
              type="button"
              onClick={() => submit('admin')}
              disabled={busy}
              className="flex w-full items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-left transition hover:border-white/20 hover:bg-white/8 disabled:opacity-50"
            >
              <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
              <div>
                <p className="font-bold text-white">Let Admin find the best match for me</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">
                  SirajOne admin will review your profile and match you with the most suitable teacher.
                </p>
              </div>
              <ArrowRight className="ml-auto mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
            </button>

            {busy && (
              <div className="flex items-center justify-center gap-2 text-sm text-emerald-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Teacher card ──────────────────────────────────────────────────────────────

function TeacherCard({ teacher, featured = false, onEnroll }) {
  const subjectLabels = teacher.assignedSubjects.map(getSubjectLabel);

  return (
    <article
      className={
        featured
          ? 'bg-emerald-950/60 border border-emerald-800 rounded-3xl p-6 sm:p-8'
          : 'bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all'
      }
    >
      <div className={featured ? 'flex flex-col sm:flex-row gap-5 items-start' : 'flex gap-4 items-start mb-3'}>
        <div
          className={
            featured
              ? 'w-16 h-16 rounded-2xl bg-emerald-900 border border-emerald-700 flex items-center justify-center flex-shrink-0'
              : 'w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0'
          }
        >
          <BookOpen className={featured ? 'w-7 h-7 text-emerald-300' : 'w-5 h-5 text-emerald-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <h2 className={featured ? 'text-xl font-bold text-white' : 'font-bold text-white text-sm'}>
              {teacher.name}
            </h2>
            {teacher.isFallback ? (
              <span className="px-3 py-1 rounded-full bg-amber-900/60 border border-amber-800 text-amber-400 text-xs font-semibold">
                Founder
              </span>
            ) : null}
          </div>

          {teacher.bio ? (
            <p className={featured ? 'text-slate-400 text-sm leading-relaxed mt-3 mb-4' : 'text-slate-400 text-xs leading-relaxed mt-3 mb-3'}>
              {teacher.bio}
            </p>
          ) : null}

          {teacher.personalityDescription ? (
            <p className="mb-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-300">
              {teacher.personalityDescription}
            </p>
          ) : null}

          {subjectLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {subjectLabels.map((subject) => (
                <span
                  key={subject}
                  className={
                    featured
                      ? 'text-xs px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-800 text-emerald-300'
                      : 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-900 text-emerald-400'
                  }
                >
                  {subject}
                </span>
              ))}
            </div>
          ) : null}

          {/* ── Enrollment button — only for approved, non-fallback profiles ── */}
          {!teacher.isFallback && (
            <button
              type="button"
              onClick={() => onEnroll(teacher)}
              className={
                featured
                  ? 'inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600'
                  : 'inline-flex items-center gap-2 rounded-xl border border-emerald-700/60 bg-emerald-950/50 px-4 py-2 text-xs font-bold text-emerald-200 transition hover:bg-emerald-900/60'
              }
            >
              <UserCheck className={featured ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
              Request Enrollment
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Teachers() {
  const [teachers,      setTeachers]      = useState([]);
  const [hasLoaded,     setHasLoaded]     = useState(false);
  const [loadError,     setLoadError]     = useState('');
  const [activeSubject, setActiveSubject] = useState('all');
  const [enrollTarget,  setEnrollTarget]  = useState(null); // teacher for modal

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        setTeachers(
          snapshot.empty
            ? [founderFallbackTeacher()]
            : snapshot.docs.map((d) => toPublicTeacher(d.id, d.data())),
        );
        setLoadError('');
        setHasLoaded(true);
      },
      (error) => {
        console.error('Error loading teacher profiles:', error);
        setLoadError('Unable to load teacher profiles right now. Showing the founder profile until the live list is available.');
        setTeachers([founderFallbackTeacher()]);
        setHasLoaded(true);
      },
    );
    return () => unsubscribe();
  }, []);

  const approvedTeachers = useMemo(
    () => teachers.filter((t) => t.profileStatus === APPROVED_PROFILE_STATUS || t.isFallback),
    [teachers],
  );

  const filteredTeachers = useMemo(() => {
    if (activeSubject === 'all') return approvedTeachers;
    return approvedTeachers.filter((t) => t.assignedSubjects.includes(activeSubject));
  }, [activeSubject, approvedTeachers]);

  const featuredTeacher   = filteredTeachers[0];
  const remainingTeachers = filteredTeachers.slice(1);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Helmet>
        <title>Our Teachers | SirajOne — Qualified Islamic Educators</title>
        <meta name="description" content="Meet SirajOne's qualified Islamic teachers — specialists in Qur'an recitation, Tajwid, and Makharij al-Huruf. Enrol with a teacher today." />
        <meta property="og:title" content="Our Teachers | SirajOne" />
        <meta property="og:description" content="Qualified Islamic educators specialising in Qur'an, Tajwid, and Makharij. Find your teacher at SirajOne." />
        <meta property="og:url" content="https://sirajone.co.za/teachers" />
        <link rel="canonical" href="https://sirajone.co.za/teachers" />
      </Helmet>
      <Navbar />

      <div className="text-center py-14 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Our Faculty</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Our Teachers</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Approved SirajOne teachers for Qur'an learning, Islamic studies, and guided student development.
          Request enrollment directly or let our admin team match you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-5">
        {/* Subject filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => setActiveSubject(subject.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                activeSubject === subject.id
                  ? 'border-emerald-500 bg-emerald-700 text-white shadow-lg shadow-emerald-950/30'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-emerald-700 hover:text-white'
              }`}
            >
              {subject.label}
            </button>
          ))}
        </div>

        {!hasLoaded && (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-400" />
            Loading teacher profiles…
          </div>
        )}

        {loadError && (
          <div className="rounded-2xl border border-amber-800 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-300">
            {loadError}
          </div>
        )}

        {hasLoaded && filteredTeachers.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-500" />
            <h2 className="text-xl font-bold text-white">No approved teachers found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              There are no approved teacher profiles for this category yet. Please check back soon or contact SirajOne for guidance.
            </p>
          </div>
        )}

        {featuredTeacher && (
          <TeacherCard teacher={featuredTeacher} featured onEnroll={setEnrollTarget} />
        )}

        {remainingTeachers.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {remainingTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} onEnroll={setEnrollTarget} />
            ))}
          </div>
        )}

        {/* In-app matching CTA — replaces WhatsApp/email links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center">
          <h2 className="text-2xl font-bold mb-3">Not sure which teacher is right for you?</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Click "Request Enrollment" on any teacher card and choose the Admin matching option.
            The SirajOne team will assess your level and place you with the best match.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {featuredTeacher && !featuredTeacher.isFallback && (
              <button
                type="button"
                onClick={() => setEnrollTarget(featuredTeacher)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Request Enrollment <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment modal */}
      <EnrollmentModal
        teacher={enrollTarget}
        onClose={() => setEnrollTarget(null)}
      />
    </div>
  );
}
