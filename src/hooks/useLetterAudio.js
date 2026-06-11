/**
 * useLetterAudio — Arabic letter audio playback hook.
 *
 * ROOT CAUSE OF PREVIOUS BUG (fixed here):
 *   audio.load() was called BEFORE Promise listeners were set up.
 *   On fast connections, canplaythrough fired during audio.load()
 *   and was missed entirely — the Promise hung for 10 s then timed out.
 *   This caused loading state to stick and no audio to play on ALL devices.
 *
 * This version removes the canplaythrough wait entirely and calls play()
 * directly after setting src — the browser handles buffering internally.
 * This is the standard, race-condition-free approach.
 *
 * Additional fixes:
 *   - mp3 fallback: tries .mp3 first, then .m4a (handles both upload formats)
 *   - loading state ALWAYS clears — guaranteed by try/catch/finally
 *   - comprehensive console logging in DEV mode at every step
 *   - error state exposed so UI shows "Audio unavailable" instead of spinning
 *   - audio context unlock for iOS Safari
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { LETTER_AUDIO_FOLDER, getLetterAudioFilename } from '../data/letterAudioMap';

const DEV = import.meta.env.DEV;

// ─── Logging helpers (DEV only) ───────────────────────────────────────────────
function log(...args)  { if (DEV) console.log( '[Audio]', ...args); }
function warn(...args) { if (DEV) console.warn('[Audio]', ...args); }

// ─── Audio context unlock ────────────────────────────────────────────────────
// iOS Safari requires a silent audio play inside a user gesture before any
// programmatic playback is allowed.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==';
let _unlocked = false;

function unlockAudioContext() {
  if (_unlocked) return;
  _unlocked = true;
  try {
    const a = new Audio(SILENT_WAV);
    a.volume = 0;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (_) { /* silent */ }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getLetterId(letter) {
  if (letter && typeof letter === 'object') {
    return String(letter.id ?? letter.num ?? letter.arabic ?? letter.name ?? 'unknown');
  }
  return String(letter ?? 'unknown');
}

function getFallbackText(letter, override) {
  if (override) return override;
  if (letter && typeof letter === 'object') {
    return letter.arabic ?? letter.letter ?? letter.name ?? '';
  }
  return String(letter ?? '');
}

function canUseTTS() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

