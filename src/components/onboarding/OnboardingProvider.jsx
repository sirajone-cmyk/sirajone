/**
 * OnboardingProvider.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore-streamed onboarding state for SirajOne.
 *
 * KEY CHANGE vs previous version
 * ───────────────────────────────
 * State is loaded via `onSnapshot` (real-time listener) instead of a one-time
 * `getDoc`.  This means:
 *   • Opening the app on a second device resumes at the exact saved step.
 *   • If the user completes or skips the tour on Device A while Device B has
 *     the overlay open, Device B's overlay closes automatically.
 *   • Step changes still write optimistically to Firestore via onboardingService
 *     so the UI never waits for a round trip.
 *
 * Two operating modes
 * ────────────────────
 * 'role'    – authenticated tour, all state synced to users/{userId}/onboarding
 * 'preview' – unauthenticated preview triggered by AuthGateway, purely in-memory
 *
 * Firestore schema (written/read under users/{userId})
 * ──────────────────────────────────────────────────────
 *   onboarding: {
 *     hasCompletedTour:    boolean   (default: false)
 *     currentStepIndex:    number    (default: 0)
 *     lastActiveTimestamp: Timestamp
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db }        from '@/lib/firebase';
import { useAuth }   from '@/lib/AuthContext';
import { PREVIEW_TOUR_STEPS, getOnboardingStepsForRole } from './onboardingSteps';
import {
  buildDefaultOnboardingState,
  completeOnboarding,
  restartOnboarding,
  submitOnboardingFeedback,
  syncOnboardingStep,
} from './onboardingService';
import { TourOverlay } from './TourOverlay';

// ── Context ───────────────────────────────────────────────────────────────────

export const OnboardingContext = createContext(null);

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDisplayName(user) {
  return user?.displayName || user?.fullName || user?.name || user?.email || 'SirajOne learner';
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isOpen,            setIsOpen]            = useState(false);
  const [mode,              setMode]              = useState('role');   // 'role' | 'preview'
  const [steps,             setSteps]             = useState([]);
  const [currentStepIndex,  setCurrentStepIndex]  = useState(0);
  const [targetRect,        setTargetRect]        = useState(null);
  const [feedback,          setFeedback]          = useState('');
  const [notice,            setNotice]            = useState('');
  const [isMobile,          setIsMobile]          = useState(false);

  // ── Refs for snapshot callback (avoids stale closures) ───────────────────
  // These mirror their state counterparts but are always current inside async
  // Firestore callbacks where captured state values would be stale.
  const isOpenRef           = useRef(false);
  const modeRef             = useRef('role');
  // True once the role tour has been auto-opened for the current user session.
  // Reset whenever user.uid changes (new login).
  const initialLoadDoneRef  = useRef(false);

  useEffect(() => { isOpenRef.current  = isOpen; },  [isOpen]);
  useEffect(() => { modeRef.current    = mode;   },  [mode]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const activeStep    = steps[currentStepIndex] || null;
  const progressLabel = steps.length
    ? `${currentStepIndex + 1} of ${steps.length}`
    : '0 of 0';

  // ── Viewport tracking ─────────────────────────────────────────────────────
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Spotlight target measurement ──────────────────────────────────────────
  const updateTargetRect = useCallback(() => {
    if (!isOpen || !activeStep?.target || typeof document === 'undefined') {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(activeStep.target);
    if (!el) { setTargetRect(null); return; }
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) { setTargetRect(null); return; }
    setTargetRect({
      top:    rect.top,
      left:   rect.left,
      right:  rect.right,
      bottom: rect.bottom,
      width:  rect.width,
      height: rect.height,
    });
  }, [activeStep, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, updateTargetRect]);

  // ── Flash notice helper ───────────────────────────────────────────────────
  const showNotice = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2800);
  }, []);

  // ── Reset per-session flag on user change ─────────────────────────────────
  useEffect(() => {
    initialLoadDoneRef.current = false;
  }, [user?.uid]);

  // ── Firestore real-time listener ──────────────────────────────────────────
  // Replaces the previous one-time getDoc / ensureOnboardingState call.
  // The listener fires on every document change, enabling:
  //   1. Initial load: open tour at the saved step index if not completed.
  //   2. Cross-device close: if completed on Device A, auto-close on Device B.
  useEffect(() => {
    // Guard: no user, auth still loading, or preview mode
    if (isLoadingAuth || !isAuthenticated || !user?.uid) return;

    const userId  = user.uid;
    const role    = user.role;
    const userRef = doc(db, 'users', userId);

    const unsubscribe = onSnapshot(
      userRef,
      async (snap) => {
        if (!snap.exists()) return;

        const onboarding = snap.data()?.onboarding;

        // ── Initialize missing onboarding field ──────────────────────────
        if (!onboarding || typeof onboarding.hasCompletedTour !== 'boolean') {
          try {
            await setDoc(
              userRef,
              { onboarding: buildDefaultOnboardingState() },
              { merge: true },
            );
          } catch (err) {
            console.error('[OnboardingProvider] Failed to init onboarding state:', err);
          }
          return; // Next snapshot will carry the initialised data
        }

        // ── Cross-device completion sync ─────────────────────────────────
        // If the tour was completed on another device, close it here.
        if (onboarding.hasCompletedTour && isOpenRef.current && modeRef.current === 'role') {
          setIsOpen(false);
          return;
        }

        // ── Auto-open: first snapshot after login ────────────────────────
        // `initialLoadDoneRef` ensures this block runs exactly once per
        // user session, even as subsequent step-writes trigger new snapshots.
        if (!onboarding.hasCompletedTour && !initialLoadDoneRef.current) {
          initialLoadDoneRef.current = true;

          const roleSteps  = getOnboardingStepsForRole(role);
          const safeIndex  = Math.min(
            Math.max(onboarding.currentStepIndex || 0, 0),
            roleSteps.length - 1,
          );

          setMode('role');
          setSteps(roleSteps);
          setCurrentStepIndex(safeIndex);
          setFeedback('');
          setIsOpen(true);
        }
      },
      (error) => {
        console.error('[OnboardingProvider] Firestore stream error:', error);
        showNotice('Onboarding could not be loaded right now. You can replay it from your dashboard.');
      },
    );

    return () => unsubscribe();
  }, [isLoadingAuth, isAuthenticated, user?.uid, user?.role, showNotice]);

  // ── Tour control callbacks ─────────────────────────────────────────────────

  const openTour = useCallback((nextSteps, nextMode, startIndex = 0) => {
    setMode(nextMode);
    setSteps(nextSteps);
    setCurrentStepIndex(startIndex);
    setFeedback('');
    setIsOpen(true);
  }, []);

  /** Open the unauthenticated preview tour — zero Firestore writes. */
  const startPreviewTour = useCallback(() => {
    openTour(PREVIEW_TOUR_STEPS, 'preview', 0);
  }, [openTour]);

  /** Restart the authenticated role tour from step 0. */
  const startRoleTour = useCallback(async () => {
    const roleSteps = getOnboardingStepsForRole(user?.role);
    if (user?.uid) await restartOnboarding(user.uid);
    openTour(roleSteps, 'role', 0);
  }, [openTour, user]);

  /** Alias used by Dashboard "Replay Tour" buttons. */
  const replayTour = useCallback(() => startRoleTour(), [startRoleTour]);

  const closeTour = useCallback(() => {
    setIsOpen(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setFeedback('');
  }, []);

  /**
   * Skip: close immediately and mark as complete in Firestore
   * (only for role tours; preview tours are in-memory only).
   */
  const skipTour = useCallback(async () => {
    if (mode === 'role' && user?.uid) {
      await completeOnboarding(user.uid);
    }
    closeTour();
  }, [closeTour, mode, user]);

  /**
   * Finish: optionally submit feedback, then complete.
   */
  const finishTour = useCallback(async () => {
    try {
      if (activeStep?.feedback && feedback.trim()) {
        await submitOnboardingFeedback({
          userId:      user?.uid,
          role:        user?.role,
          email:       user?.email,
          displayName: getDisplayName(user),
          stepId:      activeStep.id,
          feedback,
        });
      }
      if (mode === 'role' && user?.uid) {
        await completeOnboarding(user.uid);
      }
      closeTour();
      showNotice('Onboarding guide completed. You can replay it from your dashboard.');
    } catch {
      showNotice('We could not save that response. Please try again.');
    }
  }, [activeStep, closeTour, feedback, mode, showNotice, user]);

  /** Advance one step; write new index to Firestore (role tours only). */
  const goNext = useCallback(async () => {
    if (!steps.length) return;
    if (currentStepIndex >= steps.length - 1) {
      await finishTour();
      return;
    }
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    if (mode === 'role' && user?.uid) {
      await syncOnboardingStep(user.uid, nextIndex);
    }
  }, [currentStepIndex, finishTour, mode, steps.length, user]);

  /** Go back one step; write new index to Firestore (role tours only). */
  const goPrevious = useCallback(async () => {
    const prevIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(prevIndex);
    if (mode === 'role' && user?.uid) {
      await syncOnboardingStep(user.uid, prevIndex);
    }
  }, [currentStepIndex, mode, user]);

  // ── Context value ─────────────────────────────────────────────────────────
  // Expose enough surface for AuthGateway, DevTestingToolbar, Dashboard buttons.
  const contextValue = useMemo(
    () => ({
      isOpen,
      mode,
      currentStepIndex,
      totalSteps: steps.length,
      startPreviewTour,
      startRoleTour,
      replayTour,
      skipTour,
      completeTour: finishTour,
    }),
    [
      isOpen,
      mode,
      currentStepIndex,
      steps.length,
      finishTour,
      replayTour,
      skipTour,
      startPreviewTour,
      startRoleTour,
    ],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}

      {/* Flash notice (tour completed / error) */}
      {notice ? (
        <div className="fixed left-1/2 top-5 z-[999999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-400/25 bg-[#06170f]/95 px-5 py-3 text-center text-sm font-semibold text-emerald-50 shadow-2xl shadow-black/40">
          {notice}
        </div>
      ) : null}

      {/* Tour overlay — portal renders to document.body */}
      <TourOverlay
        isOpen={isOpen}
        activeStep={activeStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        progressLabel={progressLabel}
        targetRect={targetRect}
        isMobile={isMobile}
        feedback={feedback}
        onFeedbackChange={(e) => setFeedback(e.target.value)}
        onNext={goNext}
        onPrev={goPrevious}
        onSkip={skipTour}
      />
    </OnboardingContext.Provider>
  );
}

export default OnboardingProvider;
