import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Shield, User, ChevronDown, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ROLES = [
  { val: 'Admin', label: 'Admin', desc: 'Full control', color: 'text-red-400 bg-red-900/30 border-red-800' },
  { val: 'Co-Admin', label: 'Co-Admin', desc: 'Operational control', color: 'text-orange-400 bg-orange-900/30 border-orange-800' },
  { val: 'Teacher', label: 'Teacher', desc: 'Academic access', color: 'text-sky-400 bg-sky-900/30 border-sky-800' },
  { val: 'Student', label: 'Student', desc: 'Learning access', color: 'text-emerald-400 bg-emerald-900/30 border-emerald-800' },
];

const ROLE_PERMISSIONS = {
  Admin: ['Full platform control', 'Manage all users & roles', 'Delete data', 'System settings', 'Billing & payments'],
  'Co-Admin': ['Manage students', 'Reply to messages', 'Approve payments', 'View reports'],
  Teacher: ['View assigned students', 'Post feedback', 'View lesson materials'],
  Student: ['Access learning tools', 'Message admin', 'View own progress', 'Access library'],
};

export default function RoleManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    getDocs(collection(db, 'users')).then(snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const changeRole = async (userId, newRole, userEmail) => {
    if (userEmail === currentUser?.email && newRole !== 'Admin') {
      alert('You cannot remove your own Admin role.');
      return;
    }
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setOpenDropdown(null);
  };

  const getRoleMeta = (role) => ROLES.find(r => r.val === role) || ROLES[3];

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#0b1a12] text-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-emerald-900 border-t-emerald-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Shield className="w-7 h-7 text-emerald-400" /> Role Management
          </h1>
          <p className="text-slate-400">Assign roles and manage user permissions across the platform.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {ROLES.map(r => (
            <div key={r.val} className={`border rounded-2xl p-4 ${r.color}`}>
              <div className="font-bold text-sm mb-1">{r.label}</div>
              <div className="text-xs opacity-70 mb-3">{r.desc}</div>
              <ul className="space-y-1">
                {ROLE_PERMISSIONS[r.val].map(p => (
                  <li key={p} className="text-xs flex items-start gap-1.5 opacity-80">
                    <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full bg-white/8 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 text-slate-400 font-semibold">User</th>
                  <th className="px-5 py-4 text-slate-400 font-semibold">Role</th>
                  <th className="px-5 py-4 text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {filtered.map(u => {
                  const roleMeta = getRoleMeta(u.role);
                  const isMe = u.email === currentUser?.email;
                  return (
                    <tr key={u.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-800 flex items-center justify-center font-bold text-emerald-400 text-xs">
                            {u.full_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{u.full_name || '—'} {isMe && <span className="text-xs text-slate-500">(you)</span>}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <button onClick={() => !isMe && setOpenDropdown(openDropdown === u.id ? null : u.id)} disabled={isMe}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleMeta.color} ${!isMe ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}>
                            {roleMeta.label}
                            {!isMe && <ChevronDown className="w-3 h-3" />}
                          </button>
                          {openDropdown === u.id && (
                            <div className="absolute left-0 top-full mt-1 z-10 bg-[#0f2318] border border-white/15 rounded-xl shadow-xl overflow-hidden min-w-[160px]">
                              {ROLES.map(r => (
                                <button key={r.val} onClick={() => changeRole(u.id, r.val, u.email)}
                                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-white/8 ${u.role === r.val ? 'text-emerald-400' : 'text-slate-300'}`}>
                                  {r.label} — {r.desc}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${u.status === 'approved' ? 'bg-emerald-900/60 text-emerald-400 border-emerald-800' : 'bg-amber-900/60 text-amber-400 border-amber-800'}`}>
                          {u.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-10 text-slate-500">No users found.</div>}
        </div>
      </div>
    </div>
  );
}