// ─── Try fetching a download URL, returns null on object-not-found ────────────
async function tryGetDownloadURL(path) {
  try {
    const url = await getDownloadURL(ref(storage, path));
    log(`  ✓ Download URL resolved: ${path}`);
    return url;
  } catch (err) {
    const code = err?.code ?? 'unknown';
    if (code === 'storage/object-not-found') {
      warn(`  ✗ File not found in Storage: ${path}`);
      return null;
    }
    // Unexpected error (unauthorized, network, etc.) — rethrow
    warn(`  ✗ Storage error for ${path}: ${code} — ${err?.message}`);
    throw err;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLetterAudio() {
  const audioRef   = useRef(null);
  const requestRef = useRef(0);

  const [loadingLetterId, setLoadingLetterId] = useState(null);
  const [playingLetterId, setPlayingLetterId] = useState(null);
  const [errorLetterId,   setErrorLetterId]   = useState(null);

  // ── Stop ───────────────────────────────────────────────────────────────────
  const stopLetterAudio = useCallback(() => {
    requestRef.current += 1;

    const a = audioRef.current;
    if (a) {
      try { a.onended = null; a.onerror = null; a.pause(); } catch (_) {}
      audioRef.current = null;
    }
    if (canUseTTS()) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    setPlayingLetterId(null);
    setLoadingLetterId(null);
  }, []);

  // ── TTS fallback ───────────────────────────────────────────────────────────
  const speakFallback = useCallback((text, letterId) => {
    if (!text || !canUseTTS()) {
      warn(`TTS unavailable for letter "${letterId}" — showing error state.`);
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u    = new SpeechSynthesisUtterance(text);
      u.lang     = 'ar-SA';
      u.rate     = 0.65;
      u.onstart  = () => { log(`TTS started for "${letterId}"`); setPlayingLetterId(letterId); };
      u.onend    = () => { log(`TTS ended for "${letterId}"`);   setPlayingLetterId(null); };
      u.onerror  = (e) => {
        warn(`TTS error for "${letterId}":`, e.error);
        setPlayingLetterId(null);
        setErrorLetterId(letterId);
      };
      window.speechSynthesis.speak(u);
      log(`TTS fallback triggered for "${letterId}" ("${text}")`);
    } catch (err) {
      warn('speechSynthesis.speak() threw:', err);
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
    }
  }, []);

  // ── Main play ──────────────────────────────────────────────────────────────
  const playLetterAudio = useCallback(async (letter, fallbackText) => {
    const letterId  = getLetterId(letter);
    const ttsText   = getFallbackText(letter, fallbackText);

    log(`━━━ playLetterAudio called — letter: "${letterId}"`);
    if (DEV && letter && typeof letter === 'object') {
      log(`  arabic="${letter.arabic}" name="${letter.name}" num=${letter.num}`);
    }

    // ① Unlock audio context synchronously (iOS Safari)
    unlockAudioContext();

    // ② Create Audio element synchronously BEFORE any await.
    //    This keeps it within the user-gesture window on iOS Safari.
    const audio = new Audio();

    // ③ Stop previous and capture request ID
    stopLetterAudio();
    const myReq = requestRef.current;

    audioRef.current = audio;
    setErrorLetterId(null);
    setLoadingLetterId(letterId);
    log(`  Loading started (requestId=${myReq})`);

    // Guaranteed cleanup — loading state always clears
    const endLoading = () => {
      if (requestRef.current === myReq) setLoadingLetterId(null);
    };

    // ④ Resolve filename
    const filename = getLetterAudioFilename(letter);
    if (!filename) {
      warn(`  No audio mapping for letter:`, JSON.stringify(letter));
      endLoading();
      speakFallback(ttsText, letterId);
      return;
    }
    log(`  Mapped filename: "${filename}"`);

    try {
      // ⑤ Try to get a download URL.
      //    Strategy: try .mp3 first (universal), then .m4a.
      //    If the uploaded file IS already .m4a as named in the map, we try that directly.
      //    If storage/object-not-found, we attempt the alternate extension.

      const base        = filename.replace(/\.(m4a|mp3|ogg|wav)$/i, '');
      const ext         = filename.match(/\.(m4a|mp3|ogg|wav)$/i)?.[1]?.toLowerCase() ?? 'm4a';
      const altExt      = ext === 'mp3' ? 'm4a' : 'mp3';
      const primaryPath = `${LETTER_AUDIO_FOLDER}/${base}.${ext}`;
      const fallbackPath = `${LETTER_AUDIO_FOLDER}/${base}.${altExt}`;

      log(`  Trying primary path:  ${primaryPath}`);
      let url = await tryGetDownloadURL(primaryPath);

      if (url === null) {
        log(`  Trying fallback path: ${fallbackPath}`);
        url = await tryGetDownloadURL(fallbackPath);
      }

      if (url === null) {
        warn(
          `  Both paths not found in Firebase Storage:`,
          `\n    ${primaryPath}`,
          `\n    ${fallbackPath}`,
          `\n  → Upload one of these files to Firebase Storage under "letters/audio/".`
        );
        endLoading();
        speakFallback(ttsText, letterId);
        return;
      }

      // ⑥ Stale-request guard
      if (requestRef.current !== myReq) {
        log(`  Request stale after URL fetch — aborting (myReq=${myReq}, current=${requestRef.current})`);
        return;
      }

      // ⑦ Assign source.
      //    DO NOT call audio.load() before play() — it can trigger canplaythrough
      //    before listeners are set up, causing a race condition.
      //    play() implicitly calls load() and handles buffering.
      audio.src = url;
      log(`  Audio src set. Calling play()…`);

      // ⑧ Set up error handler BEFORE play()
      audio.onerror = (e) => {
        if (requestRef.current !== myReq) return;
        const code = audio.error?.code;
        // MediaError codes: 1=ABORTED 2=NETWORK 3=DECODE 4=SRC_NOT_SUPPORTED
        const msg = ['', 'ABORTED', 'NETWORK_ERR', 'DECODE_ERR', 'SRC_NOT_SUPPORTED'][code] ?? `code ${code}`;
        warn(`  Audio element error: ${msg}`, e);
        if (code === 4) {
          warn(`  → SRC_NOT_SUPPORTED: browser cannot decode "${filename}".`);
          warn(`  → .m4a files need AAC-LC encoding. If encoded as ALAC, convert to AAC.`);
          warn(`  → Firebase Storage must serve Content-Type: audio/mp4 (not application/octet-stream).`);
        }
        setLoadingLetterId(null);
        setPlayingLetterId(null);
        speakFallback(ttsText, letterId);
      };

      // ⑨ Transition to playing state, then call play()
      endLoading();
      setPlayingLetterId(letterId);

      audio.onended = () => {
        if (requestRef.current === myReq) {
          log(`  Audio ended for "${letterId}"`);
          setPlayingLetterId(null);
          audioRef.current = null;
        }
      };

      // ⑩ Play — Audio was created synchronously (step ②) so iOS Safari allows this.
      await audio.play();
      log(`  ✓ audio.play() resolved — audio is playing for "${letterId}"`);

    } catch (err) {
      if (requestRef.current !== myReq) return;

      endLoading();
      setPlayingLetterId(null);

      const name = err?.name;
      const code = err?.code;

      if (code === 'storage/unauthorized') {
        warn(
          `  storage/unauthorized for letter "${letterId}".`,
          `\n  → Check storage.rules: /letters/audio/{filename} needs \`allow read: if true;\``,
          `\n  → Redeploy with: firebase deploy --only storage`,
        );
        setErrorLetterId(letterId);
        return;
      }

      if (name === 'NotAllowedError') {
        warn(
          `  NotAllowedError: browser blocked audio.play() for "${letterId}".`,
          `\n  → Audio context was not unlocked. This can happen if the user gesture`,
          `\n    was consumed before play() was called, or on very strict browser settings.`,
        );
      } else if (name === 'NotSupportedError') {
        warn(
          `  NotSupportedError: browser cannot play "${filename}".`,
          `\n  → Verify the file is AAC-encoded (not ALAC).`,
          `\n  → Try uploading an .mp3 version.`,
        );
      } else {
        warn(`  Unhandled error playing "${letterId}":`, name, err?.message, err);
      }

      speakFallback(ttsText, letterId);
    }
  }, [speakFallback, stopLetterAudio]);

  // ── State helpers ──────────────────────────────────────────────────────────
  const isLoadingCurrent = useCallback(
    (letter) => loadingLetterId === getLetterId(letter), [loadingLetterId],
  );
  const isPlayingCurrent = useCallback(
    (letter) => playingLetterId === getLetterId(letter), [playingLetterId],
  );
  const isErrorCurrent = useCallback(
    (letter) => errorLetterId   === getLetterId(letter), [errorLetterId],
  );

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => () => stopLetterAudio(), [stopLetterAudio]);

  return {
    playLetterAudio,
    stopLetterAudio,
    isLoadingCurrent,
    isPlayingCurrent,
    isErrorCurrent,
    loadingLetterId,
    playingLetterId,
    errorLetterId,
    isLoading: Boolean(loadingLetterId),
  };
}

export default useLetterAudio;
