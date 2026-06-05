/**
 * TeacherPortal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Professional teacher command centre for SirajOne.
 *
 * Layout
 * ──────
 * [Stat cards ×4]
 * [Student Roster] | [Pending Recordings] | [Broadcast Panel]
 *
 * Preserved from original
 * ────────────────────────
 * • Full submissions Firestore stream (teacherId filter for teachers, all for admin)
 * • Stage filter tabs
 * • Review modal with voice feedback recording (MediaRecorder API)
 * • updateSubmissionReview() service call (approve / needs_improvement)
 *
 * New in this version
 * ────────────────────
 * • Student roster derived from unique studentIds in submissions
 * • Status pills: On Track / Overdue / Never Submitted (7-day threshold)
 * • "Listen" — inline audio playback of latest student recording
 * • "Send Reminder" — writes to users/{studentId}/notifications
 * • Broadcast panel — chunked writeBatch to inbox_messages collection
 * • Stat cards connected to live derived data + useUnreadMessages hook
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Megaphone,
  MessageCircle,
  Mic,
  Play,
  Square,
  UserCheck,
  UserX,
  Users,
  XCircle,
} from 'lucide-react';
import Navbar   from '../components/Navbar';
import { useAuth }  from '@/lib/AuthContext';
import { db }       from '@/lib/firebase';
import { ROLES }    from '@/lib/roles';
import {
  getStageLabel,
  PIPELINE_STAGE_OPTIONS,
  PIPELINE_STAGES,
  SUBMISSION_STATUS,
  updateSubmissionReview,
} from '@/lib/submissionPipeline';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

// ── Utilities ─────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value?.toDate) return '—';
  return value.toDate().toLocaleString('en-ZA', {
    day:    'numeric',
    month:  'short',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function userDisplayName(user) {
  return user?.full_name || user?.displayName || user?.email || 'Teacher';
}

/** Chunk an array into sub-arrays of at most `size` elements. */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ── Roster helpers ────────────────────────────────────────────────────────────

const OVERDUE_DAYS = 7;
const OVERDUE_MS   = OVERDUE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Derive a student roster from the submissions array.
 * Returns one entry per unique studentId (based on their most recent submission).
 */
function buildRoster(submissions) {
  const map = {};
  for (const sub of submissions) {
    const existing = map[sub.studentId];
    if (!existing || (sub.submittedAt?.seconds || 0) > (existing.submittedAt?.seconds || 0)) {
      map[sub.studentId] = sub;
    }
  }
  return Object.values(map).map((sub) => ({
    studentId:      sub.studentId,
    studentName:    sub.studentName  || 'Student',
    latestStage:    sub.stage,
    lastSubmittedAt: sub.submittedAt,
    lastStatus:     sub.status,
    latestAudioUrl: sub.studentAudioUrl || null,
  }));
}

/** @param {{ lastSubmittedAt: import('firebase/firestore').Timestamp | null, lastStatus: string }} student */
function getStudentStatus(student) {
  if (!student.lastSubmittedAt) return 'Never Submitted';
  const ageMs = Date.now() - (student.lastSubmittedAt.seconds || 0) * 1000;
  if (ageMs > OVERDUE_MS) return 'Overdue';
  return 'On Track';
}

const STATUS_PILL_CLASS = {
  'On Track':       'border-emerald-300/25 bg-emerald-400/10 text-emerald-200',
  'Overdue':        'border-amber-300/25 bg-amber-400/10 text-amber-200',
  'Never Submitted':'border-slate-500/20 bg-white/[0.04] text-slate-400',
};

// ── Stage routing helper (for reminders) ─────────────────────────────────────

