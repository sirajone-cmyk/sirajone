/**
 * useLetterAudio — Arabic letter audio playback hook.
 *
 * ── Root cause of audio-never-plays bug (fixed in this version) ──────────────
 *
 *   DOUBLE speakFallback CALL:
 *   When a file has a wrong MIME type (application/octet-stream instead of
 *   audio/mp4), two things fire independently for the same play attempt:
 *     1. audio.onerror  → speakFallback() → TTS starts
 *     2. audio.play() rejects → catch block → speakFallback() again
 *   The second call hits speechSynthesis.cancel() which kills the first TTS,
 *   then speak() fires again — but some browsers/OS silently drop it.
 *   Result: no sound on PC or phone, even with TTS fallback.
 *
 *   FIX: callFallbackOnce() — a per-invocation closure flag that ensures
 *   speakFallback() runs at most once per play() attempt.
 *
 * ── Other fixes in this version ───────────────────────────────────────────────
 *   - 10 s timeout on getDownloadURL (prevents infinite loading spinner)
 *   - AbortError from play() is silently ignored — no TTS (stale request)
 *   - Explicit 3-path fallback: mapped path → .mp3 slug → .m4a slug
 *   - MIME type hint logged clearly: gsutil fix command included
 *   - All log/warn/error helpers (DEV only)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { LETTER_AUDIO_FOLDER, getLetterAudioFilename } from '../data/letterAudioMap';

const DEV = import.meta.env.DEV;

// ─── Logging helpers (DEV only) ───────────────────────────────────────────────
/* eslint-disable no-console */
function log(...args)   { if (DEV) console.log(  '[Audio]', ...args); }
function warn(...args)  { if (DEV) console.warn( '[Audio]', ...args); }
function err(...args)   { if (DEV) console.error('[Audio]', ...args); }
/* eslint-enable no-console */

// ─── iOS Safari audio context unlock ─────────────────────────────────────────
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
    if (p?.catch) p.catch(() => {});
  } catch (_) { /* intentionally silent */ }
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
  if (letter && typeof letter === 'object') return letter.arabic ?? letter.letter ?? letter.name ?? '';
  return String(letter ?? '');
}

function canUseTTS() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

// ─── Build ordered list of Storage paths to try ───────────────────────────────
// Priority: mapped filename → slug.mp3 → slug.m4a
// De-duplicates automatically (e.g. if mapped file is already .mp3)
function buildPathList(filename) {
  if (!filename) return [];
  const base = filename.replace(/\.(m4a|mp3|ogg|wav)$/i, '');
  const ext  = (filename.match(/\.(m4a|mp3|ogg|wav)$/i)?.[1] ?? 'm4a').toLowerCase();

  const seen  = new Set();
  const paths = [];
  for (const e of [ext, 'mp3', 'm4a']) {
    const p = `${LETTER_AUDIO_FOLDER}/${base}.${e}`;
    if (!seen.has(p)) { seen.add(p); paths.push(p); }
  }
  return paths;
}

// ─── getDownloadURL with timeout ──────────────────────────────────────────────
const FETCH_TIMEOUT_MS = 10_000;

function fetchURL(path) {
  return new Promise((resolve, reject) => {
    let done = false;
    const timer = setTimeout(() => {
      if (!done) { done = true; reject(new Error(`Storage timeout after ${FETCH_TIMEOUT_MS}ms`)); }
    }, FETCH_TIMEOUT_MS);
    getDownloadURL(ref(storage, path))
      .then((url) => { if (!done) { done = true; clearTimeout(timer); resolve(url); } })
      .catch((e)  => { if (!done) { done = true; clearTimeout(timer); reject(e); } });
  });
}

