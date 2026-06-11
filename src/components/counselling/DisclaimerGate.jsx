import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Shield, X } from 'lucide-react';

const GUIDANCE_DISCLAIMER = 'SirajOne provides Islamic guidance, mentorship, spiritual support, and educational services. SirajOne does not provide emergency services, psychiatric treatment, psychological diagnosis, psychotherapy, or medical care.';
const EMERGENCY_WARNING = 'This form is not monitored as an emergency service. Do not use SirajOne for urgent danger, abuse, suicide risk, self-harm, violence, or medical emergencies. If your situation is urgent, contact your local emergency services, police, ambulance, or a qualified professional immediately.';

export default function DisclaimerGate({ uid, onAccept }) {
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (!agreed) return;
    setBusy(true);
    setError('');
    try {
      await updateDoc(doc(db, 'users', uid), {
        disclaimerAccepted: true,
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-2xl border border-amber-500/20 bg-[#0c1428] shadow-2xl">
        <div className="flex shrink-0 items-center gap-3 border-b border-white/8 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Before You Continue</p>
            <p className="text-sm font-black leading-tight text-white">Islamic Guidance & Support Disclaimer</p>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5 text-sm leading-6 text-slate-400">
          <div className="rounded-xl border border-red-500/30 bg-red-500/8 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-400" />
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-red-400">Emergency Warning</p>
                <p className="text-xs leading-5 text-red-300">{EMERGENCY_WARNING}</p>
              </div>
            </div>
          </div>

          <p>{GUIDANCE_DISCLAIMER}</p>

          <div className="space-y-2.5">
            {[
              "Support may be provided by Ulama, Muallimahs, Muftis, Islamic teachers, mentors, da'wah workers, or experienced community support personnel.",
              "Guidance is educational and spiritual in nature and must remain within the provider's stated area of competence.",
              'All information shared is treated with confidentiality except where disclosure is required by law, safeguarding duties, or risk of harm.',
              'Users under 18 years of age must have explicit parental or guardian consent before using this service.',
            ].map((point) => (
              <div key={point} className="flex items-start gap-2.5">
                <CheckCircle size={13} className="mt-0.5 shrink-0 text-teal-500" />
                <span className="text-xs leading-5">{point}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            Read the full guidance disclaimer at{' '}
            <Link to="/counselling-disclaimer" target="_blank" className="text-teal-400 underline hover:text-teal-300">
              sirajone.co.za/guidance-disclaimer
            </Link>
            .
          </p>
        </div>

        <div className="shrink-0 space-y-4 border-t border-white/8 px-6 py-5">
          <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
            agreed ? 'border-teal-500/50 bg-teal-500/8' : 'border-white/10 bg-white/[0.02] hover:border-white/20'
          }`}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={busy}
              className="mt-0.5 h-4 w-4 shrink-0 accent-teal-500"
            />
            <span className="text-xs leading-5 text-slate-300">
              I have read and understood the Islamic Guidance & Support disclaimer. I am 18 years or older, or I have obtained parental/guardian consent. I accept these terms and wish to continue.
            </span>
          </label>

          {error && (
            <p className="flex items-center gap-2 text-xs text-red-400">
              <X size={12} /> {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAccept}
            disabled={!agreed || busy}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Saving...' : 'I Accept - Continue to Islamic Guidance & Support'}
          </button>

          <p className="text-center text-[10px] text-slate-600">
            You must accept this disclaimer to use the Islamic Guidance & Support service.
          </p>
        </div>
      </div>
    </div>
  );
}
