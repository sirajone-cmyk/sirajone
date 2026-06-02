import React, { useMemo, useState } from 'react';
import { MessageCircle, Shield, UserRound } from 'lucide-react';
import { ChatPanel } from '../components/platform/ChatPanel';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

const TABS = {
  SUPPORT: 'support',
  TEACHER: 'teacher',
  OVERSIGHT: 'oversight',
};

export default function MessagesPage() {
  const {
    currentUser,
    isAdmin,
    usersById,
    visibleConversations,
    conversationChannels,
    sendMessage,
    markConversationRead,
    startSupportConversation,
    startTeacherConversation,
    currentAssignedTeacher,
    supportTarget,
  } = usePlatform();
  const [activeTab, setActiveTab] = useState(isAdmin ? TABS.OVERSIGHT : TABS.SUPPORT);
  const [notice, setNotice] = useState('');

  const supportConversations = useMemo(
    () =>
      visibleConversations.filter(
        (conversation) => conversation.channel === conversationChannels.SUPPORT
      ),
    [visibleConversations, conversationChannels.SUPPORT]
  );

  const teacherConversations = useMemo(
    () =>
      visibleConversations.filter(
        (conversation) => conversation.channel === conversationChannels.TEACHER_PRIVATE
      ),
    [visibleConversations, conversationChannels.TEACHER_PRIVATE]
  );

  function onStartSupport() {
    const conversationId = startSupportConversation();
    if (conversationId) {
      markConversationRead(conversationId);
      setNotice('Support conversation is ready. You can message support below.');
      setActiveTab(isAdmin ? TABS.OVERSIGHT : TABS.SUPPORT);
    }
  }

  function onStartTeacher() {
    try {
      const conversationId = startTeacherConversation();
      if (conversationId) {
        markConversationRead(conversationId);
        setNotice('Private teacher chat is ready below.');
        setActiveTab(TABS.TEACHER);
      }
    } catch (error) {
      setNotice(error.message || 'Teacher chat is not available yet.');
    }
  }

  const activeConversations = isAdmin
    ? visibleConversations
    : activeTab === TABS.TEACHER
    ? teacherConversations
    : supportConversations;
  const hasVisibleConversations = activeConversations.length > 0;

  return (
    <div className="space-y-7">
      <div className="section-head">
        <p className="section-eyebrow">Messaging</p>
        <h1 className="section-title">
          {isAdmin ? 'Admin communications oversight' : 'Support and private messaging'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          {isAdmin
            ? 'Admins can monitor support conversations, teacher-student channels, and intervene when platform support is needed.'
            : 'Use support for general platform help and your assigned teacher channel for private study communication.'}
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <MessageCircle size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Contact support</h2>
              <p className="text-sm text-slate-300">
                General admin and platform help for every app user.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {supportTarget
              ? `Support is routed to ${supportTarget.name}.`
              : 'Support becomes available once the platform has an approved admin or counsellor account.'}
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={onStartSupport}>
              Open support chat
            </Button>
          </div>
        </article>

        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <UserRound size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Message teacher</h2>
              <p className="text-sm text-slate-300">
                Private chat becomes active once a teacher is assigned.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {currentAssignedTeacher
              ? `You are connected with ${currentAssignedTeacher.name}.`
              : 'No teacher chat is available until admin approves your teacher request.'}
          </p>
          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onStartTeacher}
              disabled={!currentAssignedTeacher}
            >
              Open teacher chat
            </Button>
          </div>
        </article>

        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <Shield size={18} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Admin oversight</h2>
              <p className="text-sm text-slate-300">
                Structured oversight with separate student-facing UI.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {isAdmin
              ? 'You can review support and teacher conversations in this admin-only view.'
              : 'Teacher chat remains private in the student experience, while admin retains platform oversight separately in /admin.'}
          </p>
        </article>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-emerald-300/22 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}

      {!isAdmin ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                Contact Support
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Use this for admin help, account questions, transport support, counselling access,
                and general assistance.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-300/15 bg-slate-900/55 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">
                Message Teacher
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Private teacher chat is reserved for enrolled students with an assigned teacher.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
          <Button
            variant={activeTab === TABS.SUPPORT ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(TABS.SUPPORT)}
          >
            Contact Support
          </Button>
          <Button
            variant={activeTab === TABS.TEACHER ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(TABS.TEACHER)}
            disabled={!currentAssignedTeacher}
          >
            Message Teacher
          </Button>
          </div>

          {!currentAssignedTeacher ? (
            <div className="rounded-2xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              You need to select a teacher first before private teacher chat becomes available.
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTab === TABS.TEACHER && !currentAssignedTeacher && !isAdmin ? (
        <section className="rounded-3xl border border-emerald-300/24 bg-[rgba(8,20,14,0.8)] p-6">
          <p className="text-xl font-bold text-white">Teacher chat is locked for now</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Select your teacher first, then this page will open your private teacher conversation
            automatically.
          </p>
        </section>
      ) : !hasVisibleConversations && !isAdmin ? (
        <section className="rounded-3xl border border-emerald-300/24 bg-[rgba(8,20,14,0.8)] p-6">
          <p className="text-xl font-bold text-white">
            {activeTab === TABS.SUPPORT ? 'No support messages yet' : 'No teacher messages yet'}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {activeTab === TABS.SUPPORT
              ? 'Open a support chat to ask for admin help, counselling access, or transport guidance.'
              : 'Once your teacher is assigned, this area becomes your private lesson communication space.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {activeTab === TABS.SUPPORT ? (
              <Button variant="primary" size="sm" onClick={onStartSupport}>
                Contact support now
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={() => setActiveTab(TABS.SUPPORT)}>
                Open support instead
              </Button>
            )}
          </div>
        </section>
      ) : (
        <ChatPanel
          conversations={activeConversations}
          usersById={usersById}
          currentUser={currentUser}
          onSend={sendMessage}
          onOpenConversation={markConversationRead}
        />
      )}
    </div>
  );
}
