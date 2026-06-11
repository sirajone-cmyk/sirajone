import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const LAST_UPDATED = '7 June 2026';
const CONTACT_EMAIL = 'sirajone7@gmail.com';

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

export default function TermsOfService() {
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
              <FileText size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Terms of Service</span>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-[rgba(215,245,228,0.55)]">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-[rgba(6,20,12,0.7)] p-6 sm:p-10">

          <Section title="1. Agreement to Terms">
            <P>
              By registering for or using the SirajOne platform (<strong className="text-white">sirajone.co.za</strong>), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.
            </P>
            <P>
              SirajOne is operated by <strong className="text-white">Madrassa Tahseen ul Quran</strong>, Durban, South Africa. These terms govern your access to and use of our Islamic educational platform.
            </P>
          </Section>

          <Section title="2. Eligibility and Account Registration">
            <ul className="ml-4 space-y-2 list-disc">
              <li>You must provide accurate, complete information when registering.</li>
              <li>Students under 18 require a parent or guardian to confirm consent during registration. The person completing registration confirms they have authority to do so.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials. Do not share your account with others.</li>
              <li>You must notify us immediately if you become aware of any unauthorised use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </Section>

          <Section title="3. Roles and Access">
            <P>SirajOne operates a role-based system. Access to features depends on your approved role:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li><strong className="text-white">Students</strong> — access to letter learning, practice workbook, and assigned teacher portal.</li>
              <li><strong className="text-white">Teachers</strong> — must apply and be approved by an administrator before access is granted. Teachers agree to maintain professional conduct with students at all times.</li>
              <li><strong className="text-white">Counsellors</strong> — must apply, provide qualifications, and be approved. Counsellors agree to the Counselling Disclaimer and to operate within their scope of competence.</li>
              <li><strong className="text-white">Counselling Clients</strong> — must be approved by an administrator. Access is for personal support sessions only.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <P>You agree not to:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li>Use the platform for any unlawful purpose or in any way that violates Islamic principles of conduct and respect.</li>
              <li>Upload, transmit, or share content that is harmful, offensive, defamatory, or inappropriate.</li>
              <li>Attempt to gain unauthorised access to other users' accounts or data.</li>
              <li>Copy, reproduce, or distribute platform content (lessons, audio, materials) without written permission.</li>
              <li>Use the platform to conduct commercial activities unrelated to SirajOne services.</li>
              <li>Impersonate another person or misrepresent your qualifications.</li>
            </ul>
          </Section>

          <Section title="5. Audio Recordings">
            <P>
              Students may record their Tajweed practice through the platform. By doing so:
            </P>
            <ul className="ml-4 space-y-2 list-disc">
              <li>You grant SirajOne and the assigned teacher the right to listen to and review your recording for educational feedback purposes.</li>
              <li>Recordings are stored securely and are not shared beyond the student, their teacher, and platform administrators.</li>
              <li>You may request deletion of your recordings at any time by emailing us.</li>
            </ul>
          </Section>

          <Section title="6. Teacher Responsibilities">
            <P>Teachers using SirajOne agree to:</P>
            <ul className="ml-4 space-y-2 list-disc">
              <li>Maintain accurate and honest information in their public profiles.</li>
              <li>Treat all students with respect, patience, and Islamic adab (etiquette).</li>
              <li>Keep student data confidential and use platform tools only for educational purposes.</li>
              <li>Notify the platform immediately if they are no longer able to fulfil their teaching responsibilities.</li>
              <li>Operate within the subjects and competencies stated in their application.</li>
            </ul>
          </Section>

          <Section title="7. Islamic Guidance & Support Services">
            <P>
              Islamic Guidance & Support services on SirajOne are provided by approved support providers, Islamic mentors, Ulama, Muallimahs, Islamic teachers, and community support personnel where applicable, and are subject to the{' '}
              <Link to="/counselling-disclaimer" className="text-emerald-400 underline">Islamic Guidance & Support Disclaimer</Link>{' '}
              which forms part of these terms. By accessing Islamic Guidance & Support features, you acknowledge and accept the disclaimer in full.
            </P>
          </Section>

          <Section title="8. Intellectual Property">
            <P>
              All content on SirajOne — including lesson materials, audio recordings created by the platform, interface design, and text — is the intellectual property of SirajOne / Madrassa Tahseen ul Quran unless otherwise stated. You may not reproduce, distribute, or create derivative works without written permission.
            </P>
            <P>
              Content you upload (such as your recordings) remains your property. You grant us a limited licence to store and display it for the purpose of delivering our services.
            </P>
          </Section>

          <Section title="9. Payments and Enrolment">
            <P>
              Where enrolment fees apply, payment terms will be communicated at the time of enrolment. Refunds are considered on a case-by-case basis. To request a refund, email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 underline">{CONTACT_EMAIL}</a>{' '}
              within 7 days of payment.
            </P>
          </Section>

          <Section title="10. Limitation of Liability">
            <P>
              SirajOne provides the platform on an "as is" basis. We do not guarantee uninterrupted access or that the platform will be free from errors. To the extent permitted by South African law, SirajOne is not liable for any indirect, incidental, or consequential damages arising from use of the platform.
            </P>
          </Section>

          <Section title="11. Privacy">
            <P>
              Your use of SirajOne is also governed by our{' '}
              <Link to="/privacy" className="text-emerald-400 underline">Privacy Policy</Link>,
              which is incorporated into these Terms of Service.
            </P>
          </Section>

          <Section title="12. Changes to These Terms">
            <P>
              We may update these Terms from time to time. The "Last updated" date above will reflect any changes. Continued use of the platform after changes constitutes acceptance of the updated terms.
            </P>
          </Section>

          <Section title="13. Governing Law">
            <P>
              These Terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the jurisdiction of the South African courts.
            </P>
          </Section>

          <Section title="14. Contact">
            <P>
              For questions about these Terms, email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-400 underline">{CONTACT_EMAIL}</a>.
            </P>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">Privacy Policy →</Link>
          <Link to="/counselling-disclaimer" className="text-emerald-400 hover:text-emerald-300">Guidance Disclaimer</Link>
        </div>
      </main>
    </div>
  );
}
