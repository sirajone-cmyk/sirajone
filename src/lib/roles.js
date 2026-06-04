export const ROLES = Object.freeze({
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
  CO_ADMIN: 'Co-Admin',
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

export function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

export function isOwnerEmail(email = '') {
  return OWNER_EMAILS.includes(normalizeEmail(email));
}

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
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
  };
}
