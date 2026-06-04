const CELL_IDS = [
  'a1', 'a2', 'a3', 'a4',
  'b1', 'b2', 'b3', 'b4',
  'c1', 'c2', 'c3', 'c4',
  'd1', 'd2', 'd3', 'd4',
  'e1', 'e2', 'e3', 'e4',
  'f1', 'f2', 'f3', 'f4',
  'g1', 'g2', 'g3', 'g4',
];

const ARABIC_SKELETON_ROWS = [
  ['بً', 'تً', 'ثً', 'جً'],
  ['حً', 'خً', 'دً', 'ذً'],
  ['رً', 'زً', 'سً', 'شً'],
  ['صً', 'ضً', 'طً', 'ظً'],
  ['عً', 'غً', 'فً', 'قً'],
  ['كً', 'لً', 'مً', 'نً'],
  ['هً', 'وً', 'يً', 'ءً'],
];

const LESSON_SUBTITLES = {
  2: 'Kasratain Practice',
  3: 'Fathatain Practice',
  4: 'Joining with Sukun',
  5: 'Short Vowel Control',
  6: 'Mixed Tanween Reading',
  7: 'Closed Sound Practice',
  8: 'Heavy and Light Sounds',
  9: 'Tongue Letter Fluency',
  10: 'Throat Letter Fluency',
  11: 'Lip Letter Fluency',
  12: 'Qalqalah Awareness',
  13: 'Smooth Word Reading',
  14: 'Two-Letter Joining',
  15: 'Three-Letter Joining',
  16: 'Word Recognition',
  17: 'Breath and Flow',
  18: 'Reading Accuracy',
  19: 'Rhythm and Control',
  20: 'Mixed Practice One',
  21: 'Mixed Practice Two',
  22: 'Revision and Fluency',
  23: 'Final Reading Bridge',
};

const RULE_TITLES = {
  2: 'Reading Practice Placeholder',
  3: 'Reading Practice Placeholder',
  4: 'Reading Practice Placeholder',
  5: 'Reading Practice Placeholder',
  6: 'Reading Practice Placeholder',
  7: 'Reading Practice Placeholder',
  8: 'Reading Practice Placeholder',
  9: 'Reading Practice Placeholder',
  10: 'Reading Practice Placeholder',
  11: 'Reading Practice Placeholder',
  12: 'Reading Practice Placeholder',
  13: 'Reading Practice Placeholder',
  14: 'Reading Practice Placeholder',
  15: 'Reading Practice Placeholder',
  16: 'Reading Practice Placeholder',
  17: 'Reading Practice Placeholder',
  18: 'Reading Practice Placeholder',
  19: 'Reading Practice Placeholder',
  20: 'Reading Practice Placeholder',
  21: 'Reading Practice Placeholder',
  22: 'Reading Practice Placeholder',
  23: 'Reading Practice Placeholder',
};

const getSkeletonArabicText = (lessonNumber, cellIndex) => {
  const row = ARABIC_SKELETON_ROWS[Math.floor(cellIndex / 4)];
  const baseText = row[cellIndex % 4];

  if (lessonNumber % 3 === 0) return baseText.replace('ً', 'ٍ');
  if (lessonNumber % 3 === 1) return baseText.replace('ً', 'ٌ');

  return baseText;
};

const buildAudioUrl = (lessonNumber, cellId) => {
  if (lessonNumber === 1) return 'https://itvarsity.org';

  return `https://itvarsity.org/part-two/lesson-${lessonNumber}/${cellId}.mp3`;
};

const createGridItemsForLesson = (lessonNumber) =>
  CELL_IDS.map((cellId, index) => ({
    id: cellId,
    arabicText: getSkeletonArabicText(lessonNumber, index),
    isHighlighted: index % 4 === 3 && lessonNumber <= 6,
    audioUrl: buildAudioUrl(lessonNumber, cellId),
  }));

const createUnitLesson = (number) => ({
  id: `unit-${number}-lesson-${number}`,
  unitNumber: number,
  lessonNumber: number,
  title: `UNIT ${number} / LESSON ${number}`,
  subtitle: LESSON_SUBTITLES[number] || 'Part Two Reading Practice',
  rule: {
    title: RULE_TITLES[number] || 'Reading Practice Placeholder',
    explanation:
      'The rule explanation from The Guided Reciter Part 2 will be mapped here for this exact unit and lesson. The practice grid below remains active so students can listen, record, replay, and prepare for teacher correction.',
  },
  gridItems: createGridItemsForLesson(number),
});

export const partTwoWorkbookLessons = [
  {
    id: 'unit-1-lesson-1',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'UNIT 1 / LESSON 1',
    subtitle: 'THE TANWEEN (5 days)',
    rule: {
      title: 'The Rules of Sukun & Dammatain',
      explanation:
        "The Sukun cuts off a letter's sound and joins letters together. Dammatain contains a hidden Nun Sakinah sound. Notice how the pronunciation of a Dammah followed by a Sukun is identical to a Dammatain mark.",
    },
    gridItems: [
      // Row 1: stored right-to-left to match the physical page.
      { id: 'a1', arabicText: 'دٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'a2', arabicText: 'دُنْ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'a3', arabicText: 'دُ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'a4', arabicText: 'دُنْ', isHighlighted: true, audioUrl: 'https://itvarsity.org' },

      // Row 2
      { id: 'b1', arabicText: 'ةٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'b2', arabicText: 'ةُ نْ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'b3', arabicText: 'ةُ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'b4', arabicText: 'ةُ نْ', isHighlighted: true, audioUrl: 'https://itvarsity.org' },

      // Row 3
      { id: 'c1', arabicText: 'لٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'c2', arabicText: 'لُنْ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'c3', arabicText: 'لُ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'c4', arabicText: 'لُ نْ', isHighlighted: true, audioUrl: 'https://itvarsity.org' },

      // Row 4
      { id: 'd1', arabicText: 'مٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'd2', arabicText: 'مُنْ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'd3', arabicText: 'مُ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'd4', arabicText: 'مُ نْ', isHighlighted: true, audioUrl: 'https://itvarsity.org' },

      // Row 5: words block.
      { id: 'e1', arabicText: 'ثِمٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'e2', arabicText: 'وَةٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'e3', arabicText: 'عَلٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'e4', arabicText: 'حَدٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },

      // Row 6
      { id: 'f1', arabicText: 'سِعٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'f2', arabicText: 'تِبٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'f3', arabicText: 'رِضٌ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'f4', arabicText: 'فُرٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },

      // Row 7
      { id: 'g1', arabicText: 'رُءٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'g2', arabicText: 'اَخٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'g3', arabicText: 'نَنٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
      { id: 'g4', arabicText: 'رَجٌّ', isHighlighted: false, audioUrl: 'https://itvarsity.org' },
    ],
  },
  ...Array.from({ length: 22 }, (_, index) => createUnitLesson(index + 2)),
];