import { normalizeSubjectIds, SUBJECT_IDS } from './subjects';

export const TEACHER_APPLICATION_FIELDS = Object.freeze({
  fullName: 'fullName',
  email: 'email',
  institutionQualified: 'institutionQualified',
  qualificationLevel: 'qualificationLevel',
  referenceContact: 'referenceContact',
  yearsOfExperience: 'yearsOfExperience',
  currentWorkplace: 'currentWorkplace',
  certificationsUploadReference: 'certificationsUploadReference',
  bio: 'bio',
  personalityDescription: 'personalityDescription',
  targetSubjects: 'targetSubjects',
});

export const TEACHER_PROFILE_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended',
});

function cleanString(value) {
  return String(value || '').trim();
}

function cleanEmail(value) {
  return cleanString(value).toLowerCase();
}

function cleanYearsOfExperience(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function buildTeacherApplicationPayload(application = {}) {
  const fullName = cleanString(application.fullName);
  const email = cleanEmail(application.email);
  const assignedSubjects = normalizeSubjectIds(application.targetSubjects);

  return {
    publicProfile: {
      name: fullName,
      bio: cleanString(application.bio),
      qualifications: cleanString(application.qualificationLevel),
      personalityDescription: cleanString(application.personalityDescription),
      assignedSubjects,
      profileStatus: TEACHER_PROFILE_STATUS.PENDING,
    },
    privateData: {
      verifiedEmail: email,
      institutionQualified: cleanString(application.institutionQualified),
      qualificationLevel: cleanString(application.qualificationLevel),
      referenceContact: cleanString(application.referenceContact),
      yearsOfExperience: cleanYearsOfExperience(application.yearsOfExperience),
      currentWorkplace: cleanString(application.currentWorkplace),
      certificationsUploadReference: cleanString(application.certificationsUploadReference),
      targetSubjects: assignedSubjects,
      adminNotes: '',
    },
  };
}

export const FOUNDER_TEACHER_PROFILE = Object.freeze({
  id: 'ustaath-haashim',
  uid: 'founder-ustaath-haashim',
  publicProfile: {
    name: 'Ustaath Haashim',
    bio: 'Founder of SirajOne, focused on Qur\'an learning, makharij, Islamic studies, and practical community education.',
    qualifications: 'Qualified Islamic educator and Qur\'an teacher',
    personalityDescription: 'Warm, structured, student-focused, and committed to helping learners build confidence through clear guidance and steady practice.',
    assignedSubjects: [
      SUBJECT_IDS.ARABIC,
      SUBJECT_IDS.QURAN_READING,
      SUBJECT_IDS.TAJWID,
      SUBJECT_IDS.MAKHARIJ,
    ],
    profileStatus: TEACHER_PROFILE_STATUS.APPROVED,
  },
  privateData: {
    verifiedEmail: 'sirajone7@gmail.com',
    institutionQualified: 'SirajOne',
    qualificationLevel: 'Founder and Lead Teacher',
    referenceContact: 'sirajone7@gmail.com',
    yearsOfExperience: 0,
    currentWorkplace: 'SirajOne',
    certificationsUploadReference: 'Founder profile seed record',
    targetSubjects: [
      SUBJECT_IDS.ARABIC,
      SUBJECT_IDS.QURAN_READING,
      SUBJECT_IDS.TAJWID,
      SUBJECT_IDS.MAKHARIJ,
    ],
    adminNotes: 'Initial founder teacher profile. Review and enrich private verification details in the admin panel when available.',
  },
});
