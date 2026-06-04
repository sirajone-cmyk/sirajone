export const SUBJECTS = Object.freeze([
  { id: 'arabic', label: 'Arabic' },
  { id: 'quran-reading', label: 'Quran Reading' },
  { id: 'tajwid', label: 'Tajwid' },
  { id: 'hifz', label: 'Hifz' },
  { id: 'fiqh', label: 'Fiqh' },
  { id: 'dua', label: 'Dua' },
  { id: 'makharij', label: 'Makharij' },
]);

export const SUBJECT_IDS = Object.freeze(
  SUBJECTS.reduce((acc, subject) => {
    acc[subject.id.toUpperCase().replace(/-/g, '_')] = subject.id;
    return acc;
  }, {})
);

export const SUBJECT_LABELS = Object.freeze(
  SUBJECTS.reduce((acc, subject) => {
    acc[subject.id] = subject.label;
    return acc;
  }, {})
);

export function isValidSubjectId(subjectId) {
  return SUBJECTS.some((subject) => subject.id === subjectId);
}

export function normalizeSubjectIds(subjectIds = []) {
  if (!Array.isArray(subjectIds)) return [];
  return [...new Set(subjectIds.filter(isValidSubjectId))];
}

export function getSubjectLabel(subjectId) {
  return SUBJECT_LABELS[subjectId] || subjectId;
}
