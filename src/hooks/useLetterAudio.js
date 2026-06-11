/**
 * useLetterAudio — Arabic letter audio playback hook.
 *
 * Cross-browser / mobile reliability fixes applied:
 *
 *  1. AUDIO CONTEXT UNLOCK — On first user interaction the hook plays a
 *     zero-length silent WAV. iOS Safari and some Android Chrome builds
 *     require this before any programmatic Audio.play() is allowed.
 *
 *  2. SYNCHRONOUS Audio() CREATION — The Audio object is created *before*
 *     any await inside playLetterAudio. iOS Safari requires the Audio element
 *     to be created inside the synchronous part of the user-gesture stack.
 *     Even though getDownloadURL is awaited afterwards, the browser sees the
 *     Audio object as "user-activated" because it was instantiated synchronously.
 *
 *  3. play() REJECTION HANDLING — audio.play() returns a Promise that rejects
 *     with NotAllowedError (mobile autoplay policy) or NotSupportedError (.m4a
 *     codec unavailable). Both are caught and logged in dev mode.
 *
 *  4. STALE-REQUEST GUARD — Every call to playLetterAudio increments a counter.
 *     Async callbacks check the counter before touching state, so a fast
 *     second tap cannot cause state corruption.
 *
 *  5. ERROR STATE — isErrorCurrent(letter) returns true only when both real
 *     audio AND browser TTS have failed, so the UI can show "Audio unavailable".
 *
 *  6. DEV-ONLY WARNINGS — All diagnostic messages are guarded by
 *     import.meta.env.DEV and never appear in production builds.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { LETTER_AUDIO_FOLDER, getLetterAudioFilename } from '../data/letterAudioMap';

const DEV = import.meta.env.DEV;

// ─── Audio context unlock ────────────────────────────────────────────────────
// A minimal valid WAV: RIFF header, 0 data samples, 0 duration.
// Playing it silently on first touch tells the browser the page intends to
// use audio — required by iOS Safari and strict Android Chrome configurations.
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==';

let _audioContextUnlocked = false;

function ensureAudioContextUnlocked() {
  if (_audioContextUnlocked) return;
  _audioContextUnlocked = true; // mark immediately to avoid duplicate attempts
  try {
    const silent = new Audio(SILENT_WAV);
    silent.volume = 0;
    const p = silent.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {}); // suppress AbortError / NotAllowedError on old iOS
    }
  } catch (_) {
    /* ignore — if this fails, the real play attempt will handle it */
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getLetterId(letter) {
  if (letter && typeof letter === 'object') {
    return String(letter.id ?? letter.num ?? letter.arabic ?? letter.name ?? 'letter');
  }
  return String(letter ?? 'letter');
}

function getFallbackSpeechText(letter, fallbackText) {
  if (fallbackText) return fallbackText;
  if (letter && typeof letter === 'object') {
    return letter.arabic ?? letter.letter ?? letter.name ?? '';
  }
  return String(letter ?? '');
}

