export const PERMISSIONS = {
  FULL_PLATFORM_CONTROL: 'full_platform_control',
  MANAGE_ALL_USERS_AND_ROLES: 'manage_all_users_and_roles',
  DELETE_DATA: 'delete_data',
  SYSTEM_SETTINGS: 'system_settings',
  BILLING_AND_PAYMENTS: 'billing_and_payments',
  ALL_COADMIN_PERMISSIONS: 'all_coadmin_permissions',
  MANAGE_STUDENTS: 'manage_students',
  REPLY_TO_MESSAGES: 'reply_to_messages',
  APPROVE_PAYMENTS: 'approve_payments',
  MANAGE_ANNOUNCEMENTS: 'manage_announcements',
  VIEW_REPORTS: 'view_reports',
  VIEW_ASSIGNED_STUDENTS: 'view_assigned_students',
  POST_FEEDBACK: 'post_feedback',
  VIEW_LESSON_MATERIALS: 'view_lesson_materials',
  LIMITED_ACADEMIC_TOOLS: 'limited_academic_tools',
  ACCESS_LEARNING_TOOLS: 'access_learning_tools',
  MESSAGE_ADMIN_IF_ENABLED: 'message_admin_if_enabled',
  VIEW_OWN_PROGRESS: 'view_own_progress',
  ACCESS_LIBRARY: 'access_library',
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.FULL_PLATFORM_CONTROL]: 'Full platform control',
  [PERMISSIONS.MANAGE_ALL_USERS_AND_ROLES]: 'Manage all users and roles',
  [PERMISSIONS.DELETE_DATA]: 'Delete data',
  [PERMISSIONS.SYSTEM_SETTINGS]: 'System settings',
  [PERMISSIONS.BILLING_AND_PAYMENTS]: 'Billing and payments',
  [PERMISSIONS.ALL_COADMIN_PERMISSIONS]: 'All Co-Admin permissions',
  [PERMISSIONS.MANAGE_STUDENTS]: 'Manage students',
  [PERMISSIONS.REPLY_TO_MESSAGES]: 'Reply to messages',
  [PERMISSIONS.APPROVE_PAYMENTS]: 'Approve payments',
  [PERMISSIONS.MANAGE_ANNOUNCEMENTS]: 'Manage announcements',
  [PERMISSIONS.VIEW_REPORTS]: 'View reports',
  [PERMISSIONS.VIEW_ASSIGNED_STUDENTS]: 'View assigned students',
  [PERMISSIONS.POST_FEEDBACK]: 'Post feedback',
  [PERMISSIONS.VIEW_LESSON_MATERIALS]: 'View lesson materials',
  [PERMISSIONS.LIMITED_ACADEMIC_TOOLS]: 'Limited academic tools',
  [PERMISSIONS.ACCESS_LEARNING_TOOLS]: 'Access learning tools',
  [PERMISSIONS.MESSAGE_ADMIN_IF_ENABLED]: 'Message admin (if enabled)',
  [PERMISSIONS.VIEW_OWN_PROGRESS]: 'View own progress',
  [PERMISSIONS.ACCESS_LIBRARY]: 'Access library',
};

export const ROLE_DEFINITIONS = {
  Admin: {
    title: 'Admin',
    subtitle: 'Full control',
    accent: 'red',
    icon: 'shield',
    permissions: [
      PERMISSIONS.FULL_PLATFORM_CONTROL,
      PERMISSIONS.MANAGE_ALL_USERS_AND_ROLES,
      PERMISSIONS.DELETE_DATA,
      PERMISSIONS.SYSTEM_SETTINGS,
      PERMISSIONS.BILLING_AND_PAYMENTS,
      PERMISSIONS.ALL_COADMIN_PERMISSIONS,
    ],
  },
  'Co-Admin': {
    title: 'Co-Admin',
    subtitle: 'Operational control',
    accent: 'amber',
    icon: 'briefcase',
    permissions: [
      PERMISSIONS.MANAGE_STUDENTS,
      PERMISSIONS.REPLY_TO_MESSAGES,
      PERMISSIONS.APPROVE_PAYMENTS,
      PERMISSIONS.MANAGE_ANNOUNCEMENTS,
      PERMISSIONS.VIEW_REPORTS,
    ],
  },
  Teacher: {
    title: 'Teacher',
    subtitle: 'Academic access',
    accent: 'blue',
    icon: 'graduation',
    permissions: [
      PERMISSIONS.VIEW_ASSIGNED_STUDENTS,
      PERMISSIONS.POST_FEEDBACK,
      PERMISSIONS.VIEW_LESSON_MATERIALS,
      PERMISSIONS.LIMITED_ACADEMIC_TOOLS,
    ],
  },
  Student: {
    title: 'Student',
    subtitle: 'Learning access',
    accent: 'green',
    icon: 'user',
    permissions: [
      PERMISSIONS.ACCESS_LEARNING_TOOLS,
      PERMISSIONS.MESSAGE_ADMIN_IF_ENABLED,
      PERMISSIONS.VIEW_OWN_PROGRESS,
      PERMISSIONS.ACCESS_LIBRARY,
    ],
  },
};

export function buildDefaultRolePermissions() {
  const entries = Object.entries(ROLE_DEFINITIONS).map(([roleName, definition]) => {
    const rolePermissions = definition.permissions.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    return [roleName, rolePermissions];
  });

  return Object.fromEntries(entries);
}

