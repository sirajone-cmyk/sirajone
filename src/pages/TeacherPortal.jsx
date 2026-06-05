import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { CheckCircle2, Clock3, Mic, Play, Square, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { ROLES } from '@/lib/roles';
import {
  getStageLabel,
  PIPELINE_STAGE_OPTIONS,
  SUBMISSION_STATUS,
  updateSubmissionReview,
} from '@/lib/submissionPipeline';

const STATUS_TABS = [
  { id: SUBMISSION_STATUS.PENDING, label: 'Pending', icon: Clock3 },
  { id: SUBMISSION_STATUS.APPROVED, label: 'Approved', icon: CheckCircle2 },
  { id: SUBMISSION_STATUS.NEEDS_IMPROVEMENT, label: 'Needs Improvement', icon: XCircle },
];

function formatDate(value) {
  if (!value?.toDate) return 'Recently';
  return value.toDate().toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TeacherPortal() {
  const { user } = useAuth();
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGE_OPTIONS[0].id);
  const [activeStatus, setActiveStatus] = useState(SUBMISSION_STATUS.PENDING);
  const [submissions, setSubmissions] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [feedbackBlob, setFeedbackBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;

  useEffect(() => {
    if (!user?.uid) return undefined;

    const submissionsQuery = isAdmin
      ? query(collection(db, 'submissions'))
      : query(collection(db, 'submissions'), where('teacherId', '==', user.uid));

    return onSnapshot(submissionsQuery, (snapshot) => {
      const rows = snapshot.docs.map((submissionDoc) => ({
        id: submissionDoc.id,
        ...submissionDoc.data(),
      }));
      rows.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setSubmissions(rows);
    });
  }, [isAdmin, user?.uid]);

  const stageCounts = useMemo(() => {
    return PIPELINE_STAGE_OPTIONS.reduce((acc, stage) => {
      acc[stage.id] = submissions.filter((item) => item.stage === stage.id).length;
      return acc;
    }, {});
  }, [submissions]);

  const visibleSubmissions = submissions.filter(
    (submission) => submission.stage === activeStage && submission.status === activeStatus
  );

  const openReview = (submission, nextStatus) => {
    setReviewTarget({ submission, nextStatus });
    setFeedbackBlob(null);
    setFeedbackUrl('');
    setError('');
  };

  const startFeedbackRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('This browser cannot record audio.');
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setFeedbackBlob(blob);
      setFeedbackUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };

    recorderRef.current = recorder;
    setIsRecording(true);
    recorder.start();
  };

  const stopFeedbackRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  const submitReview = async () => {
    if (!reviewTarget) return;

    try {
      setIsUpdating(true);
      await updateSubmissionReview({
        submissionId: reviewTarget.submission.id,
        status: reviewTarget.nextStatus,
        feedbackBlob,
        reviewer: user,
      });
      setReviewTarget(null);
      setFeedbackBlob(null);
      setFeedbackUrl('');
    } catch (reviewError) {
      setError(reviewError.message || 'Unable to update this review.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07170f] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-6 rounded-3xl border border-white/10 bg-white/[0.045] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">Teacher Review Pipeline</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-white">Student Recitation Reviews</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Review submitted student audio by learning path, approve strong readings, and send voice feedback when a correction is needed.
          </p>
        </section>

        <div className="mb-5 flex flex-wrap gap-2">
          {PIPELINE_STAGE_OPTIONS.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`rounded-2xl border px-4 py-2 text-sm font-bold transition ${
                activeStage === stage.id
                  ? 'border-emerald-300/40 bg-emerald-600 text-white'
                  : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-emerald-300/30'
              }`}
            >
              {stage.label} ({stageCounts[stage.id] || 0})
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {STATUS_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveStatus(id)}
              className={`rounded-3xl border p-4 text-left transition ${
                activeStatus === id
                  ? 'border-emerald-300/40 bg-emerald-400/10'
                  : 'border-white/10 bg-white/[0.035] hover:border-emerald-300/30'
              }`}
            >
              <Icon className="mb-3 h-5 w-5 text-emerald-300" />
              <p className="font-black text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">
                {submissions.filter((item) => item.stage === activeStage && item.status === id).length} in {getStageLabel(activeStage)}
              </p>
            </button>
          ))}
        </div>

        {visibleSubmissions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
            <Clock3 className="mx-auto mb-4 h-10 w-10 text-slate-500" />
            <h2 className="font-serif text-3xl font-bold text-white">No reviews in this queue</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
              When students send recordings from {getStageLabel(activeStage)}, they will appear here in the correct status queue.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleSubmissions.map((submission) => (
              <article key={submission.id} className="rounded-3xl border border-white/10 bg-[#13241a] p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{getStageLabel(submission.stage)}</p>
                    <h3 className="mt-2 text-xl font-black text-white">{submission.studentName || 'Student'}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {submission.lessonId} · {submission.itemId} · {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                    {submission.status}
                  </span>
                </div>

                <audio controls src={submission.studentAudioUrl} className="w-full" />

                {submission.teacherFeedbackAudioUrl && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Teacher Feedback</p>
                    <audio controls src={submission.teacherFeedbackAudioUrl} className="w-full" />
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openReview(submission, SUBMISSION_STATUS.APPROVED)}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-black hover:bg-emerald-400"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => openReview(submission, SUBMISSION_STATUS.NEEDS_IMPROVEMENT)}
                    className="rounded-xl border border-red-300/20 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-400/20"
                  >
                    Needs Improvement
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-300/20 bg-[#102116] p-6 shadow-2xl shadow-black/40">
            <h2 className="font-serif text-3xl font-bold text-white">
              {reviewTarget.nextStatus === SUBMISSION_STATUS.APPROVED ? 'Approve Recitation' : 'Send Correction'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Record optional voice feedback for the student. For corrections, a short audio note helps them retry the exact item.
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
                  {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isRecording ? 'Stop Feedback' : 'Record Feedback'}
                </button>
                {feedbackUrl && (
                  <button
                    type="button"
                    onClick={() => new Audio(feedbackUrl).play().catch(() => undefined)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200"
                  >
                    <Play className="h-4 w-4" />
                    Replay
                  </button>
                )}
              </div>
            </div>

            {error && <p className="mt-4 text-sm font-semibold text-red-200">{error}</p>}

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
                {isUpdating ? 'Saving...' : 'Update Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
