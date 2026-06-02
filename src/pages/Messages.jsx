import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, serverTimestamp, getDocs, setDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Messages() {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => { init(); }, [user]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const init = async () => {
    if (!user) return;
    // Find or create conversation for this user
    const convRef = doc(db, 'conversations', user.uid);
    const convSnap = await getDocs(query(collection(db, 'conversations'), where('student_uid', '==', user.uid)));
    
    let convId;
    if (convSnap.empty) {
      await setDoc(convRef, {
        student_uid: user.uid,
        student_email: user.email,
        student_name: user.full_name || user.email,
        unread_by_admin: 0,
        unread_by_student: 0,
        status: 'open',
        created_at: serverTimestamp(),
      });
      convId = user.uid;
    } else {
      convId = convSnap.docs[0].id;
    }
    setConversation({ id: convId });
    setLoading(false);
  };

  useEffect(() => {
    if (!conversation) return;
    const q = query(
      collection(db, 'messages'),
      where('conversation_id', '==', conversation.id),
      orderBy('created_at', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [conversation]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !conversation) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversation.id,
      sender_uid: user.uid,
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      sender_role: user.role || 'Student',
      content: text,
      is_read: false,
      created_at: serverTimestamp(),
    });
    await updateDoc(doc(db, 'conversations', conversation.id), {
      last_message: text,
      last_message_at: serverTimestamp(),
      unread_by_admin: 1,
    });
    setSending(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-bold text-white">Madrasah Admin</div>
            <div className="text-xs text-emerald-400">Ustādh Hāshim · Support & Guidance</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0 max-h-[calc(100vh-280px)]">
          {messages.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No messages yet. Send a message to get started.</div>
          )}
          {messages.map(m => {
            const isMe = m.sender_uid === user?.uid;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? 'bg-emerald-700 text-white' : 'bg-white/8 border border-white/10 text-slate-200'}`}>
                  {!isMe && <div className="text-xs text-emerald-400 font-semibold mb-1">{m.sender_name}</div>}
                  <p className="text-sm leading-relaxed">{m.content}</p>
                  <div className={`text-xs mt-1 ${isMe ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {m.created_at?.toDate ? new Date(m.created_at.toDate()).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '...'}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 items-end border-t border-white/10 pt-4">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Type a message..." rows={2}
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          <button onClick={sendMessage} disabled={!input.trim() || sending}
            className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
