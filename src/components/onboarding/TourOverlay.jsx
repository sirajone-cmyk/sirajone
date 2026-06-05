/**
 * TourOverlay.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Portal-based guided tour overlay for SirajOne.
 * Extracted from OnboardingProvider so the rendering layer is independently
 * testable and the provider stays focused on state + Firestore logic.
 *
 * Rendering modes
 * ───────────────
 * • Spotlight  – step has a live `targetRect` measured from the DOM:
 *                four dim panels surround the target, an emerald ring frames it,
 *                and the card is positioned adjacent (right → left → below).
 * • Modal      – no rect (target not found, or step has no selector):
 *                full-screen blur backdrop + centred card.
 *
 * Feedback block
 * ──────────────
 * Any step whose config has `feedback: true` renders a textarea below the
 * step body.  The parent (OnboardingProvider) owns the text state and passes
 * it in via props.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, X } from 'lucide-react';

// ── Geometry helper ───────────────────────────────────────────────────────────

/**
 * Compute CSS position for the card relative to the spotlight rectangle.
 * Tries right → left → below, clamped inside the viewport.
 *
 * @param {DOMRect|null} rect
 * @param {boolean}      isMobile
 * @returns {React.CSSProperties}
 */
function getCardPosition(rect, isMobile) {
  if (isMobile || !rect) return {};

  const cardWidth      = 420;
  const gap            = 18;
  const viewportWidth  = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const canPlaceRight = rect.right  + cardWidth + gap < viewportWidth;
  const canPlaceLeft  = rect.left   - cardWidth - gap > 0;
  const top           = Math.min(Math.max(rect.top, 24), viewportHeight - 320);

  if (canPlaceRight) return { top, left: rect.right + gap, width: cardWidth };
  if (canPlaceLeft)  return { top, left: rect.left - cardWidth - gap, width: cardWidth };

  return {
    left:  Math.max(20, (viewportWidth - cardWidth) / 2),
    top:   Math.min(rect.bottom + gap, viewportHeight - 330),
    width: cardWidth,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   isOpen:           boolean,
 *   activeStep:       import('./onboardingSteps').TourStep | null,
 *   currentStepIndex: number,
 *   totalSteps:       number,
 *   progressLabel:    string,
 *   targetRect:       DOMRect | null,
 *   isMobile:         boolean,
 *   feedback:         string,
 *   onFeedbackChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
 *   onNext:           () => void,
 *   onPrev:           () => void,
 *   onSkip:           () => void,
 * }} props
 */
export function TourOverlay({
  isOpen,
  activeStep,
  currentStepIndex,
  totalSteps,
  progressLabel,
  targetRect,
  isMobile,
  feedback,
  onFeedbackChange,
  onNext,
  onPrev,
  onSkip,
}) {
  if (!isOpen || !activeStep || typeof document === 'undefined') return null;

  const isFirst    = currentStepIndex === 0;
  const isLast     = currentStepIndex >= totalSteps - 1;
  const hasTarget  = Boolean(targetRect && !isMobile);
  const cardStyle  = getCardPosition(targetRect, isMobile);

  return createPortal(
    <div className="fixed inset-0 z-[999999] pointer-events-none font-sans">

      {/* ── Backdrop ── */}
      {hasTarget ? (
        <>
          {/* Top strip */}
          <div
            className="pointer-events-auto fixed left-0 right-0 top-0 bg-black/70"
            style={{ height: targetRect.top }}
          />
          {/* Left strip */}
          <div
            className="pointer-events-auto fixed left-0 bg-black/70"
            style={{ top: targetRect.top, width: targetRect.left, height: targetRect.height }}
          />
          {/* Right strip */}
          <div
            className="pointer-events-auto fixed right-0 bg-black/70"
            style={{ top: targetRect.top, left: targetRect.right, height: targetRect.height }}
          />
          {/* Bottom strip */}
          <div
            className="pointer-events-auto fixed bottom-0 left-0 right-0 bg-black/70"
            style={{ top: targetRect.bottom }}
          />
          {/* Emerald spotlight ring */}
          <div
            className="fixed rounded-2xl border-2 border-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.16),0_0_40px_rgba(16,185,129,0.35)]"
            style={{
              top:    targetRect.top    - 6,
              left:   targetRect.left   - 6,
              width:  targetRect.width  + 12,
              height: targetRect.height + 12,
            }}
          />
        </>
      ) : (
        <div className="pointer-events-auto fixed inset-0 bg-black/75 backdrop-blur-sm" />
      )}

      {/* ── Tour card ── */}
      <section
        className={[
          'pointer-events-auto fixed',
          'w-[calc(100%-1.5rem)] max-w-[420px]',
          'rounded-3xl border border-emerald-300/20',
          'bg-[#07140d]/95 p-5 text-white',
          'shadow-2xl shadow-black/50',
          isMobile ? 'bottom-3 left-3 right-3 max-w-none' : '',
        ].join(' ')}
        style={isMobile ? undefined : cardStyle}
        role="dialog"
        aria-modal="true"
        aria-label="SirajOne onboarding guide"
        aria-live="polite"
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-200">
              <HelpCircle size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                SirajOne Guide
              </p>
              <p className="text-xs font-semibold text-slate-400">
                Step {progressLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-red-300/30 hover:bg-red-400/10 hover:text-red-100"
            aria-label="Skip onboarding tour"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* ── Step content ── */}
        <div className="mt-5 space-y-3">
          <h2 className="font-serif text-2xl font-black leading-tight text-white">
            {activeStep.title}
          </h2>
          <p className="text-sm leading-7 text-slate-300">
            {activeStep.body}
          </p>
        </div>

        {/* ── Feedback textarea (final steps) ── */}
        {activeStep.feedback && (
          <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-black/20 p-4">
            <label
              htmlFor="onboarding-feedback"
              className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300"
            >
              Tell us what is missing or confusing
            </label>
            <textarea
              id="onboarding-feedback"
              value={feedback}
              onChange={onFeedbackChange}
              rows={4}
              placeholder="Write your feedback here..."
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-[#031008] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60"
            />
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
          >
            Skip Tour
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={isFirst}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous step"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Previous
            </button>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-300"
              aria-label={isLast ? 'Finish tour' : 'Next step'}
            >
              {isLast ? (
                <>Finish <CheckCircle2 size={16} aria-hidden="true" /></>
              ) : (
                <>Next <ArrowRight size={16} aria-hidden="true" /></>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default TourOverlay;
