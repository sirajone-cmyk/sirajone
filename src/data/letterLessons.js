export const LETTER_LESSON_TABS = [
  { key: 'makhraj', label: 'Makhraj' },
  { key: 'sifaat', label: 'Sifaat' },
  { key: 'steps', label: 'Steps' },
  { key: 'diagram', label: 'Diagram' },
  { key: 'practice', label: 'Practice' },
];

export const LETTER_LESSONS = [
  {
    id: 'hamzah',
    audioKey: '1',
    lessonNumber: 1,
    totalLetters: 28,
    letter: 'أ',
    englishName: 'Alif / Hamzah',
    arabicName: 'الألف / الهمزة',
    cardTitle: 'Letter 1 of 28: Alif / Hamzah',
    openLabel: 'Open Hamzah Lesson',
    modalTitle: 'Hamzah Lesson Workspace',
    practiceAudioLabel: 'Hamzah - Official Audio',
    practiceFallbackText: 'Ah. Hamzah. Ah.',
    practiceFallbackDurationMs: 2600,
    makhrajTitle: 'Makhraj — Articulation Point',
    makhrajParagraphs: [
      'Hamzah (ء) comes from the deepest part of the throat.',
      'It is made by closing the throat completely, then opening it suddenly to release the sound.',
      'It feels like a small stop and release in the throat.',
      'Alif (ا), when it follows Hamzah, does not create a new sound by itself. It only lengthens the Hamzah sound.',
    ],
    sifaatTitle: 'Ṣifāt — Qualities of this Letter',
    sifaat: [
      {
        heading: '1. Jahr — جَهْرٌ',
        simpleMeaning: 'Voiced',
        explanation: 'The vocal cords vibrate when this sound is produced.',
      },
      {
        heading: '2. Shiddah — شِدَّةٌ',
        simpleMeaning: 'Complete stoppage',
        explanation: 'The sound is fully blocked before it is released.',
      },
      {
        heading: '3. Istifāl — اِسْتِفَالٌ',
        simpleMeaning: 'Light letter',
        explanation: 'The tongue stays low and the sound remains light, not heavy.',
      },
      {
        heading: '4. Infitāḥ — اِنْفِتَاحٌ',
        simpleMeaning: 'Open mouth',
        explanation: 'The palate and tongue do not seal together while the sound is made.',
      },
      {
        heading: '5. Iṣmāt — إِصْمَاتٌ',
        simpleMeaning: 'Restricted root usage',
        explanation:
          'This letter is not usually found alone at the beginning of Arabic root words and is commonly paired with other letters.',
      },
    ],
    stepsTitle: 'Step-by-Step Placement Guide',
    steps: [
      {
        title: 'Step 1 — Placement',
        text:
          'Tighten the throat at its deepest point. No tongue or lip movement is needed. The sound is held fully in the throat.',
      },
      {
        title: 'Step 2 — Airflow',
        text:
          'Air is stopped completely at the glottis, then released suddenly to create the Hamzah sound.',
      },
      {
        title: 'Step 3 — Teaching Note',
        text:
          'Imagine squeezing a tube fully shut, then letting it pop open. That clean throat release is Hamzah.',
      },
    ],
    diagramLabel: 'Makhraj Diagram — Alif / Hamzah',
    diagramSrc: '/hamzah-diagram.png',
    diagramAlt: 'Hamzah articulation diagram',
    practicePrompt:
      'Listen to the model pronunciation first, then record your own recitation and review it.',
    practiceLoopNote: 'This is a manual self-awareness practice loop.',
    futureWorkspace: {
      teacherResources: [],
      uploadedFiles: [],
      liveSessionId: null,
    },
  },
  {
    id: 'ba',
    audioKey: '2',
    lessonNumber: 2,
    totalLetters: 28,
    letter: 'ب',
    englishName: 'Bā’',
    arabicName: 'الباء',
    cardTitle: "Letter 2 of 28: Bā’",
    openLabel: 'Open Bā’ Lesson',
    modalTitle: "Bā’ Lesson Workspace",
    practiceAudioLabel: "Bā’ - Official Audio",
    practiceFallbackText: 'Baa. Ba. Baa.',
    practiceFallbackDurationMs: 2200,
    makhrajTitle: 'Makhraj — Articulation Point',
    makhrajParagraphs: [
      'Bā’ (ب) is produced from the two lips.',
      'Both lips close completely, the air is stopped, and then the lips open quickly to release the sound.',
      'It feels like a gentle pop from the lips.',
      'When Bā’ carries sukūn, the release can be taught clearly through controlled qalqalah practice.',
    ],
    sifaatTitle: 'Ṣifāt — Qualities of this Letter',
    sifaat: [
      {
        heading: '1. Jahr — جَهْرٌ',
        simpleMeaning: 'Voiced',
        explanation: 'The vocal cords vibrate while the sound is produced.',
      },
      {
        heading: '2. Shiddah — شِدَّةٌ',
        simpleMeaning: 'Complete stoppage',
        explanation: 'The sound is fully blocked at the lips before release.',
      },
      {
        heading: '3. Istifāl — اِسْتِفَالٌ',
        simpleMeaning: 'Light letter',
        explanation: 'The tongue remains low, so the letter stays light rather than heavy.',
      },
      {
        heading: '4. Infitāḥ — اِنْفِتَاحٌ',
        simpleMeaning: 'Open mouth',
        explanation: 'The tongue and palate do not seal together while producing the sound.',
      },
      {
        heading: '5. Iṣmāt — إِصْمَاتٌ',
        simpleMeaning: 'Restricted root usage',
        explanation: 'This letter is one of the letters described under Iṣmāt in classical Tajwid study.',
      },
      {
        heading: '6. Qalqalah — قَلْقَلَةٌ',
        simpleMeaning: 'Echo when still',
        explanation: 'When Bā’ has sukūn, a controlled bounce is heard at release.',
      },
    ],
    stepsTitle: 'Step-by-Step Placement Guide',
    steps: [
      {
        title: 'Step 1 — Placement',
        text:
          'Close both lips fully and gently. The tongue rests naturally and does not shape the sound.',
      },
      {
        title: 'Step 2 — Airflow',
        text:
          'Air builds behind the closed lips. When the lips open, the blocked air releases as a clear “b” sound.',
      },
      {
        title: 'Step 3 — Teaching Note',
        text:
          'Press the lips together, hold the air for a moment, then let them pop open. That lip release is Bā’.',
      },
    ],
    diagramLabel: "Makhraj Diagram — Bā’",
    diagramSrc: '/ba-diagram.png',
    diagramAlt: 'Bā articulation diagram',
    practicePrompt:
      'Listen to the model pronunciation first, then record your own recitation and review it.',
    practiceLoopNote: 'This is a manual self-awareness practice loop.',
    futureWorkspace: {
      teacherResources: [],
      uploadedFiles: [],
      liveSessionId: null,
    },
  },
];

export const DEFAULT_LETTER_LESSON_ID = LETTER_LESSONS[0]?.id || 'hamzah';

export const LETTER_LESSON_MAP = LETTER_LESSONS.reduce((accumulator, lesson) => {
  accumulator[lesson.id] = lesson;
  return accumulator;
}, {});

// TODO: Backend lesson management can attach teacher-uploaded PDFs, slides, and live session
// metadata to each lesson's futureWorkspace object without changing the student/admin UI shell.
