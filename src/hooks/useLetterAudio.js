import { useCallback, useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { LETTER_AUDIO_FOLDER, getLetterAudioFilename } from '../data/letterAudioMap';

function getLetterId(letter) {
  if (letter && typeof letter === 'object') {
    return String(letter.id || letter.num || letter.arabic || letter.name || 'letter');
  }

  return String(letter || 'letter');
}

function getFallbackSpeechText(letter, fallbackText) {
  if (fallbackText) return fallbackText;
  if (letter && typeof letter === 'object') return letter.arabic || letter.letter || letter.name || '';
  return String(letter || '');
}

function canUseSpeechSynthesis() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function useLetterAudio() {
  const audioRef = useRef(null);
  const requestRef = useRef(0);
  const [loadingLetterId, setLoadingLetterId] = useState(null);
  const [playingLetterId, setPlayingLetterId] = useState(null);

  const stopLetterAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    if (canUseSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }

    setPlayingLetterId(null);
    setLoadingLetterId(null);
  }, []);

  const speakFallback = useCallback((text, letterId) => {
    if (!text || !canUseSpeechSynthesis()) {
      setPlayingLetterId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.65;
    utterance.onstart = () => setPlayingLetterId(letterId);
    utterance.onend = () => setPlayingLetterId(null);
    utterance.onerror = () => setPlayingLetterId(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  const playLetterAudio = useCallback(async (letter, fallbackText) => {
    const letterId = getLetterId(letter);
    const fallbackSpeechText = getFallbackSpeechText(letter, fallbackText);
    const filename = getLetterAudioFilename(letter);
    const requestId = requestRef.current + 1;

    requestRef.current = requestId;
    stopLetterAudio();
    setLoadingLetterId(letterId);

    if (filename) {
      try {
        const url = await getDownloadURL(ref(storage, `${LETTER_AUDIO_FOLDER}/${filename}`));
        if (requestRef.current !== requestId) return;

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          if (requestRef.current === requestId) setPlayingLetterId(null);
        };
        audio.onerror = () => {
          if (requestRef.current !== requestId) return;
          setLoadingLetterId(null);
          speakFallback(fallbackSpeechText, letterId);
        };

        setLoadingLetterId(null);
        setPlayingLetterId(letterId);
        await audio.play();
        return;
      } catch (error) {
        if (requestRef.current !== requestId) return;
      }
    }

    setLoadingLetterId(null);
    speakFallback(fallbackSpeechText, letterId);
  }, [speakFallback, stopLetterAudio]);

  const isLoadingCurrent = useCallback((letter) => loadingLetterId === getLetterId(letter), [loadingLetterId]);
  const isPlayingCurrent = useCallback((letter) => playingLetterId === getLetterId(letter), [playingLetterId]);

  useEffect(() => stopLetterAudio, [stopLetterAudio]);

  return {
    playLetterAudio,
    stopLetterAudio,
    isLoadingCurrent,
    isPlayingCurrent,
    loadingLetterId,
    playingLetterId,
    isLoading: Boolean(loadingLetterId),
  };
}

export default useLetterAudio;