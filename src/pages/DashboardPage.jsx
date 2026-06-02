import React, { useMemo, useState } from 'react';
import { ArrowRight, Award, BookOpen, BusFront, CheckCircle2, LifeBuoy, MessageCircle, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

const STARTER_ACTIONS = [
  {
    key: 'letters',
    title: 'Start with letters',
    description: 'Open the letter guide and begin with the foundations of sound and articulation.',
    icon: BookOpen,
    page: 'letters',
  },
  {
    key: 'teachers',
    title: 'Choose a teacher',
    description: 'Browse available teachers and request the one that fits your level and goals.',
    icon: UserCheck,
    page: 'teachers',
  },
  {
    key: 'messages',
    title: 'Contact support',
    description: 'Reach admin or support directly for setup, timetable, or access help.',
    icon: MessageCircle,
    page: 'messages',
  },
  {
    key: 'support',
    title: 'Request ride or counselling',
    description: 'Use the support area for transport requests and counsellor access.',
    icon: BusFront,
    page: 'support',
  },
];

function tierLabel(tier) {
  if (tier === 'premium') return 'Premium';
  if (tier === 'basic') return 'Basic';
  return 'Free tier';
}

function statValue(value, fallback) {
  return value ? value : fallback;
}

export default function DashboardPage({ setPage }) {
  const { studentDashboardData } = usePlatform();

  if (!studentDashboardData) {
    return null;
  }

  const {
    firstName,
    tier,
    level,
    nextMilestone,
    progressPercent,
    completedLessons,
    streakDays,
    streakMessage,
    nextLesson,
    assignedTeacher,
    currentTeacherRequest,
    currentWorkUpdate,
    lastSupportMessage,
    nextStep,
    todaysFocus,
    encouragement,
    learningPath,
    progressState,
    motivationMessage,
  } = studentDashboardData;
  const [completedTodayFocus, setCompletedTodayFocus] = useState(false);

  const hasStarted = completedLessons > 0 || Boolean(nextLesson);
  const completionFeedback = useMemo(() => {
    if (!completedTodayFocus) return null;
    return progressState === 'teacher_selected_no_lessons' || progressState === 'no_teacher'
      ? {
          title: 'Great work today',
          detail: "You completed today's focus. Come back tomorrow to continue your journey.",
        }
      : {
          title: 'Lesson completed',
          detail: "You’ve completed today’s focus. Come back tomorrow to continue your journey.",
        };
  }, [completedTodayFocus, progressState]);
  const onboardingSteps = [
    {
      step: 'Step 1',
      title: 'Choose a teacher',
      detail: assignedTeacher
        ? `${assignedTeacher.name} is already linked to your account.`
        : 'Choose your teacher to begin structured learning.',
      page: 'teachers',
      done: Boolean(assignedTeacher),
    },
    {
      step: 'Step 2',
      title: 'Start with letters and foundations',
      detail: hasStarted
        ? 'Your account now has real learning activity.'
        : 'Open the letter guide and start your first lesson.',
      page: 'letters',
      done: hasStarted,
    },
    {
      step: 'Step 3',
      title: 'Explore the library',
      detail: 'Browse free books first, then unlock more as your plan grows.',
      page: 'library',
      done: false,
    },
    {
      step: 'Step 4',
      title: 'Contact support if needed',
      detail: 'Use support for setup, transport, counselling, or admin help.',
      page: 'messages',
      done: Boolean(lastSupportMessage),
    },
  ];

  return (
    <div className="space-y-7">
      <section className="rounded-[28px] border border-emerald-300/22 bg-[linear-gradient(160deg,rgba(6,18,13,0.98),rgba(9,27,18,0.94))] p-6 shadow-[0_30px_70px_-55px_rgba(16,185,129,0.7)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
              Authenticated Student Workspace
            </p>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-[3.25rem]">
              Assalaamu alaykum, {firstName}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-8 text-slate-200">
              {assignedTeacher
                ? `You are learning with ${assignedTeacher.name}. ${encouragement}`
                : `${encouragement} Your assigned teacher, support updates, and next actions all live here.`}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-300/20 bg-slate-950/35 px-5 py-4 text-sm text-slate-200">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Access plan</p>
            <p className="mt-2 text-2xl font-bold text-white">{tierLabel(tier)}</p>
            <p className="mt-1 text-slate-300">
              Starter modules include letters, teacher browsing, support, transport, and library
              browsing.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-emerald-300/24 bg-[linear-gradient(160deg,rgba(7,22,15,0.98),rgba(13,46,29,0.92))] p-6 shadow-[0_25px_65px_-48px_rgba(16,185,129,0.75)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/90">
              Next Step
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">{nextStep.title}</h2>
            <p className="mt-3 text-[15px] leading-7 text-slate-200">{nextStep.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-300/20 bg-slate-950/25 px-3 py-1 text-xs font-semibold text-emerald-100">
                {progressState === 'no_teacher'
                  ? 'Waiting for teacher selection'
                  : progressState === 'teacher_selected_no_lessons'
                  ? 'Teacher selected'
                  : progressState === 'inactive'
                  ? 'Inactive learner'
                  : 'Active learner'}
              </span>
              {assignedTeacher ? (
                <span className="rounded-full border border-emerald-300/20 bg-slate-950/25 px-3 py-1 text-xs font-semibold text-emerald-100">
                  Your teacher: {assignedTeacher.name}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="sm" onClick={() => setPage(nextStep.page)}>
              {nextStep.actionLabel}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPage('messages')}>
              Contact support
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-emerald-300/24 bg-[linear-gradient(160deg,rgba(8,23,16,0.98),rgba(10,35,24,0.94))] p-6 shadow-[0_30px_70px_-52px_rgba(16,185,129,0.7)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/90">
              Today&apos;s Focus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">{todaysFocus.title}</h2>
            <p className="mt-3 text-[15px] leading-7 text-slate-200">{todaysFocus.detail}</p>
            <p className="mt-3 rounded-2xl border border-emerald-300/18 bg-slate-950/25 px-4 py-3 text-sm text-emerald-100">
              {todaysFocus.instruction}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setCompletedTodayFocus(false);
                setPage(todaysFocus.page);
              }}
            >
              {todaysFocus.actionLabel}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCompletedTodayFocus(true)}
            >
              <CheckCircle2 size={15} />
              Mark today&apos;s focus complete
            </Button>
            {assignedTeacher ? (
              <Button variant="ghost" size="sm" onClick={() => setPage('messages')}>
                Ask your teacher if you need help
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {completionFeedback ? (
        <section className="rounded-[26px] border border-emerald-300/24 bg-[linear-gradient(160deg,rgba(9,29,20,0.98),rgba(18,58,36,0.92))] p-5 shadow-[0_24px_55px_-46px_rgba(16,185,129,0.82)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-500/15 text-emerald-100">
                <Award size={20} />
              </span>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  Completion feedback
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">{completionFeedback.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-200">{completionFeedback.detail}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-slate-950/25 px-4 py-2 text-sm font-semibold text-emerald-100">
              <Sparkles size={14} />
              Great work today
            </span>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-5">
        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Current learning status</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {hasStarted ? 'In progress' : 'Not started yet'}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {hasStarted ? 'Your dashboard is tracking live activity.' : 'Start with a teacher request or the letter guide.'}
          </p>
        </article>

        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Level</p>
          <p className="mt-2 text-2xl font-bold text-white">{level}</p>
          <p className="mt-1 text-sm text-slate-300">
            A simple progress identity based on your current learning journey.
          </p>
        </article>

        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Next milestone</p>
          <p className="mt-2 text-2xl font-bold text-white">{nextMilestone}</p>
          <p className="mt-1 text-sm text-slate-300">
            {level === 'Foundations' ? 'Next: Tajwid Rules' : `Next: ${nextMilestone}`}
          </p>
        </article>

        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Assigned teacher</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {statValue(assignedTeacher?.name, 'Choose a teacher')}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {assignedTeacher
              ? assignedTeacher.subjects || assignedTeacher.audience
              : currentTeacherRequest
              ? `Request ${currentTeacherRequest.status}`
              : 'No teacher assigned yet.'}
          </p>
        </article>

        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Completed lessons</p>
          <p className="mt-2 text-2xl font-bold text-white">{completedLessons}</p>
          <p className="mt-1 text-sm text-slate-300">
            {completedLessons === 0 ? 'No lessons started yet.' : 'Only real completed sessions are counted.'}
          </p>
        </article>

        <article className="panel-base p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Learning streak</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {streakDays === 0 ? 'No streak yet' : `${streakDays} day${streakDays === 1 ? '' : 's'}`}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {streakDays === 0 ? 'Start today to build your streak.' : streakMessage}
          </p>
        </article>
      </section>

      {!hasStarted ? (
        <section className="panel-base border-emerald-300/20 bg-emerald-500/10 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                First-time student onboarding
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">You haven’t started yet</h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Follow these steps to get into your first real lesson quickly and without guesswork.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => setPage(assignedTeacher ? 'letters' : 'teachers')}>
              {assignedTeacher ? 'Start your first lesson' : 'Choose your teacher'}
            </Button>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {onboardingSteps.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setPage(item.page)}
                className="rounded-2xl border border-emerald-300/15 bg-slate-950/30 p-4 text-left transition hover:border-emerald-300/40 hover:bg-slate-950/50 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
                    {item.step}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      item.done
                        ? 'bg-emerald-500/15 text-emerald-200'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.done ? 'Done' : 'Open'}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.detail}</p>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
        <article className="panel-base p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Current work update</h2>
              <p className="mt-1 text-sm text-slate-300">
                This section reflects your real account workflow, not placeholder lesson history.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPage('messages')}>
              Open messages
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-300/18 bg-slate-900/55 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-300">
              {currentWorkUpdate?.title || 'Getting started'}
            </p>
            <p className="mt-3 text-[15px] leading-7 text-slate-200">
              {currentWorkUpdate?.detail ||
                'Choose a teacher, contact support, or start the letter guide to create your first real activity.'}
            </p>
          </div>

            <div className="mt-5 rounded-2xl border border-emerald-300/18 bg-slate-950/30 p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Progress overview</h3>
              <span className="text-sm font-semibold text-emerald-200">{progressPercent}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {progressPercent === 0
                ? 'No progress yet. Your dashboard will update automatically once real sessions are completed.'
                : `${completedLessons} real lesson${completedLessons === 1 ? '' : 's'} completed so far.`}
            </p>
          </div>
        </article>

        <article className="panel-base p-5">
          <h2 className="text-xl font-bold text-white">Learning path</h2>
          <div className="mt-4 space-y-3">
            {learningPath.map((item) => (
              <div key={item.label} className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">{item.label}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      item.status === 'complete'
                        ? 'bg-emerald-500/15 text-emerald-200'
                        : item.status === 'current'
                        ? 'bg-amber-500/15 text-amber-200'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-100">{item.text}</p>
              </div>
            ))}

            {assignedTeacher ? (
              <div className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Your teacher</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{assignedTeacher.name}</p>
                <p className="mt-2 text-sm text-slate-300">
                  {assignedTeacher.subjects || assignedTeacher.audience}
                </p>
                <div className="mt-3">
                  <Button variant="secondary" size="sm" onClick={() => setPage('messages')}>
                    Message teacher
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Next lesson</p>
              <p className="mt-2 text-sm text-slate-100">
                {nextLesson
                  ? new Date(nextLesson.start).toLocaleString('en-ZA', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'No lesson booked yet'}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Teacher status</p>
              <p className="mt-2 text-sm text-slate-100">
                {assignedTeacher
                  ? `${assignedTeacher.name} is currently your assigned teacher.`
                  : currentTeacherRequest
                  ? `Teacher request is ${currentTeacherRequest.status}.`
                  : 'Choose your teacher to begin structured learning.'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {assignedTeacher
                  ? 'Next step: open teacher chat or continue your lesson.'
                  : 'Next step: browse teachers and send your request.'}
              </p>
              {assignedTeacher ? (
                <div className="mt-3">
                  <Button variant="secondary" size="sm" onClick={() => setPage('messages')}>
                    Ask your teacher if you need help
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Support update</p>
              <p className="mt-2 text-sm text-slate-100">
                {lastSupportMessage
                  ? lastSupportMessage.text
                  : 'No support messages yet. You can contact support any time from the messages area.'}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Counsellor access</p>
              <p className="mt-2 text-sm text-slate-100">
                Counsellor Aisha Peer is available through the support area for structured guidance
                and referral support.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="panel-base p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">Starter actions</h2>
            <p className="mt-1 text-sm text-slate-300">
              Helpful secondary actions are here when you need them. Your main step stays highlighted above.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STARTER_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                onClick={() => setPage(action.page)}
                className="rounded-2xl border border-emerald-300/15 bg-slate-900/60 p-4 text-left transition hover:border-emerald-300/45 hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{action.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{action.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel-base border-emerald-300/20 bg-emerald-500/10 p-5">
        <p className="text-sm font-semibold text-emerald-100">{motivationMessage}</p>
        <p className="mt-2 text-sm leading-7 text-slate-200">
          {progressState === 'active'
            ? 'You are progressing well. Keep showing up and your learning identity will keep strengthening.'
            : progressState === 'inactive'
            ? 'A gentle restart today is enough to bring your rhythm back.'
            : 'Consistency is built one sincere step at a time.'}
        </p>
      </section>

      <section className="panel-base border-emerald-300/20 bg-emerald-500/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Session closure</p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {completedTodayFocus
                ? "You've completed today's focus"
                : 'Come back tomorrow to continue your journey'}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {completedTodayFocus
                ? 'That is one more step in building your habit. Keep your rhythm going tomorrow.'
                : 'Even a small return tomorrow keeps your learning identity growing.'}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-slate-950/25 px-4 py-2 text-sm font-semibold text-emerald-100">
            <CheckCircle2 size={14} />
            {completedTodayFocus ? 'Focus completed' : 'Return tomorrow'}
          </span>
        </div>
      </section>

      <section className="panel-base border-emerald-300/20 bg-emerald-500/10 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-slate-950/30 text-emerald-200">
              <LifeBuoy size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Need help getting started?</h2>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Use support for transport, counselling, timetable help, and onboarding assistance.
                If you already have a teacher, you can also open a private teacher chat.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={() => setPage('support')}>
              Open support area
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPage('teachers')}>
              Browse teachers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
