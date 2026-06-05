import { useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useContentProtection } from '@/hooks/useContentProtection';

function resolveUserLabel(user) {
  const displayName =
    user?.display_name ||
    user?.displayName ||
    user?.full_name ||
    user?.fullName ||
    user?.name ||
    'SirajOne User';

  return `${displayName} | ${user?.email || 'protected account'}`;
}

export default function SecurityWrapper({ children, enabled = true }) {
  const { user } = useAuth();
  const { masked, notice } = useContentProtection({ enabled });
  const watermarkLabel = resolveUserLabel(user);

  const tiles = useMemo(() => Array.from({ length: 96 }, (_, index) => index), []);

  return (
    <div
      className="relative min-h-full"
      onContextMenu={enabled ? (event) => event.preventDefault() : undefined}
      style={enabled ? { userSelect: 'none', WebkitUserSelect: 'none' } : undefined}
    >
      {children}

      {enabled && (
        <div
          aria-hidden="true"
          className="fixed inset-0 overflow-hidden"
          style={{ zIndex: 80, pointerEvents: 'none' }}
        >
          <div
            className="absolute flex flex-wrap content-start"
            style={{
              inset: '-55%',
              transform: 'rotate(-15deg)',
              opacity: 0.04,
            }}
          >
            {tiles.map((tile) => (
              <span
                key={tile}
                className="block whitespace-nowrap py-8 font-mono text-xs font-semibold tracking-[0.12em] text-white"
                style={{ width: 380 }}
              >
                {watermarkLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {enabled && notice && (
        <div
          role="status"
          className="fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-2xl border border-amber-300/25 bg-[#08130d]/95 px-5 py-3 text-center text-sm font-bold text-amber-100 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          {notice}
        </div>
      )}

      {enabled && masked && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#06110b]/98 px-6 text-center backdrop-blur-2xl">
          <div className="max-w-md rounded-3xl border border-emerald-300/15 bg-white/[0.04] p-8 shadow-2xl shadow-black/50">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/25 bg-emerald-400/10 text-2xl text-emerald-200">
              S1
            </div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">SirajOne</p>
            <h2 className="mt-3 text-2xl font-black text-white">Content Protected</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Content Protected for Security Policy Enforcements
            </p>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Return to this window to continue your protected learning session.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
