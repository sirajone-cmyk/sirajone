import { useCallback, useEffect, useState } from 'react';

const ALERT_MSG =
  'Screenshots and printing are disabled to protect our learning materials and student privacy.';

/**
 * Returns { masked } — when true, render a full-screen protection overlay.
 * Smart: blur masking is skipped if the active element is a form control,
 * so dropdown selects and text inputs never cause accidental lockouts.
 */
export function useContentProtection({ enabled = true } = {}) {
  const [masked, setMasked] = useState(false);

  // Returns true if the currently-focused element is a form control that
  // should NOT trigger the mask (input, textarea, select, button).
  const activeElementIsFormControl = useCallback(() => {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return ['input', 'textarea', 'select', 'button'].includes(tag) || el.isContentEditable;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // ── Keyboard shortcut interception ──────────────────────────────────────
    function handleKeyDown(e) {
      const key = e.key?.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey; // Ctrl on Windows, Cmd on Mac

      // PrintScreen
      if (key === 'printscreen') {
        e.preventDefault();
        alert(ALERT_MSG);
        return;
      }

      // Ctrl/Cmd + P  (print dialog)
      if (ctrl && key === 'p') {
        e.preventDefault();
        alert(ALERT_MSG);
        return;
      }

      // Cmd+Shift+3 / Cmd+Shift+4  (macOS screenshot shortcuts)
      if (e.metaKey && e.shiftKey && (key === '3' || key === '4' || key === '5')) {
        e.preventDefault();
        alert(ALERT_MSG);
        return;
      }

      // Ctrl+Shift+S  (some browsers' save shortcuts)
      if (ctrl && e.shiftKey && key === 's') {
        e.preventDefault();
        return;
      }
    }

    // ── Window blur — screen switch / snipping tool activation ───────────────
    function handleBlur() {
      // Skip if a form element has focus — avoids locking out
      // users clicking dropdowns, inputs, or buttons.
      if (activeElementIsFormControl()) return;
      setMasked(true);
    }

    function handleFocus() {
      setMasked(false);
    }

    // ── Tab / visibility change ──────────────────────────────────────────────
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        setMasked(true);
      } else {
        setMasked(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, activeElementIsFormControl]);

  return { masked };
}
