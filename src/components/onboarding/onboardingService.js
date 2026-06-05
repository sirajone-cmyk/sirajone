import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const buildDefaultOnboardingState = (overrides = {}) => ({
  hasCompletedTour: false,
  currentStepIndex: 0,
  lastActiveTimestamp: serverTimestamp(),
  ...overrides,
});

export async function ensureOnboardingState(userId) {
  if (!userId) return { hasCompletedTour: true, currentStepIndex: 0 };

  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  const data = snapshot.exists() ? snapshot.data() : {};
  const onboarding = data.onboarding || {};

  const hasValidState =
    typeof onboarding.hasCompletedTour === 'boolean' &&
    Number.isInteger(onboarding.currentStepIndex);

  if (hasValidState) {
    await setDoc(
      userRef,
      { onboarding: { ...onboarding, lastActiveTimestamp: serverTimestamp() } },
      { merge: true }
    );
    return onboarding;
  }

  const defaultState = buildDefaultOnboardingState();
  await setDoc(userRef, { onboarding: defaultState }, { merge: true });
  return { hasCompletedTour: false, currentStepIndex: 0 };
}

export async function syncOnboardingStep(userId, currentStepIndex) {
  if (!userId) return;
  await updateDoc(doc(db, 'users', userId), {
    'onboarding.currentStepIndex': currentStepIndex,
    'onboarding.lastActiveTimestamp': serverTimestamp(),
  });
}

export async function completeOnboarding(userId) {
  if (!userId) return;
  await updateDoc(doc(db, 'users', userId), {
    'onboarding.hasCompletedTour': true,
    'onboarding.currentStepIndex': 0,
    'onboarding.lastActiveTimestamp': serverTimestamp(),
  });
}

export async function restartOnboarding(userId) {
  if (!userId) return;
  await setDoc(
    doc(db, 'users', userId),
    { onboarding: buildDefaultOnboardingState({ hasCompletedTour: false, currentStepIndex: 0 }) },
    { merge: true }
  );
}

export async function submitOnboardingFeedback({ userId, role, email, displayName, stepId, feedback }) {
  const cleanFeedback = String(feedback || '').trim();
  if (!cleanFeedback) return;

  await addDoc(collection(db, 'onboarding_feedback'), {
    userId: userId || null,
    role: role || null,
    email: email || null,
    displayName: displayName || null,
    stepId: stepId || null,
    feedback: cleanFeedback,
    createdAt: serverTimestamp(),
  });
}
