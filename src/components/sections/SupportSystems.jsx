import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  DollarSign,
  GraduationCap,
  MapPinned,
  MessageCircle,
  Route,
  Shield,
  ShieldCheck,
  Truck,
  UserCircle2,
  Users,
  Wallet,
} from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatPanel } from '../platform/ChatPanel';
import { PaymentSummaryCard } from '../platform/PaymentSummaryCard';
import { SessionCard } from '../platform/SessionCard';
import { SupportProfileCard } from '../platform/SupportProfileCard';
import { Modal } from '../ui/Modal';
import { usePlatform } from '../../state/PlatformContext';
import { LETTERS } from '../../data/tajweedData';

function statusTone(status) {
  if (status === 'approved') return 'text-[#34d399]';
  if (status === 'pending') return 'text-[#facc15]';
  if (status === 'rejected') return 'text-[#f87171]';
  if (status === 'suspended') return 'text-[#fb7185]';
  return 'text-[rgba(217,251,232,0.66)]';
}

function formatDate(dateValue) {
  if (!dateValue) return '-';
  try {
    return new Date(dateValue).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateValue;
  }
}

const ROLE_CARD_STYLES = {
  red: 'border-[rgba(248,113,113,0.45)] bg-[rgba(48,20,20,0.7)] shadow-[0_0_0_1px_rgba(248,113,113,0.12)]',
  amber:
    'border-[rgba(251,146,60,0.45)] bg-[rgba(56,34,15,0.68)] shadow-[0_0_0_1px_rgba(251,146,60,0.12)]',
  blue: 'border-[rgba(56,189,248,0.45)] bg-[rgba(8,41,58,0.64)] shadow-[0_0_0_1px_rgba(56,189,248,0.12)]',
  green:
    'border-[rgba(34,197,94,0.45)] bg-[rgba(7,47,33,0.62)] shadow-[0_0_0_1px_rgba(34,197,94,0.12)]',
};

const ROLE_ICON_MAP = {
  shield: Shield,
  briefcase: BriefcaseBusiness,
  graduation: GraduationCap,
  user: UserCircle2,
};

const TRANSPORT_AREAS = [
  'Overport',
  'Springfield',
  'Sydenham',
  'Musgrave',
  'Morningside',
  'Greyville',
  'Berea',
  'Other',
];

const TRANSPORT_DESTINATIONS = ['Madrasa', 'Masjid', 'Islamic Class', 'Fajr Salah'];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AGE_GROUPS = ['Under 7', '7-10', '11-14', '15-18', 'Adult'];

const PROVIDER_STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

