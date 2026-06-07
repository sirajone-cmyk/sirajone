import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, AlertTriangle, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

const LAST_UPDATED = '7 June 2026';
const CONTACT_EMAIL = 'sirajone7@gmail.com';
const EMERGENCY_SA = '0800 456 789'; // SADAG toll-free
const LIFELINE_SA = '0861 322 322'; // Lifeline SA

function Section({ title, children, highlight = false }) {
  return (
    <section className={`mb-8 rounded-xl p-6 ${highlight ? 'border border-amber-500/30 bg-amber-950/20' : 'border border-emerald-900/30 bg-[rgba(6,20,12,0.5)]'}`}>
      <h2 className={`mb-4 text-lg font-bold ${highlight ? 'text-amber-300' : 'text-emerald-300'}`}>{title}</h2>
      <div className="space-y-3 text-[rgba(215,245,228,0.82)] leading-7 text-sm sm:text-base">
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p>{children}</p>;
}

export default function CounsellingDisclaimer() {
  return (
    <div className="min-h-screen bg-[#060e09] text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
              <HeartHandshake size={18} className="text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Counselling Disclaimer</span>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Counselling Services — Important Notice</h1>
          <p className="mt-3 text-sm text-[rgba(215,245,228,0.55)]">Last updated: {LAST_UPDATED}</p>
          <p className="mt-2 text-sm text-[rgba(215,245,228,0.55)]">
            Please read this disclaimer carefully before accessing any counselling feature on SirajOne.
          </p>
        </div>

        {/* Emergency warning */}
        <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-950/30 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300 mb-2">If You Are in Crisis</p>
              <p className="text-sm text-[rgba(255,200,200,0.85)] leading-6">
                If you are experiencing a mental health crisis, thoughts of self-harm, or a medical emergency, please do not use this platform. Contact emergency services (<strong>10111</strong>), the SADAG 24-hour helpline (<strong>{EMERGENCY_SA}</strong>), or Lifeline SA (<strong>{LIFELINE_SA}</strong>) immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-0">

          <Section title="1. Nature of Counselling on SirajOne" highlight>
            <P>
              Counselling services offered through SirajOne are <strong className="text-white">Islamic-oriented peer support and guidance sessions</strong> provided by verified counsellors. These services are intended to offer emotional support, Islamic guidance, and a safe space for conversation.
            </P>
            <P>
              <strong className="text-amber-300">This is NOT:</strong>
            </P>
            <ul className="ml-4 space-y-1 list-disc text-[rgba(255,220,150,0.85)]">
              <li>A registered clinical psychology or psychotherapy service.</li>
              <li>Medical advice or psychiatric treatment.</li>
              <li>A substitute for professional, regulated mental health care.</li>
              <li>A crisis intervention or emergency service.</li>
            </ul>
          </Section>

          <Section title="2. Counsellor Qualifications">
            <P>
              SirajOne verifies that counsellors on the platform have submitted their qualifications, registration details, and references. However, SirajOne does not itself employ or regulate counsellors and is not responsible for the specific advice, guidance, or recommendations given during sessions.
            </P>
            <P>
              Counsellors on SirajOne operate within their own stated scope of competence. They are not required to be registered with the Health Professions Council of South Africa (HPCSA) unless they explicitly state so.
            </P>
            <P>
              If you require a registered clinical psychologist or psychiatrist, please contact the{' '}
              <strong className="text-white">HPCSA</strong> at{' '}
              <a href="https://www.hpcsa.co.za" className="text-emerald-400 underline" target="_blank" rel="noopener noreferrer">www.hpcsa.co.za</a>{' '}
              or consult your GP for a referral.
            </P>
          </Section>

          <Section title="3. Confidentiality">
            <P>
              Counsellors on SirajOne maintain confidentiality of session content. However, confidentiality has limits. A counsellor may breach confidentiality if:
            </P>
            <ul className="ml-4 space-y-1 list-disc">
              <li>There is a reasonable risk of harm to you or another person.</li>
              <li>Disclosure is required by law or a court order.</li>
              <li>The safety of a child is at risk.</li>
            </ul>
            <P>
              Session notes written by counsellors are private — you as the client cannot access the counsellor's private notes. This is standard professional practice and is designed to protect the quality and integrity of the support process.
            </P>
          </Section>

          <Section title="4. Limitations of Online Support">
            <P>
              Online support sessions have inherent limitations compared to in-person professional therapy:
            </P>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Non-verbal cues and body language may be missed.</li>
              <li>Technical issues may interrupt sessions.</li>
              <li>Online support is not appropriate for severe mental health conditions, psychosis, acute suicidality, or complex trauma requiring clinical intervention.</li>
            </ul>
            <P>
              If at any point your counsellor or SirajOne determines that your needs exceed what can be safely provided on this platform, we will encourage you to seek appropriate professional help.
            </P>
          </Section>

          <Section title="5. Children and Minors">
            <P>
              Counselling sessions involving children under 18 require the knowledge and implied consent of a parent or guardian. SirajOne recommends that parents are made aware if their child is accessing counselling support through the platform.
            </P>
          </Section>

          <Section title="6. No Formal Therapeutic Relationship">
            <P>
              Engaging with a counsellor on SirajOne does not establish a formal therapeutic relationship as defined by the HPCSA or any regulatory body. It is a voluntary support relationship within an Islamic educational and community platform.
            </P>
          </Section>

          <Section title="7. Your Responsibility">
            <P>By using the counselling feature, you acknowledge that:</P>
            <ul className="ml-4 space-y-1 list-disc">
              <li>You have read and understood this disclaimer.</li>
              <li>You are seeking support of your own free will.</li>
              <li>You understand that this is not clinical or regulated therapy.</li>
              <li>You will seek emergency or professional help if your situation requires it.</li>
            </ul>
          </Section>

          <Section title="8. Useful Resources in South Africa">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">SADAG 24-Hour Crisis Helpline</p>
                  <p className="text-emerald-400">{EMERGENCY_SA}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Lifeline South Africa</p>
                  <p className="text-emerald-400">{LIFELINE_SA}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Emergency Services</p>
                  <p className="text-emerald-400">10111 (Police) · 10177 (Ambulance)</p>
                </div>
              </div>
            </div>
          </Section>

          <Section title="9. Contact">
            <P>
              If you have questions about counselling services or this disclaimer, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 underline">{CONTACT_EMAIL}</a>.
            </P>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy →</Link>
          <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service →</Link>
        </div>
      </main>
    </div>
  );
}
