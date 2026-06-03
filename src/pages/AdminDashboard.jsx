import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Users, CheckCircle, XCircle, Clock, Trash2, DollarSign, ReceiptText } from 'lucide-react';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const statusStyle = {
  approved: 'bg-emerald-900/60 text-emerald-400 border-emerald-800',
  pending: 'bg-amber-900/60 text-amber-400 border-amber-800',
  suspended: 'bg-slate-800 text-slate-400 border-slate-700',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const readAmount = (payment) => Number(payment.amount || payment.amount_gross || payment.price_zar || 0);

const formatFirestoreDate = (value) => {
  if (!value) return '-';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
};

function FinancialTracker({ payments, enrollments }) {
  const metrics = useMemo(() => {
    const completePayments = payments.filter(payment => payment.payment_status === 'COMPLETE');
    return {
      revenue: completePayments.reduce((sum, payment) => sum + readAmount(payment), 0),
      activeEnrollments: enrollments.filter(enrollment => enrollment.status === 'active').length,
      awaitingPayment: enrollments.filter(enrollment => enrollment.status === 'pending_payment').length,
    };
  }, [payments, enrollments]);

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      const aDate = a.created_at?.toMillis?.() || new Date(a.created_at || 0).getTime();
      const bDate = b.created_at?.toMillis?.() || new Date(b.created_at || 0).getTime();
      return bDate - aDate;
    });
  }, [payments]);

  const cards = [
    { label: 'Total Revenue Generated', value: formatCurrency(metrics.revenue), icon: DollarSign, tone: 'text-emerald-300', panel: 'border-emerald-800/70 bg-emerald-950/40' },
    { label: 'Active Paid Enrollments', value: metrics.activeEnrollments, icon: CheckCircle, tone: 'text-sky-300', panel: 'border-sky-800/70 bg-sky-950/40' },
    { label: 'Awaiting Payment', value: metrics.awaitingPayment, icon: Clock, tone: 'text-amber-300', panel: 'border-amber-800/70 bg-amber-950/40' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(card => (
          <div key={card.label} className={`rounded-2xl border p-5 ${card.panel}`}>
            <card.icon className={`mb-3 h-6 w-6 ${card.tone}`} />
            <div className="mb-1 text-3xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Transactional Line Records</h2>
            <p className="text-sm text-slate-500">Live records from Payfast receipts and enrollment activity.</p>
          </div>
          <ReceiptText className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-4 font-semibold text-slate-400">Student Name</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Course</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Amount</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Payfast Reference / Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {sortedPayments.map(payment => (
                <tr key={payment.id} className="transition-colors hover:bg-white/3">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{payment.student_name || payment.name_first || '-'}</div>
                    <div className="text-xs text-slate-500">{payment.student_email || payment.email_address || ''}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{payment.program_title || payment.course || payment.item_name || payment.subject || '-'}</td>
                  <td className="px-5 py-4 font-semibold text-white">{formatCurrency(readAmount(payment))}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      {payment.payment_status || payment.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    <div className="font-mono text-xs text-slate-300">{payment.pf_payment_id || payment.m_payment_id || payment.payment_reference || '-'}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatFirestoreDate(payment.payfast_timestamp || payment.created_at || payment.updated_at)}</div>
                  </td>
                </tr>
              ))}
              {sortedPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No payment records have arrived yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const unsubEnrollments = onSnapshot(collection(db, 'enrollments'), (snap) => {
      setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    return () => {
      unsubUsers();
      unsubPayments();
      unsubEnrollments();
    };
  }, []);

  const approve = async (id) => {
    await updateDoc(doc(db, 'users', id), { status: 'approved' });
  };

  const suspend = async (id) => {
    await updateDoc(doc(db, 'users', id), { status: 'suspended' });
  };

  const remove = async (id) => {
    if (!confirm('Remove this user?')) return;
    await deleteDoc(doc(db, 'users', id));
  };

  const stats = {
    total: students.length,
    approved: students.filter(s => s.status === 'approved').length,
    pending: students.filter(s => s.status === 'pending').length,
    suspended: students.filter(s => s.status === 'suspended').length,
  };

  const filtered = filter === 'all' ? students : students.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Manage students, approvals, platform activity, and financial telemetry.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'users', label: 'Users' },
            { id: 'financial', label: 'Financial Tracker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-emerald-700 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'financial' ? (
          <FinancialTracker payments={payments} enrollments={enrollments} />
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Users', val: stats.total, icon: Users, color: 'text-emerald-400' },
                { label: 'Approved', val: stats.approved, icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'Pending', val: stats.pending, icon: Clock, color: 'text-amber-400' },
                { label: 'Suspended', val: stats.suspended, icon: XCircle, color: 'text-slate-400' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
                  <div className="mb-0.5 text-3xl font-bold text-white">{s.val}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {['all', 'approved', 'pending', 'suspended'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-emerald-700 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  {f} {f !== 'all' && `(${stats[f] ?? 0})`}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-4 font-semibold text-slate-400">User</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Role</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {loading ? (
                      <tr><td colSpan={4} className="py-10 text-center text-slate-500">Loading...</td></tr>
                    ) : filtered.map(s => (
                      <tr key={s.id} className="transition-colors hover:bg-white/3">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-white">{s.full_name || '-'}</div>
                          <div className="text-xs text-slate-500">{s.email}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{s.role || 'Student'}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[s.status] || statusStyle.pending}`}>
                            {s.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {s.status !== 'approved' && (
                              <button onClick={() => approve(s.id)} className="rounded-lg bg-emerald-900/60 p-1.5 text-emerald-400 transition-colors hover:bg-emerald-800" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {s.status === 'approved' && (
                              <button onClick={() => suspend(s.id)} className="rounded-lg bg-amber-900/60 p-1.5 text-amber-400 transition-colors hover:bg-amber-800" title="Suspend">
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button onClick={() => remove(s.id)} className="rounded-lg bg-red-900/40 p-1.5 text-red-400 transition-colors hover:bg-red-900" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && filtered.length === 0 && (
                <div className="py-12 text-center text-slate-500">No users in this category.</div>
              )}
            </div>

            {stats.pending > 0 && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-800 bg-amber-900/30 p-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <p className="text-sm text-amber-300">
                  <strong>{stats.pending} user{stats.pending > 1 ? 's' : ''}</strong> awaiting approval. Click approve to activate.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}