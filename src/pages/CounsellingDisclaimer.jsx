import { Link } from 'react-router-dom';
import { HeartHandshake, ArrowLeft, AlertTriangle, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

const LAST_UPDATED = '11 June 2026';
const CONTACT_EMAIL = 'sirajone7@gmail.com';
const EMERGENCY_SA = '0800 456 789';
const LIFELINE_SA = '0861 322 322';

const PLATFORM_DISCLAIMER = 'SirajOne provides Islamic guidance, mentorship, spiritual support, and educational services. SirajOne does not provide emergency services, psychiatric treatment, psychological diagnosis, psychotherapy, or medical care.';
const EMERGENCY_WARNING = 'This form is not monitored as an emergency service. Do not use SirajOne for urgent danger, abuse, suicide risk, self-harm, violence, or medical emergencies. If your situation is urgent, contact your local emergency services, police, ambulance, or a qualified professional immediately.';

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
        <div className="mb-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
              <HeartHandshake size={18} className="text-amber-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Islamic Guidance & Support Notice</span>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Islamic Guidance & Support - Important Notice</h1>
          <p className="mt-3 text-sm text-[rgba(215,245,228,0.55)]">Last updated: {LAST_UPDATED}</p>
          <p className="mt-2 text-sm text-[rgba(215,245,228,0.55)]">
            Please read this notice carefully before using any Islamic Guidance & Support feature on SirajOne.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-red-500/40 bg-red-950/30 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300 mb-2">Emergency Warning</p>
              <p className="text-sm text-[rgba(255,200,200,0.85)] leading-6">{EMERGENCY_WARNING}</p>
              <p className="mt-3 text-sm text-[rgba(255,200,200,0.85)] leading-6">
                In South Africa, contact police on <strong>10111</strong>, ambulance on <strong>10177</strong>, SADAG on <strong>{EMERGENCY_SA}</strong>, or Lifeline SA on <strong>{LIFELINE_SA}</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          <Section title="1. Nature of Islamic Guidance & Support" highlight>
            <P><strong className="text-white">{PLATFORM_DISCLAIMER}</strong></P>
            <P>
              SirajOne support is intended for Islamic guidance, mentorship, spiritual encouragement, family and community support, educational direction, and practical naseehah within a Muslim learning environment.
            </P>
            <P><strong className="text-amber-300">This is NOT:</strong></P>
            <ul className="ml-4 space-y-1 list-disc text-[rgba(255,220,150,0.85)]">
              <li>An emergency response service.</li>
              <li>A medical, psychological, psychiatric, or diagnostic service.</li>
              <li>A substitute for a qualified doctor, psychologist, psychiatrist, social worker, police officer, or emergency authority.</li>
              <li>A place to report urgent danger, abuse, violence, suicide risk, self-harm, or medical emergencies.</li>
            </ul>
          </Section>

          <Section title="2. Support Provider Scope">
            <P>
              Support providers on SirajOne may include Ulama, Muftis, Muallimahs, Islamic teachers, mentors, Da'wah workers, and experienced community support personnel.
            </P>
            <P>
              Provider profiles show Islamic qualifications, institutions or teachers studied under, areas of guidance, languages spoken, years of community experience, availability, and gender served where relevant.
            </P>
            <P>
              This provider is not presented as a medical or psychological practitioner unless separately verified.
            </P>
          </Section>

          <Section title="3. Confidentiality and Safety Limits">
            <P>
              SirajOne expects support providers to treat guidance conversations with care and discretion. Confidentiality may be limited where there is risk of harm, risk to a child, suspected abuse, legal obligation, or immediate danger.
            </P>
            <P>
              Private support notes may be restricted to authorised support providers and administrators for safeguarding, continuity, and supervision purposes.
            </P>
          </Section>

          <Section title="4. Online Support Limitations">
            <P>
              Online Islamic guidance has natural limitations. A provider may not see your full situation, may not be able to verify facts, and may need to direct you to local emergency services, family structures, community leadership, qualified professionals, or authorities.
            </P>
            <P>
              If your situation appears urgent or outside the safe scope of SirajOne, you should seek appropriate local help immediately.
            </P>
          </Section>

          <Section title="5. Children and Minors">
            <P>
              Support involving children or minors should involve parent or guardian awareness where appropriate. Safeguarding concerns must be escalated to the relevant responsible adults, authorities, or qualified professionals.
            </P>
          </Section>

          <Section title="6. User Responsibility">
            <P>By using Islamic Guidance & Support on SirajOne, you acknowledge that:</P>
            <ul className="ml-4 space-y-1 list-disc">
              <li>You have read and understood this notice.</li>
              <li>You understand the service is Islamic guidance, mentorship, spiritual support, and education.</li>
              <li>You understand it is not emergency, medical, psychiatric, psychological, diagnostic, or psychotherapy care.</li>
              <li>You will contact emergency services, authorities, or qualified professionals if your situation requires it.</li>
            </ul>
          </Section>

          <Section title="7. Useful Resources in South Africa">
            <div className="space-y-3">
              <div className="flex items-start gap-3"><Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" /><div><p className="font-semibold text-white">SADAG 24-Hour Crisis Helpline</p><p className="text-emerald-400">{EMERGENCY_SA}</p></div></div>
              <div className="flex items-start gap-3"><Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" /><div><p className="font-semibold text-white">Lifeline South Africa</p><p className="text-emerald-400">{LIFELINE_SA}</p></div></div>
              <div className="flex items-start gap-3"><Phone size={14} className="text-emerald-400 flex-shrink-0 mt-1" /><div><p className="font-semibold text-white">Emergency Services</p><p className="text-emerald-400">10111 (Police) - 10177 (Ambulance)</p></div></div>
            </div>
          </Section>

          <Section title="8. Contact">
            <P>
              If you have questions about Islamic Guidance & Support or this notice, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 underline">{CONTACT_EMAIL}</a>.
            </P>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy -&gt;</Link>
          <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service -&gt;</Link>
        </div>
      </main>
    </div>
  );
}
