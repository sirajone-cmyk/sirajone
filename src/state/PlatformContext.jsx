import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  buildDefaultRolePermissions,
  PERMISSION_LABELS,
  ROLE_DEFINITIONS,
} from '../data/rbac';

const STORAGE_KEY = 'rahla_platform_v2';

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

const initialState = {
  initializedAt: null,
  users: [],
  currentUserId: null,
  conversations: [],
  sessions: [],
  transactions: [],
  libraryBooks: [],
  counselorProfile: {
    name: 'Dr. Aisha Peer',
    title: 'Student Support and Guidance',
    bio: 'Dr. Aisha Peer provides professional counseling and student support in a compassionate, structured, and confidential environment. With extensive experience working with large numbers of students in an educational setting, she offers guidance that is thoughtful, supportive, and practical for learners and families.',
    durationPrices: {
      '30m': null,
      '45m': null,
      '60m': null,
    },
    availabilityNotes: '',
  },
  audioByLetter: {},
  transportProviders: [],
  transportRequests: [],
  rolePermissions: buildDefaultRolePermissions(),
};

const PlatformContext = createContext(null);
const MAX_STORED_BOOK_FILE_DATA_URL = 2 * 1024 * 1024;
const MAX_STORED_COVER_DATA_URL = 900 * 1024;

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function sanitizeUserRecord(user) {
  if (!user || typeof user !== 'object') return null;
  const name = String(user.name || '').trim();
  const email = String(user.email || '').trim().toLowerCase();
  if (!name || !email) return null;

  const role = sanitizeRole(user.role);
  const statusValues = Object.values(USER_STATUS);
  const status = statusValues.includes(user.status) ? user.status : USER_STATUS.PENDING;

  return {
    id: typeof user.id === 'string' && user.id ? user.id : uid('usr'),
    name,
    email,
    password: typeof user.password === 'string' ? user.password : '',
    role,
    subscriptionTier:
      String(user.subscriptionTier || '').trim().toLowerCase() === SUBSCRIPTION_TIERS.PREMIUM
        ? SUBSCRIPTION_TIERS.PREMIUM
        : String(user.subscriptionTier || '').trim().toLowerCase() === SUBSCRIPTION_TIERS.BASIC
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
  };
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
  const previewPageCount = Math.max(1, Number(book.previewPageCount) || 3);
  const pageCount = Math.max(1, Number(book.pageCount) || 1);
  const readerPages = Array.isArray(book.readerPages)
    ? book.readerPages.map((page) => String(page || '').trim()).filter(Boolean)
    : [];

  return {
    ...book,
    id: typeof book.id === 'string' && book.id ? book.id : uid('book'),
    title: String(book.title || '').trim(),
    description: String(book.description || '').trim(),
    mainCategory: String(book.mainCategory || '').trim(),
    subcategory: String(book.subcategory || '').trim(),
    author: String(book.author || '').trim(),
    visibility: book.visibility === 'private' ? 'private' : 'public',
    publishStatus: book.publishStatus === 'draft' ? 'draft' : 'published',
    requiredTier: normalizedTier,
    pageCount,
    previewPageCount,
    readerPages,
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

function sanitizeTransportProviderRecord(provider, validUserIds) {
  if (!provider || typeof provider !== 'object') return null;
  const userId = String(provider.userId || '');
  if (!validUserIds.has(userId)) return null;

  const allowedStatus = Object.values(TRANSPORT_PROVIDER_STATUS);
  const status = allowedStatus.includes(provider.status)
    ? provider.status
    : TRANSPORT_PROVIDER_STATUS.SUBMITTED;

  const serviceTypeRaw = String(provider.serviceType || '').trim().toLowerCase();
  const serviceType =
    serviceTypeRaw === 'volunteer' || serviceTypeRaw === 'mixed'
      ? serviceTypeRaw
      : 'paid';

  const seats = Math.max(1, Number(provider.seats) || 1);

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
    seats,
    serviceType,
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
    status,
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
  const status = allowedStatus.includes(request.status)
    ? request.status
    : TRANSPORT_REQUEST_STATUS.SUBMITTED;

  const affordabilityRaw = String(request.affordability || '').trim().toLowerCase();
  const affordability =
    affordabilityRaw === 'free' || affordabilityRaw === 'depends'
      ? affordabilityRaw
      : 'paid';

  const rideFrequencyRaw = String(request.rideFrequency || '').trim().toLowerCase();
  const rideFrequency = rideFrequencyRaw === 'recurring' ? 'recurring' : 'one_time';

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
    affordability,
    rideFrequency,
    notes: String(request.notes || '').trim(),
    matchedProviderId: String(request.matchedProviderId || '').trim(),
    adminNotes: String(request.adminNotes || '').trim(),
    status,
    createdAt: request.createdAt || nowIso(),
    updatedAt: request.updatedAt || nowIso(),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw);
    const users = (parsed.users || []).map(sanitizeUserRecord).filter(Boolean);
    const validUserIds = new Set(users.map((user) => user.id));
    const conversations = (parsed.conversations || [])
      .map((conversation) => sanitizeConversationRecord(conversation, validUserIds))
      .filter(Boolean);
    const sessions = (parsed.sessions || [])
      .map((session) => sanitizeSessionRecord(session, validUserIds))
      .filter(Boolean);
    const validSessionIds = new Set(sessions.map((session) => session.id));
    const transactions = (parsed.transactions || []).filter(
      (tx) =>
        tx &&
        typeof tx === 'object' &&
        typeof tx.id === 'string' &&
        validSessionIds.has(tx.sessionId)
    );

    return {
      ...initialState,
      ...parsed,
      users,
      conversations,
      sessions,
      transactions,
      libraryBooks: (parsed.libraryBooks || []).map(sanitizeLibraryBookRecord).filter(Boolean),
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

function sanitizeRole(rawRole) {
  const role = (rawRole || '').trim();
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

function buildConversationTitle(conversation, usersById, currentUserId) {
  const otherId = (conversation.participantIds || []).find((id) => id !== currentUserId);
  const otherUser = otherId ? usersById[otherId] : null;
  return otherUser ? otherUser.name : 'Conversation';
}

export function PlatformProvider({ children }) {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    try {
      const persistable = buildPersistableState(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
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

  // Admin accounts always get full platform control in this build.
  const isAdmin = currentUser?.role === ROLES.ADMIN;

  const visibleConversations = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) {
      return [...state.conversations]
        .filter((conversation) => {
          const ids = conversation.participantIds || [];
          return (
            ids.length >= 2 &&
            ids.every((id) => usersById[id]?.status === USER_STATUS.APPROVED)
          );
        })
        .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
    }
    return state.conversations
      .filter((conversation) => {
        const ids = conversation.participantIds || [];
        if (!ids.includes(currentUser.id)) return false;
        const otherId = ids.find((id) => id !== currentUser.id);
        const otherUser = otherId ? usersById[otherId] : null;
        return Boolean(otherUser && otherUser.status === USER_STATUS.APPROVED && otherUser.role === ROLES.ADMIN);
      })
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }, [state.conversations, currentUser, isAdmin, usersById]);

  function ensureOwner(owner) {
    setState((prev) => {
      const existingAdmin = prev.users.find((user) => user.role === ROLES.ADMIN && user.status === USER_STATUS.APPROVED);
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
        subscriptionTier:
          role === ROLES.TEACHER || role === ROLES.COUNSELOR || role === ROLES.CO_ADMIN
            ? SUBSCRIPTION_TIERS.BASIC
            : SUBSCRIPTION_TIERS.FREE,
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
    const account = state.users.find((user) => user.email === normalizedEmail && user.password === password);
    if (!account) {
      throw new Error('Invalid email or password.');
    }
    const isAdminAccount = account.role === ROLES.ADMIN;
    if (account.status !== USER_STATUS.APPROVED && !isAdminAccount) {
      throw new Error('Your account is not approved yet. Please wait for admin approval.');
    }

    setState((prev) => {
      const users = isAdminAccount
        ? prev.users.map((user) =>
            user.id === account.id
              ? {
                  ...user,
                  status: USER_STATUS.APPROVED,
                  approvedAt: user.approvedAt || nowIso(),
                  subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
                }
              : user
          )
        : prev.users;

      return {
        ...prev,
        users,
        currentUserId: account.id,
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
              approvedAt: status === USER_STATUS.APPROVED ? nowIso() : user.approvedAt,
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
      users: prev.users.map((user) => (user.id === userId ? { ...user, role: sanitized } : user)),
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

  function deleteUser(userId) {
    if (!isAdmin) return;
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== userId),
      conversations: prev.conversations.filter((conversation) => !(conversation.participantIds || []).includes(userId)),
      sessions: prev.sessions.filter((session) => session.teacherId !== userId && session.studentId !== userId),
      currentUserId: prev.currentUserId === userId ? null : prev.currentUserId,
    }));
  }

  function getOrCreateConversation(otherUserId) {
    if (!currentUser) return null;
    const existing = state.conversations.find((conversation) => {
      const ids = conversation.participantIds || [];
      return ids.includes(currentUser.id) && ids.includes(otherUserId) && ids.length === 2;
    });

    if (existing) return existing.id;

    const newConversation = {
      id: uid('cnv'),
      participantIds: [currentUser.id, otherUserId],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      messages: [],
      readBy: [currentUser.id],
    };

    setState((prev) => ({
      ...prev,
      conversations: [newConversation, ...prev.conversations],
    }));

    return newConversation.id;
  }

  function sendMessage(conversationId, text) {
    if (!currentUser || !text.trim()) return;
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        const message = {
          id: uid('msg'),
          senderId: currentUser.id,
          text: text.trim(),
          createdAt: nowIso(),
        };
        const participantIds = conversation.participantIds || [];
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
        const readBy = Array.from(new Set([...(conversation.readBy || []), currentUser.id]));
        const unreadFor = (conversation.unreadFor || []).filter((id) => id !== currentUser.id);
        return { ...conversation, readBy, unreadFor };
      }),
    }));
  }

  function createSession(sessionInput) {
    if (!isAdmin) return;
    const title = String(sessionInput.title || '').trim();
    const teacherId = String(sessionInput.teacherId || '');
    const studentId = String(sessionInput.studentId || '');
    const serviceType = ['lesson', 'counseling', 'support'].includes(sessionInput.serviceType)
      ? sessionInput.serviceType
      : 'lesson';
    const mode = ['video', 'audio'].includes(sessionInput.mode) ? sessionInput.mode : 'video';
    const start = String(sessionInput.start || '');
    const startDate = new Date(start);
    const durationMinutes = Number(sessionInput.durationMinutes) || 45;
    const paymentAmount = Number(sessionInput.paymentAmount) || 0;

    if (!title) {
      throw new Error('Session title is required.');
    }
    if (!teacherId) {
      throw new Error('Please select an approved teacher or counselor.');
    }
    if (!studentId) {
      throw new Error('Please select an approved student.');
    }
    if (teacherId === studentId) {
      throw new Error('Teacher and student must be different users.');
    }
    if (Number.isNaN(startDate.getTime())) {
      throw new Error('Please provide a valid date and time.');
    }
    if (durationMinutes < 15 || durationMinutes > 240) {
      throw new Error('Session duration must be between 15 and 240 minutes.');
    }

    const teacherUser = state.users.find((user) => user.id === teacherId);
    if (
      !teacherUser ||
      teacherUser.status !== USER_STATUS.APPROVED ||
      (teacherUser.role !== ROLES.TEACHER && teacherUser.role !== ROLES.COUNSELOR)
    ) {
      throw new Error('Selected teacher/counselor is not approved.');
    }

    const studentUser = state.users.find((user) => user.id === studentId);
    if (
      !studentUser ||
      studentUser.status !== USER_STATUS.APPROVED ||
      studentUser.role !== ROLES.STUDENT
    ) {
      throw new Error('Selected student is not approved.');
    }

    const session = {
      id: uid('ses'),
      title,
      teacherId,
      studentId,
      serviceType,
      mode,
      start,
      durationMinutes,
      status: SESSION_STATUS.UPCOMING,
      createdAt: nowIso(),
      paymentAmount,
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
      sessions: prev.sessions.map((session) => (session.id === sessionId ? { ...session, status } : session)),
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
        [key]: sourceUrl.trim(),
      },
    }));
  }

  function bookCounseling({ durationKey, start, notes }) {
    if (!currentUser) return;
    const admin = state.users.find((user) => user.role === ROLES.ADMIN && user.status === USER_STATUS.APPROVED);
    if (!admin) return;

    const session = {
      id: uid('ses'),
      title: `Counseling Session (${durationKey})`,
      teacherId: admin.id,
      studentId: currentUser.id,
      counselorName: state.counselorProfile.name,
      serviceType: 'counseling',
      mode: 'video',
      start,
      durationMinutes: durationKey === '60m' ? 60 : durationKey === '45m' ? 45 : 30,
      status: SESSION_STATUS.UPCOMING,
      createdAt: nowIso(),
      paymentAmount: Number(state.counselorProfile.durationPrices[durationKey]) || 0,
      paymentStatus: 'unpaid',
      notes,
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

  function registerTransportProvider(payload) {
    if (!currentUser) return;
    const fullName = String(payload.fullName || payload.name || '').trim();
    const coverageArea = String(payload.coverageArea || payload.area || '').trim();
    if (!fullName || !coverageArea) {
      throw new Error('Provider name and coverage area are required.');
    }

    const serviceTypeRaw = String(payload.serviceType || '').trim().toLowerCase();
    const serviceType =
      serviceTypeRaw === 'volunteer' || serviceTypeRaw === 'mixed'
        ? serviceTypeRaw
        : 'paid';

    const seats = Math.max(1, Number(payload.seats) || 1);

    const provider = sanitizeTransportProviderRecord(
      {
        id: uid('trp'),
        userId: currentUser.id,
        fullName,
        contactNumber: payload.contactNumber,
        email: payload.email,
        coverageArea,
        pickupZones: payload.pickupZones,
        dropoffZones: payload.dropoffZones,
        availableDays: payload.availableDays,
        timeWindowStart: payload.timeWindowStart,
        timeWindowEnd: payload.timeWindowEnd,
        serviceType,
        seats,
        vehicleType: payload.vehicleType,
        vehicleRegistration: payload.vehicleRegistration,
        routeNotes: payload.routeNotes || payload.route,
        vehicleNotes: payload.vehicleNotes || payload.notes,
        verification: payload.verification,
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
    if (!isAdmin) return;
    if (!Object.values(TRANSPORT_PROVIDER_STATUS).includes(status)) return;
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
    if (!isAdmin) return;
    if (!Object.values(TRANSPORT_REQUEST_STATUS).includes(status)) return;

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
    const normalizedProviderId = String(providerId || '').trim();
    if (!normalizedProviderId) {
      throw new Error('Select a provider to assign this request.');
    }

    const provider = state.transportProviders.find(
      (item) =>
        item.id === normalizedProviderId &&
        item.status === TRANSPORT_PROVIDER_STATUS.APPROVED
    );

    if (!provider) {
      throw new Error('Selected provider is not approved.');
    }

    updateTransportRequestStatus(requestId, TRANSPORT_REQUEST_STATUS.MATCHED, {
      matchedProviderId: normalizedProviderId,
      adminNotes,
    });
  }

  function upsertLibraryBook(bookInput) {
    if (!isAdmin) return;
    setState((prev) => {
      const now = nowIso();
      const nextBook = {
        id: bookInput.id || uid('book'),
        title: (bookInput.title || '').trim(),
        description: (bookInput.description || '').trim(),
        mainCategory: (bookInput.mainCategory || '').trim(),
        subcategory: (bookInput.subcategory || '').trim(),
        author: (bookInput.author || '').trim(),
        visibility: bookInput.visibility || 'public',
        publishStatus: bookInput.publishStatus || 'draft',
        coverDataUrl: bookInput.coverDataUrl || '',
        coverFileName: bookInput.coverFileName || '',
        fileUrl: (bookInput.fileUrl || '').trim(),
        fileDataUrl:
          typeof bookInput.fileDataUrl === 'string' &&
          bookInput.fileDataUrl.length <= MAX_STORED_BOOK_FILE_DATA_URL
            ? bookInput.fileDataUrl
            : '',
        fileName: bookInput.fileName || '',
        requiredTier:
          String(bookInput.requiredTier || '').trim().toLowerCase() === SUBSCRIPTION_TIERS.PREMIUM
            ? SUBSCRIPTION_TIERS.PREMIUM
            : String(bookInput.requiredTier || '').trim().toLowerCase() === SUBSCRIPTION_TIERS.BASIC
            ? SUBSCRIPTION_TIERS.BASIC
            : SUBSCRIPTION_TIERS.FREE,
        pageCount: Math.max(1, Number(bookInput.pageCount) || 1),
        previewPageCount: Math.max(1, Number(bookInput.previewPageCount) || 3),
        readerPages: Array.isArray(bookInput.readerPages)
          ? bookInput.readerPages.map((page) => String(page || '').trim()).filter(Boolean)
          : [],
        createdAt: bookInput.createdAt || now,
        updatedAt: now,
      };

      const exists = prev.libraryBooks.some((item) => item.id === nextBook.id);
      return {
        ...prev,
        libraryBooks: exists
          ? prev.libraryBooks.map((item) => (item.id === nextBook.id ? { ...item, ...nextBook } : item))
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
        if (tx.status === 'pending') {
          acc.pendingPayouts += tx.teacherAmount || 0;
        }
        if (tx.status === 'completed') {
          acc.completedPayouts += tx.teacherAmount || 0;
        }
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
    usersById,
    currentUser,
    isAdmin,
    visibleConversations,
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
    upsertLibraryBook,
    deleteLibraryBook,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error('usePlatform must be used inside PlatformProvider');
  }
  return ctx;
}
