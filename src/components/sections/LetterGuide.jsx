import React from 'react';
import { LetterLessonExperience } from '../letters/LetterLessonExperience';

export function LetterGuideSection() {
  return (
    <LetterLessonExperience
      sectionId="letters"
      eyebrow="Interactive Guide"
      title="Letter Lessons"
      subtitle="Only completed lessons are shown right now. Open Hamzah or Bā’ and use the same lesson workspace students, admins, and future teachers will share."
      mode="section"
    />
  );
}
