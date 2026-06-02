import React, { useMemo, useState } from 'react';
import { MessageCircle, Star, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

function availabilityTone(availability) {
  if (availability === 'unavailable') return 'bg-red-500/15 text-red-200';
  if (availability === 'limited') return 'bg-amber-500/15 text-amber-200';
  return 'bg-emerald-500/15 text-emerald-200';
}

function availabilityLabel(availability) {
  if (availability === 'unavailable') return 'Unavailable';
  if (availability === 'limited') return 'Limited availability';
  return 'Available';
}

export default function TeachersPage({ setPage }) {
  const {
    teacherDirectory,
    currentAssignedTeacher,
    currentTeacherRequest,
    requestTeacherAssignment,
    reviewTeacher,
    state,
    currentUser,
  } = usePlatform();
  const [noteByTeacher, setNoteByTeacher] = useState({});
  const [notice, setNotice] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: '' });

  const teacherReviews = useMemo(() => {
    if (!currentAssignedTeacher || !currentUser) return [];
    return (state.teacherReviews || []).filter(
      (item) =>
        item.teacherId === currentAssignedTeacher.id && item.studentId === currentUser.id
    );
  }, [currentAssignedTeacher, currentUser, state.teacherReviews]);

  function onRequestTeacher(teacherId) {
    try {
      requestTeacherAssignment({
        teacherId,
        note: noteByTeacher[teacherId] || '',
      });
      setNotice('Teacher request submitted. Admin can now review and assign your teacher.');
    } catch (error) {
      setNotice(error.message || 'Could not submit teacher request.');
    }
  }

  function onSubmitReview(event) {
    event.preventDefault();
    try {
      reviewTeacher(reviewForm);
      setReviewForm({ rating: 5, review: '' });
      setNotice('Teacher review submitted successfully.');
    } catch (error) {
      setNotice(error.message || 'Could not save your teacher review.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Teacher Selection</p>
        <h1 className="section-title">Browse and choose your teacher</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Students can browse the live teacher directory, request a preferred teacher, and message
          their assigned teacher privately once approved.
        </p>
      </div>

      {currentAssignedTeacher ? (
        <section className="panel-base border-emerald-300/35 bg-emerald-500/10 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                Assigned teacher
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">{currentAssignedTeacher.name}</h2>
              <p className="mt-2 text-sm text-emerald-200">
                {currentAssignedTeacher.subjects || currentAssignedTeacher.audience}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                {currentAssignedTeacher.bio}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onClick={() => setPage('messages')}>
                <MessageCircle size={15} />
                Message teacher
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPage('support')}>
                Need support
              </Button>
            </div>
          </div>
        </section>
      ) : currentTeacherRequest ? (
        <section className="panel-base border-amber-300/35 bg-amber-500/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Teacher request in progress
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {teacherDirectory.find((teacher) => teacher.id === currentTeacherRequest.teacherId)?.name ||
              'Requested teacher'}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Status: {currentTeacherRequest.status}. Your note was saved and is visible to admin.
          </p>
          {currentTeacherRequest.note ? (
            <p className="mt-2 text-sm text-slate-300">Your note: {currentTeacherRequest.note}</p>
          ) : null}
        </section>
      ) : null}

      {notice ? (
        <div className="rounded-2xl border border-emerald-300/22 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-2">
        {teacherDirectory.map((teacher) => {
          const isAssigned = currentAssignedTeacher?.id === teacher.id;
          const isRequested = currentTeacherRequest?.teacherId === teacher.id;

          return (
            <article key={teacher.id} className="panel-base p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{teacher.name}</h2>
                    {teacher.featured ? (
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-emerald-200">
                    {teacher.experience} · {teacher.audience}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityTone(
                    teacher.availability
                  )}`}
                >
                  {availabilityLabel(teacher.availability)}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-200">{teacher.bio}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-emerald-300/12 bg-slate-950/30 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                    Specialization
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{teacher.subjects}</p>
                </div>
                <div className="rounded-xl border border-emerald-300/12 bg-slate-950/30 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                    Best suited for
                  </p>
                  <p className="mt-2 text-sm text-slate-200">{teacher.audience}</p>
                </div>
              </div>

              {!isAssigned ? (
                <>
                  <textarea
                    value={noteByTeacher[teacher.id] || ''}
                    onChange={(event) =>
                      setNoteByTeacher((prev) => ({
                        ...prev,
                        [teacher.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Optional note for admin about why you want this teacher"
                    className="mt-4 w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-300/45"
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onRequestTeacher(teacher.id)}
                      disabled={teacher.availability === 'unavailable'}
                    >
                      <UserCheck size={15} />
                      {isRequested ? 'Update teacher request' : 'Select Teacher'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setPage('messages')}>
                      Ask support first
                    </Button>
                  </div>

                  {isRequested ? (
                    <div className="mt-4 rounded-2xl border border-emerald-300/18 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                      This teacher is currently selected in your request and waiting for admin approval.
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-slate-950/35 p-4">
                  <p className="text-sm text-slate-200">
                    This teacher is already assigned to your account. You can now message them
                    privately from the app.
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {currentAssignedTeacher ? (
        <section className="panel-base p-6">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-300" />
            <h2 className="text-2xl font-bold text-white">Review your teacher</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Once you are connected with a teacher, your review can be recorded here for future
            quality tracking.
          </p>

          <form onSubmit={onSubmitReview} className="mt-5 grid gap-4 lg:grid-cols-[180px_1fr_auto]">
            <select
              value={reviewForm.rating}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  rating: Number(event.target.value),
                }))
              }
              className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-300/45"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating === 1 ? '' : 's'}
                </option>
              ))}
            </select>

            <textarea
              value={reviewForm.review}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  review: event.target.value,
                }))
              }
              rows={3}
              placeholder="Share a short review about your teacher experience"
              className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-300/45"
            />

            <Button type="submit" variant="primary" size="sm" className="h-fit self-start">
              Save review
            </Button>
          </form>

          {teacherReviews.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                Your latest review
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {teacherReviews[0].rating} / 5
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{teacherReviews[0].review}</p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