const REQUEST_STATUS_LABELS = {
  submitted: 'Submitted',
  pending_review: 'Pending Review',
  awaiting_match: 'Awaiting Match',
  matched: 'Matched',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function TransportStatusBadge({ status, labelMap = {} }) {
  const normalized = String(status || '').trim();
  const label = labelMap[normalized] || normalized || 'Unknown';
  const tone =
    normalized === 'approved' || normalized === 'completed' || normalized === 'confirmed'
      ? 'bg-[rgba(16,185,129,0.18)] text-[#34d399] border-[rgba(16,185,129,0.35)]'
      : normalized === 'matched'
      ? 'bg-[rgba(56,189,248,0.18)] text-[#38bdf8] border-[rgba(56,189,248,0.35)]'
      : normalized === 'submitted' || normalized === 'pending_review' || normalized === 'under_review' || normalized === 'awaiting_match'
      ? 'bg-[rgba(250,204,21,0.14)] text-[#facc15] border-[rgba(250,204,21,0.34)]'
      : 'bg-[rgba(248,113,113,0.14)] text-[#f87171] border-[rgba(248,113,113,0.34)]';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${tone}`}
    >
      {label}
    </span>
  );
}

function TransportEmptyState({ icon: Icon = Truck, title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-[rgba(34,197,94,0.24)] bg-[rgba(10,15,13,0.5)] p-4 text-center">
      <Icon size={18} className="mx-auto text-[rgba(134,239,172,0.72)]" />
      <p className="mt-2 text-sm font-semibold text-[rgba(217,251,232,0.92)]">{title}</p>
      <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">{description}</p>
    </div>
  );
}

export function SupportSystemsSection() {
  const {
    state,
    roles,
    roleDefinitions,
    permissionLabels,
    userStatus,
    sessionStatus,
    transportProviderStatus,
    transportRequestStatus,
    usersById,
    currentUser,
    isAdmin,
    visibleConversations,
    financeSummary,
    ensureOwner,
    registerApplication,
    login,
    logout,
    updateUserStatus,
    changeUserRole,
    updateRolePermissions,
    deleteUser,
    getOrCreateConversation,
    sendMessage,
    markConversationRead,
    createSession,
    updateSessionStatus,
    recordPayment,
    setLetterAudio,
    bookCounseling,
    updateCounselorPrice,
    registerTransportProvider,
    submitTransportRequest,
    updateTransportProviderStatus,
    updateTransportRequestStatus,
    assignTransportRequest,
  } = usePlatform();

  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');

  const [ownerForm, setOwnerForm] = useState({
    name: 'Madrassa tahseenul Quraan',
    email: 'madrasatahseenuquraan@gmail.com',
    password: '',
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    password: '',
    desiredRole: roles.STUDENT,
  });
  const [roleSearch, setRoleSearch] = useState('');
  const [selectedRoleName, setSelectedRoleName] = useState('');
  const [roleDraftPermissions, setRoleDraftPermissions] = useState({});
  const [roleAssignUserId, setRoleAssignUserId] = useState('');

  const [messageTargetUserId, setMessageTargetUserId] = useState('');

  const [sessionForm, setSessionForm] = useState({
    title: '',
    teacherId: '',
    studentId: '',
    serviceType: 'lesson',
    mode: 'video',
    start: '',
    durationMinutes: 45,
    paymentAmount: '',
  });
  const [sessionNotice, setSessionNotice] = useState({ type: '', text: '' });
  const [activeSessionId, setActiveSessionId] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    sessionId: '',
    amount: '',
    status: 'completed',
  });

  const [counselingForm, setCounselingForm] = useState({
    durationKey: '30m',
    start: '',
    notes: '',
  });

  const [transportProviderForm, setTransportProviderForm] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    coverageArea: '',
    pickupZones: [],
    dropoffZones: [],
    availableDays: [],
    timeWindowStart: '',
    timeWindowEnd: '',
    seats: '',
    serviceType: 'paid',
    vehicleType: '',
    vehicleRegistration: '',
    routeNotes: '',
    vehicleNotes: '',
    verification: {
      idDocument: false,
      driversLicense: false,
      vehicleDocument: false,
      vehiclePhoto: false,
    },
  });
  const [transportRequestForm, setTransportRequestForm] = useState({
    firstName: '',
    surname: '',
    email: '',
    contactNumber: '',
    pickupArea: '',
    destination: '',
    madrasaOrMasjidName: '',
    ageGroup: '',
    preferredPickupTime: '',
    requiredDays: [],
    affordability: 'paid',
    rideFrequency: 'one_time',
    notes: '',
  });
  const [transportNotice, setTransportNotice] = useState({ type: '', text: '' });
  const [transportAdminNotes, setTransportAdminNotes] = useState({});
  const [transportAssignDraft, setTransportAssignDraft] = useState({});

  const [audioForm, setAudioForm] = useState({ letterNum: '1', sourceUrl: '' });

  const minSessionDateTime = useMemo(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }, []);

  const transportTimeOptions = useMemo(() => {
    const options = [];
    for (let hour = 5; hour <= 21; hour += 1) {
      for (let minute = 0; minute <= 30; minute += 30) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  }, []);

  const hasAdmin = useMemo(
    () =>
      state.users.some(
        (user) => user.role === roles.ADMIN && user.status === userStatus.APPROVED
      ),
    [state.users, roles.ADMIN, userStatus.APPROVED]
  );

  const pendingUsers = useMemo(
    () => state.users.filter((user) => user.status === userStatus.PENDING),
    [state.users, userStatus.PENDING]
  );

  const approvedTeachers = useMemo(
    () =>
      state.users.filter(
        (user) =>
          user.status === userStatus.APPROVED &&
          (user.role === roles.TEACHER || user.role === roles.COUNSELOR)
      ),
    [state.users, userStatus.APPROVED, roles.TEACHER, roles.COUNSELOR]
  );

  const approvedStudents = useMemo(
    () =>
      state.users.filter(
        (user) => user.status === userStatus.APPROVED && user.role === roles.STUDENT
      ),
    [state.users, userStatus.APPROVED, roles.STUDENT]
  );

  const filteredRoleUsers = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    if (!q) return state.users;
    return state.users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
    );
  }, [state.users, roleSearch]);

  const managedRoleCards = useMemo(() => {
    return [roles.ADMIN, roles.CO_ADMIN, roles.TEACHER, roles.STUDENT]
      .filter((roleName) => roleDefinitions[roleName])
      .map((roleName) => ({
        roleName,
        ...roleDefinitions[roleName],
        enabledPermissions: state.rolePermissions?.[roleName] || {},
      }));
  }, [roles, roleDefinitions, state.rolePermissions]);

  const selectedRoleDefinition = useMemo(() => {
    if (!selectedRoleName) return null;
    const definition = roleDefinitions[selectedRoleName];
    if (!definition) return null;

    return {
      roleName: selectedRoleName,
      ...definition,
      enabledPermissions: roleDraftPermissions,
    };
  }, [selectedRoleName, roleDefinitions, roleDraftPermissions]);

  const messageTargets = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) {
      return state.users.filter(
        (user) =>
          user.id !== currentUser.id &&
          user.status === userStatus.APPROVED &&
          user.role !== roles.ADMIN
      );
    }
    return state.users.filter(
      (user) =>
        user.id !== currentUser.id &&
        user.status === userStatus.APPROVED &&
        user.role === roles.ADMIN
    );
  }, [
    currentUser,
    isAdmin,
    roles.ADMIN,
    state.users,
    userStatus.APPROVED,
  ]);

  const visibleSessions = useMemo(() => {
    if (!currentUser) return [];
    const base = isAdmin
      ? state.sessions
      : state.sessions.filter(
          (session) =>
            session.teacherId === currentUser.id || session.studentId === currentUser.id
        );
    return base.map((session) => ({
      ...session,
      teacher: usersById[session.teacherId]?.name || session.counselorName || 'Unassigned',
      student: usersById[session.studentId]?.name || 'Unassigned',
    }));
  }, [currentUser, isAdmin, state.sessions, usersById]);

  const activeSession = useMemo(
    () => visibleSessions.find((session) => session.id === activeSessionId) || null,
    [visibleSessions, activeSessionId]
  );

  const transactionsView = useMemo(() => {
    return state.transactions.map((transaction) => {
      const session = state.sessions.find((item) => item.id === transaction.sessionId);
      const provider = session ? usersById[session.teacherId] : null;
      return {
        ...transaction,
        providerName: provider?.name || session?.counselorName || 'Provider',
      };
    });
  }, [state.transactions, state.sessions, usersById]);

  const approvedTransportProviders = useMemo(
    () =>
      state.transportProviders.filter(
        (provider) => provider.status === transportProviderStatus.APPROVED
      ),
    [state.transportProviders, transportProviderStatus.APPROVED]
  );

  const pendingTransportProviders = useMemo(
    () =>
      state.transportProviders.filter(
        (provider) =>
          provider.status === transportProviderStatus.SUBMITTED ||
          provider.status === transportProviderStatus.UNDER_REVIEW
      ),
    [
      state.transportProviders,
      transportProviderStatus.SUBMITTED,
      transportProviderStatus.UNDER_REVIEW,
    ]
  );

  const pendingTransportRequests = useMemo(
    () =>
      state.transportRequests.filter(
        (request) =>
          request.status === transportRequestStatus.SUBMITTED ||
          request.status === transportRequestStatus.PENDING_REVIEW ||
          request.status === transportRequestStatus.AWAITING_MATCH
      ),
    [
      state.transportRequests,
      transportRequestStatus.SUBMITTED,
      transportRequestStatus.PENDING_REVIEW,
      transportRequestStatus.AWAITING_MATCH,
    ]
  );

  const counselorView = useMemo(
    () => ({
      ...state.counselorProfile,
      highlights: [
        'Experienced in supporting large student communities',
        'Trusted by learners and parents for steady guidance',
        'Private support sessions available for students and families',
        'Suitable for learning support, mentoring, and practical guidance',
      ],
      durations: [
        { label: '30 Minutes', key: '30m' },
        { label: '45 Minutes', key: '45m' },
        { label: '60 Minutes', key: '60m' },
      ],
    }),
    [state.counselorProfile]
  );

  function pushInfo(message) {
    setAuthError('');
    setAuthInfo(message);
  }

  function pushError(message) {
    setAuthInfo('');
    setAuthError(message);
  }

  function onBootstrapOwner(event) {
    event.preventDefault();
    try {
      ensureOwner(ownerForm);
      pushInfo('Owner admin account has been created and logged in.');
      setOwnerForm((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      pushError(error.message || 'Unable to create owner account.');
    }
  }

  function onLogin(event) {
    event.preventDefault();
    try {
      login(loginForm);
      pushInfo('Login successful.');
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      pushError(error.message || 'Login failed.');
    }
  }

  function onApply(event) {
    event.preventDefault();
    try {
      registerApplication(applyForm);
      pushInfo('Application submitted. Awaiting admin approval.');
      setApplyForm({
        name: '',
        email: '',
        password: '',
        desiredRole: roles.STUDENT,
      });
    } catch (error) {
      pushError(error.message || 'Application failed.');
    }
  }

  function startConversation() {
    if (!messageTargetUserId) return;
    const conversationId = getOrCreateConversation(messageTargetUserId);
    if (conversationId) {
      markConversationRead(conversationId);
    }
  }

  function onCreateSession(event) {
    event.preventDefault();
    setSessionNotice({ type: '', text: '' });
    try {
      createSession(sessionForm);
      setSessionNotice({ type: 'success', text: 'Session created successfully.' });
      setSessionForm({
        title: '',
        teacherId: '',
        studentId: '',
        serviceType: 'lesson',
        mode: 'video',
        start: '',
        durationMinutes: 45,
        paymentAmount: '',
      });
    } catch (error) {
      setSessionNotice({
        type: 'error',
        text: error?.message || 'Could not create session. Please verify selections.',
      });
    }
  }

  const canCreateSession = Boolean(
    sessionForm.title.trim() &&
      sessionForm.teacherId &&
      sessionForm.studentId &&
      sessionForm.teacherId !== sessionForm.studentId &&
      sessionForm.start &&
      approvedTeachers.length > 0 &&
      approvedStudents.length > 0
  );

  function onRecordPayment(event) {
    event.preventDefault();
    if (!paymentForm.sessionId || !paymentForm.amount) return;
    recordPayment({
      sessionId: paymentForm.sessionId,
      amount: paymentForm.amount,
      status: paymentForm.status,
    });
    setPaymentForm({ sessionId: '', amount: '', status: 'completed' });
  }

  function onBookCounseling(event) {
    event.preventDefault();
    if (!counselingForm.start) return;
    bookCounseling(counselingForm);
    setCounselingForm({ durationKey: '30m', start: '', notes: '' });
  }

  function toggleArrayField(setter, key, value) {
    setter((prev) => {
      const current = Array.isArray(prev[key]) ? prev[key] : [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  function onRegisterTransportProvider(event) {
    event.preventDefault();
    setTransportNotice({ type: '', text: '' });
    try {
      if (!transportProviderForm.fullName.trim()) {
        throw new Error('Provider full name is required.');
      }
      if (!transportProviderForm.coverageArea) {
        throw new Error('Please select a coverage area.');
      }
      if (!transportProviderForm.timeWindowStart || !transportProviderForm.timeWindowEnd) {
        throw new Error('Please select a valid availability window.');
      }
      if (transportProviderForm.availableDays.length === 0) {
        throw new Error('Select at least one available day.');
      }
      if (transportProviderForm.pickupZones.length === 0) {
        throw new Error('Select at least one pickup zone.');
      }
      if (transportProviderForm.dropoffZones.length === 0) {
        throw new Error('Select at least one drop-off zone.');
      }
      if (!transportProviderForm.seats || Number(transportProviderForm.seats) < 1) {
        throw new Error('Seats available must be at least 1.');
      }

      registerTransportProvider(transportProviderForm);
      setTransportProviderForm({
        fullName: '',
        contactNumber: '',
        email: '',
        coverageArea: '',
        pickupZones: [],
        dropoffZones: [],
        availableDays: [],
        timeWindowStart: '',
        timeWindowEnd: '',
        seats: '',
        serviceType: 'paid',
        vehicleType: '',
        vehicleRegistration: '',
        routeNotes: '',
        vehicleNotes: '',
        verification: {
          idDocument: false,
          driversLicense: false,
          vehicleDocument: false,
          vehiclePhoto: false,
        },
      });
      setTransportNotice({
        type: 'success',
        text: 'Provider profile submitted. Admin review is now in progress.',
      });
    } catch (error) {
      setTransportNotice({
        type: 'error',
        text: error?.message || 'Could not submit provider profile.',
      });
    }
  }

  function onSubmitTransportRequest(event) {
    event.preventDefault();
    setTransportNotice({ type: '', text: '' });
    try {
      if (!transportRequestForm.pickupArea || !transportRequestForm.destination) {
        throw new Error('Pickup area and destination are required.');
      }
      if (!transportRequestForm.preferredPickupTime) {
        throw new Error('Please select a preferred pickup time.');
      }
      if (transportRequestForm.requiredDays.length === 0) {
        throw new Error('Select at least one day for transport.');
      }
      submitTransportRequest({
        ...transportRequestForm,
        status: transportRequestStatus.PENDING_REVIEW,
      });
      setTransportRequestForm({
        firstName: '',
        surname: '',
        email: '',
        contactNumber: '',
        pickupArea: '',
        destination: '',
        madrasaOrMasjidName: '',
        ageGroup: '',
        preferredPickupTime: '',
        requiredDays: [],
        affordability: 'paid',
        rideFrequency: 'one_time',
        notes: '',
      });
      setTransportNotice({
        type: 'success',
        text: 'Ride request submitted. You will receive an update once a provider is matched.',
      });
    } catch (error) {
      setTransportNotice({
        type: 'error',
        text: error?.message || 'Could not submit ride request.',
      });
    }
  }

  function setProviderUnderReview(providerId) {
    updateTransportProviderStatus(providerId, transportProviderStatus.UNDER_REVIEW);
  }

  function assignRequestToProvider(requestId) {
    const providerId = transportAssignDraft[requestId];
    try {
      assignTransportRequest(requestId, providerId, transportAdminNotes[requestId] || '');
      setTransportNotice({
        type: 'success',
        text: 'Request matched to provider successfully.',
      });
    } catch (error) {
      setTransportNotice({
        type: 'error',
        text: error?.message || 'Could not assign provider to request.',
      });
    }
  }

  function getEligibleProviders(request) {
    return approvedTransportProviders.filter((provider) => {
      const pickupMatch =
        provider.pickupZones.includes(request.pickupArea) ||
        provider.coverageArea === request.pickupArea;
      const dropoffMatch =
        provider.dropoffZones.includes(request.destination) ||
        provider.coverageArea === request.destination;
      const hasSeats = Number(provider.seats) > 0;
      const canSupportAffordability =
        request.affordability === 'paid'
          ? provider.serviceType === 'paid' || provider.serviceType === 'mixed'
          : request.affordability === 'free'
          ? provider.serviceType === 'volunteer' || provider.serviceType === 'mixed'
          : true;
      return pickupMatch && dropoffMatch && hasSeats && canSupportAffordability;
    });
  }

  function onSaveLetterAudio(event) {
    event.preventDefault();
    if (!audioForm.letterNum || !audioForm.sourceUrl.trim()) return;
    setLetterAudio(audioForm.letterNum, audioForm.sourceUrl);
    setAudioForm((prev) => ({ ...prev, sourceUrl: '' }));
  }

  function openRoleEditor(roleName) {
    const currentPermissionMap = state.rolePermissions?.[roleName] || {};
    setSelectedRoleName(roleName);
    setRoleDraftPermissions({ ...currentPermissionMap });
    setRoleAssignUserId('');
  }

  function closeRoleEditor() {
    setSelectedRoleName('');
    setRoleDraftPermissions({});
    setRoleAssignUserId('');
  }

  function toggleRolePermission(permissionKey) {
    setRoleDraftPermissions((prev) => ({
      ...prev,
      [permissionKey]: !prev[permissionKey],
    }));
  }

  function saveRolePermissions() {
    if (!selectedRoleName) return;
    updateRolePermissions(selectedRoleName, roleDraftPermissions);
    closeRoleEditor();
  }

  function assignUserToSelectedRole() {
    if (!selectedRoleName || !roleAssignUserId) return;
    changeUserRole(roleAssignUserId, selectedRoleName);
    setRoleAssignUserId('');
  }

  const upcomingCount = visibleSessions.filter(
    (session) => session.status === sessionStatus.UPCOMING
  ).length;
  const liveCount = visibleSessions.filter(
    (session) => session.status === sessionStatus.LIVE
  ).length;

  return (
    <>
      {!currentUser || isAdmin ? (
      <Section id="platform-auth" variant="alt" py="py-12 md:py-16">
        <div className="mb-8">
          <p className="section-eyebrow">Platform Access</p>
          <h2 className="section-title">Account Access</h2>
          <p className="section-subtitle !mx-0">
            Sign in to continue or apply for access. Admin approval is required before protected
            tools are enabled.
          </p>
        </div>

        {authInfo ? (
          <p className="mb-3 rounded-xl border border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.16)] px-3 py-2 text-sm text-[#dcfce7]">
            {authInfo}
          </p>
        ) : null}
        {authError ? (
          <p className="mb-3 rounded-xl border border-[rgba(248,113,113,0.45)] bg-[rgba(127,29,29,0.3)] px-3 py-2 text-sm text-[#fecaca]">
            {authError}
          </p>
        ) : null}

        {!hasAdmin ? (
          <form
            onSubmit={onBootstrapOwner}
            className="rounded-2xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.82)] p-4 md:p-5"
          >
            <h3 className="text-xl font-semibold text-white">Create Owner Admin</h3>
            <p className="mt-1 text-sm text-[rgba(217,251,232,0.68)]">
              First-time setup: create the owner account to enable approvals and admin
              controls.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input
                value={ownerForm.name}
                onChange={(event) =>
                  setOwnerForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Owner name"
                required
              />
              <Input
                type="email"
                value={ownerForm.email}
                onChange={(event) =>
                  setOwnerForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Owner email"
                required
              />
              <Input
                type="password"
                value={ownerForm.password}
                onChange={(event) =>
                  setOwnerForm((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Password"
                required
              />
            </div>
            <div className="mt-3">
              <Button type="submit" variant="primary" size="sm">
                Initialize Platform Owner
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {!currentUser ? (
              <>
                <form
                  onSubmit={onLogin}
                  className="rounded-2xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.82)] p-4"
                >
                  <h3 className="text-xl font-semibold text-white">Sign In</h3>
                  <div className="mt-3 grid gap-3">
                    <Input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="Email"
                      required
                    />
                    <Input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <Button type="submit" variant="primary" size="sm">
                      Sign In
                    </Button>
                  </div>
                </form>

                <form
                  onSubmit={onApply}
                  className="rounded-2xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.82)] p-4"
                >
                  <h3 className="text-xl font-semibold text-white">Apply to Join</h3>
                  <p className="mt-1 text-sm text-[rgba(217,251,232,0.68)]">
                    New applications remain pending until approved by admin.
                  </p>
                  <div className="mt-3 grid gap-3">
                    <Input
                      value={applyForm.name}
                      onChange={(event) =>
                        setApplyForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      placeholder="Full name"
                      required
                    />
                    <Input
                      type="email"
                      value={applyForm.email}
                      onChange={(event) =>
                        setApplyForm((prev) => ({ ...prev, email: event.target.value }))
                      }
                      placeholder="Email"
                      required
                    />
                    <Input
                      type="password"
                      value={applyForm.password}
                      onChange={(event) =>
                        setApplyForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Password"
                      required
                    />
                    <select
                      value={applyForm.desiredRole}
                      onChange={(event) =>
                        setApplyForm((prev) => ({
                          ...prev,
                          desiredRole: event.target.value,
                        }))
                      }
                      className="input"
                    >
                      <option value={roles.STUDENT}>Student</option>
                      <option value={roles.TEACHER}>Teacher</option>
                      <option value={roles.COUNSELOR}>Counselor</option>
                      <option value={roles.DRIVER}>Driver / Transport Provider</option>
                    </select>
                  </div>
                  <div className="mt-3">
                    <Button type="submit" variant="secondary" size="sm">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.82)] p-4 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Logged in as {currentUser.name}
                    </h3>
                    <p className={`text-sm ${statusTone(currentUser.status)}`}>
                      {currentUser.role} - {currentUser.status}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Section>
      ) : null}

      {isAdmin ? (
        <Section id="roles" variant="pattern" py="py-12 md:py-16">
          <div className="mb-6">
            <p className="section-eyebrow">Roles</p>
            <h2 className="section-title inline-flex items-center gap-2">
              <Shield size={28} className="text-[#42e59a]" /> Role Management
            </h2>
            <p className="section-subtitle !mx-0">
              Assign roles and manage user permissions across the platform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {managedRoleCards.map((roleCard) => {
              const Icon = ROLE_ICON_MAP[roleCard.icon] || Shield;
              const enabledCount = Object.values(roleCard.enabledPermissions).filter(Boolean).length;
              return (
                <button
                  key={roleCard.roleName}
                  type="button"
                  onClick={() => openRoleEditor(roleCard.roleName)}
                  className={`rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 ${ROLE_CARD_STYLES[roleCard.accent] || ROLE_CARD_STYLES.green}`}
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(217,251,232,0.26)] bg-[rgba(17,26,21,0.5)]">
                    <Icon size={19} className="text-[#dcfce7]" />
                  </div>
                  <p className="text-2xl font-semibold text-white">{roleCard.title}</p>
                  <p className="mt-0.5 text-sm text-[rgba(217,251,232,0.68)]">{roleCard.subtitle}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-[rgba(217,251,232,0.9)]">
                    {roleCard.permissions.slice(0, 4).map((permissionKey) => (
                      <li key={permissionKey} className="inline-flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 text-[#67f1b4]" />
                        <span>{permissionLabels[permissionKey] || permissionKey}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 inline-flex items-center rounded-full border border-[rgba(217,251,232,0.22)] px-3 py-1 text-xs text-[rgba(217,251,232,0.78)]">
                    {enabledCount} permissions enabled
                  </div>
                </button>
              );
            })}
          </div>

          <Modal
            open={Boolean(selectedRoleDefinition)}
            onClose={closeRoleEditor}
            title={selectedRoleDefinition ? `${selectedRoleDefinition.title} Permissions` : 'Role Permissions'}
          >
            {selectedRoleDefinition ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.56)] p-3">
                  <p className="text-lg font-semibold text-white">{selectedRoleDefinition.title}</p>
                  <p className="text-sm text-[rgba(217,251,232,0.68)]">
                    {selectedRoleDefinition.subtitle}
                  </p>
                </div>

                <div className="space-y-2">
                  {selectedRoleDefinition.permissions.map((permissionKey) => (
                    <label
                      key={permissionKey}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.74)] px-3 py-2"
                    >
                      <span className="text-sm text-[#e6f9ef]">
                        {permissionLabels[permissionKey] || permissionKey}
                      </span>
                      <input
                        type="checkbox"
                        checked={Boolean(roleDraftPermissions[permissionKey])}
                        onChange={() => toggleRolePermission(permissionKey)}
                        className="h-4 w-4 accent-[#22c55e]"
                      />
                    </label>
                  ))}
                </div>

                <div className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.56)] p-3">
                  <p className="text-sm font-semibold text-white">Assign this role to a user</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      value={roleAssignUserId}
                      onChange={(event) => setRoleAssignUserId(event.target.value)}
                      className="input min-w-[250px] py-2"
                    >
                      <option value="">Select approved user</option>
                      {state.users
                        .filter((user) => user.status === userStatus.APPROVED)
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                            {user.id === currentUser?.id ? ' (You)' : ''} ({user.role})
                          </option>
                        ))}
                    </select>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={assignUserToSelectedRole}
                      disabled={!roleAssignUserId}
                    >
                      Assign role
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-[rgba(34,197,94,0.2)] pt-3">
                  <Button type="button" variant="ghost" size="sm" onClick={closeRoleEditor}>
                    Cancel
                  </Button>
                  <Button type="button" variant="primary" size="sm" onClick={saveRolePermissions}>
                    Save changes
                  </Button>
                </div>
              </div>
            ) : null}
          </Modal>
        </Section>
      ) : null}

      {isAdmin ? (
        <Section id="admin-approvals" variant="pattern" py="py-12 md:py-16">
          <div className="mb-6">
            <p className="section-eyebrow">Admin Control</p>
            <h2 className="section-title inline-flex items-center gap-2">
              <Shield size={28} className="text-[#42e59a]" /> User Approvals and Roles
            </h2>
            <p className="section-subtitle !mx-0">
              Approve applications, manage roles, and control account access from real user
              records.
            </p>
          </div>

          <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
            <h3 className="text-xl font-semibold text-white">Pending Applications</h3>
            {pendingUsers.length === 0 ? (
              <p className="mt-2 text-sm text-[rgba(217,251,232,0.62)]">
                No pending applications.
              </p>
            ) : (
              <div className="mt-3 grid gap-3">
                {pendingUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.55)] p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-[rgba(217,251,232,0.66)]">
                          {user.email} - Applied as {user.role}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            updateUserStatus(user.id, userStatus.APPROVED)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            updateUserStatus(user.id, userStatus.REJECTED)
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">
                  All Users and Role Assignment
                </h3>
                <div className="w-full md:w-[320px]">
                  <Input
                    value={roleSearch}
                    onChange={(event) => setRoleSearch(event.target.value)}
                    placeholder="Search users..."
                  />
                </div>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(34,197,94,0.2)] text-left text-sm text-[rgba(217,251,232,0.66)]">
                      <th className="pb-2 pr-3 font-medium">User</th>
                      <th className="pb-2 pr-3 font-medium">Role</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 pr-3 font-medium">Joined</th>
                      <th className="pb-2 pr-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoleUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[rgba(34,197,94,0.12)] text-sm text-[#e5f8ef]"
                      >
                        <td className="py-3 pr-3">
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-[rgba(217,251,232,0.55)]">{user.email}</p>
                        </td>
                        <td className="py-3 pr-3">
                          {user.id === currentUser?.id ? (
                            <span>{user.role}</span>
                          ) : (
                            <select
                              value={user.role}
                              className="input py-1.5"
                              onChange={(event) =>
                                changeUserRole(user.id, event.target.value)
                              }
                            >
                              {Object.values(roles).map((roleValue) => (
                                <option key={roleValue} value={roleValue}>
                                  {roleValue}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className={`py-3 pr-3 capitalize ${statusTone(user.status)}`}>
                          {user.status}
                        </td>
                        <td className="py-3 pr-3 text-[rgba(217,251,232,0.7)]">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 pr-3">
                          {user.id === currentUser?.id ? (
                            <span className="text-xs text-[rgba(217,251,232,0.55)]">
                              Owner account
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user.id, userStatus.APPROVED)
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateUserStatus(user.id, userStatus.SUSPENDED)
                                }
                              >
                                Suspend
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>
      ) : null}

      {!currentUser ? (
        <>
          <Section id="messages" variant="alt" py="py-12 md:py-16">
            <div className="mb-4">
              <p className="section-eyebrow">Messaging</p>
              <h2 className="section-title inline-flex items-center gap-2">
                <MessageCircle size={28} className="text-[#42e59a]" /> Messages
              </h2>
              <p className="section-subtitle !mx-0">
                Your conversations will appear here after sign-in. No messages yet.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-5">
              <TransportEmptyState
                icon={MessageCircle}
                title="No messages yet"
                description="Sign in to start secure conversations with admin and support."
              />
              <div className="mt-4">
                <Button variant="secondary" size="sm" href="#platform-auth">
                  Sign In to Open Messages
                </Button>
              </div>
            </div>
          </Section>

          <Section id="support" variant="pattern" py="py-12 md:py-16">
            <div className="mb-8 text-center">
              <p className="section-eyebrow">Student Support</p>
              <h2 className="section-title">Counseling and Guidance</h2>
              <p className="section-subtitle">
                Professional educational support in a calm and trusted environment.
              </p>
            </div>
            <SupportProfileCard profile={counselorView} />
            <div className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4 text-sm text-[rgba(217,251,232,0.72)]">
              Sign in with an approved account to request a counseling booking.
            </div>
          </Section>

          <Section id="transport" variant="alt" py="py-12 md:py-16">
            <div className="mb-6">
              <p className="section-eyebrow">Transport Service</p>
              <h2 className="section-title">Madrasa and Masjid Ride Requests</h2>
              <p className="section-subtitle !mx-0">
                Register as a provider or submit a ride request after account sign-in.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TransportEmptyState
                title="Provider registration requires sign-in"
                description="Create or sign in to your account to submit and manage provider applications."
              />
              <TransportEmptyState
                icon={Route}
                title="Ride request requires sign-in"
                description="Sign in to submit transport requests and track matching status updates."
              />
            </div>
            <div className="mt-4">
              <Button variant="secondary" size="sm" href="#platform-auth">
                Go to Account Access
              </Button>
            </div>
          </Section>
        </>
      ) : null}

      {currentUser ? (
        <>
          <Section id="sessions" variant="pattern" py="py-12 md:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-eyebrow">In-App Classes</p>
                <h2 className="section-title">Lessons and Session Rooms</h2>
                <p className="section-subtitle !mx-0">
                  Sessions are scheduled and joined inside the platform.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.26)] bg-[rgba(34,197,94,0.13)] px-3 py-1.5 text-[#c6fce2]">
                  <CalendarPlus size={14} /> Upcoming: {upcomingCount}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.18)] px-3 py-1.5 text-[#dcfce7]">
                  <CheckCircle2 size={14} /> Live: {liveCount}
                </span>
              </div>
            </div>

            {isAdmin ? (
              <form
                onSubmit={onCreateSession}
                className="mb-5 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <h3 className="text-xl font-semibold text-white">Schedule New Session</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Input
                    value={sessionForm.title}
                    onChange={(event) =>
                      setSessionForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Session title"
                    required
                  />
                  <select
                    value={sessionForm.teacherId}
                    onChange={(event) =>
                      setSessionForm((prev) => ({ ...prev, teacherId: event.target.value }))
                    }
                    className="input"
                    required
                    disabled={approvedTeachers.length === 0}
                  >
                    <option value="">Select teacher/counselor</option>
                    {approvedTeachers
                      .filter((teacher) => teacher.id !== sessionForm.studentId)
                      .map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.role})
                      </option>
                      ))}
                  </select>
                  <select
                    value={sessionForm.studentId}
                    onChange={(event) =>
                      setSessionForm((prev) => ({ ...prev, studentId: event.target.value }))
                    }
                    className="input"
                    required
                    disabled={approvedStudents.length === 0}
                  >
                    <option value="">Select student</option>
                    {approvedStudents
                      .filter((student) => student.id !== sessionForm.teacherId)
                      .map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                      ))}
                  </select>
                  <Input
                    type="datetime-local"
                    value={sessionForm.start}
                    onChange={(event) =>
                      setSessionForm((prev) => ({ ...prev, start: event.target.value }))
                    }
                    min={minSessionDateTime}
                    required
                  />
                  <select
                    value={sessionForm.serviceType}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        serviceType: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option value="lesson">Lesson</option>
                    <option value="counseling">Counseling</option>
                    <option value="support">Support</option>
                  </select>
                  <select
                    value={sessionForm.mode}
                    onChange={(event) =>
                      setSessionForm((prev) => ({ ...prev, mode: event.target.value }))
                    }
                    className="input"
                  >
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </select>
                  <Input
                    type="number"
                    min="15"
                    value={sessionForm.durationMinutes}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        durationMinutes: event.target.value,
                      }))
                    }
                    placeholder="Duration minutes"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={sessionForm.paymentAmount}
                    onChange={(event) =>
                      setSessionForm((prev) => ({
                        ...prev,
                        paymentAmount: event.target.value,
                      }))
                    }
                    placeholder="Expected payment (R)"
                  />
                </div>
                {approvedTeachers.length === 0 ? (
                  <p className="mt-2 text-sm text-[rgba(217,251,232,0.62)]">
                    No approved teachers/counselors available yet.
                  </p>
                ) : null}
                {approvedStudents.length === 0 ? (
                  <p className="mt-1 text-sm text-[rgba(217,251,232,0.62)]">
                    No approved students available yet.
                  </p>
                ) : null}
                {sessionNotice.text ? (
                  <p
                    className={`mt-2 text-sm ${
                      sessionNotice.type === 'error'
                        ? 'text-[#fecaca]'
                        : 'text-[#bbf7d0]'
                    }`}
                  >
                    {sessionNotice.text}
                  </p>
                ) : null}
                <div className="mt-3">
                  <Button type="submit" variant="primary" size="sm" disabled={!canCreateSession}>
                    Create Session
                  </Button>
                </div>
              </form>
            ) : null}

            {visibleSessions.length === 0 ? (
              <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4 text-sm text-[rgba(217,251,232,0.62)]">
                {isAdmin
                  ? 'No sessions scheduled yet. Create your first session above.'
                  : 'No sessions assigned to your account yet.'}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onJoin={() => {
                      setActiveSessionId(session.id);
                      if (session.status === sessionStatus.UPCOMING) {
                        updateSessionStatus(session.id, sessionStatus.LIVE);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {activeSession ? (
              <div className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.25)] bg-[rgba(17,26,21,0.86)] p-4">
                <h3 className="text-xl font-semibold text-white">
                  Session Room: {activeSession.title}
                </h3>
                <p className="mt-1 text-sm text-[rgba(217,251,232,0.7)]">
                  This is the in-app live session area. Extend this room with WebRTC signaling
                  for full built-in video/audio streaming.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateSessionStatus(activeSession.id, sessionStatus.LIVE)}
                  >
                    Mark Live
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      updateSessionStatus(activeSession.id, sessionStatus.COMPLETED)
                    }
                  >
                    Mark Completed
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveSessionId('')}
                  >
                    Close Room
                  </Button>
                </div>
              </div>
            ) : null}
          </Section>

          <Section id="messages" variant="alt" py="py-12 md:py-16">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="section-eyebrow">Messaging</p>
                <h2 className="section-title inline-flex items-center gap-2">
                  <MessageCircle size={28} className="text-[#42e59a]" /> Messages
                </h2>
              </div>
              {messageTargets.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={messageTargetUserId}
                    onChange={(event) => setMessageTargetUserId(event.target.value)}
                    className="input md:w-[240px]"
                  >
                    <option value="">Start conversation with...</option>
                    {messageTargets.map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.name} ({target.role})
                      </option>
                    ))}
                  </select>
                  <Button variant="secondary" size="sm" onClick={startConversation}>
                    Open Chat
                  </Button>
                </div>
              ) : null}
            </div>
            <ChatPanel
              conversations={visibleConversations}
              usersById={usersById}
              currentUser={currentUser}
              onSend={sendMessage}
              onOpenConversation={markConversationRead}
            />
          </Section>

          <Section id="support" variant="pattern" py="py-12 md:py-16">
            <div className="mb-8 text-center">
              <p className="section-eyebrow">Student Support</p>
              <h2 className="section-title">Counseling and Guidance</h2>
              <p className="section-subtitle">
                Professional educational support integrated into your learning journey.
              </p>
            </div>
            <SupportProfileCard profile={counselorView} />

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {isAdmin ? (
                <article className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
                  <h3 className="text-xl font-semibold text-white">Edit Counseling Fees</h3>
                  <p className="mt-1 text-sm text-[rgba(217,251,232,0.66)]">
                    These values are stored and used for real counseling bookings.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {['30m', '45m', '60m'].map((durationKey) => (
                      <label key={durationKey} className="text-sm">
                        <span className="mb-1 block text-[rgba(217,251,232,0.72)]">
                          {durationKey}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          value={state.counselorProfile.durationPrices[durationKey] ?? ''}
                          onChange={(event) =>
                            updateCounselorPrice(durationKey, event.target.value)
                          }
                          placeholder="Amount (R)"
                        />
                      </label>
                    ))}
                  </div>
                </article>
              ) : currentUser.status === userStatus.APPROVED ? (
                <form
                  onSubmit={onBookCounseling}
                  className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
                >
                  <h3 className="text-xl font-semibold text-white">
                    Book Counseling Session
                  </h3>
                  <div className="mt-3 grid gap-3">
                    <select
                      value={counselingForm.durationKey}
                      onChange={(event) =>
                        setCounselingForm((prev) => ({
                          ...prev,
                          durationKey: event.target.value,
                        }))
                      }
                      className="input"
                    >
                      <option value="30m">
                        30 minutes -{' '}
                        {state.counselorProfile.durationPrices['30m'] == null
                          ? 'Set by admin'
                          : `R ${state.counselorProfile.durationPrices['30m']}`}
                      </option>
                      <option value="45m">
                        45 minutes -{' '}
                        {state.counselorProfile.durationPrices['45m'] == null
                          ? 'Set by admin'
                          : `R ${state.counselorProfile.durationPrices['45m']}`}
                      </option>
                      <option value="60m">
                        60 minutes -{' '}
                        {state.counselorProfile.durationPrices['60m'] == null
                          ? 'Set by admin'
                          : `R ${state.counselorProfile.durationPrices['60m']}`}
                      </option>
                    </select>
                    <Input
                      type="datetime-local"
                      value={counselingForm.start}
                      onChange={(event) =>
                        setCounselingForm((prev) => ({
                          ...prev,
                          start: event.target.value,
                        }))
                      }
                      required
                    />
                    <textarea
                      className="input min-h-[100px]"
                      value={counselingForm.notes}
                      onChange={(event) =>
                        setCounselingForm((prev) => ({
                          ...prev,
                          notes: event.target.value,
                        }))
                      }
                      placeholder="Session notes (optional)"
                    />
                  </div>
                  <div className="mt-3">
                    <Button type="submit" variant="primary" size="sm">
                      Book Session
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4 text-sm text-[rgba(217,251,232,0.62)]">
                  Your account must be approved before booking counseling sessions.
                </div>
              )}
            </div>
          </Section>

          <Section id="transport" variant="alt" py="py-12 md:py-16">
            <div className="mb-6">
              <p className="section-eyebrow">Transport Service</p>
              <h2 className="section-title">Madrasa and Masjid Ride Requests</h2>
              <p className="section-subtitle !mx-0">
                Register providers, submit ride requests, and manage approvals through a trusted,
                real workflow for madrasa and masjid transport.
              </p>
            </div>

            {transportNotice.text ? (
              <div
                className={`mb-4 rounded-xl border px-3 py-2 text-sm ${
                  transportNotice.type === 'success'
                    ? 'border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.14)] text-[#dcfce7]'
                    : 'border-[rgba(248,113,113,0.4)] bg-[rgba(127,29,29,0.25)] text-[#fecaca]'
                }`}
              >
                {transportNotice.text}
              </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-2">
              <form
                onSubmit={onRegisterTransportProvider}
                className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                  <Truck size={18} className="text-[#42e59a]" /> Register as Transport Provider
                </h3>
                <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">
                  Providers move from Submitted → Under Review → Approved before public listing.
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Input
                    value={transportProviderForm.fullName}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Full name"
                    required
                  />
                  <Input
                    value={transportProviderForm.contactNumber}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        contactNumber: event.target.value,
                      }))
                    }
                    placeholder="Contact number"
                    required
                  />
                  <Input
                    type="email"
                    value={transportProviderForm.email}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Email"
                    required
                  />
                  <select
                    value={transportProviderForm.coverageArea}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        coverageArea: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Coverage area</option>
                    {TRANSPORT_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgba(217,251,232,0.62)]">
                    Pickup Zones
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORT_AREAS.map((area) => (
                      <button
                        key={`pickup-${area}`}
                        type="button"
                        onClick={() =>
                          toggleArrayField(setTransportProviderForm, 'pickupZones', area)
                        }
                        className={`rounded-full border px-3 py-1 text-xs ${
                          transportProviderForm.pickupZones.includes(area)
                            ? 'border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.18)] text-[#dcfce7]'
                            : 'border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.42)] text-[rgba(217,251,232,0.72)]'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgba(217,251,232,0.62)]">
                    Drop-off Zones
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRANSPORT_AREAS.map((area) => (
                      <button
                        key={`dropoff-${area}`}
                        type="button"
                        onClick={() =>
                          toggleArrayField(setTransportProviderForm, 'dropoffZones', area)
                        }
                        className={`rounded-full border px-3 py-1 text-xs ${
                          transportProviderForm.dropoffZones.includes(area)
                            ? 'border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.18)] text-[#dcfce7]'
                            : 'border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.42)] text-[rgba(217,251,232,0.72)]'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgba(217,251,232,0.62)]">
                    Available Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          toggleArrayField(setTransportProviderForm, 'availableDays', day)
                        }
                        className={`rounded-full border px-3 py-1 text-xs ${
                          transportProviderForm.availableDays.includes(day)
                            ? 'border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.18)] text-[#dcfce7]'
                            : 'border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.42)] text-[rgba(217,251,232,0.72)]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <select
                    value={transportProviderForm.timeWindowStart}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        timeWindowStart: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Available from</option>
                    {transportTimeOptions.map((value) => (
                      <option key={`provider-start-${value}`} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transportProviderForm.timeWindowEnd}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        timeWindowEnd: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Available until</option>
                    {transportTimeOptions.map((value) => (
                      <option key={`provider-end-${value}`} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <select
                    value={transportProviderForm.serviceType}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        serviceType: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option value="paid">Paid</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="mixed">Mixed</option>
                  </select>
                  <Input
                    value={transportProviderForm.vehicleType}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        vehicleType: event.target.value,
                      }))
                    }
                    placeholder="Vehicle type"
                  />
                  <Input
                    value={transportProviderForm.vehicleRegistration}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        vehicleRegistration: event.target.value,
                      }))
                    }
                    placeholder="Vehicle registration"
                  />
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Input
                    type="number"
                    min="1"
                    value={transportProviderForm.seats}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        seats: event.target.value,
                      }))
                    }
                    placeholder="Seats available"
                    required
                  />
                  <Input
                    value={transportProviderForm.routeNotes}
                    onChange={(event) =>
                      setTransportProviderForm((prev) => ({
                        ...prev,
                        routeNotes: event.target.value,
                      }))
                    }
                    placeholder="Route notes"
                  />
                </div>

                <textarea
                  className="input mt-3 min-h-[84px]"
                  value={transportProviderForm.vehicleNotes}
                  onChange={(event) =>
                    setTransportProviderForm((prev) => ({
                      ...prev,
                      vehicleNotes: event.target.value,
                    }))
                  }
                  placeholder="Vehicle/service notes"
                />

                <div className="mt-3 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.55)] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(217,251,232,0.62)]">
                    Verification Readiness
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {[
                      ['idDocument', 'ID Document'],
                      ['driversLicense', "Driver's License"],
                      ['vehicleDocument', 'Vehicle Document'],
                      ['vehiclePhoto', 'Vehicle Photo'],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="inline-flex items-center gap-2 text-xs text-[rgba(217,251,232,0.8)]"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(transportProviderForm.verification[key])}
                          onChange={(event) =>
                            setTransportProviderForm((prev) => ({
                              ...prev,
                              verification: {
                                ...prev.verification,
                                [key]: event.target.checked,
                              },
                            }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <Button type="submit" variant="secondary" size="sm">
                    Submit Provider Profile
                  </Button>
                </div>
              </form>

              <form
                onSubmit={onSubmitTransportRequest}
                className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                  <MapPinned size={18} className="text-[#42e59a]" /> Request Transport
                </h3>
                <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">
                  Request flow: Submitted → Pending Review → Awaiting Match → Confirmed.
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Input
                    value={transportRequestForm.firstName}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                    placeholder="First name"
                    required
                  />
                  <Input
                    value={transportRequestForm.surname}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        surname: event.target.value,
                      }))
                    }
                    placeholder="Surname"
                    required
                  />
                  <Input
                    type="email"
                    value={transportRequestForm.email}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="Email"
                    required
                  />
                  <Input
                    value={transportRequestForm.contactNumber}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        contactNumber: event.target.value,
                      }))
                    }
                    placeholder="Contact number"
                    required
                  />
                  <select
                    value={transportRequestForm.pickupArea}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        pickupArea: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Pickup area</option>
                    {TRANSPORT_AREAS.map((area) => (
                      <option key={`request-pickup-${area}`} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transportRequestForm.destination}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        destination: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Destination type</option>
                    {TRANSPORT_DESTINATIONS.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                  <Input
                    value={transportRequestForm.madrasaOrMasjidName}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        madrasaOrMasjidName: event.target.value,
                      }))
                    }
                    placeholder="Madrasa / Masjid name"
                    required
                  />
                  <select
                    value={transportRequestForm.ageGroup}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        ageGroup: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Age group</option>
                    {AGE_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transportRequestForm.preferredPickupTime}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        preferredPickupTime: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Preferred pickup time</option>
                    {transportTimeOptions.map((value) => (
                      <option key={`request-time-${value}`} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <select
                    value={transportRequestForm.affordability}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        affordability: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option value="paid">Can afford paid transport</option>
                    <option value="free">Needs free transport</option>
                    <option value="depends">Depends on fare</option>
                  </select>
                  <select
                    value={transportRequestForm.rideFrequency}
                    onChange={(event) =>
                      setTransportRequestForm((prev) => ({
                        ...prev,
                        rideFrequency: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option value="one_time">One-time ride</option>
                    <option value="recurring">Recurring schedule</option>
                  </select>
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[rgba(217,251,232,0.62)]">
                    Required Days
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => (
                      <button
                        key={`request-day-${day}`}
                        type="button"
                        onClick={() =>
                          toggleArrayField(setTransportRequestForm, 'requiredDays', day)
                        }
                        className={`rounded-full border px-3 py-1 text-xs ${
                          transportRequestForm.requiredDays.includes(day)
                            ? 'border-[rgba(34,197,94,0.45)] bg-[rgba(34,197,94,0.18)] text-[#dcfce7]'
                            : 'border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.42)] text-[rgba(217,251,232,0.72)]'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className="input mt-3 min-h-[84px]"
                  value={transportRequestForm.notes}
                  onChange={(event) =>
                    setTransportRequestForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Notes (optional)"
                />

                <div className="mt-3">
                  <Button type="submit" variant="primary" size="sm">
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>

            {isAdmin ? (
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
                  <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                    <ShieldCheck size={18} className="text-[#42e59a]" /> Provider Approvals
                  </h3>
                  {pendingTransportProviders.length === 0 ? (
                    <div className="mt-3">
                      <TransportEmptyState
                        icon={ShieldCheck}
                        title="No providers awaiting review"
                        description="New submissions will appear here for approval."
                      />
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-3">
                      {pendingTransportProviders.map((provider) => (
                        <article
                          key={provider.id}
                          className="rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.55)] p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-white">{provider.fullName}</p>
                              <p className="text-xs text-[rgba(217,251,232,0.66)]">
                                {provider.contactNumber || provider.email || 'No contact shared'}
                              </p>
                            </div>
                            <TransportStatusBadge
                              status={provider.status}
                              labelMap={PROVIDER_STATUS_LABELS}
                            />
                          </div>
                          <p className="mt-2 text-xs text-[rgba(217,251,232,0.68)]">
                            <Route size={12} className="mr-1 inline text-[#42e59a]" />
                            {provider.coverageArea} • {provider.pickupZones.join(', ')} →{' '}
                            {provider.dropoffZones.join(', ')}
                          </p>
                          <p className="mt-1 text-xs text-[rgba(217,251,232,0.6)]">
                            {provider.timeWindowStart} - {provider.timeWindowEnd} •{' '}
                            {provider.availableDays.join(', ')} • {provider.seats} seats •{' '}
                            {provider.serviceType}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {provider.status === transportProviderStatus.SUBMITTED ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setProviderUnderReview(provider.id)}
                              >
                                Mark Under Review
                              </Button>
                            ) : null}
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                updateTransportProviderStatus(
                                  provider.id,
                                  transportProviderStatus.APPROVED
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                updateTransportProviderStatus(
                                  provider.id,
                                  transportProviderStatus.REJECTED
                                )
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateTransportProviderStatus(
                                  provider.id,
                                  transportProviderStatus.SUSPENDED
                                )
                              }
                            >
                              Suspend
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
                  <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                    <BadgeCheck size={18} className="text-[#42e59a]" /> Request Matching
                  </h3>
                  {pendingTransportRequests.length === 0 ? (
                    <div className="mt-3">
                      <TransportEmptyState
                        icon={MapPinned}
                        title="No pending requests"
                        description="Incoming requests will appear here for review and assignment."
                      />
                    </div>
                  ) : (
                    <div className="mt-3 grid gap-3">
                      {pendingTransportRequests.map((request) => {
                        const eligibleProviders = getEligibleProviders(request);
                        return (
                          <article
                            key={request.id}
                            className="rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(10,15,13,0.55)] p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-white">
                                  {request.firstName} {request.surname}
                                </p>
                                <p className="text-xs text-[rgba(217,251,232,0.66)]">
                                  {request.pickupArea} → {request.destination}
                                </p>
                              </div>
                              <TransportStatusBadge
                                status={request.status}
                                labelMap={REQUEST_STATUS_LABELS}
                              />
                            </div>
                            <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">
                              {request.madrasaOrMasjidName} • {request.preferredPickupTime} •{' '}
                              {request.requiredDays.join(', ')}
                            </p>
                            <div className="mt-3 grid gap-2 md:grid-cols-2">
                              <select
                                value={transportAssignDraft[request.id] || ''}
                                onChange={(event) =>
                                  setTransportAssignDraft((prev) => ({
                                    ...prev,
                                    [request.id]: event.target.value,
                                  }))
                                }
                                className="input"
                              >
                                <option value="">
                                  {eligibleProviders.length > 0
                                    ? 'Select matching provider'
                                    : 'No matching provider available'}
                                </option>
                                {eligibleProviders.map((provider) => (
                                  <option key={provider.id} value={provider.id}>
                                    {provider.fullName} ({provider.seats} seats)
                                  </option>
                                ))}
                              </select>
                              <Input
                                value={transportAdminNotes[request.id] || ''}
                                onChange={(event) =>
                                  setTransportAdminNotes((prev) => ({
                                    ...prev,
                                    [request.id]: event.target.value,
                                  }))
                                }
                                placeholder="Admin notes (internal)"
                              />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  updateTransportRequestStatus(
                                    request.id,
                                    transportRequestStatus.AWAITING_MATCH
                                  )
                                }
                              >
                                Awaiting Match
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={!transportAssignDraft[request.id]}
                                onClick={() => assignRequestToProvider(request.id)}
                              >
                                Assign Provider
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateTransportRequestStatus(
                                    request.id,
                                    transportRequestStatus.CANCELLED
                                  )
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
              <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck size={18} className="text-[#42e59a]" /> Approved Providers
              </h3>
              {approvedTransportProviders.length === 0 ? (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <TransportEmptyState
                    icon={Truck}
                    title="No approved transport providers yet"
                    description="Be the first provider to support your madrasa or masjid community."
                  />
                  <TransportEmptyState
                    icon={AlertTriangle}
                    title="Need a ride now?"
                    description="Submit a request and admin will notify you once matching providers are available."
                  />
                </div>
              ) : (
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {approvedTransportProviders.map((provider) => (
                    <article
                      key={provider.id}
                      className="rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(10,15,13,0.55)] p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-white">{provider.fullName}</p>
                          <p className="text-sm text-[rgba(217,251,232,0.66)]">
                            {provider.coverageArea}
                          </p>
                        </div>
                        {provider.verifiedByAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.15)] px-2 py-0.5 text-[11px] font-semibold text-[#86efac]">
                            <BadgeCheck size={12} /> Verified
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-xs text-[rgba(217,251,232,0.62)]">
                        <Route size={12} className="mr-1 inline text-[#42e59a]" />
                        {provider.pickupZones.join(', ')} → {provider.dropoffZones.join(', ')}
                      </p>
                      <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">
                        {provider.timeWindowStart} - {provider.timeWindowEnd} •{' '}
                        {provider.availableDays.join(', ')}
                      </p>
                      <p className="mt-1 text-xs text-[rgba(217,251,232,0.62)]">
                        {provider.serviceType} • {provider.seats} seats •{' '}
                        {provider.vehicleType || 'Vehicle type pending'}
                      </p>
                      {provider.routeNotes ? (
                        <p className="mt-1 text-xs text-[rgba(217,251,232,0.55)]">
                          Notes: {provider.routeNotes}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section id="finance" variant="pattern" py="py-12 md:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-eyebrow">Finance</p>
                <h2 className="section-title inline-flex items-center gap-2">
                  <DollarSign size={28} className="text-[#42e59a]" /> Finance Dashboard
                </h2>
                <p className="section-subtitle !mx-0">
                  Totals are calculated from real recorded transactions only.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.82)] px-3 py-2 text-sm text-[rgba(219,242,230,0.75)]">
                <Wallet size={14} /> 70% Provider - 30% Platform
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <PaymentSummaryCard
                icon={<DollarSign size={14} />}
                label="Total Revenue"
                value={financeSummary.totalRevenue}
                tone="text-[#42e59a]"
              />
              <PaymentSummaryCard
                icon={<DollarSign size={14} />}
                label="Platform Earnings"
                value={financeSummary.platformEarnings}
                tone="text-[#38bdf8]"
              />
              <PaymentSummaryCard
                icon={<Users size={14} />}
                label="Provider Earnings"
                value={financeSummary.providerEarnings}
                tone="text-[#facc15]"
              />
              <PaymentSummaryCard
                icon={<Clock3 size={14} />}
                label="Pending Payouts"
                value={financeSummary.pendingPayouts}
                tone="text-[#fca5a5]"
              />
              <PaymentSummaryCard
                icon={<CheckCircle2 size={14} />}
                label="Completed Payouts"
                value={financeSummary.completedPayouts}
                tone="text-[#86efac]"
              />
            </div>

            {isAdmin ? (
              <form
                onSubmit={onRecordPayment}
                className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <h3 className="text-xl font-semibold text-white">Record Payment</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <select
                    value={paymentForm.sessionId}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        sessionId: event.target.value,
                      }))
                    }
                    className="input"
                    required
                  >
                    <option value="">Select session</option>
                    {state.sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.title}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="0"
                    value={paymentForm.amount}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        amount: event.target.value,
                      }))
                    }
                    placeholder="Gross amount (R)"
                    required
                  />
                  <select
                    value={paymentForm.status}
                    onChange={(event) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="mt-3">
                  <Button type="submit" variant="primary" size="sm">
                    Save Transaction
                  </Button>
                </div>
              </form>
            ) : null}

            <div className="mt-5 rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
              <h3 className="text-xl font-semibold text-white">
                Transaction History
              </h3>
              {transactionsView.length === 0 ? (
                <p className="mt-2 text-sm text-[rgba(217,251,232,0.62)]">
                  No payments recorded yet.
                </p>
              ) : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse">
                    <thead>
                      <tr className="border-b border-[rgba(34,197,94,0.2)] text-left text-sm text-[rgba(217,251,232,0.66)]">
                        <th className="pb-2 pr-3 font-medium">Session</th>
                        <th className="pb-2 pr-3 font-medium">Provider</th>
                        <th className="pb-2 pr-3 font-medium">Gross</th>
                        <th className="pb-2 pr-3 font-medium">Provider (70%)</th>
                        <th className="pb-2 pr-3 font-medium">Platform (30%)</th>
                        <th className="pb-2 pr-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionsView.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-[rgba(34,197,94,0.12)] text-sm text-[#e5f8ef]"
                        >
                          <td className="py-3 pr-3">{transaction.sessionId}</td>
                          <td className="py-3 pr-3">{transaction.providerName}</td>
                          <td className="py-3 pr-3">R {transaction.gross}</td>
                          <td className="py-3 pr-3">R {transaction.teacherAmount}</td>
                          <td className="py-3 pr-3">R {transaction.platformAmount}</td>
                          <td className="py-3 pr-3 capitalize">{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Section>

          {isAdmin ? (
            <Section id="audio-admin" variant="alt" py="py-12 md:py-16">
              <div className="mb-6">
                <p className="section-eyebrow">Tajwid Audio</p>
                <h2 className="section-title">Letter Audio Management</h2>
                <p className="section-subtitle !mx-0">
                  Attach official pronunciation URLs per letter. Learners see empty state
                  until audio is uploaded.
                </p>
              </div>
              <form
                onSubmit={onSaveLetterAudio}
                className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4"
              >
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <select
                    value={audioForm.letterNum}
                    onChange={(event) =>
                      setAudioForm((prev) => ({
                        ...prev,
                        letterNum: event.target.value,
                      }))
                    }
                    className="input"
                  >
                    {LETTERS.map((letter) => (
                      <option key={letter.num} value={letter.num}>
                        Letter {letter.num}: {letter.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="url"
                    value={audioForm.sourceUrl}
                    onChange={(event) =>
                      setAudioForm((prev) => ({
                        ...prev,
                        sourceUrl: event.target.value,
                      }))
                    }
                    placeholder="https://...audio-file.mp3"
                    required
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Save Letter Audio
                  </Button>
                </div>
              </form>
            </Section>
          ) : null}
        </>
      ) : null}
    </>
  );
}
