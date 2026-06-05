import { useEffect, useMemo, useState } from 'react';

const PROTECTION_MESSAGE = 'Screenshots and printing are strictly disabled to protect privacy.';
const FORM_CONTROL_SELECTOR = 'input, textarea, select, button, [contenteditable="true"], [role="textbox"]';

function isFormInteractionElement(element) {
  if (!element || element === document.body) return false;
  return Boolean(element.closest?.(FORM_CONTROL_SELECTOR));
}

function isProtectedShortcut(event) {
  const key = event.key?.toLowerCase();
  const code = event.code?.toLowerCase();
  const commandOrControl = event.ctrlKey || event.metaKey;

  return (
    key === 'printscreen' ||
    code === 'printscreen' ||
    (commandOrControl && key === 'p') ||
    (event.metaKey && event.shiftKey && ['3', '4', '5'].includes(key)) ||
    (commandOrControl && event.shiftKey && ['s', 'i', 'j', 'c'].includes(key))
  );
}

export function useContentProtection({ enabled = true } = {}) {
  const [masked, setMasked] = useState(false);
  const [notice, setNotice] = useState('');

  const showNotice = useMemo(() => {
    let noticeTimer = null;

    return (message = PROTECTION_MESSAGE) => {
      setNotice(message);
      if (noticeTimer) window.clearTimeout(noticeTimer);
      noticeTimer = window.setTimeout(() => setNotice(''), 2800);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setMasked(false);
      setNotice('');
      return undefined;
    }

    function blockEvent(event) {
      if (isFormInteractionElement(event.target)) return;
      event.preventDefault();
      showNotice('Copying is disabled on protected SirajOne learning materials.');
    }

    function handleKeyDown(event) {
      if (!isProtectedShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
      showNotice(PROTECTION_MESSAGE);
    }

    function handleBlur() {
      if (isFormInteractionElement(document.activeElement)) return;
      setMasked(true);
    }

    function handleFocus() {
      setMasked(false);
    }

    function handleVisibilityChange() {
      setMasked(document.visibilityState === 'hidden');
    }

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', blockEvent, true);
    document.addEventListener('cut', blockEvent, true);
    document.addEventListener('dragstart', blockEvent, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', blockEvent, true);
      document.removeEventListener('cut', blockEvent, true);
      document.removeEventListener('dragstart', blockEvent, true);
    };
  }, [enabled, showNotice]);

  return { masked, notice, clearNotice: () => setNotice('') };
}
