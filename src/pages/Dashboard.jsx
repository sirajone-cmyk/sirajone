import { useState } from 'react';
import Navbar from '../components/Navbar';
import { BookOpen, RefreshCw, Star, CheckCircle, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const MOCK_PLAN = {
  sabaq: { title: 'Lesson 19: Ikhfā Rules', desc: "Today's new lesson: learn the 15 letters of Ikhfā and how to apply them with Noon Sākinah and Tanween.", done: false },
  awalMurajaah: { title: 'Awal Murājaʿah: Lessons 10–15', desc: 'Revise the rules of Idghām with and without Ghunnah. Focus on smooth transitions.', done: false },
  akhirMurajaah: { title: 'Ākhir Murājaʿah: Lessons 1–9', desc: 'Full revision of Makhārij groups and Sifāt pairs (Jahr/Hams, Shiddah/Rikhwah).', done: false },
};

const MOCK_FEEDBACK = [
  { date: '2 Apr 2026', note: 'Excellent progress on Idghām. Pay attention to Meem Mushaddadah — slight shortening noticed.' },
  { date: '30 Mar 2026', note: 'Sabaq completed well. Awal Murājaʿah needs more work. Revise lessons 7–9 before next class.' },
  { date: '28 Mar 2026', note: 'Strong session today. Tajwīd rules are being applied correctly. Keep up the consistency.' },
];

const TAJWID_TOPICS = [
  { name: 'Noon Sākinah & Tanween', status: 'completed' },
  { name: 'Meem Sākinah', status: 'completed' },
  { name: 'Madd Types', status: 'in-progress' },
  { name: 'Qalqalah', status: 'pending' },
  { name: 'Lām Rules', status: 'pending' },
  { name: 'Rā Rules', status: 'pending' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [plan, setPlan] = useState(MOCK_PLAN);

  const studentName = user?.full_name?.split(' ')[0] || 'Student';
  const progress = 45;

  const toggleDone = (key) => {
    setPlan(prev => ({ ...prev, [key]: { ...prev[key], done: !prev[key].done } }));
  };

  const statusColor = (s) => ({
    completed: 'bg-emerald-900 text-emerald-400 border-emerald-800',
    'in-progress': 'bg-amber-900 text-amber-400 border-amber-800',
    pending: 'bg-white/5 text-slate-500 border-white/10',
  }[s]);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">السَّلاَمُ عَلَيْكُم، {studentName}</h1>
          <p className="text-slate-400">Here is your learning plan for today. Consistency is the key to success.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Program', val: 'Tajwīd Foundations', sub: 'Intermediate', icon: BookOpen },
            { label: 'Progress', val: `${progress}%`, sub: '18 of 40 lessons', icon: TrendingUp },
            { label: 'Day Streak', val: '7 days', sub: 'Keep it going!', icon: Star },
            { label: 'Next Class', val: 'Tomorrow', sub: '10:00 AM', icon: Clock },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <s.icon className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-lg leading-tight">{s.val}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.sub}</div>
              <div className="text-slate-600 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-white">Overall Progress</span>
            <span className="text-sm text-emerald-400 font-bold">{progress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">22 lessons remaining to complete Tajwīd Foundations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Today's Lesson Plan
            </h2>
            <div className="space-y-3">
              {Object.entries(plan).map(([key, item]) => (
                <button key={key} onClick={() => toggleDone(key)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all ${item.done ? 'bg-emerald-900/40 border-emerald-700' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${item.done ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600'}`}>
                      {item.done && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <div className={`font-semibold text-sm mb-1 ${item.done ? 'line-through text-slate-500' : 'text-white'}`}>{item.title}</div>
                      <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" /> Tajwīd Topics
            </h2>
            <div className="space-y-2">
              {TAJWID_TOPICS.map(t => (
                <div key={t.name} className={`flex items-center justify-between rounded-xl border px-4 py-3 ${statusColor(t.status)}`}>
                  <span className="text-sm font-medium">{t.name}</span>
                  <span className="text-xs capitalize font-semibold">{t.status.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Teacher Feedback
          </h2>
          <div className="space-y-3">
            {MOCK_FEEDBACK.map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <div className="text-xs text-emerald-500 font-semibold mb-1">{f.date} · Ustādh Hāshim</div>
                <p className="text-slate-300 text-sm leading-relaxed">{f.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="font-bold text-lg mb-4">Learning Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Letter Guide', desc: 'Makhārij & Sifāt', to: '/letters' },
              { label: 'Programs', desc: 'View all programs', to: '/programs' },
              { label: 'Library', desc: 'Books & resources', to: '/library' },
              { label: 'Messages', desc: 'Chat with teacher', to: '/messages' },
            ].map(t => (
              <a key={t.label} href={t.to} className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-4 transition-all block">
                <div className="font-semibold text-sm text-white mb-0.5">{t.label}</div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
