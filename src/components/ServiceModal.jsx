import { useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhatsAppButton from './WhatsAppButton';

/**
 * ServiceModal — reusable modal for counselling service cards.
 * Props:
 *   service  — the service object (icon, cat, title, fullDesc, desc,
 *              suitableFor, benefits[], sessionFormat, duration)
 *   onClose  — called when the modal should close
 */
export default function ServiceModal({ service, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    // Auto-focus close button for keyboard accessibility
    closeBtnRef.current?.focus();

    // Prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Escape key to close
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!service) return null;

  const {
    icon: Icon,
    cat,
    title,
    fullDesc,
    desc,
    suitableFor,
    benefits,
    sessionFormat,
    duration,
  } = service;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="svc-modal-title"
    >
      <div className="relative flex w-full max-w-md flex-col rounded-t-3xl border border-white/8 bg-[#0c1428] shadow-2xl sm:rounded-2xl max-h-[92vh] overflow-hidden">

        {/* ── Sticky header ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/6 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10">
              <Icon size={16} className="text-teal-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{cat}</p>
              <p
                id="svc-modal-title"
                className="truncate text-sm font-black text-white leading-tight"
              >
                {title}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <div className="overflow-y-auto px-6 py-5 pb-8 space-y-5">

          {/* Description */}
          <p className="text-sm leading-7 text-slate-400">{fullDesc || desc}</p>

          {/* Suitable for */}
          {suitableFor && (
            <div>
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
                Suitable For
              </p>
              <p className="text-sm leading-6 text-slate-400">{suitableFor}</p>
            </div>
          )}

          {/* What to expect */}
          {benefits?.length > 0 && (
            <div>
              <p className="mb-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
                What to Expect
              </p>
              <ul className="space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm leading-5 text-slate-400">
                    <CheckCircle size={13} className="mt-0.5 shrink-0 text-teal-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Format & Duration */}
          {(sessionFormat || duration) && (
            <div className="grid grid-cols-2 gap-3">
              {sessionFormat && (
                <div className="rounded-xl border border-white/7 bg-white/[0.025] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Format
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{sessionFormat}</p>
                </div>
              )}
              {duration && (
                <div className="rounded-xl border border-white/7 bg-white/[0.025] p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Duration
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-300">{duration}</p>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <Link
            to="/counselling-client"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Request Support
            <ArrowRight size={15} />
          </Link>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <WhatsAppButton
            service={title}
            label="Chat on WhatsApp"
            variant="outline"
            fullWidth
          />

        </div>
      </div>
    </div>
  );
}
