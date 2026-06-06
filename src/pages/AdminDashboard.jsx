import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  DollarSign,
  ReceiptText,
  Eye,
  Loader2,
  X,
  HeartHandshake,
  GitMerge,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getSubjectLabel } from '@/lib/subjects';

const statusStyle = {
  approved: 'bg-emerald-900/60 text-emerald-400 border-emerald-800',
  pending: 'bg-amber-900/60 text-amber-400 border-amber-800',
  suspended: 'bg-slate-800 text-slate-400 border-slate-700',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const readAmount = (payment) => Number(payment.amount || payment.amount_gross || payment.price_zar || 0);
const isTeacherRole = (role) => role === 'Teacher';
const isCounsellorRole = (role) => role === 'Counsellor' || role === 'Counselor';
const hasCounsellorApplicationIntent = (user = {}) => {
  const searchableIdentity = [user.email, user.full_name, user.display_name, user.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return (
    isCounsellorRole(user.role) ||
    isCounsellorRole(user.appliedRole) ||
    user.registrationType === 'counsellor' ||
    user.registrationIntent === 'counsellor' ||
    (user.status === 'pending' && /counsello?r/.test(searchableIdentity))
  );
};
const withCounsellorRole = (user = {}) => ({
  ...user,
  role: 'Counsellor',
  appliedRole: 'Counsellor',
  registrationType: 'counsellor',
});

const hasDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const formatPlainValue = (value) => {
  if (!hasDisplayValue(value)) return 'Not provided';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value?.toDate === 'function') return formatFirestoreDate(value);
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const normalizeTeacherProfile = (data) => {
  if (!data) return null;
  return data.publicProfile && typeof data.publicProfile === 'object' ? data.publicProfile : data;
};

const buildSafeTeacherProfile = (user, profileStatus = 'approved', existingProfile = null) => {
  const fallback = {
    name: user.full_name || user.name || user.email || 'SirajOne Teacher',
    bio: user.bio || 'Approved SirajOne teacher profile. Full teaching details will be added soon.',
    qualifications: user.qualifications || user.qualificationLevel || '',
    personalityDescription: user.personalityDescription || 'Teacher profile approved by SirajOne admin.',
    assignedSubjects: Array.isArray(user.assignedSubjects) ? user.assignedSubjects : [],
  };

  return {
    ...fallback,
    ...(existingProfile || {}),
    name: existingProfile?.name || fallback.name,
    bio: existingProfile?.bio || fallback.bio,
    qualifications: existingProfile?.qualifications || fallback.qualifications,
    personalityDescription: existingProfile?.personalityDescription || fallback.personalityDescription,
    assignedSubjects: Array.isArray(existingProfile?.assignedSubjects)
      ? existingProfile.assignedSubjects
      : fallback.assignedSubjects,
    profileStatus,
    updated_at: serverTimestamp(),
  };
};

async function syncTeacherPublicProfile(user, profileStatus = 'approved', existingProfile = null) {
  if (!user?.id || !isTeacherRole(user.role)) return;

  await setDoc(
    doc(db, 'teachers', user.id),
    buildSafeTeacherProfile(user, profileStatus, existingProfile),
    { merge: true }
  );
}

const buildSafeCounsellorProfile = (user, profileStatus = 'approved', existingProfile = null) => ({
  fullName: existingProfile?.fullName || user.full_name || user.name || user.email || 'SirajOne Counsellor',
  displayName: existingProfile?.displayName || user.displayName || user.full_name || user.name || user.email || 'SirajOne Counsellor',
  email: existingProfile?.email || user.email || '',
  mobileNumber: existingProfile?.mobileNumber || user.mobileNumber || '',
  country: existingProfile?.country || user.country || '',
  city: existingProfile?.city || user.city || '',
  languagesSpoken: Array.isArray(existingProfile?.languagesSpoken) ? existingProfile.languagesSpoken : [],
  profilePhoto: existingProfile?.profilePhoto || '',
  categories: Array.isArray(existingProfile?.categories) ? existingProfile.categories : [],
  serviceDeliveryModes: existingProfile?.serviceDeliveryModes || {},
  availability: existingProfile?.availability || {},
  bio: existingProfile?.bio || 'Approved SirajOne counsellor profile. Profile details will be completed soon.',
  profileStatus,
  updated_at: serverTimestamp(),
});

async function syncCounsellorPublicProfile(user, profileStatus = 'approved', existingProfile = null) {
  if (!user?.id || !hasCounsellorApplicationIntent(user)) return;

  await setDoc(
    doc(db, 'counsellors', user.id),
    buildSafeCounsellorProfile(user, profileStatus, existingProfile),
    { merge: true }
  );
}

const formatFirestoreDate = (value) => {
  if (!value) return '-';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
};

function SubjectPills({ subjects }) {
  if (!Array.isArray(subjects) || subjects.length === 0) {
    return <span className="text-slate-500">Not provided</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map((subject) => (
        <span
          key={subject}
          className="rounded-full border border-emerald-700/60 bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-300"
        >
          {getSubjectLabel(subject)}
        </span>
      ))}
    </div>
  );
}

function DetailItem({ label, value, wide = false }) {
  const display = formatPlainValue(value);
  const isLong = typeof display === 'string' && display.length > 80;

  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200 ${isLong ? 'leading-6' : ''}`}>
        {display}
      </div>
    </div>
  );
}

function TeacherReviewModal({ preview, loading, error, onClose, onApprove }) {
  if (!preview) return null;

  const { user, publicProfile, privateData } = preview;
  const needsProfilePublish = publicProfile?.profileStatus !== 'approved';
  const canApprove = user?.status !== 'approved' || needsProfilePublish;
  const requestedSubjects = privateData?.targetSubjects || privateData?.assignedSubjects || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#102018] shadow-2xl shadow-black/50">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-[#102018]/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Teacher Application Review</p>
            <h2 className="text-2xl font-bold text-white">{user?.full_name || user?.name || user?.email || 'Teacher Profile'}</h2>
            <p className="mt-1 text-sm text-slate-400">Review public and private teacher details before approving.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            title="Close profile review"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {loading && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-4 text-emerald-200">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading teacher profile details...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-4 text-lg font-bold text-white">Account Status</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="Full Name" value={user?.full_name || user?.name} />
              <DetailItem label="Email" value={user?.email} />
              <DetailItem label="Role" value={user?.role || 'Teacher'} />
              <DetailItem label="Account Status" value={user?.status || 'pending'} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">Public Teacher Profile</h3>
                <p className="text-sm text-slate-500">This is the safe profile students will see after approval.</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusStyle[publicProfile?.profileStatus] || statusStyle.pending}`}>
                {publicProfile?.profileStatus || 'not created'}
              </span>
            </div>

            {publicProfile ? (
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem label="Teacher Name" value={publicProfile.name} />
                <div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Assigned Subjects</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
                    <SubjectPills subjects={publicProfile.assignedSubjects} />
                  </div>
                </div>
                <DetailItem label="Qualifications" value={publicProfile.qualifications} wide />
                <DetailItem label="Bio" value={publicProfile.bio} wide />
                <DetailItem label="Personality Description" value={publicProfile.personalityDescription} wide />
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-900/60 bg-amber-950/25 p-4 text-sm text-amber-200">
                No public teacher profile document exists yet. Approving this teacher will create a safe public profile from the user record.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-1 text-lg font-bold text-white">Private Application Details</h3>
            <p className="mb-4 text-sm text-slate-500">Only admins should use these details for verification before approval.</p>

            {privateData ? (
              <div className="grid gap-4 md:grid-cols-2">
                <DetailItem label="Institution Qualified" value={privateData.institutionQualified} />
                <DetailItem label="Qualification Level" value={privateData.qualificationLevel} />
                <DetailItem label="Reference Contact" value={privateData.referenceContact} />
                <DetailItem label="Years of Experience" value={privateData.yearsOfExperience} />
                <DetailItem label="Current Workplace" value={privateData.currentWorkplace} />
                <DetailItem
                  label="Certifications Upload Reference"
                  value={privateData.certificationsUploadReference || privateData.certificationUploadReference || privateData.certifications}
                />
                <div className="md:col-span-2">
                  <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Target Subjects</div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200">
                    <SubjectPills subjects={requestedSubjects} />
                  </div>
                </div>
                <DetailItem label="Application Bio" value={privateData.bio} wide />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-400">
                No private verification document was found for this teacher account.
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
            {canApprove && (
              <button
                type="button"
                onClick={() => onApprove(user, publicProfile)}
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-600"
              >
                {user?.status === 'approved' ? 'Publish Teacher Profile' : 'Approve Teacher'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialTracker({ payments, enrollments }) {
  const metrics = useMemo(() => {
    const completePayments = payments.filter(payment => payment.payment_status === 'COMPLETE');
    return {
      revenue: completePayments.reduce((sum, payment) => sum + readAmount(payment), 0),
      activeEnrollments: enrollments.filter(enrollment => enrollment.status === 'active').length,
      awaitingPayment: enrollments.filter(enrollment => enrollment.status === 'pending_payment').length,
    };
  }, [payments, enrollments]);

  const sortedPayments = useMemo(() => {
    return [...payments].sort((a, b) => {
      const aDate = a.created_at?.toMillis?.() || new Date(a.created_at || 0).getTime();
      const bDate = b.created_at?.toMillis?.() || new Date(b.created_at || 0).getTime();
      return bDate - aDate;
    });
  }, [payments]);

  const cards = [
    { label: 'Total Revenue Generated', value: formatCurrency(metrics.revenue), icon: DollarSign, tone: 'text-emerald-300', panel: 'border-emerald-800/70 bg-emerald-950/40' },
    { label: 'Active Paid Enrollments', value: metrics.activeEnrollments, icon: CheckCircle, tone: 'text-sky-300', panel: 'border-sky-800/70 bg-sky-950/40' },
    { label: 'Awaiting Payment', value: metrics.awaitingPayment, icon: Clock, tone: 'text-amber-300', panel: 'border-amber-800/70 bg-amber-950/40' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(card => (
          <div key={card.label} className={`rounded-2xl border p-5 ${card.panel}`}>
            <card.icon className={`mb-3 h-6 w-6 ${card.tone}`} />
            <div className="mb-1 text-3xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Transactional Line Records</h2>
            <p className="text-sm text-slate-500">Live records from Payfast receipts and enrollment activity.</p>
          </div>
          <ReceiptText className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-4 font-semibold text-slate-400">Student Name</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Course</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Amount</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                <th className="px-5 py-4 font-semibold text-slate-400">Payfast Reference / Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {sortedPayments.map(payment => (
                <tr key={payment.id} className="transition-colors hover:bg-white/3">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{payment.student_name || payment.name_first || '-'}</div>
                    <div className="text-xs text-slate-500">{payment.student_email || payment.email_address || ''}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{payment.program_title || payment.course || payment.item_name || payment.subject || '-'}</td>
                  <td className="px-5 py-4 font-semibold text-white">{formatCurrency(readAmount(payment))}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      {payment.payment_status || payment.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    <div className="font-mono text-xs text-slate-300">{payment.pf_payment_id || payment.m_payment_id || payment.payment_reference || '-'}</div>
                    <div className="mt-1 text-xs text-slate-500">{formatFirestoreDate(payment.payfast_timestamp || payment.created_at || payment.updated_at)}</div>
                  </td>
                </tr>
              ))}
              {sortedPayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">No payment records have arrived yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminEmptyState({ title, body, actionLabel }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <HeartHandshake className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{body}</p>
      {actionLabel && (
        <button
          type="button"
          className="mt-5 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-950/30"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function CounsellorAdminPanel({ users, counsellorProfiles, counsellingRequests, onApprove, onSuspend }) {
  const counsellorUsers = users.filter((user) => hasCounsellorApplicationIntent(user));
  const pendingApplications = counsellorUsers.filter((user) => user.status === 'pending');
  const approvedProfiles = counsellorProfiles.filter((profile) => profile.profileStatus === 'approved');
  const pendingRequests = counsellingRequests.filter((request) => request.status === 'pending');

  const cards = [
    { label: 'Counsellor Accounts', value: counsellorUsers.length, icon: HeartHandshake, tone: 'text-emerald-300' },
    { label: 'Pending Applications', value: pendingApplications.length, icon: Clock, tone: 'text-amber-300' },
    { label: 'Approved Public Profiles', value: approvedProfiles.length, icon: CheckCircle, tone: 'text-sky-300' },
    { label: 'Open Support Requests', value: pendingRequests.length, icon: ReceiptText, tone: 'text-violet-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <card.icon className={`mb-3 h-6 w-6 ${card.tone}`} />
            <div className="mb-1 text-3xl font-bold text-white">{card.value}</div>
            <div className="text-sm text-slate-400">{card.label}</div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Pending Counsellor Registrations</h2>
          <p className="text-sm text-slate-500">Approve or suspend counsellor applications after verification.</p>
        </div>
        {pendingApplications.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              title="No pending counsellor applications"
              body="New counsellor applications will appear here with clean approval actions. No placeholder counsellors are shown."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 font-semibold text-slate-400">Applicant</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Role</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {pendingApplications.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-white/3">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{user.full_name || user.name || user.email || 'Counsellor Applicant'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {isCounsellorRole(user.role) ? user.role : 'Counsellor (role repair pending)'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[user.status] || statusStyle.pending}`}>
                        {user.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onApprove(user)}
                          className="rounded-lg bg-emerald-900/60 p-1.5 text-emerald-400 transition-colors hover:bg-emerald-800"
                          title="Approve counsellor"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onSuspend(user)}
                          className="rounded-lg bg-amber-900/60 p-1.5 text-amber-400 transition-colors hover:bg-amber-800"
                          title="Suspend counsellor"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Approved Counsellor Profiles</h2>
          <p className="text-sm text-slate-500">Public counsellor profiles visible to students.</p>
        </div>
        {approvedProfiles.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              title="No approved counsellor profiles"
              body="Approved counsellors will appear here once an application is verified. We are intentionally not using fake profile records."
            />
          </div>
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {approvedProfiles.map((profile) => (
              <article key={profile.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{profile.displayName || profile.fullName || 'SirajOne Counsellor'}</h3>
                    <p className="text-sm text-slate-500">{[profile.city, profile.country].filter(Boolean).join(', ') || 'Location not provided'}</p>
                  </div>
                  <span className="rounded-full border border-emerald-800 bg-emerald-950/60 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    Approved
                  </span>
                </div>
                <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-300">{profile.bio || 'Bio not provided.'}</p>
                <div className="flex flex-wrap gap-2">
                  {(profile.categories || []).slice(0, 5).map((category) => (
                    <span key={category} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      {category}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-bold text-white">Counselling Requests</h2>
          <p className="text-sm text-slate-500">Student support cases and counselling activity pipeline.</p>
        </div>
        {counsellingRequests.length === 0 ? (
          <div className="p-5">
            <AdminEmptyState
              title="No counselling requests yet"
              body="Student support requests will appear here after learners request counselling support from a public counsellor profile."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 font-semibold text-slate-400">Student</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Counsellor</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Categories</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {counsellingRequests.map((request) => (
                  <tr key={request.id} className="transition-colors hover:bg-white/3">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{request.studentName || 'Student'}</div>
                      <div className="text-xs text-slate-500">{request.studentEmail || request.studentId}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{request.counsellorName || request.counsellorId || '-'}</td>
                    <td className="px-5 py-4 text-slate-300">{formatPlainValue(request.categories)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[request.status] || statusStyle.pending}`}>
                        {request.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{formatFirestoreDate(request.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Allocation Panel ──────────────────────────────────────────────────────────

/**
 * AllocationPanel
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders two sections:
 *   1. Summary Matrix  — every approved educator with their live active count.
 *   2. Placement Board — all pending_admin assignments with educator dropdown.
 */
function AllocationPanel({ teacherProfiles, counsellorProfiles }) {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [activeAssignments,  setActiveAssignments]  = useState([]);
  const [loadingA, setLoadingA] = useState(true);
  const [selections, setSelections] = useState({}); // { [assignmentId]: educatorId }
  const [confirming, setConfirming] = useState({}); // { [assignmentId]: true }
  const [confirmed,  setConfirmed]  = useState({}); // { [assignmentId]: true }

  // Stream pending_admin assignments
  useEffect(() => {
    const q = query(
      collection(db, 'assignments'),
      where('status', '==', 'pending_admin'),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, (snap) => {
      setPendingAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingA(false);
    }, console.error);
  }, []);

  // Stream active assignments (for capacity counts)
  useEffect(() => {
    const q = query(
      collection(db, 'assignments'),
      where('status', '==', 'active'),
    );
    return onSnapshot(q, (snap) => {
      setActiveAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, console.error);
  }, []);

  // Build educator options (merged, labelled)
  const teacherOptions = useMemo(() =>
    teacherProfiles
      .filter((p) => p.profileStatus === 'approved')
      .map((p) => ({
        id:   p.id,
        name: p.name || p.displayName || p.fullName || 'Teacher',
        type: 'teacher',
      })),
    [teacherProfiles],
  );

  const counsellorOptions = useMemo(() =>
    counsellorProfiles
      .filter((p) => p.profileStatus === 'approved')
      .map((p) => ({
        id:   p.id,
        name: p.displayName || p.fullName || 'Counsellor',
        type: 'counsellor',
      })),
    [counsellorProfiles],
  );

  // Active count per educator
  function activeCountFor(educatorId) {
    return activeAssignments.filter((a) => a.assignedId === educatorId).length;
  }

  async function handleConfirm(assignment) {
    const educatorId = selections[assignment.id];
    if (!educatorId) return;

    const allOptions   = [...teacherOptions, ...counsellorOptions];
    const educator     = allOptions.find((e) => e.id === educatorId);
    if (!educator) return;

    setConfirming((prev) => ({ ...prev, [assignment.id]: true }));
    try {
      await updateDoc(doc(db, 'assignments', assignment.id), {
        assignedId:   educator.id,
        assignedName: educator.name,
        status:       'active',
        updatedAt:    serverTimestamp(),
      });
      setConfirmed((prev) => ({ ...prev, [assignment.id]: true }));
    } catch (err) {
      console.error('[AllocationPanel] confirm error:', err);
    } finally {
      setConfirming((prev) => { const n = { ...prev }; delete n[assignment.id]; return n; });
    }
  }

  const allEducators = [...teacherOptions, ...counsellorOptions];

  return (
    <div className="space-y-8">

      {/* ── Summary Matrix ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Educator Capacity Matrix</h2>
          <p className="mt-1 text-sm text-slate-500">
            Live active assignment counts per approved educator.
          </p>
        </div>

        {allEducators.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-600" />
            <p className="text-sm text-slate-500">No approved educators yet.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allEducators.map((educator) => {
              const count = activeCountFor(educator.id);
              return (
                <div
                  key={educator.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white text-sm">{educator.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">
                      {educator.type}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 text-center">
                    <p className="text-2xl font-black text-emerald-300">{count}</p>
                    <p className="text-[10px] text-slate-600">active</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Placement Board ── */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Placement Board</h2>
          <p className="mt-1 text-sm text-slate-500">
            Incoming requests awaiting admin allocation. Select an educator and confirm.
          </p>
        </div>

        {loadingA ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          </div>
        ) : pendingAssignments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
            <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
            <h3 className="text-lg font-bold text-white">No pending allocations</h3>
            <p className="mt-2 text-sm text-slate-500">
              All incoming requests have been assigned. New admin-route requests will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-5 py-4 font-semibold text-slate-400">Student / Client</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Type</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Note</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Assign to</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {pendingAssignments.map((assignment) => {
                  const isConfirmed  = confirmed[assignment.id];
                  const isConfirming = confirming[assignment.id];
                  const selectedId   = selections[assignment.id] || '';

                  // Filter educator options by assignment type
                  const options = assignment.type === 'counsellor'
                    ? counsellorOptions
                    : assignment.type === 'teacher'
                      ? teacherOptions
                      : allEducators;

                  return (
                    <tr key={assignment.id} className={`transition-colors ${isConfirmed ? 'bg-emerald-950/20' : 'hover:bg-white/3'}`}>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">
                          {assignment.studentName || 'Student'}
                        </div>
                        <div className="text-xs text-slate-500">{assignment.studentId}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300 capitalize">
                          {assignment.type || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs max-w-[180px]">
                        <p className="line-clamp-2">{assignment.note || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        {isConfirmed ? (
                          <span className="text-xs text-emerald-400 font-semibold">✓ Assigned</span>
                        ) : (
                          <select
                            value={selectedId}
                            onChange={(e) =>
                              setSelections((prev) => ({ ...prev, [assignment.id]: e.target.value }))
                            }
                            className="rounded-xl border border-white/10 bg-[#0b1a12] px-3 py-2 text-xs text-white outline-none focus:border-emerald-600 min-w-[180px]"
                          >
                            <option value="">— Select educator —</option>
                            {options.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.name} ({activeCountFor(opt.id)} active)
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {!isConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(assignment)}
                            disabled={!selectedId || isConfirming}
                            className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {isConfirming ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              'Confirm Allocation'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [counsellorProfiles, setCounsellorProfiles] = useState([]);
  const [counsellingRequests, setCounsellingRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [teacherPreview, setTeacherPreview] = useState(null);
  const [teacherPreviewLoading, setTeacherPreviewLoading] = useState(false);
  const [teacherPreviewError, setTeacherPreviewError] = useState('');
  const syncedTeacherIds = useRef(new Set());

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    const unsubPayments = onSnapshot(collection(db, 'payments'), (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const unsubEnrollments = onSnapshot(collection(db, 'enrollments'), (snap) => {
      setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const unsubCounsellors = onSnapshot(collection(db, 'counsellors'), (snap) => {
      setCounsellorProfiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    const unsubCounsellingRequests = onSnapshot(collection(db, 'counsellingRequests'), (snap) => {
      setCounsellingRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, console.error);

    return () => {
      unsubUsers();
      unsubPayments();
      unsubEnrollments();
      unsubCounsellors();
      unsubCounsellingRequests();
    };
  }, []);

  useEffect(() => {
    students
      .filter((user) => isTeacherRole(user.role) && user.status === 'approved' && !syncedTeacherIds.current.has(user.id))
      .forEach((user) => {
        syncedTeacherIds.current.add(user.id);
        syncTeacherPublicProfile(user, 'approved').catch((error) => {
          syncedTeacherIds.current.delete(user.id);
          console.error('Failed to sync teacher profile', error);
        });
      });
  }, [students]);

  const approve = async (user, existingProfile = null) => {
    const shouldRepairCounsellorRole = hasCounsellorApplicationIntent(user);
    const approvedUser = shouldRepairCounsellorRole
      ? withCounsellorRole({ ...user, status: 'approved' })
      : { ...user, status: 'approved' };

    await updateDoc(
      doc(db, 'users', user.id),
      shouldRepairCounsellorRole
        ? { status: 'approved', role: 'Counsellor', appliedRole: 'Counsellor', registrationType: 'counsellor', updated_at: serverTimestamp() }
        : { status: 'approved', updated_at: serverTimestamp() }
    );

    if (isTeacherRole(approvedUser.role)) {
      await syncTeacherPublicProfile(approvedUser, 'approved', existingProfile);
    }
    if (hasCounsellorApplicationIntent(approvedUser)) {
      const publicSnap = existingProfile ? null : await getDoc(doc(db, 'counsellors', user.id)).catch(() => null);
      const publicProfile = existingProfile || (publicSnap?.exists?.() ? publicSnap.data() : null);
      await syncCounsellorPublicProfile(approvedUser, 'approved', publicProfile);
    }
  };

  const approveFromPreview = async (user, existingProfile) => {
    await approve(user, existingProfile);
    setTeacherPreview(null);
  };

  const suspend = async (user) => {
    const shouldRepairCounsellorRole = hasCounsellorApplicationIntent(user);
    const suspendedUser = shouldRepairCounsellorRole
      ? withCounsellorRole({ ...user, status: 'suspended' })
      : { ...user, status: 'suspended' };

    await updateDoc(
      doc(db, 'users', user.id),
      shouldRepairCounsellorRole
        ? { status: 'suspended', role: 'Counsellor', appliedRole: 'Counsellor', registrationType: 'counsellor', updated_at: serverTimestamp() }
        : { status: 'suspended', updated_at: serverTimestamp() }
    );

    if (isTeacherRole(suspendedUser.role)) {
      await syncTeacherPublicProfile(suspendedUser, 'suspended');
    }
    if (hasCounsellorApplicationIntent(suspendedUser)) {
      const publicSnap = await getDoc(doc(db, 'counsellors', user.id)).catch(() => null);
      const publicProfile = publicSnap?.exists?.() ? publicSnap.data() : null;
      await syncCounsellorPublicProfile(suspendedUser, 'suspended', publicProfile);
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this user?')) return;
    await deleteDoc(doc(db, 'users', id));
    await deleteDoc(doc(db, 'teachers', id)).catch(() => {});
    await deleteDoc(doc(db, 'counsellors', id)).catch(() => {});
  };

  const viewTeacherProfile = async (user) => {
    setTeacherPreview({ user, publicProfile: null, privateData: null });
    setTeacherPreviewLoading(true);
    setTeacherPreviewError('');

    try {
      const [publicSnap, privateSnap] = await Promise.all([
        getDoc(doc(db, 'teachers', user.id)),
        getDoc(doc(db, 'teachers', user.id, 'private_data', 'verification')),
      ]);

      setTeacherPreview({
        user,
        publicProfile: publicSnap.exists() ? normalizeTeacherProfile(publicSnap.data()) : null,
        privateData: privateSnap.exists() ? privateSnap.data() : null,
      });
    } catch (error) {
      console.error(error);
      setTeacherPreviewError('Unable to load teacher profile details right now. Please check Firestore permissions and try again.');
      setTeacherPreview((current) => current || { user, publicProfile: null, privateData: null });
    } finally {
      setTeacherPreviewLoading(false);
    }
  };

  const stats = {
    total: students.length,
    approved: students.filter(s => s.status === 'approved').length,
    pending: students.filter(s => s.status === 'pending').length,
    suspended: students.filter(s => s.status === 'suspended').length,
  };

  const filtered = filter === 'all' ? students : students.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <TeacherReviewModal
        preview={teacherPreview}
        loading={teacherPreviewLoading}
        error={teacherPreviewError}
        onClose={() => setTeacherPreview(null)}
        onApprove={approveFromPreview}
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Manage students, approvals, platform activity, and financial telemetry.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'users',      label: 'Users' },
            { id: 'counsellors',label: 'Counsellors' },
            { id: 'allocation', label: 'Roster Allocation' },
            { id: 'financial',  label: 'Financial Tracker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-emerald-700 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'financial' ? (
          <FinancialTracker payments={payments} enrollments={enrollments} />
        ) : activeTab === 'counsellors' ? (
          <CounsellorAdminPanel
            users={students}
            counsellorProfiles={counsellorProfiles}
            counsellingRequests={counsellingRequests}
            onApprove={approve}
            onSuspend={suspend}
          />
        ) : activeTab === 'allocation' ? (
          <AllocationPanel
            teacherProfiles={(() => {
              // Build from the teacher collection stream via users list
              const teacherUsers = students.filter(u => isTeacherRole(u.role) && u.status === 'approved');
              // Prefer counsellorProfiles pattern — create teacher profile objects from users
              return teacherUsers.map(u => ({
                id:            u.id,
                name:          u.full_name || u.name || u.email || 'Teacher',
                profileStatus: 'approved',
              }));
            })()}
            counsellorProfiles={counsellorProfiles}
          />
        ) : (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Total Users', val: stats.total, icon: Users, color: 'text-emerald-400' },
                { label: 'Approved', val: stats.approved, icon: CheckCircle, color: 'text-emerald-400' },
                { label: 'Pending', val: stats.pending, icon: Clock, color: 'text-amber-400' },
                { label: 'Suspended', val: stats.suspended, icon: XCircle, color: 'text-slate-400' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <s.icon className={`mb-2 h-6 w-6 ${s.color}`} />
                  <div className="mb-0.5 text-3xl font-bold text-white">{s.val}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              {['all', 'approved', 'pending', 'suspended'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-emerald-700 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                  {f} {f !== 'all' && `(${stats[f] ?? 0})`}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="px-5 py-4 font-semibold text-slate-400">User</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Role</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Status</th>
                      <th className="px-5 py-4 font-semibold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/8">
                    {loading ? (
                      <tr><td colSpan={4} className="py-10 text-center text-slate-500">Loading...</td></tr>
                    ) : filtered.map(s => (
                      <tr key={s.id} className="transition-colors hover:bg-white/3">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-white">{s.full_name || s.name || '-'}</div>
                          <div className="text-xs text-slate-500">{s.email}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-300">{s.role || 'Student'}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[s.status] || statusStyle.pending}`}>
                            {s.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {isTeacherRole(s.role) && (
                              <button
                                onClick={() => viewTeacherProfile(s)}
                                className="rounded-lg bg-sky-900/50 p-1.5 text-sky-300 transition-colors hover:bg-sky-800"
                                title="View teacher profile"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            {s.status !== 'approved' && (
                              <button onClick={() => approve(s)} className="rounded-lg bg-emerald-900/60 p-1.5 text-emerald-400 transition-colors hover:bg-emerald-800" title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            {s.status === 'approved' && (
                              <button onClick={() => suspend(s)} className="rounded-lg bg-amber-900/60 p-1.5 text-amber-400 transition-colors hover:bg-amber-800" title="Suspend">
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button onClick={() => remove(s.id)} className="rounded-lg bg-red-900/40 p-1.5 text-red-400 transition-colors hover:bg-red-900" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!loading && filtered.length === 0 && (
                <div className="py-12 text-center text-slate-500">No users in this category.</div>
              )}
            </div>

            {stats.pending > 0 && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-800 bg-amber-900/30 p-4">
                <Clock className="h-5 w-5 flex-shrink-0 text-amber-400" />
                <p className="text-sm text-amber-300">
                  <strong>{stats.pending} user{stats.pending > 1 ? 's' : ''}</strong> awaiting approval. Click approve to activate.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