// Returns URL string, null on 404, throws on other errors
async function tryGetDownloadURL(path) {
  try {
    const url = await fetchURL(path);
    log('  ✓ URL resolved:', path);
    log('  URL preview:', url.slice(0, 80) + '…');
    return url;
  } catch (e) {
    const code = e?.code ?? 'unknown';
    if (code === 'storage/object-not-found') {
      log('  ✗ 404 (not found):', path);
      return null;
    }
    warn('  ✗ Storage error:', code, e?.message, 'path:', path);
    throw e;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLetterAudio() {
  const audioRef   = useRef(null);
  const requestRef = useRef(0);

  const [loadingLetterId, setLoadingLetterId] = useState(null);
  const [playingLetterId, setPlayingLetterId] = useState(null);
  const [errorLetterId,   setErrorLetterId]   = useState(null);

  // ── Stop current audio / TTS ───────────────────────────────────────────────
  const stopLetterAudio = useCallback(() => {
    requestRef.current += 1;
    const a = audioRef.current;
    if (a) {
      try { a.onended = null; a.onerror = null; a.pause(); } catch (_) {}
      audioRef.current = null;
    }
    if (canUseTTS()) { try { window.speechSynthesis.cancel(); } catch (_) {} }
    setPlayingLetterId(null);
    setLoadingLetterId(null);
  }, []);

  // ── TTS fallback ───────────────────────────────────────────────────────────
  const speakFallback = useCallback((text, letterId) => {
    if (!text || !canUseTTS()) {
      warn('TTS unavailable — no Arabic voice or SpeechSynthesis not supported. Showing error state.');
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u   = new SpeechSynthesisUtterance(text);
      u.lang    = 'ar-SA';
      u.rate    = 0.65;
      u.onstart = () => { log('TTS started for "' + letterId + '"'); setPlayingLetterId(letterId); };
      u.onend   = () => { log('TTS ended for "' + letterId + '"');   setPlayingLetterId(null); };
      u.onerror = (e) => {
        warn('TTS error for "' + letterId + '":', e.error);
        setPlayingLetterId(null);
        setErrorLetterId(letterId);
      };
      window.speechSynthesis.speak(u);
      log('TTS triggered for "' + letterId + '" text="' + text + '"');
    } catch (e) {
      warn('speechSynthesis.speak() threw:', e);
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
    }
  }, []);

  // ── Main play ──────────────────────────────────────────────────────────────
  const playLetterAudio = useCallback(async (letter, fallbackText) => {
    const letterId = getLetterId(letter);
    const ttsText  = getFallbackText(letter, fallbackText);

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    log('playLetterAudio → letter id:', letterId);
    if (DEV && letter && typeof letter === 'object') {
      log('  arabic="' + letter.arabic + '"  name="' + letter.name + '"  num=' + letter.num);
    }

    // ① Unlock audio context inside user-gesture (iOS Safari)
    unlockAudioContext();

    // ② Create Audio SYNCHRONOUSLY before any await (iOS Safari user-gesture window)
    const audio = new Audio();

    // ③ Invalidate any previous request
    stopLetterAudio();
    const myReq = requestRef.current;

    audioRef.current = audio;
    setErrorLetterId(null);
    setLoadingLetterId(letterId);
    log('  Loading state set (requestId=' + myReq + ')');

    // Clears loading state — called in every exit path
    const endLoading = () => {
      if (requestRef.current === myReq) setLoadingLetterId(null);
    };

    // ──────────────────────────────────────────────────────────────────────────
    // KEY FIX: callFallbackOnce
    //
    // audio.onerror fires for MediaError (e.g. SRC_NOT_SUPPORTED when MIME type
    // is application/octet-stream). audio.play() also rejects (NotSupportedError)
    // for the same event. Without this guard, speakFallback runs twice:
    //   1. onerror  → TTS starts
    //   2. catch    → speechSynthesis.cancel() kills TTS, speak() fires again
    // Browser silently drops the second speak(), so no sound plays at all.
    // This flag prevents the second call.
    // ──────────────────────────────────────────────────────────────────────────
    let fallbackCalled = false;
    const callFallbackOnce = () => {
      if (!fallbackCalled) {
        fallbackCalled = true;
        speakFallback(ttsText, letterId);
      }
    };

    // ④ Resolve filename from letter object
    const filename = getLetterAudioFilename(letter);
    if (!filename) {
      warn('  No audio filename mapping found for letter:', JSON.stringify(letter));
      endLoading();
      callFallbackOnce();
      return;
    }
    log('  Mapped filename: "' + filename + '"');

    try {
      // ⑤ Try paths in priority order
      const pathsToTry = buildPathList(filename);
      log('  Storage paths to try (in order):', pathsToTry);

      let url = null;
      for (const path of pathsToTry) {
        log('  → requesting:', path);
        url = await tryGetDownloadURL(path);
        if (url !== null) break;
      }

      if (url === null) {
        err(
          '  ✗ AUDIO FILE NOT FOUND in Firebase Storage.\n',
          '  Tried all paths:\n' + pathsToTry.map((p) => '    ' + p).join('\n') + '\n',
          '\n  ═══ HOW TO FIX ═══',
          '\n  1. Go to: https://console.firebase.google.com → Storage → sirajone-786',
          '\n  2. Navigate to: letters/audio/',
          '\n  3. Upload files named exactly as listed above (.m4a or .mp3)',
          '\n  4. Ensure Content-Type is audio/mp4 (for .m4a) or audio/mpeg (for .mp3)',
          '\n     If wrongly set to application/octet-stream, fix with:',
          '\n     gsutil setmeta -h "Content-Type:audio/mp4" gs://sirajone-786.appspot.com/letters/audio/*.m4a',
          '\n     gsutil setmeta -h "Content-Type:audio/mpeg" gs://sirajone-786.appspot.com/letters/audio/*.mp3',
        );
        endLoading();
        callFallbackOnce();
        return;
      }

      // ⑥ Stale-request guard
      if (requestRef.current !== myReq) {
        log('  Request became stale after URL fetch — aborting (myReq=' + myReq + ', now=' + requestRef.current + ')');
        return;
      }

      // ⑦ Set src. DO NOT call audio.load() — play() triggers load internally.
      audio.src = url;
      log('  audio.src set. Calling play()…');

      // ⑧ Error handler (MediaError — fires for decode/network/MIME errors)
      audio.onerror = () => {
        if (requestRef.current !== myReq) return;
        const mediaCode = audio.error?.code;
        const mediaMsg  = { 1: 'ABORTED', 2: 'NETWORK_ERR', 3: 'DECODE_ERR', 4: 'SRC_NOT_SUPPORTED' }[mediaCode]
          ?? 'code ' + mediaCode;
        err('  audio.onerror → MediaError:', mediaMsg);
        if (mediaCode === 4) {
          err(
            '  SRC_NOT_SUPPORTED — the browser received the file but cannot decode it.',
            '\n  Most common cause: Firebase Storage is serving .m4a as Content-Type: application/octet-stream.',
            '\n  The browser ignores files with that MIME type.',
            '\n  Fix options:',
            '\n    A) Re-upload the .m4a files (Firebase auto-detects Content-Type on upload via console)',
            '\n    B) Run: gsutil setmeta -h "Content-Type:audio/mp4" gs://sirajone-786.appspot.com/letters/audio/*.m4a',
            '\n    C) Upload .mp3 versions — they are served as audio/mpeg by default',
          );
        } else if (mediaCode === 2) {
          err('  NETWORK_ERR — check Storage rules and CORS config.');
        } else if (mediaCode === 3) {
          err('  DECODE_ERR — file is corrupted or encoded in an unsupported codec.');
        }
        endLoading();
        setPlayingLetterId(null);
        callFallbackOnce(); // ← guarded — will NOT fire twice
      };

      // ⑨ Transition loading → playing, THEN call play()
      endLoading();
      setPlayingLetterId(letterId);

      audio.onended = () => {
        if (requestRef.current === myReq) {
          log('  audio ended for "' + letterId + '"');
          setPlayingLetterId(null);
          audioRef.current = null;
        }
      };

      // ⑩ Play — Audio() was created synchronously so iOS allows this
      await audio.play();
      log('  ✓ audio.play() resolved — playing "' + letterId + '"');

    } catch (e) {
      if (requestRef.current !== myReq) return;

      endLoading();
      setPlayingLetterId(null);

      const eName = e?.name;
      const eCode = e?.code;

      // Storage permission error
      if (eCode === 'storage/unauthorized') {
        err(
          '  storage/unauthorized for "' + letterId + '".',
          '\n  → storage.rules must include:',
          '\n    match /letters/audio/{filename} { allow read: if true; }',
          '\n  → Redeploy: firebase deploy --only storage',
        );
        setErrorLetterId(letterId);
        return; // no TTS — show error icon, rule must be fixed
      }

      // Storage timeout
      if (e?.message?.includes('Storage timeout')) {
        err('  Firebase Storage request timed out. Check network connectivity and Storage config.');
        callFallbackOnce();
        return;
      }

      // AbortError = play() was interrupted by a subsequent call — NORMAL, ignore
      if (eName === 'AbortError') {
        log('  AbortError: play() interrupted by newer call — normal, ignoring.');
        return; // no TTS — this is expected when quickly clicking different letters
      }

      // NotAllowedError = autoplay policy blocked it
      if (eName === 'NotAllowedError') {
        err(
          '  NotAllowedError: browser blocked audio.play().',
          '\n  This should NOT happen here because Audio() was created synchronously inside the click handler.',
          '\n  Check if an event.preventDefault() somewhere is consuming the user gesture before onClick fires.',
        );
      }

      // NotSupportedError = format rejected by browser (usually MIME type issue)
      else if (eName === 'NotSupportedError') {
        err(
          '  NotSupportedError from audio.play().',
          '\n  This is almost always the MIME type issue described above (application/octet-stream).',
          '\n  Re-upload the files or set the correct Content-Type in Firebase Storage.',
        );
      }

      // Anything else
      else {
        err('  Unhandled play() error for "' + letterId + '":', eName, e?.message, e);
      }

      callFallbackOnce(); // ← guarded — onerror may have already called this
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
