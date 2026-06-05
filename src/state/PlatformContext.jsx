import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildDefaultRolePermissions,
  PERMISSION_LABELS,
  ROLE_DEFINITIONS,
} from '../data/rbac';
import { INITIAL_LIBRARY_ITEMS, TEACHERS } from '../data/platformSeed';

const STORAGE_KEY = 'rahla_platform_v3';

const ROLES = {
  ADMIN: 'Admin',
  CO_ADMIN: 'Co-Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  COUNSELOR: 'Counselor',
  DRIVER: 'Driver',
};

const USER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

const SESSION_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const TRANSPORT_PROVIDER_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
};

const TRANSPORT_REQUEST_STATUS = {
  SUBMITTED: 'submitted',
  PENDING_REVIEW: 'pending_review',
  AWAITING_MATCH: 'awaiting_match',
  MATCHED: 'matched',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
};

const TEACHER_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
};

const ASSIGNMENT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
};
const COUNSELLOR_REGISTRATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DECLINED: 'declined',
  SUSPENDED: 'suspended',
};

const COUNSELLING_REQUEST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};


const CONVERSATION_CHANNELS = {
  SUPPORT: 'support',
  TEACHER_PRIVATE: 'teacher_private',
  ADMIN_OVERSIGHT: 'admin_oversight',
  GENERAL: 'general',
};

const COUNSELLOR_USER_ID = 'staff_counsellor_aisha_peer';
const MAX_STORED_BOOK_FILE_DATA_URL = 2 * 1024 * 1024;
const MAX_STORED_COVER_DATA_URL = 900 * 1024;

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function slugify(value) {
  return (
    String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'record'
  );
}

