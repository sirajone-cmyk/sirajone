export const SUPPORT_PROFILE = {
  name: 'Counsellor Aisha Pierre',
  title: 'Student Support & Guidance',
  bio: 'Counsellor Aisha Pierre supports students and families in an educational setting with calm, practical guidance. She is known for helping learners stay emotionally steady, focused, and motivated through structured Islamic learning journeys.',
  highlights: [
    'Experienced in supporting large student communities',
    'Trusted by learners and parents for steady guidance',
    'Private support sessions available for students and families',
    'Suitable for learning support, mentoring, and general guidance',
  ],
  durations: [
    { label: '30 Minutes', key: '30m' },
    { label: '45 Minutes', key: '45m' },
    { label: '60 Minutes', key: '60m' },
  ],
  pricing: {
    currency: 'ZAR',
    editable: true,
    values: {
      '30m': null,
      '45m': null,
      '60m': null,
    },
  },
};

export const OFFICIAL_AUDIO_LIBRARY = {
  default: {
    src: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
    label: 'Official pronunciation sample',
  },
};

export const LESSON_SESSIONS = [
  {
    id: 'sess-101',
    title: 'Tajwid Foundations - Live Lesson',
    teacher: 'Ustadh Hashim bin Hussain',
    student: 'Ahmad S.',
    start: '2026-04-21T17:00:00+02:00',
    durationMinutes: 45,
    status: 'upcoming',
    mode: 'video',
  },
  {
    id: 'sess-102',
    title: 'Makharij Correction Session',
    teacher: 'Muallima Aneesa',
    student: 'Maryam A.',
    start: '2026-04-20T20:00:00+02:00',
    durationMinutes: 30,
    status: 'live',
    mode: 'audio',
  },
  {
    id: 'sess-103',
    title: 'Muraja\'ah Coaching',
    teacher: 'Qari Abbas',
    student: 'Yusuf K.',
    start: '2026-04-19T18:00:00+02:00',
    durationMinutes: 45,
    status: 'completed',
    mode: 'video',
  },
];

export const MESSAGE_THREADS = [
  {
    id: 'thr-1',
    name: 'Ustaath Hashim',
    role: 'Admin',
    unread: 1,
    messages: [
      { id: 'm1', from: 'them', text: 'Assalaamu alaykum. Please send your child\'s current sabaq level.', time: '2026-04-20T09:10:00+02:00' },
      { id: 'm2', from: 'me', text: 'Wa alaykum salaam. Current sabaq is lesson 12.', time: '2026-04-20T09:13:00+02:00' },
    ],
  },
  {
    id: 'thr-2',
    name: 'Azgar Tar',
    role: 'Student',
    unread: 0,
    messages: [
      { id: 'm3', from: 'them', text: 'Can we move tomorrow\'s class to 6:30 PM?', time: '2026-04-20T11:10:00+02:00' },
    ],
  },
  {
    id: 'thr-3',
    name: 'Muhammad Junaid Hoosen',
    role: 'Student',
    unread: 1,
    messages: [
      { id: 'm4', from: 'them', text: 'As-salaam-u-alaikum. I need help with Madd types.', time: '2026-04-20T13:40:00+02:00' },
    ],
  },
];

export const ROLE_CARDS = [
  {
    key: 'admin',
    title: 'Admin',
    subtitle: 'Full control',
    tone: 'border-[rgba(239,68,68,0.45)] bg-[rgba(127,29,29,0.23)] text-[#fecaca]',
    items: [
      'Manage all users and roles',
      'Manage sessions and pricing',
      'Reply to all messages',
      'Control finance and payouts',
    ],
  },
  {
    key: 'co-admin',
    title: 'Co-Admin',
    subtitle: 'Operational control',
    tone: 'border-[rgba(249,115,22,0.45)] bg-[rgba(120,53,15,0.23)] text-[#fed7aa]',
    items: [
      'Manage students and sessions',
      'Reply to messages',
      'Approve payments and announcements',
      'Cannot change core owner settings',
    ],
  },
  {
    key: 'teacher',
    title: 'Teacher',
    subtitle: 'Academic access',
    tone: 'border-[rgba(56,189,248,0.4)] bg-[rgba(14,116,144,0.2)] text-[#bae6fd]',
    items: ['View assigned students', 'Upload lesson notes', 'Share feedback', 'Limited tool access'],
  },
  {
    key: 'student',
    title: 'Student',
    subtitle: 'Learning access',
    tone: 'border-[rgba(34,197,94,0.4)] bg-[rgba(20,83,45,0.24)] text-[#bbf7d0]',
    items: ['Access learning tools', 'Join sessions', 'Send messages (policy-based)', 'View own progress'],
  },
];

export const ROLE_USERS = [
  { name: 'Muhammad Junaid Hoosen', email: 'mjhoosen@alfalaah.org.za', role: 'Student', subscribed: false, joined: '15 Apr 2026' },
  { name: 'raid dindar', email: 'raid.dindar@gmail.com', role: 'Student', subscribed: false, joined: '13 Apr 2026' },
  { name: 'Azgar Tar', email: 'azgartar@gmail.com', role: 'Student', subscribed: true, joined: '2 Apr 2026' },
  { name: 'Ustaath Hashim', email: 'hashimhussein074@gmail.com', role: 'Teacher', subscribed: true, joined: '2 Apr 2026' },
  { name: 'Madrassa tahseenul Quraan', email: 'madrasatahseenuquraan@gmail.com', role: 'Admin', subscribed: true, joined: '2 Apr 2026' },
];

export const PAYMENT_TRANSACTIONS = [
  { id: 'pay-1', sessionId: 'sess-101', recipient: 'Ustadh Hashim bin Hussain', gross: 500, status: 'pending' },
  { id: 'pay-2', sessionId: 'sess-102', recipient: 'Muallima Aneesa', gross: 350, status: 'paid' },
  { id: 'pay-3', sessionId: 'sess-103', recipient: 'Qari Abbas', gross: 450, status: 'paid' },
];

export const PLATFORM_SPLIT = {
  teacherPercent: 70,
  platformPercent: 30,
};

