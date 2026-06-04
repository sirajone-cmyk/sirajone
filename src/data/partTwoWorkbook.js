const createPlaceholderUnitLesson = (number) => ({
  id: `unit-${number}-lesson-${number}`,
  unitNumber: number,
  lessonNumber: number,
  title: `UNIT ${number} / LESSON ${number}`,
  subtitle: 'Part Two Reading Practice',
  rule: {
    title: 'Rule Placeholder',
    explanation: 'The rule explanation from The Guided Reciter Part 2 will be mapped here for this exact unit and lesson.',
  },
  examples: [
    { id: 'ex-1', arabicText: '', audioUrl: '' },
    { id: 'ex-2', arabicText: '', audioUrl: '' },
    { id: 'ex-3', arabicText: '', audioUrl: '' },
    { id: 'ex-4', arabicText: '', audioUrl: '' },
  ],
});

export const partTwoWorkbookLessons = [
  {
    id: 'unit-1-lesson-1',
    unitNumber: 1,
    lessonNumber: 1,
    title: 'UNIT 1 / LESSON 1',
    subtitle: 'Sukun & Dammatain',
    rule: {
      title: 'The Rule - Sukun and Dammatain',
      explanation:
        'The Sukun is a small oval that sits above a letter. It cuts off the sound of the letter so the letter is read short and closed, with no vowel following it. It also joins two letters together when reading. Dammatain is the first type of Tanwin. It appears as two Dammahs stacked above a letter and contains a hidden Nun Sakinah sound at the end.',
    },
    examples: [
      { id: 'ex-1', arabicText: 'دٌ', audioUrl: '' },
      { id: 'ex-2', arabicText: 'دُنْ', audioUrl: '' },
      { id: 'ex-3', arabicText: 'هٌ', audioUrl: '' },
      { id: 'ex-4', arabicText: 'هُنْ', audioUrl: '' },
    ],
  },
  ...Array.from({ length: 22 }, (_, index) => createPlaceholderUnitLesson(index + 2)),
];