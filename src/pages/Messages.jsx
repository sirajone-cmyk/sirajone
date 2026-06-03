import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Bell,
  BookOpen,
  Loader2,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { ROLES } from '@/lib/roles';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSubjectLabel } from '@/lib/subjects';

const BROADCAST_AUDIENCES = Object.freeze({
  TEACHERS: 'Teachers',
  STUDENTS: 'Students',
});

const CONVERSATION_TYPES = Object.freeze({
  SUPPORT: 'support',
  DIRECT: 'direct',
  TEACHER: 'teacher',
  BROADCAST: 'broadcast',
});

function userDisplayName(user) {
  return user?.full_name || user?.name || user?.email || 'SirajOne User';
}

function formatMessageTime(value) {
  if (!value?.toDate) return 'Sending...';
  return value.toDate().toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sortByUpdatedAt(items) {
  return [...items].sort((a, b) => {
    const aTime = a.updatedAt?.toMillis?.() || a.lastMessageAt?.toMillis?.() || 0;
    const bTime = b.updatedAt?.toMillis?.() || b.lastMessageAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
}

function directConversationId(uidA, uidB) {
  return `direct_${[uidA, uidB].sort().join('_')}`;
}

function teacherConversationId(teacherId, studentId) {
  return `teacher_${teacherId}_${studentId}`;
}

function supportConversationId(userId) {
  return `support_${userId}`;
}

function broadcastConversationId(audience) {
  return `broadcast_${audience.toLowerCase()}`;
}

function conversationTitle(conversation, currentUser) {
  if (conversation.title) return conversation.title;
  if (conversation.type === CONVERSATION_TYPES.BROADCAST) return `${conversation.audience} Broadcast`;
  if (conversation.type === CONVERSATION_TYPES.SUPPORT) return 'SirajOne Admin Support';

  const names = conversation.participantNames || {};
  const otherId = (conversation.participantIds || []).find((id) => id !== currentUser?.uid);
  return names[otherId] || conversation.studentName || conversation.teacherName || 'Private Conversation';
}

function conversationSubtitle(conversation) {
  if (conversation.type === CONVERSATION_TYPES.BROADCAST) return 'Platform-wide announcement room';
  if (conversation.type === CONVERSATION_TYPES.SUPPORT) return 'Direct support line to SirajOne admin';
  if (conversation.type === CONVERSATION_TYPES.TEACHER) return 'Teacher and student private room';
  return 'One-on-one private chat';
}

function normalizeTeacher(docSnap) {
  const data = docSnap.data() || {};
  return {
    uid: data.uid || docSnap.id,
    name: data.name || 'Teacher',
    bio: data.bio || '',
    assignedSubjects: Array.isArray(data.assignedSubjects) ? data.assignedSubjects : [],
    profileStatus: data.profileStatus || 'pending',
  };
}

function ContactButton({ icon: Icon, title, subtitle, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-emerald-700 hover:bg-emerald-950/35 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-800 bg-emerald-950/70 text-emerald-300">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ message, isMine, onDelete }) {
  return (
    <div className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
          isMine
            ? 'bg-emerald-700 text-white'
            : 'border border-white/10 bg-white/8 text-slate-200'
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-3">
          <span className={`text-xs font-bold ${isMine ? 'text-emerald-100' : 'text-emerald-400'}`}>
            {message.senderName || 'SirajOne User'}
          </span>
          {isMine ? (
            <button
              type="button"
              onClick={() => onDelete(message)}
              className="rounded-lg p-1 text-emerald-100 opacity-0 transition hover:bg-emerald-900/60 hover:text-white group-hover:opacity-100"
              aria-label="Delete message"
              title="Delete message"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
        <div className={`mt-1 text-[11px] ${isMine ? 'text-emerald-100/75' : 'text-slate-500'}`}>
          {formatMessageTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [broadcastConversations, setBroadcastConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.CO_ADMIN;
  const isTeacher = user?.role === ROLES.TEACHER;
  const isStudent = user?.role === ROLES.STUDENT;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user?.uid) return undefined;

    setLoadingConversations(true);
    setError('');

    if (isAdmin) {
      const unsubscribe = onSnapshot(
        collection(db, 'conversations'),
        (snapshot) => {
          setConversations(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
          setLoadingConversations(false);
        },
        (err) => {
          console.error('Unable to load conversations:', err);
          setError('Unable to load conversations right now.');
          setLoadingConversations(false);
        }
      );
      return unsubscribe;
    }

    const personalQuery = query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', user.uid)
    );

    const audience = isTeacher ? BROADCAST_AUDIENCES.TEACHERS : BROADCAST_AUDIENCES.STUDENTS;
    const broadcastQuery = query(
      collection(db, 'conversations'),
      where('type', '==', CONVERSATION_TYPES.BROADCAST),
      where('audience', '==', audience)
    );

    const unsubscribePersonal = onSnapshot(
      personalQuery,
      (snapshot) => {
        setConversations(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setLoadingConversations(false);
      },
      (err) => {
        console.error('Unable to load personal conversations:', err);
        setError('Unable to load your conversations right now.');
        setLoadingConversations(false);
      }
    );

    const unsubscribeBroadcast = onSnapshot(
      broadcastQuery,
      (snapshot) => {
        setBroadcastConversations(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      (err) => {
        console.error('Unable to load broadcast conversations:', err);
      }
    );

    return () => {
      unsubscribePersonal();
      unsubscribeBroadcast();
    };
  }, [isAdmin, isTeacher, user?.uid]);

  useEffect(() => {
    if (!user?.uid || isTeacher) return undefined;

    const teachersQuery = query(
      collection(db, 'teachers'),
      where('profileStatus', '==', 'approved')
    );

    return onSnapshot(
      teachersQuery,
      (snapshot) => {
        setTeachers(snapshot.docs.map(normalizeTeacher));
      },
      (err) => {
        console.error('Unable to load teachers:', err);
      }
    );
  }, [isTeacher, user?.uid]);

  useEffect(() => {
    if (!isAdmin || !user?.uid) return undefined;

    return onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setUsers(snapshot.docs.map((item) => ({ uid: item.id, ...item.data() })));
      },
      (err) => {
        console.error('Unable to load user directory:', err);
      }
    );
  }, [isAdmin, user?.uid]);

  useEffect(() => {
    if (!selected?.id) {
      setMessages([]);
      return undefined;
    }

    const messagesQuery = query(
      collection(db, 'conversations', selected.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      },
      (err) => {
        console.error('Unable to load messages:', err);
        setError('Unable to load messages for this conversation.');
      }
    );
  }, [selected?.id]);

  const visibleConversations = useMemo(() => {
    const merged = new Map();
    [...conversations, ...broadcastConversations].forEach((conversation) => {
      merged.set(conversation.id, conversation);
    });

    const normalizedSearch = search.trim().toLowerCase();
    const sorted = sortByUpdatedAt([...merged.values()]);
    if (!normalizedSearch) return sorted;

    return sorted.filter((conversation) => {
      const haystack = [
        conversationTitle(conversation, user),
        conversationSubtitle(conversation),
        conversation.lastMessage,
        conversation.audience,
        conversation.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [broadcastConversations, conversations, search, user]);

  async function openConversation(conversationSeed) {
    setError('');
    const conversationRef = doc(db, 'conversations', conversationSeed.id);
    const now = serverTimestamp();

    await setDoc(
      conversationRef,
      {
        ...conversationSeed,
        createdBy: conversationSeed.createdBy || user.uid,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );

    setSelected(conversationSeed);
  }

  function openSupportRoom() {
    return openConversation({
      id: supportConversationId(user.uid),
      type: CONVERSATION_TYPES.SUPPORT,
      title: 'SirajOne Admin Support',
      participantIds: [user.uid],
      participantRoles: [user.role],
      participantNames: { [user.uid]: userDisplayName(user) },
    });
  }

  function openTeacherRoom(teacher) {
    return openConversation({
      id: teacherConversationId(teacher.uid, user.uid),
      type: CONVERSATION_TYPES.TEACHER,
      title: teacher.name,
      teacherId: teacher.uid,
      teacherName: teacher.name,
      studentId: user.uid,
      studentName: userDisplayName(user),
      participantIds: [user.uid, teacher.uid],
      participantRoles: [ROLES.STUDENT, ROLES.TEACHER],
      participantNames: {
        [user.uid]: userDisplayName(user),
        [teacher.uid]: teacher.name,
      },
    });
  }

  function openDirectRoom(targetUser) {
    return openConversation({
      id: directConversationId(user.uid, targetUser.uid),
      type: CONVERSATION_TYPES.DIRECT,
      title: targetUser.full_name || targetUser.email || 'Private Chat',
      participantIds: [user.uid, targetUser.uid],
      participantRoles: [user.role, targetUser.role],
      participantNames: {
        [user.uid]: userDisplayName(user),
        [targetUser.uid]: targetUser.full_name || targetUser.email || 'SirajOne User',
      },
    });
  }

  function openBroadcastRoom(audience) {
    return openConversation({
      id: broadcastConversationId(audience),
      type: CONVERSATION_TYPES.BROADCAST,
      title: `${audience} Broadcast`,
      audience,
      participantIds: [user.uid],
      participantRoles: [user.role],
      participantNames: { [user.uid]: userDisplayName(user) },
    });
  }

  async function sendMessage() {
    if (!typedMessage.trim() || !selected?.id || sending) return;

    const body = typedMessage.trim();
    setTypedMessage('');
    setSending(true);
    setError('');

    try {
      await addDoc(collection(db, 'conversations', selected.id, 'messages'), {
        body,
        senderId: user.uid,
        senderName: userDisplayName(user),
        senderRole: user.role,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, 'conversations', selected.id),
        {
          lastMessage: body,
          lastMessageAt: serverTimestamp(),
          lastSenderId: user.uid,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Unable to send message:', err);
      setTypedMessage(body);
      setError('Unable to send this message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function deleteOwnMessage(message) {
    if (message.senderId !== user.uid) return;
    if (!selected?.id) return;
    if (!window.confirm('Delete this message from the conversation?')) return;

    try {
      await deleteDoc(doc(db, 'conversations', selected.id, 'messages', message.id));
    } catch (err) {
      console.error('Unable to delete message:', err);
      setError('Unable to delete this message right now.');
    }
  }

  function handleComposerKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  const directUsers = useMemo(() => {
    if (!isAdmin) return [];
    return users
      .filter((item) => item.uid !== user?.uid)
      .filter((item) => [ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN, ROLES.CO_ADMIN].includes(item.role));
  }, [isAdmin, user?.uid, users]);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 lg:flex-row">
        <aside className="w-full flex-shrink-0 space-y-4 lg:w-80">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-500">Real-time Messaging</span>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold text-white">
              <MessageCircle className="h-6 w-6 text-emerald-400" /> Messages
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Secure SirajOne conversations for support, classes, and announcements.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-2xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="mt-3 max-h-[42vh] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-330px)]">
              {loadingConversations ? (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" /> Loading rooms...
                </div>
              ) : null}

              {!loadingConversations && visibleConversations.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-6 text-center text-sm text-slate-500">
                  No conversations yet.
                </div>
              ) : null}

              {visibleConversations.map((conversation) => {
                const active = selected?.id === conversation.id;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelected(conversation)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? 'border-emerald-700 bg-emerald-950/60'
                        : 'border-white/8 bg-white/4 hover:border-emerald-900 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-900 bg-emerald-950/70 text-emerald-300">
                        {conversation.type === CONVERSATION_TYPES.BROADCAST ? <Bell className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">{conversationTitle(conversation, user)}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{conversation.lastMessage || conversationSubtitle(conversation)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex min-h-[72vh] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/4">
          {selected ? (
            <>
              <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-white">{conversationTitle(selected, user)}</p>
                  <p className="text-xs text-slate-500">{conversationSubtitle(selected)}</p>
                </div>
                <span className="rounded-full border border-emerald-900 bg-emerald-950/70 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {selected.type || 'chat'}
                </span>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
                {messages.length === 0 ? (
                  <div className="flex h-full min-h-[260px] items-center justify-center text-center text-sm text-slate-500">
                    No messages yet. Use the composer below to start.
                  </div>
                ) : null}

                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isMine={message.senderId === user?.uid}
                    onDelete={deleteOwnMessage}
                  />
                ))}
                <div ref={bottomRef} />
              </div>

              {error ? (
                <div className="mx-4 mb-3 rounded-2xl border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <footer className="border-t border-white/10 p-4">
                {typedMessage.trim() ? (
                  <div className="mb-3 rounded-2xl border border-emerald-900 bg-emerald-950/30 px-4 py-3">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">Draft Preview</p>
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">{typedMessage}</p>
                  </div>
                ) : null}

                <div className="flex items-end gap-2">
                  <textarea
                    value={typedMessage}
                    onChange={(event) => setTypedMessage(event.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    rows={3}
                    placeholder="Type your message..."
                    className="min-h-[92px] flex-1 resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!typedMessage.trim() || sending}
                    className="inline-flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-slate-600">Press Enter to send. Use Shift+Enter for a new line.</p>
              </footer>
            </>
          ) : (
            <div className="flex h-full flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <MessageCircle className="mb-4 h-12 w-12 text-slate-700" />
              <h2 className="text-2xl font-bold text-white">Choose or create a room</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Select a conversation from the left, or open one of the pathways below.
              </p>
            </div>
          )}
        </section>

        <aside className="w-full flex-shrink-0 space-y-3 lg:w-80">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Start Chat
            </h2>

            <div className="mt-4 space-y-3">
              {isAdmin ? (
                <>
                  <ContactButton
                    icon={Bell}
                    title="Broadcast to Teachers"
                    subtitle="Send one announcement room to every approved teacher."
                    onClick={() => openBroadcastRoom(BROADCAST_AUDIENCES.TEACHERS)}
                  />
                  <ContactButton
                    icon={Bell}
                    title="Broadcast to Students"
                    subtitle="Send one announcement room to every approved student."
                    onClick={() => openBroadcastRoom(BROADCAST_AUDIENCES.STUDENTS)}
                  />

                  <div className="pt-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">One-on-one users</p>
                    <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                      {directUsers.length === 0 ? (
                        <p className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-500">No users found yet.</p>
                      ) : null}
                      {directUsers.map((item) => (
                        <ContactButton
                          key={item.uid}
                          icon={UserRound}
                          title={item.full_name || item.email || 'SirajOne User'}
                          subtitle={`${item.role || 'User'} - ${item.email || 'No email saved'}`}
                          onClick={() => openDirectRoom(item)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {isStudent ? (
                <>
                  <ContactButton
                    icon={ShieldCheck}
                    title="Admin Support"
                    subtitle="Open a private support line with SirajOne admin."
                    onClick={openSupportRoom}
                  />
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Teacher rooms</p>
                    <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                      {teachers.length === 0 ? (
                        <p className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-500">No approved teachers available yet.</p>
                      ) : null}
                      {teachers.map((teacher) => (
                        <ContactButton
                          key={teacher.uid}
                          icon={BookOpen}
                          title={teacher.name}
                          subtitle={teacher.assignedSubjects.map(getSubjectLabel).join(', ') || 'SirajOne teacher'}
                          onClick={() => openTeacherRoom(teacher)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {isTeacher ? (
                <>
                  <ContactButton
                    icon={ShieldCheck}
                    title="Admin Support"
                    subtitle="Message SirajOne admin about classes, students, or platform support."
                    onClick={openSupportRoom}
                  />
                  <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm leading-relaxed text-slate-500">
                    Student rooms appear here when a student or admin opens an assigned teacher conversation with you.
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}