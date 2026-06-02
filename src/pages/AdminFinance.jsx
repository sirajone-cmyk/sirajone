import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { DollarSign, TrendingUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const TEACHER_SHARE = 0.7;
const PLATFORM_SHARE = 0.3;

export default function AdminFinance() {
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().slice(0, 7));

  const loadData = async () => {
    const [pSnap, eSnap, poSnap] = await Promise.all([
      getDocs(query(collection(db, 'payments'), orderBy('created_at', 'desc'))),
      getDocs(query(collection(db, 'enrollments'), orderBy('created_at', 'desc'))),
      getDocs(query(collection(db, 'payouts'), orderBy('created_at', 'desc'))),
    ]);
    setPayments(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setEnrollments(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setPayouts(poSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const confirmPayment = async (paymentId, enrollmentId) => {
    await updateDoc(doc(db, 'payments', paymentId), { status: 'confirmed' });
    if (enrollmentId) await updateDoc(doc(db, 'enrollments', enrollmentId), { payment_status: 'confirmed', active: true });
    loadData();
  };

  const rejectPayment = async (paymentId, enrollmentId) => {
    await updateDoc(doc(db, 'payments', paymentId), { status: 'rejected' });
    if (enrollmentId) await updateDoc(doc(db, 'enrollments', enrollmentId), { payment_status: 'rejected', active: false });
    loadData();
  };

  const markPayoutPaid = async (payoutId) => {
    await updateDoc(doc(db, 'payouts', payoutId), { status: 'paid', paid_date: new Date().toISOString().slice(0, 10) });
    loadData();
  };

  const confirmed = payments.filter(p => p.status === 'confirmed');
  const pending = payments.filter(p => p.status === 'pending');
  const totalIncome = confirmed.reduce((s, p) => s + (p.amount || 0), 0);
  const totalTeacher = confirmed.reduce((s, p) => s + (p.amount || 0) * TEACHER_SHARE, 0);
  const totalPlatform = confirmed.reduce((s, p) => s + (p.amount || 0) * PLATFORM_SHARE, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.total_earned || 0), 0);

  const bySubject = confirmed.reduce((acc, p) => {
    acc[p.subject] = (acc[p.subject] || 0) + (p.amount || 0);
    return acc;
  }, {});

  if (loading) return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3"><DollarSign className="w-7 h-7 text-emerald-400" />Finance Dashboard</h1>
          <p className="text-slate-400 mt-1">Revenue tracking, teacher payouts & financial reports.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Income', val: `R ${totalIncome.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Platform Share', val: `R ${Math.round(totalPlatform).toLocaleString()}`, icon: DollarSign, color: 'text-sky-400' },
            { label: 'Teacher Share', val: `R ${Math.round(totalTeacher).toLocaleString()}`, icon: Users, color: 'text-amber-400' },
            { label: 'Pending Payouts', val: `R ${pendingPayouts.toLocaleString()}`, icon: Clock, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{s.val}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['overview', 'payments', 'by-subject'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${activeTab === tab ? 'bg-emerald-700 text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> Pending Payments ({pending.length})</h3>
              {pending.length === 0 ? <p className="text-slate-500 text-sm">No pending payments.</p> : (
                <div className="space-y-2">
                  {pending.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-amber-950/20 border border-amber-900/40 rounded-xl p-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{p.student_name}</div>
                        <div className="text-xs text-slate-500">{p.subject} · R {p.amount} · Ref: {p.payment_reference || '—'}</div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => confirmPayment(p.id, p.enrollment_id)} className="p-1.5 bg-emerald-900/60 text-emerald-400 rounded-lg hover:bg-emerald-800 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => rejectPayment(p.id, p.enrollment_id)} className="p-1.5 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900 transition-colors"><AlertCircle className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Revenue by Subject</h3>
              {Object.keys(bySubject).length === 0 ? <p className="text-slate-500 text-sm">No data yet.</p> : (
                <div className="space-y-2">
                  {Object.entries(bySubject).sort((a, b) => b[1] - a[1]).map(([subject, amount]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{subject}</span>
                      <span className="text-sm font-bold text-white">R {amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    {['Student', 'Subject', 'Amount', 'Reference', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-4 text-slate-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white text-xs">{p.student_name}</div>
                        <div className="text-slate-500 text-xs">{p.student_email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{p.subject}</td>
                      <td className="px-4 py-3 text-white font-bold text-xs">R {p.amount}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{p.payment_reference || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${p.status === 'confirmed' ? 'bg-emerald-900/60 text-emerald-400 border-emerald-800' : p.status === 'pending' ? 'bg-amber-900/60 text-amber-400 border-amber-800' : 'bg-red-900/40 text-red-400 border-red-800'}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === 'pending' && (
                          <div className="flex gap-1">
                            <button onClick={() => confirmPayment(p.id, p.enrollment_id)} className="p-1 bg-emerald-900/60 text-emerald-400 rounded-lg hover:bg-emerald-800 transition-colors"><CheckCircle className="w-3.5 h-3.5" /></button>
                            <button onClick={() => rejectPayment(p.id, p.enrollment_id)} className="p-1 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900 transition-colors"><AlertCircle className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && <div className="text-center py-10 text-slate-500">No payments yet.</div>}
            </div>
          </div>
        )}

        {activeTab === 'by-subject' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(bySubject).sort((a, b) => b[1] - a[1]).map(([subject, amount]) => (
              <div key={subject} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="font-bold text-white mb-1">{subject}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-1">R {amount.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Teacher: R {Math.round(amount * TEACHER_SHARE)} · Platform: R {Math.round(amount * PLATFORM_SHARE)}</div>
              </div>
            ))}
            {Object.keys(bySubject).length === 0 && <div className="col-span-3 text-center py-10 text-slate-500">No confirmed payments yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
