import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Send, Search, MessageCircle, Trash2, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminMessages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Listen to all conversations in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'conversations'), (snap) => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  // Listen to messages for selected conversation
  useEffect(() => {
    if (!selected) return;
    const q = query(
      collection(db, 'messages'),
      where('conversation_id', '==', selected.id),
      orderBy('created_at', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    // Mark as read
    updateDoc(doc(db, 'conversations', selected.id), { unread_by_admin: 0 });
    return unsub;
  }, [selected]);

  const sendReply = async () => {
    if (!input.trim() || sending || !selected) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    await addDoc(collection(db, 'messages'), {
      conversation_id: selected.id,
      sender_uid: user.uid,
      sender_email: user.email,
      sender_name: user.full_name || 'Admin',
      sender_role: 'Admin',
      content: text,
      is_read: false,
      created_at: serverTimestamp(),
    });
    await updateDoc(doc(db, 'conversations', selected.id), {
      last_message: text,
      last_message_at: serverTimestamp(),
      unread_by_student: 1,
    });
    setSending(false);
  };

  const deleteConversation = async (conv) => {
    if (!confirm('Delete this conversation?')) return;
    const msgs = await getDocs(query(collection(db, 'messages'), where('conversation_id', '==', conv.id)));
    await Promise.all(msgs.docs.map(d => deleteDoc(d.ref)));
    await deleteDoc(doc(db, 'conversations', conv.id));
    if (selected?.id === conv.id) { setSelected(null); setMessages([]); }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); }
  };

  const filtered = conversations.filter(c =>
    c.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.student_email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_by_admin || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-6 gap-4">

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
            Messages
            {totalUnread > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{totalUnread}</span>}
          </h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="w-full bg-white/8 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {filtered.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">No conversations yet.</div>}
            {filtered.map(conv => (
              <div key={conv.id} onClick={() => setSelected(conv)}
                className={`group flex items-start gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${selected?.id === conv.id ? 'bg-emerald-900/40 border border-emerald-800' : 'hover:bg-white/5'}`}>
                <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-800 flex items-center justify-center flex-shrink-0 text-sm font-bold text-emerald-400">
                  {conv.student_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-white truncate">{conv.student_name || conv.student_email}</span>
                    {conv.unread_by_admin > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">{conv.unread_by_admin}</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">{conv.last_message || 'No messages yet'}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteConversation(conv); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-red-400 hover:bg-red-900/40 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 flex flex-col bg-white/3 border border-white/8 rounded-3xl overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-slate-500">
              <MessageCircle className="w-10 h-10 text-slate-600" />
              <p className="text-sm">Select a conversation to reply</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center font-bold text-emerald-400">
                    {selected.student_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{selected.student_name}</div>
                    <div className="text-xs text-slate-500">{selected.student_email}</div>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setMessages([]); }} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/8 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(m => {
                  const isAdmin = m.sender_role === 'Admin' || m.sender_role === 'Co-Admin';
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isAdmin ? 'bg-emerald-700 text-white' : 'bg-white/8 border border-white/10 text-slate-200'}`}>
                        {!isAdmin && <div className="text-xs text-emerald-400 font-semibold mb-1">{m.sender_name}</div>}
                        <p className="text-sm leading-relaxed">{m.content}</p>
                        <div className={`text-xs mt-1 ${isAdmin ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {m.created_at?.toDate ? new Date(m.created_at.toDate()).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '...'}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="px-4 pb-4 pt-3 border-t border-white/8 flex gap-2 items-end">
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Type a reply..." rows={2}
                  className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                <button onClick={sendReply} disabled={!input.trim() || sending}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
