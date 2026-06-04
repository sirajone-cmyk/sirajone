import { LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function PendingApproval() {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen bg-[#06160d] px-6 py-10 text-white flex items-center justify-center">
      <section className="w-full max-w-xl rounded-[28px] border border-emerald-400/20 bg-[#0c2417]/95 p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/10 text-emerald-300">
          <ShieldCheck className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">
          Application Received
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Pending Approval
        </h1>
        <p className="text-lg leading-8 text-emerald-50/80">
          Your teacher application is pending review. Please wait for an administrator to activate your account.
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
