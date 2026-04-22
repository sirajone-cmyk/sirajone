import React, { useMemo, useState } from 'react';
import { MessageCircle, Search, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

function formatShort(isoDate) {
  try {
    return new Date(isoDate).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

export function ChatPanel({ conversations, usersById, currentUser, onSend, onOpenConversation }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return conversations.filter((conversation) => {
      const otherId = (conversation.participantIds || []).find((id) => id !== currentUser?.id);
      const otherUser = otherId ? usersById[otherId] : null;
      const name = (otherUser?.name || 'Conversation').toLowerCase();
      return name.includes(q);
    });
  }, [conversations, currentUser, usersById, query]);

  const selectedConversation = filtered.find((conversation) => conversation.id === selectedId) || filtered[0] || null;

  function selectConversation(conversationId) {
    setSelectedId(conversationId);
    if (onOpenConversation) {
      onOpenConversation(conversationId);
    }
  }

  function handleSend() {
    if (!selectedConversation || !draft.trim()) return;
    onSend(selectedConversation.id, draft);
    setDraft('');
  }

  return (
    <section id="messages" className="rounded-3xl border border-[rgba(34,197,94,0.24)] bg-[rgba(8,20,14,0.8)]">
      <div className="grid md:grid-cols-[360px_1fr]">
        <aside className="border-b border-[rgba(34,197,94,0.16)] p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl md:text-3xl font-bold text-white inline-flex items-center gap-2"><MessageCircle size={18} className="text-[#38df95]" /> Messages</h3>
            <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-xs font-semibold text-white">
              {conversations.reduce((total, conversation) => total + ((conversation.unreadFor || []).includes(currentUser?.id) ? 1 : 0), 0)}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[rgba(148,163,184,0.35)] bg-[rgba(31,41,55,0.52)] px-3 py-2">
            <Search size={14} className="text-[rgba(217,251,232,0.62)]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations..."
              className="border-none bg-transparent p-0 text-sm focus:shadow-none"
            />
          </div>

          <div className="mt-4 space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.7)] px-3 py-4 text-sm text-[rgba(217,251,232,0.62)]">
                No messages yet.
              </div>
            ) : (
              filtered.map((conversation) => {
                const otherId = (conversation.participantIds || []).find((id) => id !== currentUser?.id);
                const otherUser = otherId ? usersById[otherId] : null;
                const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                const unread = (conversation.unreadFor || []).includes(currentUser?.id);

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => selectConversation(conversation.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${selectedConversation?.id === conversation.id ? 'border-[rgba(34,197,94,0.48)] bg-[rgba(34,197,94,0.12)]' : 'border-transparent bg-transparent hover:bg-[rgba(34,197,94,0.08)]'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-[#ecfff4]">{otherUser?.name || 'Conversation'}</p>
                      {unread ? <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-xs text-white">New</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-[rgba(217,251,232,0.66)] line-clamp-1">{lastMessage?.text || 'No messages yet.'}</p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <div className="p-4">
          {selectedConversation ? (
            <>
              <div className="rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(17,26,21,0.78)] p-3">
                {(() => {
                  const otherId = (selectedConversation.participantIds || []).find((id) => id !== currentUser?.id);
                  const otherUser = otherId ? usersById[otherId] : null;
                  return (
                    <>
                      <p className="text-white font-semibold">{otherUser?.name || 'Conversation'}</p>
                      <p className="text-xs text-[rgba(217,251,232,0.58)]">{otherUser?.role || ''}</p>
                    </>
                  );
                })()}
              </div>

              <div className="mt-3 min-h-[240px] max-h-[420px] overflow-y-auto space-y-2 rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(17,26,21,0.65)] p-3">
                {(selectedConversation.messages || []).length === 0 ? (
                  <div className="text-sm text-[rgba(217,251,232,0.62)]">No messages yet. Start the conversation.</div>
                ) : (
                  selectedConversation.messages.map((message) => {
                    const isMine = message.senderId === currentUser?.id;
                    return (
                      <div key={message.id} className={`max-w-[85%] rounded-xl px-3 py-2 ${isMine ? 'ml-auto bg-[rgba(34,197,94,0.22)] text-[#dcfce7]' : 'bg-[rgba(51,65,85,0.55)] text-[#e2e8f0]'}`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className="mt-1 text-[11px] opacity-75">{formatShort(message.createdAt)}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button variant="primary" size="sm" onClick={handleSend}>
                  <Send size={14} /> Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center text-[rgba(217,251,232,0.62)]">No conversations yet.</div>
          )}
        </div>
      </div>
    </section>
  );
}
