import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Shield, X } from 'lucide-react';

/**
 * DisclaimerGate
 *
 * Blocking overlay shown to counselling clients who have not yet accepted the
 * counselling disclaimer. Acceptance is persisted to Firestore so the gate
 * does not appear again.
 *
 * Props:
 *   uid       — Firebase Auth UID of the current user
 *   onAccept  — callback invoked after successful Firestore write
 */
export default function DisclaimerGate({ uid, onAccept }) {
  const [agreed, setAgreed] = useState(false);
  const [busy,   setBusy]   = useState(false);
  const [error,  setError]  = useState('');

  const handleAccept = async () => {
    if (!agreed) return;
    setBusy(true);
    setError('');
    try {
      await updateDoc(doc(db, 'users', uid), {
        disclaimerAccepted:   true,
        disclaimerAcceptedAt: serverTimestamp(),
      });
      onAccept();
    } catch (err) {
      console.error('DisclaimerGate write error:', err);
      setError('Could not save your acceptance. Please check your connection and try again.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-[#0c1428] shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 border border-amber-400/20">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Before You Continue</p>
            <p className="text-sm font-black text-white leading-tight">Counselling Service Disclaimer</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-4 text-sm leading-6 text-slate-400">

          {/* Crisis warning — always at top */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-1">
                  Crisis or Emergency
                </p>
                <p className="text-xs text-red-300 leading-5">
                  If you are in immediate danger or experiencing a mental health crisis, do NOT use this service.
                  Contact <strong>emergency services (10111)</strong> or the{' '}
                  <strong>SADAG helpline: 0800 21 22 23</strong> (24-hour, free).
                </p>
              </div>
            </div>
          </div>

          <p>
            SirajOne Counselling is a <strong className="text-slate-200">faith-based support service</strong> that
            complements, but does not replace, professional medical or psychological treatment.
          </p>

          <div className="space-y-2.5">
            {[
              'Sessions are conducted by trained Islamic counsellors and may not hold formal clinical licensure.',
              'All information shared is treated with confidentiality except where disclosure is required by law (e.g. risk of harm to self or others, child safeguarding).',
              'This service is not a substitute for emergency psychiatric care, hospitalisation, or licensed psychotherapy.',
              'Participants are expected to engage sincerely and in good faith. The service may be withdrawn if misused.',
              'Participants under 18 years of age must have explicit parental or guardian consent before using this service.',
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <CheckCircle size={13} className="mt-0.5 shrink-0 text-teal-500" />
                <span className="text-xs leading-5">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Read the full disclaimer at{' '}
            <Link
              to="/counselling-disclaimer"
              target="_blank"
              className="text-teal-400 underline hover:text-teal-300"
            >
              sirajone.co.za/counselling-disclaimer
            </Link>
            .
          </p>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/8 px-6 py-5 space-y-4">
          {/* Consent checkbox */}
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
            agreed
              ? 'border-teal-500/50 bg-teal-500/8'
              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
          }`}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={busy}
              className="mt-0.5 h-4 w-4 shrink-0 accent-teal-500"
            />
            <span className="text-xs leading-5 text-slate-300">
              I have read and understood the above disclaimer. I am 18 years or older, or I have obtained
              parental/guardian consent. I accept these terms and wish to continue.
            </span>
          </label>

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-2">
              <X size={12} /> {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || busy}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Saving…' : 'I Accept — Continue to SirajOne Counselling'}
          </button>

          <p className="text-center text-[10px] text-slate-600">
            You must accept this disclaimer to use the counselling service.
          </p>
        </div>
      </div>
    </div>
  );
}
