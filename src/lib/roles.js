export const ROLES = Object.freeze({
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
  CO_ADMIN: 'Co-Admin',
  COUNSELLOR: 'Counsellor',
  // Legacy spelling kept for backwards compatibility with seeded data.
  COUNSELOR: 'Counselor',
  // Person seeking Islamic guidance/support; stored value is preserved for live data compatibility.
  COUNSELLING_CLIENT: 'counsellingClient',
});

export const USER_STATUS = Object.freeze({
  APPROVED: 'approved',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
});

export const OWNER_EMAILS = Object.freeze([
  'sirajone7@gmail.com',
  'madrassatahseenulquraan@gmail.com',
]);

export const ADMIN_ROLES = Object.freeze([
  ROLES.ADMIN,
  ROLES.CO_ADMIN,
]);

export const APPROVED_TEACHER_ROLES = Object.freeze([
  ROLES.TEACHER,
]);

export const COUNSELLOR_CATEGORIES = Object.freeze([
  'Islamic Guidance',
  'Spiritual Support',
  'Marriage Guidance',
  'Premarital Guidance',
  'Family Support',
  'Parenting Support',
  'Youth Mentorship',
  'Student Support',
  "Da'wah & Revert Support",
  'Emotional Wellbeing Support',
  "Women's Guidance",
  "Men's Guidance",
  'Community Support',
  "Du'a & Spiritual Advice",
  'Islamic Learning Support',
]);

export const SERVICE_DELIVERY_OPTIONS = Object.freeze([
  'Online',
  'In-Person',
  'Phone',
  'WhatsApp',
  'Group Guidance',
]);

export function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

export function isOwnerEmail(email = '') {
  return OWNER_EMAILS.includes(normalizeEmail(email));
}

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isCounsellorRole(role) {
  return role === ROLES.COUNSELLOR || role === ROLES.COUNSELOR;
}

export const LEGACY_COUNSELLING_CLIENT_ROLES = Object.freeze(['CounsellingClient']);

export function isCounsellingClientRole(role) {
  return role === ROLES.COUNSELLING_CLIENT || LEGACY_COUNSELLING_CLIENT_ROLES.includes(role);
}

export function enrichUserProfile(profile = {}) {
  const role = profile.role || ROLES.STUDENT;
  const status = profile.status || USER_STATUS.PENDING;

  return {
    ...profile,
    role,
    status,
    isApproved: status === USER_STATUS.APPROVED,
    isPending: status === USER_STATUS.PENDING,
    isSuspended: status === USER_STATUS.SUSPENDED,
    isAdmin: isAdminRole(role) && status === USER_STATUS.APPROVED,
    isTeacher: role === ROLES.TEACHER && status === USER_STATUS.APPROVED,
    isTeacherPending: role === ROLES.TEACHER && status === USER_STATUS.PENDING,
    isCounsellor: isCounsellorRole(role) && status === USER_STATUS.APPROVED,
    isCounsellorPending: isCounsellorRole(role) && status === USER_STATUS.PENDING,
    isCounsellingClient: isCounsellingClientRole(role) && status === USER_STATUS.APPROVED,
    isCounsellingClientPending: isCounsellingClientRole(role) && status === USER_STATUS.PENDING,
  };
}