function stageToRoute(stage) {
  switch (stage) {
    case PIPELINE_STAGES.LETTER_GUIDE:       return '/letters';
    case PIPELINE_STAGES.PRACTICAL_WORKBOOK: return '/practice-workbook';
    case PIPELINE_STAGES.PART_TWO:           return '/part-two-workbook';
    default:                                 return '/practice-workbook';
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent = 'emerald' }) {
  const accent2Color = {
    emerald: 'text-emerald-300 bg-emerald-400/10',
    amber:   'text-amber-300 bg-amber-400/10',
    red:     'text-red-300 bg-red-400/10',
    sky:     'text-sky-300 bg-sky-400/10',
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className={`mb-4 inline-flex rounded-xl p-2.5 ${accent2Color[accent]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TeacherPortal() {
  const { user }             = useAuth();
  const { count: unreadCount } = useUnreadMessages(user?.uid);

  // ── Pending assignment requests (status: pending_educator) ────────────────
  const [pendingRequests,      setPendingRequests]      = useState([]);
  const [requestsExpanded,     setRequestsExpanded]     = useState(true);
  const [requestActionBusy,    setRequestActionBusy]    = useState(null); // assignmentId | null

  useEffect(() => {
    if (!user?.uid) return undefined;

    const q = query(
      collection(db, 'assignments'),
      where('assignedId', '==', user.uid),
      where('status',     '==', 'pending_educator'),
      where('type',       '==', 'teacher'),
    );

    return onSnapshot(q, (snap) => {
      setPendingRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('[TeacherPortal] pending assignments:', err));
  }, [user?.uid]);

  async function handleAccept(assignmentId) {
    setRequestActionBusy(assignmentId);
    try {
      await updateDoc(doc(db, 'assignments', assignmentId), {
        status:    'active',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[TeacherPortal] accept error:', err);
    } finally {
      setRequestActionBusy(null);
    }
  }

  async function handleDecline(assignmentId) {
    setRequestActionBusy(assignmentId);
    try {
      await updateDoc(doc(db, 'assignments', assignmentId), {
        status:    'declined',
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[TeacherPortal] decline error:', err);
    } finally {
      setRequestActionBusy(null);
    }
  }

  // ── Submissions stream ─────────────────────────────────────────────────────
  const [submissions, setSubmissions] = useState([]);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;

  useEffect(() => {
    if (!user?.uid) return undefined;

    const submissionsQuery = isAdmin
      ? query(collection(db, 'submissions'))
      : query(collection(db, 'submissions'), where('teacherId', '==', user.uid));

    return onSnapshot(submissionsQuery, (snapshot) => {
      const rows = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setSubmissions(rows);
    });
  }, [isAdmin, user?.uid]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const rosterStudents = useMemo(() => buildRoster(submissions), [submissions]);

  const pendingSubmissions = useMemo(
    () => submissions.filter((s) => s.status === SUBMISSION_STATUS.PENDING),
    [submissions],
  );

  const overdueCount = useMemo(
    () => rosterStudents.filter((s) => getStudentStatus(s) === 'Overdue').length,
    [rosterStudents],
  );

  const stageCounts = useMemo(() => {
    return PIPELINE_STAGE_OPTIONS.reduce((acc, stage) => {
      acc[stage.id] = pendingSubmissions.filter((s) => s.stage === stage.id).length;
      return acc;
    }, {});
  }, [pendingSubmissions]);

  // ── Stage filter (for pending recordings centre panel) ─────────────────────
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGE_OPTIONS[0].id);
  const visiblePending = pendingSubmissions.filter((s) => s.stage === activeStage);

  // ── Roster: inline audio player state ─────────────────────────────────────
  const [listeningStudentId, setListeningStudentId] = useState(null);

  function toggleListen(studentId) {
    setListeningStudentId((prev) => (prev === studentId ? null : studentId));
  }

  // ── Send Reminder ─────────────────────────────────────────────────────────
  const [reminderSending, setReminderSending] = useState(null); // studentId | null
  const [reminderSent,    setReminderSent]    = useState({});   // { [studentId]: true }

  const sendReminder = useCallback(async (student) => {
    if (!user?.uid) return;
    setReminderSending(student.studentId);

    const teacherName = userDisplayName(user);
    const stageName   = getStageLabel(student.latestStage);
    const notifRef    = doc(collection(db, 'users', student.studentId, 'notifications'));

    try {
      await setDoc(notifRef, {
        type:        'practice_reminder',
        teacherId:   user.uid,
        teacherName,
        studentId:   student.studentId,
        message:     `Ustādh ${teacherName} noticed you haven't uploaded a practice recording for ${stageName} yet. Tap here to record your best attempt now.`,
        stage:       student.latestStage,
        route:       stageToRoute(student.latestStage),
        read:        false,
        dismissed:   false,
        createdAt:   serverTimestamp(),
      });
      setReminderSent((prev) => ({ ...prev, [student.studentId]: true }));
      // Clear "Sent" indicator after 3 seconds
      setTimeout(() => {
        setReminderSent((prev) => { const n = { ...prev }; delete n[student.studentId]; return n; });
      }, 3000);
    } catch (err) {
      console.error('[TeacherPortal] sendReminder error:', err);
    } finally {
      setReminderSending(null);
    }
  }, [user]);

  // ── Broadcast ─────────────────────────────────────────────────────────────
  const [broadcastText,    setBroadcastText]    = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult,  setBroadcastResult]  = useState('');  // success | error message

  const sendBroadcast = useCallback(async () => {
    const text = broadcastText.trim();
    if (!text || !user?.uid || rosterStudents.length === 0) return;

    setBroadcastSending(true);
    setBroadcastResult('');
    const teacherName = userDisplayName(user);

    try {
      // Chunk at 499 to stay under Firestore's 500 operations per batch limit.
      const chunks = chunkArray(rosterStudents, 499);

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        for (const student of chunk) {
          const ref = doc(collection(db, 'inbox_messages'));
          batch.set(ref, {
            type:        'broadcast',
            senderId:    user.uid,
            senderName:  teacherName,
            recipientId: student.studentId,
            message:     text,
            isRead:      false,
            createdAt:   serverTimestamp(),
          });
        }
        await batch.commit(); // eslint-disable-line no-await-in-loop
      }

      setBroadcastText('');
      setBroadcastResult(`Broadcast sent to ${rosterStudents.length} student${rosterStudents.length !== 1 ? 's' : ''}.`);
    } catch (err) {
      console.error('[TeacherPortal] broadcast error:', err);
      setBroadcastResult('Broadcast failed. Please try again.');
    } finally {
      setBroadcastSending(false);
      setTimeout(() => setBroadcastResult(''), 5000);
    }
  }, [broadcastText, rosterStudents, user]);

  // ── Review modal (preserved from original) ────────────────────────────────
  const [reviewTarget,  setReviewTarget]  = useState(null);
  const [feedbackUrl,   setFeedbackUrl]   = useState('');
  const [feedbackBlob,  setFeedbackBlob]  = useState(null);
  const [isRecording,   setIsRecording]   = useState(false);
  const [isUpdating,    setIsUpdating]    = useState(false);
  const [reviewError,   setReviewError]   = useState('');
  const recorderRef  = useRef(null);
  const chunksRef    = useRef([]);

  function openReview(submission, nextStatus) {
    setReviewTarget({ submission, nextStatus });
    setFeedbackBlob(null);
    setFeedbackUrl('');
    setReviewError('');
  }

  async function startFeedbackRecording() {
    setReviewError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setReviewError('This browser cannot record audio.');
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setFeedbackBlob(blob);
      setFeedbackUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((t) => t.stop());
    };
    recorderRef.current = recorder;
    setIsRecording(true);
    recorder.start();
  }

  function stopFeedbackRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  }

  async function submitReview() {
    if (!reviewTarget) return;
    try {
      setIsUpdating(true);
      await updateSubmissionReview({
        submissionId: reviewTarget.submission.id,
        status:       reviewTarget.nextStatus,
        feedbackBlob,
        reviewer:     user,
      });
      setReviewTarget(null);
      setFeedbackBlob(null);
      setFeedbackUrl('');
    } catch (err) {
      setReviewError(err.message || 'Unable to update this review.');
    } finally {
      setIsUpdating(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07170f] text-white">
      <Navbar />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">

        {/* ── Page header ── */}
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            Teacher Command Centre
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            {userDisplayName(user)}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your students, review recordings, and communicate — all from one place.
          </p>
        </section>

        {/* ── Stat cards ── */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Active Students"
            value={rosterStudents.length}
            accent="emerald"
          />
          <StatCard
            icon={Clock3}
            label="Recordings Awaiting Review"
            value={pendingSubmissions.length}
            accent="sky"
          />
          <StatCard
            icon={AlertTriangle}
            label="Students Overdue This Week"
            value={overdueCount}
            accent="amber"
          />
          <StatCard
            icon={MessageCircle}
            label="Messages Unread"
            value={unreadCount}
            accent="red"
          />
        </div>

        {/* ── Three-column command grid ── */}
        <div className="grid gap-6 xl:grid-cols-[320px_1fr_300px]">

          {/* ── LEFT: Student Roster ── */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-200">
                <Users className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                  Student Roster
                </p>
                <p className="text-xs text-slate-500">{rosterStudents.length} students</p>
              </div>
            </div>

            {/* ── Pending Enrollment Requests ── */}
            {pendingRequests.length > 0 && (
              <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-950/20">
                {/* Toggle header */}
                <button
                  type="button"
                  onClick={() => setRequestsExpanded((x) => !x)}
                  className="flex w-full items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-amber-400" aria-hidden="true" />
                    <span className="text-sm font-bold text-amber-300">
                      Enrollment Requests
                    </span>
                    <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-black">
                      {pendingRequests.length}
                    </span>
                  </div>
                  {requestsExpanded
                    ? <ChevronUp  className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    : <ChevronDown className="h-4 w-4 text-amber-500" aria-hidden="true" />}
                </button>

                {requestsExpanded && (
                  <div className="border-t border-amber-500/20 px-3 pb-3 pt-2 space-y-2">
                    {pendingRequests.map((req) => {
                      const isBusy = requestActionBusy === req.id;
                      const ts = req.createdAt?.toDate?.();
                      const dateStr = ts
                        ? ts.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'Recently';

                      return (
                        <div
                          key={req.id}
                          className="rounded-xl border border-amber-500/20 bg-amber-950/30 p-3"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {req.studentName || 'Student'}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                Requested {dateStr}
                              </p>
                            </div>
                          </div>

                          {req.note && (
                            <p className="mb-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-slate-400 line-clamp-2">
                              {req.note}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleAccept(req.id)}
                              disabled={isBusy}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                            >
                              <UserCheck className="h-3 w-3" aria-hidden="true" />
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecline(req.id)}
                              disabled={isBusy}
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-700/40 bg-red-950/30 py-1.5 text-xs font-bold text-red-200 transition hover:bg-red-950/50 disabled:opacity-50"
                            >
                              <UserX className="h-3 w-3" aria-hidden="true" />
                              Decline
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {rosterStudents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-6 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-600" />
                <p className="text-sm text-slate-500">No student submissions yet.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {rosterStudents.map((student) => {
                  const status   = getStudentStatus(student);
                  const pillCls  = STATUS_PILL_CLASS[status] ?? STATUS_PILL_CLASS['On Track'];
                  const isListening = listeningStudentId === student.studentId;
                  const isSending   = reminderSending === student.studentId;
                  const wasSent     = reminderSent[student.studentId];

                  return (
                    <article
                      key={student.studentId}
                      className="rounded-2xl border border-white/10 bg-[#13241a] p-4"
                    >
                      {/* Name + stage */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-white text-sm">
                            {student.studentName}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {getStageLabel(student.latestStage)}
                          </p>
                        </div>
                        <span className={`flex-shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${pillCls}`}>
                          {status}
                        </span>
                      </div>

                      {/* Last submission date */}
                      <p className="text-[11px] text-slate-600 mb-3">
                        Last submission: {formatDate(student.lastSubmittedAt)}
                      </p>

                      {/* Inline audio player */}
                      {isListening && student.latestAudioUrl && (
                        <div className="mb-3 rounded-xl border border-white/10 bg-black/20 p-2">
                          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                            Latest Recording
                          </p>
                          <audio
                            controls
                            src={student.latestAudioUrl}
                            className="w-full h-9"
                            autoPlay
                          />
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleListen(student.studentId)}
                          disabled={!student.latestAudioUrl}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition
                            ${isListening
                              ? 'border-emerald-300/40 bg-emerald-600 text-white'
                              : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-emerald-300/30 disabled:cursor-not-allowed disabled:opacity-40'
                            }`}
                        >
                          <Play className="h-3 w-3" aria-hidden="true" />
                          {isListening ? 'Close' : 'Listen'}
                        </button>

                        <button
                          type="button"
                          onClick={() => sendReminder(student)}
                          disabled={isSending || Boolean(wasSent)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition
                            ${wasSent
                              ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
                              : 'border-amber-300/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-40'
                            }`}
                        >
                          <Bell className="h-3 w-3" aria-hidden="true" />
                          {isSending ? 'Sending…' : wasSent ? 'Sent ✓' : 'Send Reminder'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </aside>

          {/* ── CENTRE: Pending Recordings ── */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-sky-400/10 p-2 text-sky-200">
                  <Mic className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                    Pending Recordings
                  </p>
                  <p className="text-xs text-slate-500">
                    {pendingSubmissions.length} awaiting review
                  </p>
                </div>
              </div>
            </div>

            {/* Stage filter */}
            <div className="mb-4 flex flex-wrap gap-2">
              {PIPELINE_STAGE_OPTIONS.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`rounded-2xl border px-4 py-1.5 text-xs font-bold transition ${
                    activeStage === stage.id
                      ? 'border-emerald-300/40 bg-emerald-600 text-white'
                      : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-emerald-300/30'
                  }`}
                >
                  {stage.label}
                  {stageCounts[stage.id] > 0 && (
                    <span className="ml-1.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                      {stageCounts[stage.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {visiblePending.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-12 text-center">
                <CheckCircle2 className="mb-4 h-10 w-10 text-emerald-600" />
                <h2 className="font-serif text-2xl font-bold text-white">
                  Queue clear for {getStageLabel(activeStage)}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  New recordings will appear here as students submit.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {visiblePending.map((submission) => (
                  <article
                    key={submission.id}
                    className="rounded-3xl border border-white/10 bg-[#13241a] p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                          {getStageLabel(submission.stage)}
                        </p>
                        <h3 className="mt-1.5 text-lg font-black text-white">
                          {submission.studentName || 'Student'}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {submission.lessonId} · {submission.itemId} · {formatDate(submission.submittedAt)}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[10px] font-bold text-amber-200">
                        Pending
                      </span>
                    </div>

                    {/* Student recording */}
                    <audio controls src={submission.studentAudioUrl} className="w-full" />

                    {/* Teacher feedback (if already added) */}
                    {submission.teacherFeedbackAudioUrl && (
                      <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                          Your Previous Feedback
                        </p>
                        <audio controls src={submission.teacherFeedbackAudioUrl} className="w-full" />
                      </div>
                    )}

                    {/* Send Feedback (review actions) */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openReview(submission, SUBMISSION_STATUS.APPROVED)}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-black hover:bg-emerald-400"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => openReview(submission, SUBMISSION_STATUS.NEEDS_IMPROVEMENT)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-white/10"
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-400" aria-hidden="true" />
                        Send Feedback
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ── RIGHT: Broadcast Panel ── */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-xl bg-purple-400/10 p-2 text-purple-200">
                <Megaphone className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">
                  Broadcast
                </p>
                <p className="text-xs text-slate-500">All active students</p>
              </div>
            </div>

            <p className="mb-3 text-xs leading-relaxed text-slate-400">
              Send a message directly to every student in your roster. Each student receives a personal inbox notification.
            </p>

            <textarea
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              rows={6}
              placeholder="Write your message to all students…"
              disabled={broadcastSending}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-50"
            />

            {rosterStudents.length === 0 && (
              <p className="mt-2 text-xs text-slate-600">
                No students to broadcast to yet.
              </p>
            )}

            <button
              type="button"
              onClick={sendBroadcast}
              disabled={!broadcastText.trim() || broadcastSending || rosterStudents.length === 0}
              className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {broadcastSending
                ? 'Sending…'
                : `Broadcast to ${rosterStudents.length} Student${rosterStudents.length !== 1 ? 's' : ''}`}
            </button>

            {broadcastResult && (
              <p className={`mt-3 text-center text-xs font-semibold ${
                broadcastResult.includes('failed') ? 'text-red-300' : 'text-emerald-300'
              }`}>
                {broadcastResult}
              </p>
            )}

            {/* Recent sent indicator */}
            <div className="mt-5 rounded-2xl border border-white/8 bg-black/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Roster ({rosterStudents.length})
              </p>
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {rosterStudents.map((s) => (
                  <p key={s.studentId} className="truncate text-[11px] text-slate-500">
                    {s.studentName}
                  </p>
                ))}
                {rosterStudents.length === 0 && (
                  <p className="text-[11px] text-slate-600">No students yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Review modal (preserved exactly from original) ── */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-300/20 bg-[#102116] p-6 shadow-2xl shadow-black/40">
            <h2 className="font-serif text-3xl font-bold text-white">
              {reviewTarget.nextStatus === SUBMISSION_STATUS.APPROVED
                ? 'Approve Recitation'
                : 'Send Correction'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Record optional voice feedback for{' '}
              <strong>{reviewTarget.submission.studentName || 'the student'}</strong>.
              For corrections, a short audio note helps them retry the exact item.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              {feedbackUrl ? (
                <audio controls src={feedbackUrl} className="w-full" />
              ) : (
                <p className="text-sm text-slate-400">No feedback recorded yet.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopFeedbackRecording : startFeedbackRecording}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black ${
                    isRecording ? 'bg-red-500 text-white' : 'bg-emerald-500 text-black'
                  }`}
                >
                  {isRecording
                    ? <><Square className="h-4 w-4" aria-hidden="true" /> Stop Feedback</>
                    : <><Mic    className="h-4 w-4" aria-hidden="true" /> Record Feedback</>}
                </button>
                {feedbackUrl && (
                  <button
                    type="button"
                    onClick={() => new Audio(feedbackUrl).play().catch(() => undefined)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" /> Replay
                  </button>
                )}
              </div>
            </div>

            {reviewError && (
              <p className="mt-4 text-sm font-semibold text-red-200">{reviewError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReview}
                disabled={isUpdating}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-black hover:bg-emerald-400 disabled:opacity-40"
              >
                {isUpdating ? 'Saving…' : 'Update Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
