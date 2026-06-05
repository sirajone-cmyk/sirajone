import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, CloudUpload, Send, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  clearRetrySubmission,
  createReviewSubmission,
  getStatusTone,
  resolveAssignedTeacherId,
  STATUS_LABELS,
  SUBMISSION_STATUS,
} from '@/lib/submissionPipeline';

const badgeClasses = {
  amber: 'border-amber-300/25 bg-amber-400/10 text-amber-200',
  emerald: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200',
  red: 'border-red-300/25 bg-red-400/10 text-red-200',
};

export default function SubmissionControls({
  audioBlob,
  stage,
  lessonId,
  itemId,
  submission,
  onSubmitted,
  onCleared,
}) {
  const { user } = useAuth();
  const [savedBlob, setSavedBlob] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSavedBlob(null);
    setError('');
    setIsConfirming(false);
  }, [stage, lessonId, itemId]);

  const statusTone = getStatusTone(submission?.status);
  const canRetry = submission?.status === SUBMISSION_STATUS.NEEDS_IMPROVEMENT;
  const isSubmitted = Boolean(submission?.id);
  const teacherId = resolveAssignedTeacherId(user);

  const saveRecording = () => {
    setError('');
    if (!audioBlob) {
      setError('Record your recitation first, then save it.');
      return;
    }
    setSavedBlob(audioBlob);
  };

  const sendForReview = async () => {
    setError('');
    const blob = savedBlob || audioBlob;
    if (!blob) {
      setError('Please save a recording before sending it to your teacher.');
      return;
    }

    try {
      setIsSubmitting(true);
      const submissionId = await createReviewSubmission({
        student: user,
        teacherId,
        stage,
        lessonId,
        itemId,
        audioBlob: blob,
      });
      onSubmitted?.(submissionId);
      setIsConfirming(false);
    } catch (submitError) {
      setError(submitError.message || 'Unable to send this recording right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForRetry = async () => {
    if (!submission?.id) return;
    try {
      setIsSubmitting(true);
      await clearRetrySubmission(submission.id);
      setSavedBlob(null);
      onCleared?.(submission.id);
    } catch (clearError) {
      setError(clearError.message || 'Unable to reset this item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Teacher Review</p>
          {isSubmitted ? (
            <span className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${badgeClasses[statusTone]}`}>
              {submission.status === SUBMISSION_STATUS.APPROVED ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
              {STATUS_LABELS[submission.status] || 'Submitted'}
            </span>
          ) : (
            <p className="mt-1 text-sm text-slate-400">Save your best recording, then send it for teacher review.</p>
          )}
        </div>

        {!isSubmitted && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveRecording}
              disabled={!audioBlob || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CloudUpload className="h-4 w-4" />
              Save Recording
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(true)}
              disabled={!(savedBlob || audioBlob) || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-black text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              Send to Teacher
            </button>
          </div>
        )}
      </div>

      {savedBlob && !isSubmitted && (
        <p className="mt-3 text-xs font-semibold text-emerald-200">Recording saved locally. It will upload only when you confirm sending.</p>
      )}

      {submission?.teacherFeedbackAudioUrl && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Teacher Voice Feedback</p>
          <audio controls src={submission.teacherFeedbackAudioUrl} className="w-full" />
        </div>
      )}

      {canRetry && (
        <button
          type="button"
          onClick={clearForRetry}
          disabled={isSubmitting}
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-100 transition hover:bg-red-400/20 disabled:opacity-40"
        >
          <X className="h-4 w-4" />
          Clear and Re-record
        </button>
      )}

      {error && <p className="mt-3 text-sm font-semibold text-red-200">{error}</p>}

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-w-md rounded-3xl border border-emerald-300/20 bg-[#102116] p-6 shadow-2xl shadow-black/40">
            <div className="mb-4 inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-white">Are you satisfied with this recording?</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Once you send it, your teacher will receive the audio for review. You can retry later if your teacher marks it as needs improvement.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                Not Yet
              </button>
              <button
                type="button"
                onClick={sendForReview}
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-black text-black hover:bg-emerald-400 disabled:opacity-40"
              >
                {isSubmitting ? 'Sending...' : 'Yes, Send It'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
