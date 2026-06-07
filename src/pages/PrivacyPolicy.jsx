import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Mail, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';

const LAST_UPDATED = '7 June 2026';
const RESPONSIBLE_PARTY = 'Madrassa Tahseen ul Quran / SirajOne';
const INFO_OFFICER_EMAIL = 'sirajone7@gmail.com';
const PHYSICAL_ADDRESS = 'Overport, Durban, KwaZulu-Natal, South Africa';

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-emerald-300">{title}</h2>
      <div className="space-y-3 text-[rgba(215,245,228,0.82)] leading-7 text-sm sm:text-base">
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p>{children}</p>;
}

export default function PrivacyPolicy() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <Shield size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Your Privacy Matters</h1>
          <p className="mt-3 text-sm text-[rgba(215,245,228,0.55)]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-[rgba(6,20,12,0.7)] p-6 sm:p-10">

          <Section title="1. Who We Are">
            <P>
              This Privacy Policy applies to <strong className="text-white">{RESPONSIBLE_PARTY}</strong> (operating as <strong className="text-white">SirajOne</strong>), an Islamic educational platform based in Durban, South Africa.
            </P>
            <P>
              <strong className="text-white">Information Officer:</strong> The responsible party for the processing of your personal information is the owner of SirajOne. For all data-related queries, contact us at{' '}
              <a href={`mailto:${INFO_OFFICER_EMAIL}`} className="text-emerald-400 underline">{INFO_OFFICER_EMAIL}</a>.
            </P>
            <P>
              <strong className="text-white">Physical address:</strong> {PHYSICAL_ADDRESS}
            </P>
          </Section>

          <Section title="2. What Personal Information We Collect">
            <P>We collect only what is necessary to provide our services:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong className="text-white">Account data:</strong> Full name, email address, role (Student, Teacher, Counsellor).</li>
              <li><strong className="text-white">Student registration:</strong> Parent/guardian consent confirmation and timestamp.</li>
              <li><strong className="text-white">Teacher applications:</strong> Institution, qualifications, reference contact, years of experience, bio.</li>
              <li><strong className="text-white">Counsellor applications:</strong> Contact number, country, city, qualifications, categories, availability, registration body.</li>
              <li><strong className="text-white">Audio recordings:</strong> Student Tajweed practice recordings submitted for teacher review.</li>
              <li><strong className="text-white">Messages:</strong> In-platform messages between users.</li>
              <li><strong className="text-white">Usage data:</strong> Onboarding progress, lesson activity (stored via Firebase).</li>
            </ul>
          </Section>

          <Section title="3. Why We Collect It (Lawful Basis under POPIA)">
            <P>We process personal information for the following lawful purposes:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong className="text-white">Performance of a contract:</strong> To create and manage your account, deliver lessons, and facilitate teacher–student communication.</li>
              <li><strong className="text-white">Legitimate interest:</strong> To maintain platform security, verify teacher qualifications, and support counselling sessions.</li>
              <li><strong className="text-white">Consent:</strong> Parent/guardian consent is explicitly recorded before any student account is created. Students' audio recordings are only stored and shared with their assigned teacher.</li>
              <li><strong className="text-white">Legal obligation:</strong> To comply with South African law including POPIA (Protection of Personal Information Act, Act 4 of 2013).</li>
            </ul>
          </Section>

          <Section title="4. Children's Data">
            <P>
              SirajOne serves learners of all ages, including children under 18. We take special care with children's data:
            </P>
            <ul className="ml-4 space-y-2 list-disc">
              <li>Student accounts require a parent or guardian to confirm consent before registration is completed.</li>
              <li>Student audio recordings are only accessible to the student themselves, their assigned teacher, and platform administrators.</li>
              <li>We do not share, sell, or use children's data for marketing purposes.</li>
              <li>Children's data is processed under the child protection provisions of POPIA.</li>
            </ul>
          </Section>

          <Section title="5. How We Store and Protect Your Data">
            <P>
              All data is stored using <strong className="text-white">Google Firebase</strong> (Firebase Authentication, Firestore Database, Firebase Storage), hosted on Google Cloud infrastructure. Firebase complies with international security standards including ISO 27001 and SOC 2.
            </P>
            <P>
              Access is controlled by role-based Firestore Security Rules. Only authorised users can access their own data. Administrators can only access data necessary for platform management.
            </P>
          </Section>

          <Section title="6. Sharing of Personal Information">
            <P>We do not sell your personal information. We share data only in these limited circumstances:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong className="text-white">Teachers:</strong> A student's name, assigned lessons, and audio submissions are shared with their assigned teacher.</li>
              <li><strong className="text-white">Counsellors:</strong> Counselling session details are shared only between the counsellor and the assigned client. Notes are private to the counsellor.</li>
              <li><strong className="text-white">Administrators:</strong> Platform administrators can access account data for support and management purposes.</li>
              <li><strong className="text-white">Service providers:</strong> Google Firebase (data hosting). No other third parties receive personal data.</li>
              <li><strong className="text-white">Legal requirements:</strong> We may disclose information if required by law or court order.</li>
            </ul>
          </Section>

          <Section title="7. Your Rights under POPIA">
            <P>As a data subject under POPIA, you have the right to:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li>Request access to your personal information.</li>
              <li>Request correction of inaccurate personal information.</li>
              <li>Request deletion of your personal information (subject to legal retention requirements).</li>
              <li>Object to the processing of your personal information.</li>
              <li>Lodge a complaint with the <strong className="text-white">Information Regulator of South Africa</strong> at <a href="https://www.inforegulator.org.za" className="text-emerald-400 underline" target="_blank" rel="noopener noreferrer">www.inforegulator.org.za</a>.</li>
            </ul>
            <P>
              To exercise any of these rights, email us at{' '}
              <a href={`mailto:${INFO_OFFICER_EMAIL}`} className="text-emerald-400 underline">{INFO_OFFICER_EMAIL}</a>{' '}
              with the subject line: <em>Data Request — [your name]</em>. We will respond within 30 days.
            </P>
          </Section>

          <Section title="8. Data Deletion">
            <P>
              To request deletion of your account and all associated personal data, email{' '}
              <a href={`mailto:${INFO_OFFICER_EMAIL}`} className="text-emerald-400 underline">{INFO_OFFICER_EMAIL}</a>{' '}
              with the subject line: <em>Delete My Account — [your name and email]</em>.
            </P>
            <P>
              We will delete your account, profile data, messages, and audio recordings within 30 days. Some data may be retained for legally required periods (e.g., financial records).
            </P>
          </Section>

          <Section title="9. Retention Period">
            <P>
              We retain personal information only for as long as necessary to provide our services or as required by law. Account data is retained for the duration of the account. Audio recordings are retained until deleted by the student, teacher, or upon account deletion request.
            </P>
          </Section>

          <Section title="10. Cookies and Tracking">
            <P>
              SirajOne uses Firebase Authentication tokens stored in your browser's local storage for session management. We do not use third-party advertising cookies or tracking pixels.
            </P>
          </Section>

          <Section title="11. Changes to This Policy">
            <P>
              We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. We encourage you to review this policy periodically.
            </P>
          </Section>

          <Section title="12. Contact Us">
            <P>For any privacy-related queries or to exercise your rights:</P>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${INFO_OFFICER_EMAIL}`} className="text-emerald-400 underline">{INFO_OFFICER_EMAIL}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-emerald-400 flex-shrink-0" />
                <span>{PHYSICAL_ADDRESS}</span>
              </div>
            </div>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">Terms of Service →</Link>
          <Link to="/counselling-disclaimer" className="text-emerald-400 hover:text-emerald-300">Counselling Disclaimer →</Link>
        </div>
      </main>
    </div>
  );
}
