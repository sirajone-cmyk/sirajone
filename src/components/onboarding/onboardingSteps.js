import { ROLES } from '@/lib/roles';

export const ONBOARDING_DEFAULT_STATE = {
  hasCompletedTour: false,
  currentStepIndex: 0,
};

export const PREVIEW_TOUR_STEPS = [
  {
    id: 'preview-welcome',
    title: 'Welcome to SirajOne',
    body: 'SirajOne brings learning, practice, teacher review, Islamic guidance support, and digital resources into one guided Islamic education platform.',
  },
  {
    id: 'preview-path',
    title: 'A Clear Learning Path',
    body: 'Students move through Letter Guide, Practical Workbook, Part Two, Tajwid Kitaab, and later advanced stages with teacher support.',
  },
  {
    id: 'preview-approval',
    title: 'Safe Roles and Approval',
    body: 'Students can begin learning, while teachers and support providers enter an approval journey before accessing their professional dashboards.',
  },
  {
    id: 'preview-help',
    title: 'Support Inside the App',
    body: 'Messaging, teacher review, guidance requests, and account guidance reduce the need for manual WhatsApp explanations.',
    feedback: true,
  },
];

export const ROLE_TOUR_STEPS = {
  [ROLES.STUDENT]: [
    {
      id: 'student-welcome',
      title: 'Welcome and Steps to Becoming a Hafiz',
      body: 'Your journey is structured in stages: Letter Guide, Practical Workbook, Part Two, Tajwid Kitaab, and future memorisation support.',
      target: '[data-tour="learning-path"], a[href="/letters"]',
    },
    {
      id: 'student-teachers',
      title: 'Finding Your Lifelong Teacher',
      body: 'Use the teacher browser to find approved SirajOne teachers by subject, profile, and learning pathway.',
      target: 'a[href="/teachers"]',
    },
    {
      id: 'student-audio',
      title: 'Practising and Submitting Audio',
      body: 'Listen, record, replay, and submit your recitation for teacher review when you are satisfied with your practice.',
      target: 'a[href="/practice-workbook"], a[href="/part-two-workbook"], a[href="/letters"]',
    },
    {
      id: 'student-support',
      title: 'Getting Support',
      body: 'Use Messages, Contact, and the support areas to ask for help without losing your place in the learning path.',
      target: 'a[href="/messages"], a[href="/contact"]',
      feedback: true,
    },
  ],
  [ROLES.TEACHER]: [
    {
      id: 'teacher-welcome',
      title: 'Welcome to the Digital Madrasa',
      body: 'Your teacher workspace is designed to help you track active students, completed work, and review queues clearly.',
      target: 'a[href="/teacher"], a[href="/teacher-portal"]',
    },
    {
      id: 'teacher-queues',
      title: 'Managing the Stage Queues',
      body: 'Student submissions are grouped by learning stage and review status: Pending, Approved, and Needs Improvement.',
      target: '[data-tour="teacher-stage-queues"], a[href="/teacher"]',
    },
    {
      id: 'teacher-feedback',
      title: 'Recording Audio Corrections',
      body: 'Use the native voice feedback tools to send precise corrections back to students without leaving the dashboard.',
      target: '[data-tour="teacher-feedback"], a[href="/messages"]',
    },
    {
      id: 'teacher-policy',
      title: 'Support and Administration Policy Hub',
      body: 'Admin and support channels are available for account issues, student concerns, and teaching policy guidance.',
      target: 'a[href="/admin"], a[href="/messages"]',
      feedback: true,
    },
  ],
  [ROLES.COUNSELLOR]: [
    {
      id: 'counsellor-welcome',
      title: 'Welcome to SirajOne Islamic Guidance & Support Support',
      body: 'Your public profile only appears after approval, with naming and visibility rules kept consistent for safety and trust.',
      target: 'a[href="/counsellor"]',
    },
    {
      id: 'counsellor-cases',
      title: 'Handling Student Support Cases',
      body: 'Guidance requests and scheduling tools help you organise support cases with a calm, professional workflow.',
      target: '[data-tour="counselling-requests"], a[href="/counsellor"]',
    },
    {
      id: 'counsellor-messages',
      title: 'Secure Messages Layer',
      body: 'Use the internal messages area for privacy-aware communication with students and administrators.',
      target: 'a[href="/messages"]',
    },
    {
      id: 'counsellor-approval',
      title: 'Admin Approval Journey',
      body: 'Your registration, profile visibility, and access remain connected to the verification review pipeline.',
      target: 'a[href="/admin"], a[href="/counsellor"]',
      feedback: true,
    },
  ],
  [ROLES.COUNSELOR]: [],
  [ROLES.ADMIN]: [
    {
      id: 'admin-welcome',
      title: 'Welcome to SirajOne Administration',
      body: 'Use the admin area to manage approvals, users, learning activity, messages, finance, and platform safety.',
      target: 'a[href="/admin"]',
    },
    {
      id: 'admin-approvals',
      title: 'Approval Workflows',
      body: 'Teacher and support provider applications should be reviewed carefully before account activation.',
      target: 'a[href="/admin"]',
    },
    {
      id: 'admin-support',
      title: 'Support and Messaging',
      body: 'Messages and support tools help the team respond to students, teachers, and support providers from inside the platform.',
      target: 'a[href="/messages"]',
      feedback: true,
    },
  ],
  [ROLES.CO_ADMIN]: [],
};

ROLE_TOUR_STEPS[ROLES.COUNSELOR] = ROLE_TOUR_STEPS[ROLES.COUNSELLOR];
ROLE_TOUR_STEPS[ROLES.CO_ADMIN] = ROLE_TOUR_STEPS[ROLES.ADMIN];

export function getOnboardingStepsForRole(role) {
  return ROLE_TOUR_STEPS[role] || ROLE_TOUR_STEPS[ROLES.STUDENT];
}
