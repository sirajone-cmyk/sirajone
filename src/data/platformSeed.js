export const TEACHERS = [
  {
    name: "Ustadh Hashim bin Hussain",
    experience: "15+ years",
    subjects: "Tajweed, Makharij, Quran Reading",
    audience: "Brothers & Sisters",
    featured: true,
    bio: "Founder and lead teacher focused on precise recitation and structured spiritual learning.",
  },
  {
    name: "Ustadh Yusuf Ismail",
    experience: "10 years",
    subjects: "Tajweed Foundations",
    audience: "Brothers",
    bio: "Specialises in beginner progression and pronunciation correction.",
  },
  {
    name: "Ustadh Khalid Ahmed",
    experience: "9 years",
    subjects: "Hifz and Murajaah",
    audience: "Brothers",
    bio: "Builds consistent revision systems for long-term retention.",
  },
  {
    name: "Ustadh Salman Patel",
    experience: "8 years",
    subjects: "Reading Quran Part 1 and 2",
    audience: "Brothers",
    bio: "Known for clear, step-by-step teaching methods for children.",
  },
  {
    name: "Ustadh Musa Khan",
    experience: "7 years",
    subjects: "Advanced Tajweed",
    audience: "Brothers",
    bio: "Supports intermediate learners transitioning to fluent recitation.",
  },
  {
    name: "Ustadhah Amina Suliman",
    experience: "11 years",
    subjects: "Tajweed, Reading, Adab",
    audience: "Sisters",
    bio: "Experienced in child-friendly and parent-guided learning plans.",
  },
  {
    name: "Ustadhah Ruqayyah Mahomed",
    experience: "8 years",
    subjects: "Hifz and Murajaah",
    audience: "Sisters",
    bio: "Focuses on disciplined memorisation and revision pathways.",
  },
  {
    name: "Ustadhah Maryam Khan",
    experience: "6 years",
    subjects: "Beginner Quran Reading",
    audience: "Sisters",
    bio: "Helps new students gain confidence in script and sound.",
  },
  {
    name: "Ustadhah Fatimah Hoosen",
    experience: "9 years",
    subjects: "Makharij Correction",
    audience: "Sisters",
    bio: "Provides detailed articulation coaching and recitation refinement.",
  },
  {
    name: "Qari Abdul Rahman",
    experience: "12 years",
    subjects: "Tarteel and Voice Discipline",
    audience: "Brothers",
    bio: "Guides students in controlled, balanced, and beautiful recitation.",
  },
  {
    name: "Qariah Sumayyah Ibrahim",
    experience: "10 years",
    subjects: "Applied Tajweed Practice",
    audience: "Sisters",
    bio: "Integrates theory and repetition for strong practical outcomes.",
  },
];

export const LIBRARY_CATEGORIES = [
  "Aqidah",
  "Tajweed",
  "Quran Reading",
  "Hifz",
  "Murajaah",
  "Fiqh",
  "Hadith",
  "Tafsir",
  "Dua",
  "Parent Guides",
];

export const INITIAL_LIBRARY_ITEMS = [
  {
    title: "Tajweed Fundamentals Workbook",
    category: "Tajweed",
    description: "Core articulation and sifah drills for beginners.",
  },
  {
    title: "Daily Murajaah Planner",
    category: "Murajaah",
    description: "A practical revision schedule for consistency.",
  },
  {
    title: "Parent Guide: Supporting Quran Practice",
    category: "Parent Guides",
    description: "Simple home routines for healthy learning habits.",
  },
  {
    title: "Intro to Makharij",
    category: "Quran Reading",
    description: "A beginner visual and written articulation guide.",
  },
];

export const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Ahmad S.",
    subscribed: true,
    active: true,
    completion: 38,
    sabaq: "Lesson 6",
    awal: "Surah Mulk",
    akhir: "Surah Yaseen",
    feedback: "Good consistency. Focus on Hamzah clarity.",
  },
  {
    id: 2,
    name: "Maryam A.",
    subscribed: false,
    active: true,
    completion: 62,
    sabaq: "Lesson 11",
    awal: "Surah Waqiah",
    akhir: "Surah Kahf",
    feedback: "Excellent rhythm. Improve Taa heaviness.",
  },
  {
    id: 3,
    name: "Yusuf K.",
    subscribed: true,
    active: false,
    completion: 21,
    sabaq: "Lesson 3",
    awal: "Surah Mulk",
    akhir: "Surah Ikhlas",
    feedback: "Rejoining soon. Keep review short and frequent.",
  },
];

export const INITIAL_MESSAGES = [
  {
    from: "student",
    name: "Ahmad S.",
    text: "Assalaamu alaykum, may I shift my lesson time this week?",
    time: "09:10",
  },
  {
    from: "admin",
    name: "Admin",
    text: "Wa alaykum salaam. Yes, please choose an available evening slot.",
    time: "09:15",
  },
];
