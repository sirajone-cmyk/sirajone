/**
 * useOnboarding.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Consumer hook for OnboardingContext.
 *
 * Returns the full context value shape:
 *   {
 *     isOpen:           boolean
 *     mode:             'role' | 'preview'
 *     currentStepIndex: number
 *     totalSteps:       number
 *     startPreviewTour: () => void
 *     startRoleTour:    () => Promise<void>
 *     replayTour:       () => void
 *     skipTour:         () => Promise<void>
 *     completeTour:     () => Promise<void>
 *   }
 *
 * Throws a descriptive error when used outside <OnboardingProvider> so
 * the mistake surfaces immediately during development.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useContext } from 'react';
import { OnboardingContext } from './OnboardingProvider';

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      '[useOnboarding] must be used inside <OnboardingProvider>.\n' +
      'Ensure <OnboardingProvider> wraps your component tree in App.jsx, ' +
      'inside <AuthProvider> and above <AuthenticatedApp>.',
    );
  }

  return context;
}

export default useOnboarding;
