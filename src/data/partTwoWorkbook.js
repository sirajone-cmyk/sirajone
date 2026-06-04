const createPlaceholderLesson = (lessonNumber) => ({
  id: `lesson-${lessonNumber}`,
  lessonNumber,
  title: `Lesson ${lessonNumber}: Part Two Reading Practice`,
  rule: {
    title: 'Rule Placeholder',
    explanation: 'The rule explanation from The Guided Reciter Part 2 will be mapped here for this exact lesson.',
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
    id: 'lesson-1',
    lessonNumber: 1,
    title: 'Lesson 1: Madd and Lengthening Rules',
    rule: {
      title: 'The Rule of Madd Asli',
      explanation: 'When a letter of Madd is followed by a non-Hamzah letter, lengthen the sound for 2 counts.',
    },
    examples: [
      { id: 'ex-1', arabicText: '?????', audioUrl: '' },
      { id: 'ex-2', arabicText: '?????', audioUrl: '' },
      { id: 'ex-3', arabicText: '???????', audioUrl: '' },
      { id: 'ex-4', arabicText: '?????????', audioUrl: '' },
    ],
  },
  ...Array.from({ length: 22 }, (_, index) => createPlaceholderLesson(index + 2)),
];