function titleCase(value) {
  return String(value || '')
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function sanitizeRole(rawRole) {
  const role = String(rawRole || '').trim();
  const allowed = Object.values(ROLES);
  return allowed.includes(role) ? role : ROLES.STUDENT;
}

function sanitizeRolePermissions(rawPermissions) {
  const defaults = buildDefaultRolePermissions();
  if (!rawPermissions || typeof rawPermissions !== 'object') return defaults;

  const safe = {};
  Object.entries(defaults).forEach(([roleName, permissionMap]) => {
    const incomingMap =
      rawPermissions[roleName] && typeof rawPermissions[roleName] === 'object'
        ? rawPermissions[roleName]
        : {};

    safe[roleName] = {};
    Object.keys(permissionMap).forEach((permissionKey) => {
      safe[roleName][permissionKey] = Boolean(incomingMap[permissionKey]);
    });
  });

  return safe;
}

function seedTeacherUsers() {
  const seededTeachers = TEACHERS.map((teacher) => ({
    id: `staff_${slugify(teacher.name)}`,
    name: teacher.name,
    email: `${slugify(teacher.name)}@sirajone.local`,
    password: '',
    role: ROLES.TEACHER,
    subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
    status: USER_STATUS.APPROVED,
    createdAt: '2026-01-01T08:00:00.000Z',
    approvedAt: '2026-01-01T08:00:00.000Z',
    experience: teacher.experience,
    subjects: teacher.subjects,
    audience: teacher.audience,
    featured: Boolean(teacher.featured),
    bio: teacher.bio,
    availability: teacher.featured ? 'limited' : 'available',
  }));

  return [
    ...seededTeachers,
    {
      id: COUNSELLOR_USER_ID,
      name: 'Counsellor Aisha Peer',
      email: 'aisha.peer@sirajone.local',
      password: '',
      role: ROLES.COUNSELOR,
      subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
      status: USER_STATUS.APPROVED,
      createdAt: '2026-01-01T08:00:00.000Z',
      approvedAt: '2026-01-01T08:00:00.000Z',
      experience: 'Student wellness support',
      subjects: 'Counselling, family support, wellbeing guidance',
      audience: 'Students & families',
      featured: true,
      bio: 'Aisha Peer supports students and families with confidential guidance, wellbeing check-ins, and practical counselling referrals.',
      availability: 'available',
    },
  ];
}

function buildInitialLibraryBooks() {
  return INITIAL_LIBRARY_ITEMS.map((item, index) => ({
    id: `book_seed_${index + 1}`,
    title: item.title,
    description: item.description,
    mainCategory: item.category,
    subcategory: item.category,
    author: 'SirajOne Library',
    visibility: 'public',
    publishStatus: 'published',
    requiredTier: index < 2 ? SUBSCRIPTION_TIERS.FREE : SUBSCRIPTION_TIERS.BASIC,
    pageCount: 24,
    previewPageCount: 4,
    readerPages: [
      `${item.title}\n\n${item.description}`,
      'Use this resource with your teacher or independently as part of your weekly SirajOne routine.',
      'Progress note:\n- Review key definitions\n- Practice aloud\n- Bring questions to your next lesson',
      'Reference note:\nThis reader is prepared for guided study inside the protected student app.',
    ],
    coverDataUrl: '',
    coverFileName: '',
    fileUrl: '',
    fileDataUrl: '',
    fileName: '',
    createdAt: '2026-01-01T08:00:00.000Z',
    updatedAt: '2026-01-01T08:00:00.000Z',
  }));
}

const initialState = {
  initializedAt: null,
  users: seedTeacherUsers(),
  currentUserId: null,
  conversations: [],
  sessions: [],
  transactions: [],
  libraryBooks: buildInitialLibraryBooks(),
  teacherRequests: [],
  teacherAssignments: [],
  teacherReviews: [],
  counsellorRegistrations: [],
  counsellingRequests: [],
  counselorProfile: {
    name: 'Counsellor Aisha Peer',
    title: 'Student Support and Guidance',
    bio: 'Counsellor Aisha Peer provides structured, compassionate, and confidential support for students and families navigating learning, wellbeing, and personal challenges.',
    durationPrices: {
      '30m': null,
      '45m': null,
      '60m': null,
    },
    availabilityNotes:
      'Appointments are reviewed by the platform team and scheduled with appropriate privacy and care.',
  },
  audioByLetter: {},
  transportProviders: [],
  transportRequests: [],
  rolePermissions: buildDefaultRolePermissions(),
};

const PlatformContext = createContext(null);

function sanitizeUserRecord(user) {
  if (!user || typeof user !== 'object') return null;
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  if (!name || !email) return null;

  const role = sanitizeRole(user.role);
  const statusValues = Object.values(USER_STATUS);
  const status = statusValues.includes(user.status) ? user.status : USER_STATUS.PENDING;
  const incomingTier = String(user.subscriptionTier || '').trim().toLowerCase();

  return {
    id: typeof user.id === 'string' && user.id ? user.id : uid('usr'),
    name,
    email,
    password: typeof user.password === 'string' ? user.password : '',
    role,
    subscriptionTier:
      incomingTier === SUBSCRIPTION_TIERS.PREMIUM
        ? SUBSCRIPTION_TIERS.PREMIUM
        : incomingTier === SUBSCRIPTION_TIERS.BASIC
        ? SUBSCRIPTION_TIERS.BASIC
        : role === ROLES.ADMIN ||
          role === ROLES.CO_ADMIN ||
          role === ROLES.TEACHER ||
          role === ROLES.COUNSELOR
        ? SUBSCRIPTION_TIERS.PREMIUM
        : SUBSCRIPTION_TIERS.FREE,
    status,
    createdAt: user.createdAt || nowIso(),
    approvedAt: user.approvedAt || null,
    experience: String(user.experience || '').trim(),
    subjects: String(user.subjects || '').trim(),
    audience: String(user.audience || '').trim(),
    featured: Boolean(user.featured),
    bio: String(user.bio || '').trim(),
    availability: ['available', 'limited', 'unavailable'].includes(
      String(user.availability || '').trim().toLowerCase()
    )
      ? String(user.availability || '').trim().toLowerCase()
      : role === ROLES.TEACHER || role === ROLES.COUNSELOR
      ? 'available'
      : '',
  };
}

function ensureSeededUsers(users) {
  const seeded = seedTeacherUsers();
  const byId = new Map(users.map((user) => [user.id, user]));
  seeded.forEach((seedUser) => {
    const existing = byId.get(seedUser.id);
    if (!existing) {
      byId.set(seedUser.id, seedUser);
      return;
    }

    byId.set(seedUser.id, {
      ...seedUser,
      ...existing,
      status: existing.status || USER_STATUS.APPROVED,
      role: existing.role || seedUser.role,
    });
  });
  return Array.from(byId.values());
}

function sanitizeLibraryBookRecord(book) {
  if (!book || typeof book !== 'object') return null;
  const requiredTier = String(book.requiredTier || '').trim().toLowerCase();
  const normalizedTier =
    requiredTier === SUBSCRIPTION_TIERS.PREMIUM
      ? SUBSCRIPTION_TIERS.PREMIUM
      : requiredTier === SUBSCRIPTION_TIERS.BASIC
      ? SUBSCRIPTION_TIERS.BASIC
      : SUBSCRIPTION_TIERS.FREE;

  return {
    ...book,
    id: typeof book.id === 'string' && book.id ? book.id : uid('book'),
    title: String(book.title || '').trim(),
    description: String(book.description || '').trim(),
    mainCategory: String(book.mainCategory || book.category || '').trim(),
    subcategory: String(book.subcategory || book.category || '').trim(),
    author: String(book.author || '').trim(),
    visibility: book.visibility === 'private' ? 'private' : 'public',
    publishStatus: book.publishStatus === 'draft' ? 'draft' : 'published',
    requiredTier: normalizedTier,
    pageCount: Math.max(1, Number(book.pageCount) || 1),
    previewPageCount: Math.max(1, Number(book.previewPageCount) || 3),
    readerPages: Array.isArray(book.readerPages)
      ? book.readerPages.map((page) => String(page || '').trim()).filter(Boolean)
      : [],
    coverDataUrl: String(book.coverDataUrl || ''),
    coverFileName: String(book.coverFileName || ''),
    fileUrl: String(book.fileUrl || '').trim(),
    fileDataUrl:
      typeof book.fileDataUrl === 'string' &&
      book.fileDataUrl.length <= MAX_STORED_BOOK_FILE_DATA_URL
        ? book.fileDataUrl
        : '',
    fileName: String(book.fileName || ''),
    createdAt: book.createdAt || nowIso(),
    updatedAt: book.updatedAt || nowIso(),
  };
}

function sanitizeConversationRecord(conversation, validUserIds) {
  if (!conversation || typeof conversation !== 'object') return null;
  const participantIds = Array.isArray(conversation.participantIds)
    ? Array.from(new Set(conversation.participantIds.filter((id) => validUserIds.has(id))))
    : [];
  if (participantIds.length < 2) return null;

  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
        .filter(
          (message) =>
            message &&
            typeof message === 'object' &&
            participantIds.includes(message.senderId) &&
            typeof message.text === 'string' &&
            message.text.trim()
        )
        .map((message) => ({
          id: typeof message.id === 'string' && message.id ? message.id : uid('msg'),
          senderId: message.senderId,
          text: message.text.trim(),
          createdAt: message.createdAt || nowIso(),
        }))
    : [];

  return {
    id: typeof conversation.id === 'string' && conversation.id ? conversation.id : uid('cnv'),
    participantIds,
    createdAt: conversation.createdAt || nowIso(),
    updatedAt: conversation.updatedAt || nowIso(),
    channel: Object.values(CONVERSATION_CHANNELS).includes(conversation.channel)
      ? conversation.channel
      : CONVERSATION_CHANNELS.GENERAL,
    subject: String(conversation.subject || '').trim(),
    messages,
    readBy: Array.isArray(conversation.readBy)
      ? conversation.readBy.filter((id) => participantIds.includes(id))
      : [],
    unreadFor: Array.isArray(conversation.unreadFor)
      ? conversation.unreadFor.filter((id) => participantIds.includes(id))
      : [],
  };
}

function sanitizeSessionRecord(session, validUserIds) {
  if (!session || typeof session !== 'object') return null;
  if (!validUserIds.has(session.teacherId) || !validUserIds.has(session.studentId)) return null;
  const allowedStatus = Object.values(SESSION_STATUS);
  return {
    ...session,
    id: typeof session.id === 'string' && session.id ? session.id : uid('ses'),
    status: allowedStatus.includes(session.status) ? session.status : SESSION_STATUS.UPCOMING,
    paymentAmount: Number(session.paymentAmount) || 0,
    durationMinutes: Number(session.durationMinutes) || 45,
    createdAt: session.createdAt || nowIso(),
  };
}

function sanitizeCounsellorRegistration(record) {
  if (!record || typeof record !== 'object') return null;
  return {
    id: typeof record.id === 'string' && record.id ? record.id : uid('creg'),
    userId: String(record.userId || ''),
    fullName: String(record.fullName || '').trim(),
    displayName: String(record.displayName || '').trim(),
    email: String(record.email || '').trim().toLowerCase(),
    mobileNumber: String(record.mobileNumber || '').trim(),
    country: String(record.country || '').trim(),
    city: String(record.city || '').trim(),
    languagesSpoken: Array.isArray(record.languagesSpoken) ? record.languagesSpoken.map(String).filter(Boolean) : [],
    profilePhotoUrl: String(record.profilePhotoUrl || ''),
    categories: Array.isArray(record.categories) ? record.categories.map(String).filter(Boolean) : [],
    highestQualification: String(record.highestQualification || '').trim(),
    institution: String(record.institution || '').trim(),
    certifications: String(record.certifications || '').trim(),
    yearsOfExperience: String(record.yearsOfExperience || '').trim(),
    registrationBody: String(record.registrationBody || '').trim(),
    professionalMemberships: String(record.professionalMemberships || '').trim(),
    serviceDelivery: Array.isArray(record.serviceDelivery) ? record.serviceDelivery.map(String).filter(Boolean) : [],
    availability: {
      weekdays: Boolean(record.availability?.weekdays),
      weekends: Boolean(record.availability?.weekends),
      evenings: Boolean(record.availability?.evenings),
      timeZone: String(record.availability?.timeZone || '').trim(),
    },
    bio: String(record.bio || '').trim(),
    status: Object.values(COUNSELLOR_REGISTRATION_STATUS).includes(record.status)
      ? record.status : COUNSELLOR_REGISTRATION_STATUS.PENDING,
    adminNotes: String(record.adminNotes || '').trim(),
    submittedAt: record.submittedAt || nowIso(),
    reviewedAt: String(record.reviewedAt || ''),
    updatedAt: record.updatedAt || nowIso(),
  };
}

function sanitizeCounsellingRequest(record) {
  if (!record || typeof record !== 'object') return null;
  return {
    id: typeof record.id === 'string' && record.id ? record.id : uid('creq'),
    studentId: String(record.studentId || ''),
    counsellorRegistrationId: String(record.counsellorRegistrationId || ''),
    categories: Array.isArray(record.categories) ? record.categories.map(String).filter(Boolean) : [],
    note: String(record.note || '').trim(),
    preferredContact: String(record.preferredContact || '').trim(),
    status: Object.values(COUNSELLING_REQUEST_STATUS).includes(record.status)
      ? record.status : COUNSELLING_REQUEST_STATUS.PENDING,
    adminNotes: String(record.adminNotes || '').trim(),
    createdAt: record.createdAt || nowIso(),
    updatedAt: record.updatedAt || nowIso(),
  };
}

function sanitizeTeacherRequestRecord(record, validUserIds) {
  if (!record || typeof record !== 'object') return null;
  const studentId = String(record.studentId || '');
  const teacherId = String(record.teacherId || '');
  if (!validUserIds.has(studentId) || !validUserIds.has(teacherId)) return null;
  return {
    id: typeof record.id === 'string' && record.id ? record.id : uid('treq'),
    studentId,
    teacherId,
    note: String(record.note || '').trim(),
    status: Object.values(TEACHER_REQUEST_STATUS).includes(record.status)
      ? record.status
      : TEACHER_REQUEST_STATUS.PENDING,
    adminNotes: String(record.adminNotes || '').trim(),
    createdAt: record.createdAt || nowIso(),
    updatedAt: record.updatedAt || nowIso(),
  };
}

function sanitizeTeacherAssignmentRecord(record, validUserIds) {
  if (!record || typeof record !== 'object') return null;
  const studentId = String(record.studentId || '');
  const teacherId = String(record.teacherId || '');
  if (!validUserIds.has(studentId) || !validUserIds.has(teacherId)) return null;
  return {
    id: typeof record.id === 'string' && record.id ? record.id : uid('tassign'),
    studentId,
    teacherId,
    status: Object.values(ASSIGNMENT_STATUS).includes(record.status)
      ? record.status
      : ASSIGNMENT_STATUS.ACTIVE,
    assignedAt: record.assignedAt || nowIso(),
    adminNotes: String(record.adminNotes || '').trim(),
  };
}

function sanitizeTeacherReviewRecord(record, validUserIds) {
  if (!record || typeof record !== 'object') return null;
  const studentId = String(record.studentId || '');
  const teacherId = String(record.teacherId || '');
  if (!validUserIds.has(studentId) || !validUserIds.has(teacherId)) return null;
  return {
    id: typeof record.id === 'string' && record.id ? record.id : uid('trev'),
    studentId,
    teacherId,
    rating: Math.max(1, Math.min(5, Number(record.rating) || 0)),
    review: String(record.review || '').trim(),
    createdAt: record.createdAt || nowIso(),
  };
}

function sanitizeTransportProviderRecord(provider, validUserIds) {
  if (!provider || typeof provider !== 'object') return null;
  const userId = String(provider.userId || '');
  if (!validUserIds.has(userId)) return null;

  const allowedStatus = Object.values(TRANSPORT_PROVIDER_STATUS);
  return {
    id: typeof provider.id === 'string' && provider.id ? provider.id : uid('trp'),
    userId,
    fullName: String(provider.fullName || provider.name || '').trim(),
    contactNumber: String(provider.contactNumber || '').trim(),
    email: String(provider.email || '').trim().toLowerCase(),
    coverageArea: String(provider.coverageArea || provider.area || '').trim(),
    pickupZones: Array.isArray(provider.pickupZones)
      ? provider.pickupZones.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    dropoffZones: Array.isArray(provider.dropoffZones)
      ? provider.dropoffZones.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    availableDays: Array.isArray(provider.availableDays)
      ? provider.availableDays.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    timeWindowStart: String(provider.timeWindowStart || '').trim(),
    timeWindowEnd: String(provider.timeWindowEnd || '').trim(),
    seats: Math.max(1, Number(provider.seats) || 1),
    serviceType: ['paid', 'volunteer', 'mixed'].includes(
      String(provider.serviceType || '').trim().toLowerCase()
    )
      ? String(provider.serviceType || '').trim().toLowerCase()
      : 'paid',
    vehicleType: String(provider.vehicleType || '').trim(),
    vehicleRegistration: String(provider.vehicleRegistration || '').trim(),
    vehicleNotes: String(provider.vehicleNotes || provider.notes || '').trim(),
    routeNotes: String(provider.routeNotes || provider.route || '').trim(),
    verification: {
      idDocument: Boolean(provider.verification?.idDocument),
      driversLicense: Boolean(provider.verification?.driversLicense),
      vehicleDocument: Boolean(provider.verification?.vehicleDocument),
      vehiclePhoto: Boolean(provider.verification?.vehiclePhoto),
    },
    verifiedByAdmin: Boolean(provider.verifiedByAdmin),
    status: allowedStatus.includes(provider.status)
      ? provider.status
      : TRANSPORT_PROVIDER_STATUS.SUBMITTED,
    adminNotes: String(provider.adminNotes || '').trim(),
    createdAt: provider.createdAt || nowIso(),
    updatedAt: provider.updatedAt || nowIso(),
  };
}

function sanitizeTransportRequestRecord(request, validUserIds) {
  if (!request || typeof request !== 'object') return null;
  const requesterId = String(request.requesterId || '');
  if (!validUserIds.has(requesterId)) return null;

  const allowedStatus = Object.values(TRANSPORT_REQUEST_STATUS);
  return {
    id: typeof request.id === 'string' && request.id ? request.id : uid('trq'),
    requesterId,
    firstName: String(request.firstName || '').trim(),
    surname: String(request.surname || '').trim(),
    email: String(request.email || '').trim().toLowerCase(),
    contactNumber: String(request.contactNumber || '').trim(),
    pickupArea: String(request.pickupArea || '').trim(),
    destination: String(request.destination || '').trim(),
    madrasaOrMasjidName: String(request.madrasaOrMasjidName || '').trim(),
    ageGroup: String(request.ageGroup || request.age || '').trim(),
    preferredPickupTime: String(request.preferredPickupTime || '').trim(),
    requiredDays: Array.isArray(request.requiredDays)
      ? request.requiredDays.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    affordability: ['paid', 'free', 'depends'].includes(
      String(request.affordability || '').trim().toLowerCase()
    )
      ? String(request.affordability || '').trim().toLowerCase()
      : 'paid',
    rideFrequency:
      String(request.rideFrequency || '').trim().toLowerCase() === 'recurring'
        ? 'recurring'
        : 'one_time',
    notes: String(request.notes || '').trim(),
    matchedProviderId: String(request.matchedProviderId || '').trim(),
    adminNotes: String(request.adminNotes || '').trim(),
    status: allowedStatus.includes(request.status)
      ? request.status
      : TRANSPORT_REQUEST_STATUS.SUBMITTED,
    createdAt: request.createdAt || nowIso(),
    updatedAt: request.updatedAt || nowIso(),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    const users = ensureSeededUsers((parsed.users || []).map(sanitizeUserRecord).filter(Boolean));
    const validUserIds = new Set(users.map((user) => user.id));

    return {
      ...initialState,
      ...parsed,
      users,
      conversations: (parsed.conversations || [])
        .map((conversation) => sanitizeConversationRecord(conversation, validUserIds))
        .filter(Boolean),
      sessions: (parsed.sessions || [])
        .map((session) => sanitizeSessionRecord(session, validUserIds))
        .filter(Boolean),
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      libraryBooks: (parsed.libraryBooks || []).map(sanitizeLibraryBookRecord).filter(Boolean),
      teacherRequests: (parsed.teacherRequests || [])
        .map((record) => sanitizeTeacherRequestRecord(record, validUserIds))
        .filter(Boolean),
      teacherAssignments: (parsed.teacherAssignments || [])
        .map((record) => sanitizeTeacherAssignmentRecord(record, validUserIds))
        .filter(Boolean),
      teacherReviews: (parsed.teacherReviews || [])
        .map((record) => sanitizeTeacherReviewRecord(record, validUserIds))
        .filter(Boolean),
      counsellorRegistrations: (parsed.counsellorRegistrations || [])
        .map((record) => sanitizeCounsellorRegistration(record))
        .filter(Boolean),
      counsellingRequests: (parsed.counsellingRequests || [])
        .map((record) => sanitizeCounsellingRequest(record))
        .filter(Boolean),
      transportProviders: (parsed.transportProviders || [])
        .map((provider) => sanitizeTransportProviderRecord(provider, validUserIds))
        .filter(Boolean),
      transportRequests: (parsed.transportRequests || [])
        .map((request) => sanitizeTransportRequestRecord(request, validUserIds))
        .filter(Boolean),
      audioByLetter: parsed.audioByLetter || {},
      rolePermissions: sanitizeRolePermissions(parsed.rolePermissions),
      counselorProfile: {
        ...initialState.counselorProfile,
        ...(parsed.counselorProfile || {}),
        name: 'Counsellor Aisha Peer',
        durationPrices: {
          ...initialState.counselorProfile.durationPrices,
          ...((parsed.counselorProfile && parsed.counselorProfile.durationPrices) || {}),
        },
      },
    };
  } catch {
    return initialState;
  }
}

function buildPersistableState(state) {
  return {
    ...state,
    libraryBooks: (state.libraryBooks || [])
      .map(sanitizeLibraryBookRecord)
      .filter(Boolean)
      .map((book) => ({
        ...book,
        coverDataUrl:
          typeof book.coverDataUrl === 'string' &&
          book.coverDataUrl.length <= MAX_STORED_COVER_DATA_URL
            ? book.coverDataUrl
            : '',
      })),
  };
}

function buildConversationTitle(conversation, usersById, currentUserId) {
  const otherId = (conversation.participantIds || []).find((id) => id !== currentUserId);
  const otherUser = otherId ? usersById[otherId] : null;
  if (conversation.channel === CONVERSATION_CHANNELS.SUPPORT) {
    return otherUser ? `${otherUser.name} · Support` : 'Support';
  }
  return otherUser ? otherUser.name : 'Conversation';
}

function resolveTierLevel(tier) {
  if (tier === SUBSCRIPTION_TIERS.PREMIUM) return 2;
  if (tier === SUBSCRIPTION_TIERS.BASIC) return 1;
  return 0;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function calculateStreak(dates) {
  const uniqueDays = Array.from(
    new Set(
      dates
        .map((value) => {
          const parsed = new Date(value);
          if (Number.isNaN(parsed.getTime())) return null;
          return startOfDay(parsed).toISOString();
        })
        .filter(Boolean)
    )
  )
    .map((value) => new Date(value))
    .sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDays.length === 0) return 0;

  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const first = uniqueDays[0].getTime();
  if (first !== today.getTime() && first !== yesterday.getTime()) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = uniqueDays[index - 1];
    const current = uniqueDays[index];
    const diff = Math.round((previous.getTime() - current.getTime()) / 86400000);
    if (diff !== 1) break;
    streak += 1;
  }

  return streak;
}

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(buildPersistableState(state)));
    } catch (error) {
      console.warn('Storage write skipped to keep app stable:', error);
    }
  }, [state]);

  const usersById = useMemo(() => {
    const map = {};
    state.users.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [state.users]);

  const currentUser = state.currentUserId ? usersById[state.currentUserId] || null : null;
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const teacherDirectory = useMemo(
    () =>
      state.users
        .filter((user) => user.role === ROLES.TEACHER && user.status === USER_STATUS.APPROVED)
        .sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
        ),
    [state.users]
  );

  const studentUsers = useMemo(
    () => state.users.filter((user) => user.role === ROLES.STUDENT),
    [state.users]
  );

  const supportTarget = useMemo(() => {
    const admin = state.users.find(
      (user) => user.role === ROLES.ADMIN && user.status === USER_STATUS.APPROVED
    );
    if (admin) return admin;
    return state.users.find((user) => user.id === COUNSELLOR_USER_ID) || null;
  }, [state.users]);

  const currentTeacherAssignment = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return null;
    return (
      [...state.teacherAssignments]
        .filter(
          (assignment) =>
            assignment.studentId === currentUser.id &&
            assignment.status === ASSIGNMENT_STATUS.ACTIVE
        )
        .sort((a, b) => (b.assignedAt || '').localeCompare(a.assignedAt || ''))[0] || null
    );
  }, [state.teacherAssignments, currentUser]);

  const currentAssignedTeacher = currentTeacherAssignment
    ? usersById[currentTeacherAssignment.teacherId] || null
    : null;

  const currentTeacherRequest = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return null;
    return (
      [...state.teacherRequests]
        .filter((request) => request.studentId === currentUser.id)
        .sort((a, b) =>
          (b.updatedAt || b.createdAt || '').localeCompare(
            a.updatedAt || a.createdAt || ''
          )
        )[0] || null
    );
  }, [state.teacherRequests, currentUser]);

  // ── Counsellor computed values ──────────────────────────────────────────
  const currentCounsellorRegistration = useMemo(() => {
    if (!currentUser) return null;
    return [...state.counsellorRegistrations]
      .filter((r) => r.userId === currentUser.id)
      .sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''))[0] || null;
  }, [state.counsellorRegistrations, currentUser]);

  const approvedCounsellors = useMemo(
    () => state.counsellorRegistrations.filter(
      (r) => r.status === COUNSELLOR_REGISTRATION_STATUS.APPROVED
    ),
    [state.counsellorRegistrations]
  );

  const myStudentCounsellingRequests = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return [];
    return [...state.counsellingRequests]
      .filter((r) => r.studentId === currentUser.id)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [state.counsellingRequests, currentUser]);

  const myCounsellorRequests = useMemo(() => {
    if (!currentCounsellorRegistration) return [];
    return [...state.counsellingRequests]
      .filter((r) => r.counsellorRegistrationId === currentCounsellorRegistration.id)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [state.counsellingRequests, currentCounsellorRegistration]);


  const visibleConversations = useMemo(() => {
    if (!currentUser) return [];

    if (isAdmin) {
      return [...state.conversations].sort((a, b) =>
        (b.updatedAt || '').localeCompare(a.updatedAt || '')
      );
    }

    return state.conversations
      .filter((conversation) => (conversation.participantIds || []).includes(currentUser.id))
      .filter((conversation) => {
        if (currentUser.role === ROLES.STUDENT) {
          return [
            CONVERSATION_CHANNELS.SUPPORT,
            CONVERSATION_CHANNELS.TEACHER_PRIVATE,
            CONVERSATION_CHANNELS.GENERAL,
          ].includes(conversation.channel);
        }
        return true;
      })
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }, [state.conversations, currentUser, isAdmin]);

  const visibleLibraryBooks = useMemo(() => {
    if (!currentUser) {
      return state.libraryBooks.filter(
        (book) => book.publishStatus === 'published' && book.visibility === 'public'
      );
    }

    const currentTier = resolveTierLevel(currentUser.subscriptionTier);
    return state.libraryBooks.filter((book) => {
      if (book.publishStatus !== 'published' || book.visibility !== 'public') return false;
      return currentTier >= resolveTierLevel(book.requiredTier);
    });
  }, [state.libraryBooks, currentUser]);

  const completedSessions = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return [];
    return state.sessions.filter(
      (session) =>
        session.studentId === currentUser.id &&
        session.status === SESSION_STATUS.COMPLETED
    );
  }, [state.sessions, currentUser]);

  const upcomingSessions = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return [];
    return state.sessions
      .filter(
        (session) =>
          session.studentId === currentUser.id &&
          session.status === SESSION_STATUS.UPCOMING
      )
      .sort((a, b) => (a.start || '').localeCompare(b.start || ''));
  }, [state.sessions, currentUser]);

  const currentWorkUpdate = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return null;

    const latestRequest = [...state.teacherRequests]
      .filter((request) => request.studentId === currentUser.id)
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0];

    const latestTransport = [...state.transportRequests]
      .filter((request) => request.requesterId === currentUser.id)
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0];

    const nextSession = upcomingSessions[0];

    if (nextSession) {
      return {
        title: nextSession.title || 'Upcoming lesson scheduled',
        detail: `Your next session is ${new Date(nextSession.start).toLocaleString('en-ZA', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}.`,
      };
    }

    if (latestRequest && latestRequest.status === TEACHER_REQUEST_STATUS.PENDING) {
      return {
        title: 'Teacher request pending review',
        detail:
          'Admin is reviewing your teacher preference and matching you to the right instructor.',
      };
    }

    if (latestTransport) {
      return {
        title: `Transport request: ${titleCase(latestTransport.status)}`,
        detail:
          latestTransport.adminNotes ||
          'Your route request is in the support workflow and visible to admin.',
      };
    }

    return {
      title: 'No lessons started yet',
      detail:
        'Choose a teacher, open the letter guide, or contact support to begin your learning journey.',
    };
  }, [currentUser, state.teacherRequests, state.transportRequests, upcomingSessions]);

  const studentDashboardData = useMemo(() => {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return null;
    const latestTeacherReview = [...state.teacherReviews]
      .filter((review) => review.studentId === currentUser.id)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))[0];

    const supportConversation = visibleConversations.find(
      (conversation) => conversation.channel === CONVERSATION_CHANNELS.SUPPORT
    );
    const lastSupportMessage =
      supportConversation?.messages?.[supportConversation.messages.length - 1] || null;
    const hasTeacher = Boolean(currentAssignedTeacher);
    const hasLessonsStarted = completedSessions.length > 0 || Boolean(upcomingSessions[0]);
    const isInactive = completedSessions.length > 0 && !upcomingSessions[0];
    const activityDates = [
      ...completedSessions.map((session) => session.createdAt || session.start),
      ...upcomingSessions.map((session) => session.createdAt || session.start),
      ...(supportConversation?.messages || []).map((message) => message.createdAt),
    ];
    const streakDays = calculateStreak(activityDates);
    const progressState = !hasTeacher
      ? 'no_teacher'
      : !hasLessonsStarted
      ? 'teacher_selected_no_lessons'
      : isInactive
      ? 'inactive'
      : 'active';

    const nextStep =
      progressState === 'no_teacher'
        ? {
            title: 'Choose your teacher to begin',
            description:
              'Select a teacher so your learning path can be structured around the right guidance and pace.',
            actionLabel: 'Choose teacher',
            page: 'teachers',
          }
        : progressState === 'teacher_selected_no_lessons'
        ? {
            title: 'Start your first lesson',
            description:
              'Your teacher relationship is ready. Open the foundations and begin your first real lesson.',
            actionLabel: 'Start first lesson',
            page: 'letters',
          }
        : progressState === 'inactive'
        ? {
            title: 'Resume your progress',
            description:
              'You have already started. Re-enter your lesson flow and continue building consistency.',
            actionLabel: 'Resume learning',
            page: 'learn',
          }
        : {
            title: 'Continue your learning',
            description:
              'Keep your momentum going with your next lesson, revision, or teacher follow-up.',
            actionLabel: 'Continue learning',
            page: 'learn',
          };

    const todaysFocus =
      progressState === 'no_teacher'
        ? {
            title: 'Choose your teacher today',
            detail: 'A teacher connection is the first meaningful step toward structured progress.',
            instruction: 'Browse teachers and request the one that fits your level.',
            actionLabel: 'Choose teacher',
            page: 'teachers',
          }
        : progressState === 'teacher_selected_no_lessons'
        ? {
            title: 'Start your first lesson today',
            detail: 'Your teacher is in place. Begin with the foundations so real progress can start.',
            instruction: 'Open the letter guide and complete your first focused lesson.',
            actionLabel: 'Start first lesson',
            page: 'letters',
          }
        : {
            title: upcomingSessions[0]?.title || 'Continue your current lesson',
            detail: assignedTeacher
              ? `Stay connected with ${assignedTeacher.name} and keep building consistent recitation habits.`
              : 'Keep your learning rhythm moving forward today.',
            instruction: upcomingSessions[0]
              ? 'Open your lesson, review the teacher guidance, and continue from your current point.'
              : 'Return to your learning materials and complete the next practical step today.',
            actionLabel: progressState === 'inactive' ? 'Resume lesson' : 'Continue lesson',
            page: 'learn',
          };

    const level =
      progressPercent >= 65
        ? 'Intermediate'
        : progressPercent >= 30
        ? 'Foundations'
        : 'Beginner';
    const nextMilestone =
      level === 'Beginner'
        ? 'Foundations'
        : level === 'Foundations'
        ? 'Tajwid Rules'
        : 'Applied Recitation';
    const streakMessage =
      streakDays === 0
        ? 'Start again today'
        : streakDays >= 3
        ? "Don't break your streak"
        : "You're building consistency";

    const encouragement =
      progressState === 'no_teacher'
        ? 'A strong start begins with the right teacher.'
        : progressState === 'teacher_selected_no_lessons'
        ? 'Everything is set up. Your first lesson is the next meaningful step.'
        : progressState === 'inactive'
        ? 'You already began this journey. A small return step will get you moving again.'
        : 'Steady effort builds beautiful, lasting progress.';

    const learningPath = [
      {
        label: 'Teacher',
        status: hasTeacher ? 'complete' : 'current',
        text: hasTeacher
          ? `Connected with ${currentAssignedTeacher.name}`
          : 'Choose your teacher',
      },
      {
        label: 'Foundations',
        status: hasLessonsStarted ? 'complete' : hasTeacher ? 'current' : 'upcoming',
        text: hasLessonsStarted ? 'First lesson started' : 'Start with letters and foundations',
      },
      {
        label: 'Progress',
        status: completedSessions.length > 0 ? 'current' : 'upcoming',
        text:
          completedSessions.length > 0
            ? `${completedSessions.length} completed lesson${completedSessions.length === 1 ? '' : 's'}`
            : 'Build your first streak',
      },
    ];

    return {
      displayName: currentUser.name,
      firstName: currentUser.name.split(' ')[0] || currentUser.name,
      tier: currentUser.subscriptionTier || SUBSCRIPTION_TIERS.FREE,
      completedLessons: completedSessions.length,
      progressPercent:
        completedSessions.length === 0
          ? 0
          : Math.min(100, completedSessions.length * 12),
      streakDays,
      nextLesson: upcomingSessions[0] || null,
      assignedTeacher: currentAssignedTeacher,
      latestTeacherReview,
      lastSupportMessage,
      currentWorkUpdate,
      currentTeacherRequest,
      progressState,
      nextStep,
      todaysFocus,
      encouragement,
      learningPath,
      hasTeacher,
      hasLessonsStarted,
      isInactive,
      level,
      nextMilestone,
      streakMessage,
      motivationMessage:
        streakDays > 0
          ? streakDays >= 3
            ? 'Consistency is the key to success.'
            : 'Start small, stay consistent.'
          : progressPercent > 0
          ? 'You are progressing well.'
          : 'Start small, stay consistent.',
    };
  }, [
    currentUser,
    completedSessions,
    upcomingSessions,
    currentAssignedTeacher,
    state.teacherReviews,
    visibleConversations,
    currentWorkUpdate,
    currentTeacherRequest,
  ]);

  function ensureOwner(owner) {
    setState((prev) => {
      const existingAdmin = prev.users.find(
        (user) =>
          user.role === ROLES.ADMIN && user.status === USER_STATUS.APPROVED
      );
      if (existingAdmin) return prev;

      const newOwner = {
        id: uid('usr'),
        name: owner.name.trim(),
        email: owner.email.trim().toLowerCase(),
        password: owner.password,
        role: ROLES.ADMIN,
        subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
        status: USER_STATUS.APPROVED,
        createdAt: nowIso(),
        approvedAt: nowIso(),
      };

      return {
        ...prev,
        initializedAt: nowIso(),
        users: [...prev.users, newOwner],
        currentUserId: newOwner.id,
      };
    });
  }

  function registerApplication({ name, email, password, desiredRole }) {
    const normalizedEmail = email.trim().toLowerCase();
    const role = sanitizeRole(desiredRole);

    setState((prev) => {
      if (prev.users.some((user) => user.email === normalizedEmail)) {
        throw new Error('A user with this email already exists.');
      }

      const applicant = {
        id: uid('usr'),
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        subscriptionTier: SUBSCRIPTION_TIERS.FREE,
        status: USER_STATUS.PENDING,
        createdAt: nowIso(),
        approvedAt: null,
      };

      return {
        ...prev,
        users: [...prev.users, applicant],
      };
    });
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    const account = state.users.find(
      (user) => user.email === normalizedEmail && user.password === password
    );
    if (!account) {
      throw new Error('Invalid email or password.');
    }
    if (account.status !== USER_STATUS.APPROVED && account.role !== ROLES.ADMIN) {
      throw new Error(
        'Your account is not approved yet. Please wait for admin approval.'
      );
    }

    setState((prev) => ({
      ...prev,
      currentUserId: account.id,
    }));

    return account;
  }

  function logout() {
    setState((prev) => ({
      ...prev,
      currentUserId: null,
    }));
  }

  function updateUserStatus(userId, status) {
    if (!isAdmin) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status,
              approvedAt:
                status === USER_STATUS.APPROVED
                  ? user.approvedAt || nowIso()
                  : user.approvedAt,
            }
          : user
      ),
    }));
  }

  function changeUserRole(userId, role) {
    if (!isAdmin) return;
    const sanitized = sanitizeRole(role);
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId ? { ...user, role: sanitized } : user
      ),
    }));
  }

  function updateRolePermissions(roleName, nextPermissionMap) {
    if (!isAdmin) return;
    if (!ROLE_DEFINITIONS[roleName]) return;

    setState((prev) => {
      const defaults = buildDefaultRolePermissions();
      const roleDefaults = defaults[roleName] || {};
      const safeNext = {};
      Object.keys(roleDefaults).forEach((permissionKey) => {
        safeNext[permissionKey] = Boolean(nextPermissionMap?.[permissionKey]);
      });

      return {
        ...prev,
        rolePermissions: {
          ...prev.rolePermissions,
          [roleName]: safeNext,
        },
      };
    });
  }

  function grantCurrentUserFullAdminAccess() {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              role: ROLES.ADMIN,
              status: USER_STATUS.APPROVED,
              approvedAt: user.approvedAt || nowIso(),
              subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
            }
          : user
      ),
    }));
  }

  function deleteUser(userId) {
    if (!isAdmin) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== userId),
      conversations: prev.conversations.filter(
        (conversation) => !(conversation.participantIds || []).includes(userId)
      ),
      sessions: prev.sessions.filter(
        (session) => session.teacherId !== userId && session.studentId !== userId
      ),
      teacherRequests: prev.teacherRequests.filter(
        (request) => request.studentId !== userId && request.teacherId !== userId
      ),
      teacherAssignments: prev.teacherAssignments.filter(
        (assignment) =>
          assignment.studentId !== userId && assignment.teacherId !== userId
      ),
      teacherReviews: prev.teacherReviews.filter(
        (review) => review.studentId !== userId && review.teacherId !== userId
      ),
      currentUserId: prev.currentUserId === userId ? null : prev.currentUserId,
    }));
  }

  function getOrCreateConversation(otherUserId, options = {}) {
    if (!currentUser || !otherUserId || otherUserId === currentUser.id) return null;
    const channel = Object.values(CONVERSATION_CHANNELS).includes(options.channel)
      ? options.channel
      : CONVERSATION_CHANNELS.GENERAL;

    const existing = state.conversations.find((conversation) => {
      const ids = conversation.participantIds || [];
      return (
        ids.length === 2 &&
        ids.includes(currentUser.id) &&
        ids.includes(otherUserId) &&
        conversation.channel === channel
      );
    });

    if (existing) return existing.id;

    const newConversation = {
      id: uid('cnv'),
      participantIds: [currentUser.id, otherUserId],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      channel,
      subject: String(options.subject || '').trim(),
      messages: [],
      readBy: [currentUser.id],
      unreadFor: [otherUserId],
    };

    setState((prev) => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
    }));

    return newConversation.id;
  }

  function startSupportConversation() {
    if (!supportTarget) return null;
    return getOrCreateConversation(supportTarget.id, {
      channel: CONVERSATION_CHANNELS.SUPPORT,
      subject: 'General support',
    });
  }

  function startTeacherConversation(teacherId = currentAssignedTeacher?.id) {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return null;
    const targetTeacherId = String(teacherId || '');
    if (!targetTeacherId) return null;
    const assigned = state.teacherAssignments.find(
      (assignment) =>
        assignment.studentId === currentUser.id &&
        assignment.teacherId === targetTeacherId &&
        assignment.status === ASSIGNMENT_STATUS.ACTIVE
    );
    if (!assigned) {
      throw new Error(
        'Choose or request a teacher first before opening private teacher chat.'
      );
    }
    return getOrCreateConversation(targetTeacherId, {
      channel: CONVERSATION_CHANNELS.TEACHER_PRIVATE,
      subject: 'Teacher chat',
    });
  }

  function sendMessage(conversationId, text) {
    if (!currentUser || !text.trim()) return;
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const participantIds = conversation.participantIds || [];
        const message = {
          id: uid('msg'),
          senderId: currentUser.id,
          text: text.trim(),
          createdAt: nowIso(),
        };
        return {
          ...conversation,
          messages: [...(conversation.messages || []), message],
          updatedAt: nowIso(),
          readBy: [currentUser.id],
          unreadFor: participantIds.filter((id) => id !== currentUser.id),
        };
      }),
    }));
  }

  function markConversationRead(conversationId) {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        return {
          ...conversation,
          readBy: Array.from(new Set([...(conversation.readBy || []), currentUser.id])),
          unreadFor: (conversation.unreadFor || []).filter(
            (id) => id !== currentUser.id
          ),
        };
      }),
    }));
  }

  function requestTeacherAssignment({ teacherId, note }) {
    if (!currentUser || currentUser.role !== ROLES.STUDENT) return;
    const normalizedTeacherId = String(teacherId || '').trim();
    if (!normalizedTeacherId) {
      throw new Error('Choose a teacher to continue.');
    }

    const teacher = usersById[normalizedTeacherId];
    if (
      !teacher ||
      teacher.role !== ROLES.TEACHER ||
      teacher.status !== USER_STATUS.APPROVED
    ) {
      throw new Error('Selected teacher is not available.');
    }

    setState((prev) => {
      const existingPending = prev.teacherRequests.find(
        (request) =>
          request.studentId === currentUser.id &&
          request.teacherId === normalizedTeacherId &&
          request.status === TEACHER_REQUEST_STATUS.PENDING
      );

      const nextRequest = {
        id: existingPending?.id || uid('treq'),
        studentId: currentUser.id,
        teacherId: normalizedTeacherId,
        note: String(note || '').trim(),
        status: TEACHER_REQUEST_STATUS.PENDING,
        adminNotes: existingPending?.adminNotes || '',
        createdAt: existingPending?.createdAt || nowIso(),
        updatedAt: nowIso(),
      };

      return {
        ...prev,
        teacherRequests: existingPending
          ? prev.teacherRequests.map((request) =>
              request.id === existingPending.id ? nextRequest : request
            )
          : [nextRequest, ...prev.teacherRequests],
      };
    });
  }

  function reviewTeacher({ rating, review }) {
    if (!currentUser || currentUser.role !== ROLES.STUDENT || !currentAssignedTeacher) return;
    if (!review.trim() || Number(rating) < 1) {
      throw new Error('Provide a rating and short review.');
    }

    setState((prev) => ({
      ...prev,
      teacherReviews: [
        {
          id: uid('trev'),
          studentId: currentUser.id,
          teacherId: currentAssignedTeacher.id,
          rating: Math.max(1, Math.min(5, Number(rating) || 1)),
          review: review.trim(),
          createdAt: nowIso(),
        },
        ...prev.teacherReviews,
      ],
    }));
  }

  function assignTeacherRequest(requestId, decision, adminNotes = '') {
    if (!isAdmin) return;
    const nextStatus =
      decision === 'approved'
        ? TEACHER_REQUEST_STATUS.APPROVED
        : TEACHER_REQUEST_STATUS.DECLINED;

    setState((prev) => {
      const request = prev.teacherRequests.find((item) => item.id === requestId);
      if (!request) return prev;

      const updatedRequests = prev.teacherRequests.map((item) =>
        item.id === requestId
          ? {
              ...item,
              status: nextStatus,
              adminNotes: adminNotes.trim(),
              updatedAt: nowIso(),
            }
          : item
      );

      if (nextStatus !== TEACHER_REQUEST_STATUS.APPROVED) {
        return {
          ...prev,
          teacherRequests: updatedRequests,
        };
      }

      const nextAssignments = [
        ...prev.teacherAssignments.filter(
          (assignment) => assignment.studentId !== request.studentId
        ),
        {
          id: uid('tassign'),
          studentId: request.studentId,
          teacherId: request.teacherId,
          status: ASSIGNMENT_STATUS.ACTIVE,
          assignedAt: nowIso(),
          adminNotes: adminNotes.trim(),
        },
      ];

      const existingConversation = prev.conversations.find((conversation) => {
        const ids = conversation.participantIds || [];
        return (
          ids.length === 2 &&
          ids.includes(request.studentId) &&
          ids.includes(request.teacherId) &&
          conversation.channel === CONVERSATION_CHANNELS.TEACHER_PRIVATE
        );
      });

      return {
        ...prev,
        teacherRequests: updatedRequests,
        teacherAssignments: nextAssignments,
        conversations: existingConversation
          ? prev.conversations
          : [
              {
                id: uid('cnv'),
                participantIds: [request.studentId, request.teacherId],
                createdAt: nowIso(),
                updatedAt: nowIso(),
                channel: CONVERSATION_CHANNELS.TEACHER_PRIVATE,
                subject: 'Teacher chat',
                messages: [],
                readBy: [],
                unreadFor: [request.studentId, request.teacherId],
              },
              ...prev.conversations,
            ],
      };
    });
  }

  function updateTeacherAvailability(teacherId, availability) {
    if (!isAdmin) return;
    const safeAvailability = ['available', 'limited', 'unavailable'].includes(
      String(availability || '').trim().toLowerCase()
    )
      ? String(availability || '').trim().toLowerCase()
      : 'available';

    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === teacherId && user.role === ROLES.TEACHER
          ? { ...user, availability: safeAvailability }
          : user
      ),
    }));
  }

  function createSession(sessionInput) {
    if (!isAdmin) return null;
    const title = String(sessionInput.title || '').trim();
    const teacherId = String(sessionInput.teacherId || '');
    const studentId = String(sessionInput.studentId || '');
    if (!title || !teacherId || !studentId) {
      throw new Error('Session title, teacher, and student are required.');
    }

    const session = {
      id: uid('ses'),
      title,
      teacherId,
      studentId,
      serviceType: ['lesson', 'counseling', 'support'].includes(
        sessionInput.serviceType
      )
        ? sessionInput.serviceType
        : 'lesson',
      mode: ['video', 'audio'].includes(sessionInput.mode)
        ? sessionInput.mode
        : 'video',
      start: String(sessionInput.start || nowIso()),
      durationMinutes: Number(sessionInput.durationMinutes) || 45,
      status: SESSION_STATUS.UPCOMING,
      createdAt: nowIso(),
      paymentAmount: Number(sessionInput.paymentAmount) || 0,
      paymentStatus: 'unpaid',
    };

    setState((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));
    return session.id;
  }

  function updateSessionStatus(sessionId, status) {
    if (!currentUser) return;
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId ? { ...session, status } : session
      ),
    }));
  }

  function recordPayment({ sessionId, amount, status = 'completed' }) {
    if (!isAdmin) return;
    const gross = Number(amount) || 0;
    const teacherAmount = Math.round((gross * 70) / 100);
    const platformAmount = gross - teacherAmount;

    setState((prev) => ({
      ...prev,
      transactions: [
        {
          id: uid('txn'),
          sessionId,
          gross,
          teacherAmount,
          platformAmount,
          status,
          createdAt: nowIso(),
        },
        ...prev.transactions,
      ],
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              paymentAmount: gross,
              paymentStatus: status,
            }
          : session
      ),
    }));
  }

  function setLetterAudio(letterNum, sourceUrl) {
    if (!isAdmin) return;
    const key = String(letterNum);
    setState((prev) => ({
      ...prev,
      audioByLetter: {
        ...prev.audioByLetter,
        [key]: String(sourceUrl || '').trim(),
      },
    }));
  }

  function bookCounseling({ durationKey, start, notes }) {
    if (!currentUser) return;
    const counselor = usersById[COUNSELLOR_USER_ID] || supportTarget;
    if (!counselor) return;

    const session = {
      id: uid('ses'),
      title: `Counselling Session (${durationKey})`,
      teacherId: counselor.id,
      studentId: currentUser.id,
      counselorName: 'Counsellor Aisha Peer',
      serviceType: 'counseling',
      mode: 'video',
      start,
      durationMinutes: durationKey === '60m' ? 60 : durationKey === '45m' ? 45 : 30,
      status: SESSION_STATUS.UPCOMING,
      createdAt: nowIso(),
      paymentAmount: Number(state.counselorProfile.durationPrices[durationKey]) || 0,
      paymentStatus: 'unpaid',
      notes: String(notes || '').trim(),
    };

    setState((prev) => ({
      ...prev,
      sessions: [session, ...prev.sessions],
    }));
  }

  function updateCounselorPrice(durationKey, value) {
    if (!isAdmin) return;
    setState((prev) => ({
      ...prev,
      counselorProfile: {
        ...prev.counselorProfile,
        durationPrices: {
          ...prev.counselorProfile.durationPrices,
          [durationKey]: value === '' ? null : Number(value),
        },
      },
    }));
  }

  // ── Counsellor functions ────────────────────────────────────────────────

  function submitCounsellorRegistration(payload) {
    if (!currentUser) throw new Error('You must be signed in.');
    const existing = state.counsellorRegistrations.find(
      (r) => r.userId === currentUser.id && r.status === COUNSELLOR_REGISTRATION_STATUS.PENDING
    );
    if (existing) throw new Error('You already have a pending counsellor application.');
    const record = sanitizeCounsellorRegistration({
      id: uid('creg'),
      userId: currentUser.id,
      ...payload,
      status: COUNSELLOR_REGISTRATION_STATUS.PENDING,
      submittedAt: nowIso(),
      updatedAt: nowIso(),
    });
    setState((prev) => ({ ...prev, counsellorRegistrations: [record, ...prev.counsellorRegistrations] }));
  }

  function approveCounsellorRegistration(registrationId, decision, adminNotes = '') {
    if (!isAdmin) return;
    const nextStatus = decision === 'approved'
      ? COUNSELLOR_REGISTRATION_STATUS.APPROVED
      : COUNSELLOR_REGISTRATION_STATUS.DECLINED;
    setState((prev) => {
      const reg = prev.counsellorRegistrations.find((r) => r.id === registrationId);
      if (!reg) return prev;
      const updatedRegs = prev.counsellorRegistrations.map((r) =>
        r.id === registrationId
          ? { ...r, status: nextStatus, adminNotes: adminNotes.trim(), reviewedAt: nowIso(), updatedAt: nowIso() }
          : r
      );
      const updatedUsers = nextStatus === COUNSELLOR_REGISTRATION_STATUS.APPROVED
        ? prev.users.map((u) =>
            u.id === reg.userId ? { ...u, role: ROLES.COUNSELOR, status: USER_STATUS.APPROVED } : u
          )
        : prev.users;
      return { ...prev, counsellorRegistrations: updatedRegs, users: updatedUsers };
    });
  }

  function requestCounselling(payload) {
    if (!currentUser) throw new Error('You must be signed in.');
    const record = sanitizeCounsellingRequest({
      id: uid('creq'),
      studentId: currentUser.id,
      ...payload,
      status: COUNSELLING_REQUEST_STATUS.PENDING,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    setState((prev) => ({ ...prev, counsellingRequests: [record, ...prev.counsellingRequests] }));
  }

  function manageCounsellingRequest(requestId, action, adminNotes = '') {
    const nextStatus = {
      accept: COUNSELLING_REQUEST_STATUS.ACCEPTED,
      decline: COUNSELLING_REQUEST_STATUS.DECLINED,
      complete: COUNSELLING_REQUEST_STATUS.COMPLETED,
      cancel: COUNSELLING_REQUEST_STATUS.CANCELLED,
    }[action];
    if (!nextStatus) return;
    setState((prev) => ({
      ...prev,
      counsellingRequests: prev.counsellingRequests.map((r) =>
        r.id === requestId
          ? { ...r, status: nextStatus, adminNotes: adminNotes.trim(), updatedAt: nowIso() }
          : r
      ),
    }));
  }

  function updateCounsellorProfile(registrationId, updates) {
    setState((prev) => ({
      ...prev,
      counsellorRegistrations: prev.counsellorRegistrations.map((r) =>
        r.id === registrationId
          ? sanitizeCounsellorRegistration({ ...r, ...updates, updatedAt: nowIso() })
          : r
      ),
    }));
  }

  function registerTransportProvider(payload) {
    if (!currentUser) return;
    const provider = sanitizeTransportProviderRecord(
      {
        id: uid('trp'),
        userId: currentUser.id,
        ...payload,
        status: TRANSPORT_PROVIDER_STATUS.SUBMITTED,
        verifiedByAdmin: false,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      new Set(state.users.map((user) => user.id))
    );

    if (!provider) {
      throw new Error('Could not register transport provider.');
    }

    setState((prev) => ({
      ...prev,
      transportProviders: [provider, ...prev.transportProviders],
    }));
  }

  function submitTransportRequest(payload) {
    if (!currentUser) return;
    const request = sanitizeTransportRequestRecord(
      {
        id: uid('trq'),
        requesterId: currentUser.id,
        ...payload,
        status: TRANSPORT_REQUEST_STATUS.SUBMITTED,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
      new Set(state.users.map((user) => user.id))
    );

    if (!request) {
      throw new Error('Could not submit transport request.');
    }

    setState((prev) => ({
      ...prev,
      transportRequests: [request, ...prev.transportRequests],
    }));
  }

  function updateTransportProviderStatus(providerId, status) {
    if (!isAdmin || !Object.values(TRANSPORT_PROVIDER_STATUS).includes(status)) return;
    setState((prev) => ({
      ...prev,
      transportProviders: prev.transportProviders.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              status,
              verifiedByAdmin:
                status === TRANSPORT_PROVIDER_STATUS.APPROVED
                  ? true
                  : provider.verifiedByAdmin,
              updatedAt: nowIso(),
            }
          : provider
      ),
    }));
  }

  function updateTransportRequestStatus(requestId, status, options = {}) {
    if (!isAdmin || !Object.values(TRANSPORT_REQUEST_STATUS).includes(status)) return;
    setState((prev) => ({
      ...prev,
      transportRequests: prev.transportRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status,
              matchedProviderId:
                typeof options.matchedProviderId === 'string'
                  ? options.matchedProviderId
                  : request.matchedProviderId,
              adminNotes:
                typeof options.adminNotes === 'string'
                  ? options.adminNotes
                  : request.adminNotes,
              updatedAt: nowIso(),
            }
          : request
      ),
    }));
  }

  function assignTransportRequest(requestId, providerId, adminNotes = '') {
    if (!isAdmin) return;
    updateTransportRequestStatus(requestId, TRANSPORT_REQUEST_STATUS.MATCHED, {
      matchedProviderId: String(providerId || '').trim(),
      adminNotes,
    });
  }

  function upsertLibraryBook(bookInput) {
    if (!isAdmin) return;
    setState((prev) => {
      const now = nowIso();
      const nextBook = sanitizeLibraryBookRecord({
        ...bookInput,
        id: bookInput.id || uid('book'),
        createdAt: bookInput.createdAt || now,
        updatedAt: now,
      });

      if (!nextBook) return prev;
      const exists = prev.libraryBooks.some((item) => item.id === nextBook.id);
      return {
        ...prev,
        libraryBooks: exists
          ? prev.libraryBooks.map((item) =>
              item.id === nextBook.id ? nextBook : item
            )
          : [nextBook, ...prev.libraryBooks],
      };
    });
  }

  function deleteLibraryBook(bookId) {
    if (!isAdmin) return;
    setState((prev) => ({
      ...prev,
      libraryBooks: prev.libraryBooks.filter((item) => item.id !== bookId),
    }));
  }

  const financeSummary = useMemo(() => {
    return state.transactions.reduce(
      (acc, tx) => {
        acc.totalRevenue += tx.gross || 0;
        acc.platformEarnings += tx.platformAmount || 0;
        acc.providerEarnings += tx.teacherAmount || 0;
        if (tx.status === 'pending') acc.pendingPayouts += tx.teacherAmount || 0;
        if (tx.status === 'completed') acc.completedPayouts += tx.teacherAmount || 0;
        return acc;
      },
      {
        totalRevenue: 0,
        platformEarnings: 0,
        providerEarnings: 0,
        pendingPayouts: 0,
        completedPayouts: 0,
      }
    );
  }, [state.transactions]);

  const value = {
    state,
    roles: ROLES,
    roleDefinitions: ROLE_DEFINITIONS,
    permissionLabels: PERMISSION_LABELS,
    subscriptionTiers: SUBSCRIPTION_TIERS,
    userStatus: USER_STATUS,
    sessionStatus: SESSION_STATUS,
    transportProviderStatus: TRANSPORT_PROVIDER_STATUS,
    transportRequestStatus: TRANSPORT_REQUEST_STATUS,
    teacherRequestStatus: TEACHER_REQUEST_STATUS,
    assignmentStatus: ASSIGNMENT_STATUS,
    conversationChannels: CONVERSATION_CHANNELS,
    usersById,
    currentUser,
    isAdmin,
    teacherDirectory,
    studentUsers,
    supportTarget,
    currentTeacherAssignment,
    currentAssignedTeacher,
    currentTeacherRequest,
    visibleConversations,
    visibleLibraryBooks,
    studentDashboardData,
    currentWorkUpdate,
    financeSummary,
    buildConversationTitle,
    ensureOwner,
    registerApplication,
    login,
    logout,
    updateUserStatus,
    changeUserRole,
    updateRolePermissions,
    grantCurrentUserFullAdminAccess,
    deleteUser,
    getOrCreateConversation,
    startSupportConversation,
    startTeacherConversation,
    sendMessage,
    markConversationRead,
    requestTeacherAssignment,
    assignTeacherRequest,
    updateTeacherAvailability,
    reviewTeacher,
    createSession,
    updateSessionStatus,
    recordPayment,
    setLetterAudio,
    // ── Counsellor ──
    counsellorRegistrationStatus: COUNSELLOR_REGISTRATION_STATUS,
    counsellingRequestStatus: COUNSELLING_REQUEST_STATUS,
    currentCounsellorRegistration,
    approvedCounsellors,
    myStudentCounsellingRequests,
    myCounsellorRequests,
    submitCounsellorRegistration,
    approveCounsellorRegistration,
    requestCounselling,
    manageCounsellingRequest,
    updateCounsellorProfile,
    bookCounseling,
    updateCounselorPrice,
    registerTransportProvider,
    submitTransportRequest,
    updateTransportProviderStatus,
    updateTransportRequestStatus,
    assignTransportRequest,
    upsertLibraryBook,
    deleteLibraryBook,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export const AuthProvider = PlatformProvider;

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used inside PlatformProvider');
  }
  return ctx;
}
