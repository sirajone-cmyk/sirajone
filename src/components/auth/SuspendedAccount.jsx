import { LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function SuspendedAccount() {
  const { logout, user } = useAuth();

  return (
    <main className="min-h-screen bg-[#06160d] px-6 py-10 text-white flex items-center justify-center">
      <section className="w-full max-w-xl rounded-[28px] border border-red-300/20 bg-[#24100c]/95 p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200/30 bg-red-400/10 text-red-200">
          <ShieldAlert className="h-7 w-7" aria-hidden="true" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-red-200">
          Account Restricted
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Suspended Account
        </h1>
        <p className="text-lg leading-8 text-red-50/80">
          This account has been suspended. If you believe this is a mistake, please contact SirajOne support.
        </p>

        {user?.email && (
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-red-50/70">
            Signed in as <span className="font-semibold text-white">{user.email}</span>
          </p>
        )}

        <button
          type="button"
          onClick={logout}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-200 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#210906] shadow-lg shadow-black/30 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-100 focus:ring-offset-2 focus:ring-offset-[#06160d] sm:w-auto"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </section>
    </main>
  );
}
