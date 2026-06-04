const createPlaceholderUnitLesson = (number) => ({
  id: `unit-${number}-lesson-${number}`,
  unitNumber: number,
  lessonNumber: number,
  title: `UNIT ${number} / LESSON ${number}`,
  subtitle: 'Part Two Reading Practice',
  rule: {
    title: 'Rule Placeholder',
    explanation:
      'The rule explanation from The Guided Reciter Part 2 will be mapped here for this exact unit and lesson.',
  },
  gridItems: [
    { id: `u${number}-a1`, arabicText: '', isHighlighted: false, audioUrl: '' },
    { id: `u${number}-a2`, arabicText: '', isHighlighted: false, audioUrl: '' },
    { id: `u${number}-a3`, arabicText: '', isHighlighted: false, audioUrl: '' },
    { id: `u${number}-a4`, arabicText: '', isHighlighted: false, audioUrl: '' },
  ],
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
  ...Array.from({ length: 22 }, (_, index) => createPlaceholderUnitLesson(index + 2)),
];
