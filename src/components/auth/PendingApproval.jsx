import { LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { ROLES } from '@/lib/roles';

const PENDING_COPY = {
  [ROLES.TEACHER]: {
    eyebrow: 'Teacher Application Received',
    body: 'Your teacher application is pending review. Please wait for an administrator to activate your account.',
  },
  [ROLES.COUNSELLOR]: {
    eyebrow: 'Counsellor Application Received',
    body: 'Your counsellor application is pending review. Please wait for an administrator to activate your account.',
  },
  [ROLES.COUNSELOR]: {
    eyebrow: 'Counsellor Application Received',
    body: 'Your counsellor application is pending review. Please wait for an administrator to activate your account.',
  },
  [ROLES.COUNSELLING_CLIENT]: {
    eyebrow: 'Counselling Request Received',
    body: 'Your counselling support account is pending review. Please wait for an administrator to approve your access.',
  },
  [ROLES.STUDENT]: {
    eyebrow: 'Account Pending',
    body: 'Your account is pending approval. Please wait for an administrator to activate your access.',
  },
};

const looksLikeCounsellorApplicant = (user = {}) => {
  const haystack = [user.email, user.full_name, user.display_name, user.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes('counsellor') || haystack.includes('counselor');
};

const resolvePendingRole = (user) => {
  if (user?.appliedRole) return user.appliedRole;
  if (user?.registrationType === 'teacher') return ROLES.TEACHER;
  if (user?.registrationType === 'counsellor') return ROLES.COUNSELLOR;
  if (user?.registrationType === 'counsellingClient') return ROLES.COUNSELLING_CLIENT;

  const searchableIdentity = [user?.email, user?.full_name, user?.display_name, user?.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (user?.status === 'pending' && /counsello?r/.test(searchableIdentity)) return ROLES.COUNSELLOR;

  return user?.role;
};

export default function PendingApproval() {
  const { logout, user } = useAuth();
  const copy = PENDING_COPY[resolvePendingRole(user)] || {
    eyebrow: 'Application Received',
    body: 'Your account is pending review. Please wait for an administrator to activate your access.',
  };

  return (
    <main className="min-h-screen bg-[#06160d] px-6 py-10 text-white flex items-center justify-center">
      <section className="w-full max-w-xl rounded-[28px] border border-emerald-400/20 bg-[#0c2417]/95 p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 text-emerald-300">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          {copy.eyebrow}
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pending Approval
        </h1>
        <p className="text-lg leading-8 text-emerald-50/80">
          {copy.body}
        </p>

        {user?.email && (
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-50/70">
            Signed in as <span className="font-semibold text-white">{user.email}</span>
          </p>
        )}

        <button
          type="button"
          onClick={logout}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#04120b] shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-[#06160d] sm:w-auto"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </section>
    </main>
  );
}