function canUseSpeechSynthesis() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLetterAudio() {
  const audioRef   = useRef(null);
  const requestRef = useRef(0);

  const [loadingLetterId, setLoadingLetterId] = useState(null);
  const [playingLetterId, setPlayingLetterId] = useState(null);
  const [errorLetterId,   setErrorLetterId]   = useState(null);

  // ── Stop all current audio ─────────────────────────────────────────────────
  const stopLetterAudio = useCallback(() => {
    // Increment request counter — invalidates all in-flight async operations.
    requestRef.current += 1;

    const a = audioRef.current;
    if (a) {
      try {
        a.onended  = null;
        a.onerror  = null;
        a.pause();
      } catch (_) { /* ignore */ }
      audioRef.current = null;
    }

    if (canUseSpeechSynthesis()) {
      try { window.speechSynthesis.cancel(); } catch (_) { /* ignore */ }
    }

    setPlayingLetterId(null);
    setLoadingLetterId(null);
  }, []);

  // ── TTS fallback ───────────────────────────────────────────────────────────
  const speakFallback = useCallback((text, letterId) => {
    if (!text || !canUseSpeechSynthesis()) {
      // No TTS available — surface the error state so the UI shows "Unavailable"
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance   = new SpeechSynthesisUtterance(text);
      utterance.lang    = 'ar-SA';
      utterance.rate    = 0.65;
      utterance.onstart = () => setPlayingLetterId(letterId);
      utterance.onend   = () => setPlayingLetterId(null);
      utterance.onerror = () => {
        // TTS also failed — surface error state
        setPlayingLetterId(null);
        setErrorLetterId(letterId);
        if (DEV) console.warn('[useLetterAudio] TTS utterance error for letter:', letterId);
      };
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      if (DEV) console.warn('[useLetterAudio] speechSynthesis.speak() threw:', err);
      setErrorLetterId(letterId);
      setPlayingLetterId(null);
    }
  }, []);

  // ── Main play ──────────────────────────────────────────────────────────────
  const playLetterAudio = useCallback(async (letter, fallbackText) => {
    const letterId           = getLetterId(letter);
    const fallbackSpeechText = getFallbackSpeechText(letter, fallbackText);

    // ① Unlock the audio context synchronously (iOS Safari requirement).
    ensureAudioContextUnlocked();

    // ② Create the Audio object synchronously — BEFORE any await.
    //    iOS Safari marks an Audio element as "user-activated" when it is
    //    constructed inside the synchronous event-handler call stack.
    //    Subsequent play() calls on this element are allowed even after awaits.
    const audio = new Audio();
    audio.preload = 'auto';

    // ③ Stop previous playback (increments requestRef) then capture the new ID.
    stopLetterAudio();
    const myRequest = requestRef.current;

    audioRef.current = audio;
    setErrorLetterId(null);
    setLoadingLetterId(letterId);

    // ④ Resolve the filename for this letter.
    const filename = getLetterAudioFilename(letter);
    if (!filename) {
      if (DEV) {
        console.warn(
          '[useLetterAudio] No audio file mapping found for letter:',
          JSON.stringify(letter),
          '— falling back to browser TTS.',
        );
      }
      setLoadingLetterId(null);
      speakFallback(fallbackSpeechText, letterId);
      return;
    }

    const storagePath = `${LETTER_AUDIO_FOLDER}/${filename}`;

    try {
      // ⑤ Fetch the Firebase Storage download URL (async — user gesture window expires here).
      //    This is safe because we created the Audio element synchronously in step ②.
      let url;
      try {
        url = await getDownloadURL(ref(storage, storagePath));
      } catch (storageErr) {
        if (DEV) {
          const code = storageErr?.code ?? 'unknown';
          console.warn(
            `[useLetterAudio] Firebase Storage URL fetch failed for "${storagePath}":`,
            code,
            storageErr?.message,
          );
          if (code === 'storage/unauthorized') {
            console.warn(
              '[useLetterAudio] → Likely cause: storage.rules does not allow public read',
              'for /letters/audio/{filename}. Check that `allow read: if true;` is present',
              'and that the rules have been deployed with `firebase deploy --only storage`.',
            );
          }
          if (code === 'storage/object-not-found') {
            console.warn(
              `[useLetterAudio] → File not found in Firebase Storage: ${storagePath}`,
              'Verify the file was uploaded with exactly this path and filename.',
            );
          }
        }
        throw storageErr;
      }

      // ⑥ Stale-request guard — another letter was tapped while we awaited.
      if (requestRef.current !== myRequest) return;

      // ⑦ Assign source and begin loading.
      audio.src = url;
      audio.load();

      // ⑧ Wait until the browser has enough data to play without stalling.
      //    We listen for both `canplaythrough` (ideal) and `loadeddata` (partial
      //    load, common on slow mobile connections) so we don't wait forever.
      await new Promise((resolve, reject) => {
        let settled = false;

        const done = (err) => {
          if (settled) return;
          settled = true;
          audio.removeEventListener('canplaythrough', onReady);
          audio.removeEventListener('loadeddata',     onReady);
          audio.removeEventListener('error',          onError);
          clearTimeout(timer);
          err ? reject(err) : resolve();
        };

        const onReady = () => done(null);
        const onError = () => {
          const code = audio.error?.code ?? '?';
          // MediaError codes: 1=ABORTED 2=NETWORK 3=DECODE 4=SRC_NOT_SUPPORTED
          done(new Error(`Audio element error (MediaError code ${code})`));
        };

        audio.addEventListener('canplaythrough', onReady, { once: true });
        audio.addEventListener('loadeddata',     onReady, { once: true });
        audio.addEventListener('error',          onError, { once: true });

        // 10-second safety timeout for very slow connections.
        const timer = setTimeout(
          () => done(new Error('Audio load timeout after 10s')),
          10_000,
        );
      });

      // ⑨ Second stale-request guard — stop() may have been called while loading.
      if (requestRef.current !== myRequest) return;

      // ⑩ Transition state: loading → playing.
      setLoadingLetterId(null);
      setPlayingLetterId(letterId);

      audio.onended = () => {
        if (requestRef.current === myRequest) {
          setPlayingLetterId(null);
          audioRef.current = null;
        }
      };

      // ⑪ Play — the Audio object was created synchronously (step ②) so the
      //    browser allows this even though we are now inside an async chain.
      await audio.play();

    } catch (err) {
      // Only handle errors for our own request.
      if (requestRef.current !== myRequest) return;

      if (DEV) {
        if (err?.name === 'NotAllowedError') {
          console.warn(
            '[useLetterAudio] Playback rejected with NotAllowedError.',
            'The browser refused to play audio without a direct user gesture.',
            'Letter:', letterId,
            '— This can happen on iOS Safari if the audio unlock did not work,',
            'or if there was a very long async delay before play() was called.',
          );
        } else if (err?.name === 'NotSupportedError') {
          console.warn(
            '[useLetterAudio] NotSupportedError: the browser cannot play this audio format.',
            'File:', filename,
            '— .m4a files require audio/mp4 (AAC-LC) codec support.',
            'Verify the file was exported as AAC, not ALAC.',
            'Also check that Firebase Storage served the file with Content-Type: audio/mp4',
            '(not application/octet-stream).',
          );
        } else {
          console.warn(
            '[useLetterAudio] Playback error:',
            err?.name,
            err?.message,
            'Letter:', letterId,
          );
        }
      }

      setLoadingLetterId(null);
      setPlayingLetterId(null);
      // speakFallback sets errorLetterId if TTS also fails.
      speakFallback(fallbackSpeechText, letterId);
    }
  }, [speakFallback, stopLetterAudio]);

  // ── Per-letter state helpers ───────────────────────────────────────────────
  const isLoadingCurrent = useCallback(
    (letter) => loadingLetterId === getLetterId(letter),
    [loadingLetterId],
  );
  const isPlayingCurrent = useCallback(
    (letter) => playingLetterId === getLetterId(letter),
    [playingLetterId],
  );
  const isErrorCurrent = useCallback(
    (letter) => errorLetterId === getLetterId(letter),
    [errorLetterId],
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
