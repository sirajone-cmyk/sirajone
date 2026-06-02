import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Users, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const statusStyle = {
  approved: 'bg-emerald-900/60 text-emerald-400 border-emerald-800',
  pending: 'bg-amber-900/60 text-amber-400 border-amber-800',
  suspended: 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const approve = async (id) => {
    await updateDoc(doc(db, 'users', id), { status: 'approved' });
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const suspend = async (id) => {
    await updateDoc(doc(db, 'users', id), { status: 'suspended' });
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'suspended' } : s));
  };

  const remove = async (id) => {
    if (!confirm('Remove this user?')) return;
    await deleteDoc(doc(db, 'users', id));
    setStudents(prev => prev.filter(s => s.id !== id));
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-slate-400">Manage students, approvals, and platform activity.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', val: stats.total, icon: Users, color: 'text-emerald-400' },
            { label: 'Approved', val: stats.approved, icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Pending', val: stats.pending, icon: Clock, color: 'text-amber-400' },
            { label: 'Suspended', val: stats.suspended, icon: XCircle, color: 'text-slate-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
              <div className="text-3xl font-bold text-white mb-0.5">{s.val}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'approved', 'pending', 'suspended'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-emerald-700 text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
              {f} {f !== 'all' && `(${stats[f] ?? 0})`}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 text-slate-400 font-semibold">User</th>
                  <th className="px-5 py-4 text-slate-400 font-semibold">Role</th>
                  <th className="px-5 py-4 text-slate-400 font-semibold">Status</th>
                  <th className="px-5 py-4 text-slate-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-slate-500">Loading...</td></tr>
                ) : filtered.map(s => (
                  <tr key={s.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{s.full_name || '—'}</div>
                      <div className="text-slate-500 text-xs">{s.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{s.role || 'Student'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyle[s.status] || statusStyle.pending}`}>
                        {s.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {s.status !== 'approved' && (
                          <button onClick={() => approve(s.id)} className="p-1.5 rounded-lg bg-emerald-900/60 text-emerald-400 hover:bg-emerald-800 transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {s.status === 'approved' && (
                          <button onClick={() => suspend(s.id)} className="p-1.5 rounded-lg bg-amber-900/60 text-amber-400 hover:bg-amber-800 transition-colors" title="Suspend">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">No users in this category.</div>
          )}
        </div>

        {stats.pending > 0 && (
          <div className="mt-6 bg-amber-900/30 border border-amber-800 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm">
              <strong>{stats.pending} user{stats.pending > 1 ? 's' : ''}</strong> awaiting approval. Click ✓ to approve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
