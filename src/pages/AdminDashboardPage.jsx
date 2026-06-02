import React, { useMemo, useState } from 'react';
import { BookOpen, BusFront, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { LetterLessonExperience } from '../components/letters/LetterLessonExperience';
import { ChatPanel } from '../components/platform/ChatPanel';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

function statusTone(status) {
  if (status === 'approved' || status === 'active' || status === 'published') {
    return 'bg-emerald-500/15 text-emerald-200';
  }
  if (status === 'pending' || status === 'submitted') {
    return 'bg-amber-500/15 text-amber-200';
  }
  if (status === 'declined' || status === 'cancelled' || status === 'draft') {
    return 'bg-red-500/15 text-red-200';
  }
  return 'bg-slate-700/60 text-slate-200';
}

export default function AdminDashboardPage() {
  const {
    state,
    usersById,
    currentUser,
    visibleConversations,
    teacherDirectory,
    studentUsers,
    currentAssignedTeacher,
    sendMessage,
    markConversationRead,
    userStatus,
    updateUserStatus,
    teacherRequestStatus,
    assignTeacherRequest,
    updateTeacherAvailability,
    transportRequestStatus,
    updateTransportRequestStatus,
    upsertLibraryBook,
    deleteLibraryBook,
    financeSummary,
  } = usePlatform();
  const [libraryDraft, setLibraryDraft] = useState({
    title: '',
    mainCategory: 'Tajweed',
    description: '',
    requiredTier: 'free',
  });

  const activeStudents = useMemo(
    () => studentUsers.filter((student) => student.status === userStatus.APPROVED),
    [studentUsers, userStatus.APPROVED]
  );

  const teacherRequests = useMemo(
    () =>
      [...(state.teacherRequests || [])].sort((a, b) =>
        (b.updatedAt || '').localeCompare(a.updatedAt || '')
      ),
    [state.teacherRequests]
  );

  const counselingSessions = useMemo(
    () =>
      (state.sessions || []).filter((session) => session.serviceType === 'counseling').length,
    [state.sessions]
  );

  const supportConversationCount = useMemo(
    () =>
      visibleConversations.filter((conversation) => conversation.channel === 'support').length,
    [visibleConversations]
  );

  function onAddLibrary(event) {
    event.preventDefault();
    if (!libraryDraft.title.trim() || !libraryDraft.description.trim()) return;
    upsertLibraryBook({
      ...libraryDraft,
      title: libraryDraft.title.trim(),
      subcategory: libraryDraft.mainCategory,
      author: 'SirajOne Admin',
      visibility: 'public',
      publishStatus: 'published',
      readerPages: [
        `${libraryDraft.title.trim()}\n\n${libraryDraft.description.trim()}`,
        'This admin-added library record is ready for future backend upload integration.',
      ],
    });
    setLibraryDraft({
      title: '',
      mainCategory: 'Tajweed',
      description: '',
      requiredTier: 'free',
    });
  }

  return (
    <div className="min-h-screen bg-[#050d0a] text-[#ecfff4]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[28px] border border-emerald-300/22 bg-[linear-gradient(160deg,rgba(6,18,13,0.98),rgba(9,27,18,0.94))] p-6 shadow-[0_30px_70px_-55px_rgba(16,185,129,0.7)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
                Admin app
              </p>
              <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-[3.25rem]">
                Admin control panel
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-8 text-slate-200">
                Manage students, teacher assignment workflows, messaging oversight, transport
                requests, library visibility, and support activity from one role-aware dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-slate-950/35 px-5 py-4 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Signed in as</p>
              <p className="mt-2 text-2xl font-bold text-white">{currentUser?.name}</p>
              <p className="mt-1 text-slate-300">Full admin access is active.</p>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Approved students</p>
            <p className="mt-2 text-3xl font-bold text-white">{activeStudents.length}</p>
            <p className="mt-1 text-sm text-slate-300">Visible student records under active review.</p>
          </article>
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Teacher requests</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {
                teacherRequests.filter(
                  (request) => request.status === teacherRequestStatus.PENDING
                ).length
              }
            </p>
            <p className="mt-1 text-sm text-slate-300">Pending teacher assignment decisions.</p>
          </article>
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Support activity</p>
            <p className="mt-2 text-3xl font-bold text-white">{supportConversationCount}</p>
            <p className="mt-1 text-sm text-slate-300">Support channels with admin oversight.</p>
          </article>
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Counselling sessions</p>
            <p className="mt-2 text-3xl font-bold text-white">{counselingSessions}</p>
            <p className="mt-1 text-sm text-slate-300">Support access patterns visible to admin.</p>
          </article>
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Student records</h2>
            </div>
            <div className="mt-5 space-y-3">
              {studentUsers.length === 0 ? (
                <p className="text-sm text-slate-300">No student records yet.</p>
              ) : (
                studentUsers.map((student) => {
                  const assignment = state.teacherAssignments.find(
                    (item) => item.studentId === student.id && item.status === 'active'
                  );
                  const teacher = assignment ? usersById[assignment.teacherId] : null;

                  return (
                    <div
                      key={student.id}
                      className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <p className="text-lg font-bold text-white">{student.name}</p>
                          <p className="text-sm text-slate-300">{student.email}</p>
                          <p className="mt-2 text-sm text-slate-200">
                            Assigned teacher: {teacher?.name || 'None yet'}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(student.status)}`}>
                            {student.status}
                          </span>
                          {student.status !== userStatus.APPROVED ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateUserStatus(student.id, userStatus.APPROVED)}
                            >
                              Approve
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </article>

          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Teacher request workflow</h2>
            </div>
            <div className="mt-5 space-y-3">
              {teacherRequests.length === 0 ? (
                <p className="text-sm text-slate-300">No teacher requests submitted yet.</p>
              ) : (
                teacherRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {usersById[request.studentId]?.name || 'Student'} →{' '}
                          {usersById[request.teacherId]?.name || 'Teacher'}
                        </p>
                        <p className="mt-2 text-sm text-slate-300">
                          {request.note || 'No student note attached.'}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {request.status === teacherRequestStatus.PENDING ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => assignTeacherRequest(request.id, 'approved')}
                        >
                          Approve teacher
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => assignTeacherRequest(request.id, 'declined')}
                        >
                          Decline
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Teacher listings</h2>
            </div>
            <div className="mt-5 space-y-3">
              {teacherDirectory.map((teacher) => (
                <div
                  key={teacher.id}
                  className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{teacher.name}</p>
                      <p className="text-sm text-slate-300">{teacher.subjects}</p>
                    </div>
                    <select
                      value={teacher.availability || 'available'}
                      onChange={(event) =>
                        updateTeacherAvailability(teacher.id, event.target.value)
                      }
                      className="rounded-xl border border-emerald-300/20 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Messaging oversight</h2>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Support and teacher channels remain distinct for students, while this admin view keeps
              platform-wide oversight available when intervention is required.
            </p>
            <div className="mt-5">
              <ChatPanel
                conversations={visibleConversations}
                usersById={usersById}
                currentUser={currentUser}
                onSend={sendMessage}
                onOpenConversation={markConversationRead}
              />
            </div>
          </article>
        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="panel-base p-5 xl:col-span-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Letter lesson workspace</h2>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              Admin sees the same Hamzah and Bā’ lesson cards and workspace students use. This
              keeps content review, future teacher uploads, and lesson QA on a single reusable
              system instead of separate competing views.
            </p>
            <div className="mt-5">
              <LetterLessonExperience
                eyebrow="Shared lesson system"
                title="Available letter lessons"
                subtitle="Only completed lessons are visible right now. Use this shared workspace to review tabs, diagram behavior, audio, and practice flow."
                mode="admin"
              />
            </div>
          </article>

        </section>

        <section className="mt-7 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <BusFront size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Transport requests</h2>
            </div>
            <div className="mt-5 space-y-3">
              {(state.transportRequests || []).length === 0 ? (
                <p className="text-sm text-slate-300">No transport requests yet.</p>
              ) : (
                state.transportRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {request.pickupArea} → {request.destination}
                        </p>
                        <p className="text-sm text-slate-300">
                          {usersById[request.requesterId]?.name || 'Student'}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    {request.status === transportRequestStatus.SUBMITTED ||
                    request.status === transportRequestStatus.PENDING_REVIEW ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            updateTransportRequestStatus(
                              request.id,
                              transportRequestStatus.AWAITING_MATCH
                            )
                          }
                        >
                          Mark awaiting match
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            updateTransportRequestStatus(
                              request.id,
                              transportRequestStatus.CANCELLED
                            )
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="panel-base p-5">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-300" />
              <h2 className="text-2xl font-bold text-white">Library visibility and content</h2>
            </div>
            <form onSubmit={onAddLibrary} className="mt-5 grid gap-3">
              <input
                value={libraryDraft.title}
                onChange={(event) =>
                  setLibraryDraft((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Book or resource title"
                className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <input
                value={libraryDraft.mainCategory}
                onChange={(event) =>
                  setLibraryDraft((prev) => ({
                    ...prev,
                    mainCategory: event.target.value,
                  }))
                }
                placeholder="Category"
                className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <textarea
                value={libraryDraft.description}
                onChange={(event) =>
                  setLibraryDraft((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
                placeholder="Description"
                className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <select
                value={libraryDraft.requiredTier}
                onChange={(event) =>
                  setLibraryDraft((prev) => ({
                    ...prev,
                    requiredTier: event.target.value,
                  }))
                }
                className="rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
              <Button type="submit" variant="primary" size="sm">
                Add library item
              </Button>
            </form>

            <div className="mt-5 space-y-3">
              {(state.libraryBooks || []).map((book) => (
                <div
                  key={book.id}
                  className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{book.title}</p>
                      <p className="text-sm text-slate-300">{book.mainCategory}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(book.publishStatus)}`}>
                      {book.publishStatus}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        upsertLibraryBook({
                          ...book,
                          publishStatus:
                            book.publishStatus === 'published' ? 'draft' : 'published',
                        })
                      }
                    >
                      {book.publishStatus === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteLibraryBook(book.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Revenue</p>
            <p className="mt-2 text-3xl font-bold text-white">R {financeSummary.totalRevenue}</p>
            <p className="mt-1 text-sm text-slate-300">Payments tracked in the local admin workflow.</p>
          </article>
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Platform share</p>
            <p className="mt-2 text-3xl font-bold text-white">R {financeSummary.platformEarnings}</p>
            <p className="mt-1 text-sm text-slate-300">Admin financial oversight summary.</p>
          </article>
          <article className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Teacher payouts</p>
            <p className="mt-2 text-3xl font-bold text-white">R {financeSummary.providerEarnings}</p>
            <p className="mt-1 text-sm text-slate-300">Visible to admin for future backend payout flow.</p>
          </article>
        </section>
      </div>
    </div>
  );
}
