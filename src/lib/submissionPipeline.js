import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';

export const PIPELINE_STAGES = {
  LETTER_GUIDE: 'letter_guide',
  PRACTICAL_WORKBOOK: 'practical_workbook',
  PART_TWO: 'part_two',
  MURSHIDUL_QARI: 'murshidul_qari',
  HIFZ: 'hifz',
};

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  NEEDS_IMPROVEMENT: 'needs_improvement',
};

export const PIPELINE_STAGE_OPTIONS = [
  { id: PIPELINE_STAGES.LETTER_GUIDE, label: 'Letter Guide' },
  { id: PIPELINE_STAGES.PRACTICAL_WORKBOOK, label: 'Practical Workbook' },
  { id: PIPELINE_STAGES.PART_TWO, label: 'Part Two' },
  { id: PIPELINE_STAGES.MURSHIDUL_QARI, label: 'Murshidul Qari' },
  { id: PIPELINE_STAGES.HIFZ, label: 'Hifz' },
];

export const STATUS_LABELS = {
  [SUBMISSION_STATUS.PENDING]: 'Submitted / Awaiting Review',
  [SUBMISSION_STATUS.APPROVED]: 'Teacher Approved',
  [SUBMISSION_STATUS.NEEDS_IMPROVEMENT]: 'Needs Improvement - Retry',
};

export function getStatusTone(status) {
  if (status === SUBMISSION_STATUS.APPROVED) return 'emerald';
  if (status === SUBMISSION_STATUS.NEEDS_IMPROVEMENT) return 'red';
  return 'amber';
}

export function getStageLabel(stage) {
  return PIPELINE_STAGE_OPTIONS.find((item) => item.id === stage)?.label || stage;
}

export function resolveAssignedTeacherId(user) {
  return (
    user?.teacherId ||
    user?.assignedTeacherId ||
    user?.assigned_teacher_id ||
    user?.teacher_uid ||
    user?.primaryTeacherId ||
    ''
  );
}

export function buildSubmissionStoragePath({ studentId, stage, lessonId, itemId, role = 'student' }) {
  const cleanLesson = String(lessonId || 'lesson').replace(/[^a-zA-Z0-9_-]/g, '-');
  const cleanItem = String(itemId || 'item').replace(/[^a-zA-Z0-9_-]/g, '-');
  const timestamp = Date.now();
  return `submissions/${studentId}/${stage}/${cleanLesson}/${cleanItem}/${role}-${timestamp}.webm`;
}

export async function uploadReviewAudioBlob({ blob, studentId, stage, lessonId, itemId, role = 'student' }) {
  if (!blob) throw new Error('No audio recording was found.');
  if (!studentId) throw new Error('A signed-in user is required before audio can be uploaded.');

  const storagePath = buildSubmissionStoragePath({ studentId, stage, lessonId, itemId, role });
  const audioRef = ref(storage, storagePath);
  await uploadBytes(audioRef, blob, { contentType: blob.type || 'audio/webm' });
  const downloadUrl = await getDownloadURL(audioRef);

  return { storagePath, downloadUrl };
}

export async function createReviewSubmission({
  student,
  teacherId,
  stage,
  lessonId,
  itemId,
  audioBlob,
}) {
  const studentId = student?.uid;
  if (!studentId) throw new Error('Please sign in before sending a recording.');
  if (!teacherId) throw new Error('No teacher is assigned to this account yet.');

  const uploaded = await uploadReviewAudioBlob({
    blob: audioBlob,
    studentId,
    stage,
    lessonId,
    itemId,
    role: 'student',
  });

  const docRef = await addDoc(collection(db, 'submissions'), {
    studentId,
    studentName: student?.full_name || student?.displayName || student?.email || 'Student',
    studentEmail: student?.email || '',
    teacherId,
    stage,
    lessonId,
    itemId,
    studentAudioUrl: uploaded.downloadUrl,
    studentAudioPath: uploaded.storagePath,
    status: SUBMISSION_STATUS.PENDING,
    teacherFeedbackAudioUrl: null,
    teacherFeedbackAudioPath: null,
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateSubmissionReview({ submissionId, status, feedbackBlob, reviewer }) {
  if (!submissionId) throw new Error('Missing submission ID.');

  const payload = {
    status,
    reviewedBy: reviewer?.uid || '',
    reviewedByName: reviewer?.full_name || reviewer?.email || 'Teacher',
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (feedbackBlob) {
    const uploaded = await uploadReviewAudioBlob({
      blob: feedbackBlob,
      studentId: reviewer?.uid || 'teacher-feedback',
      stage: 'teacher_feedback',
      lessonId: submissionId,
      itemId: status,
      role: 'teacher',
    });
    payload.teacherFeedbackAudioUrl = uploaded.downloadUrl;
    payload.teacherFeedbackAudioPath = uploaded.storagePath;
  }

  await updateDoc(doc(db, 'submissions', submissionId), payload);
}

export async function clearRetrySubmission(submissionId) {
  if (!submissionId) return;
  await deleteDoc(doc(db, 'submissions', submissionId));
}

export async function fetchLatestSubmission({ studentId, stage, lessonId, itemId }) {
  if (!studentId) return null;

  const snapshot = await getDocs(query(
    collection(db, 'submissions'),
    where('studentId', '==', studentId),
    where('stage', '==', stage),
    where('lessonId', '==', lessonId),
    where('itemId', '==', itemId),
    orderBy('submittedAt', 'desc'),
    limit(1)
  ));

  if (snapshot.empty) return null;
  const firstDoc = snapshot.docs[0];
  return { id: firstDoc.id, ...firstDoc.data() };
}
