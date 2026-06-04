import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, Loader2, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function AudioPlayer({ src, label = 'Audio', className = '' }) {
  const audioRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle|loading|playing|paused|error
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const hasNativeAudio = Boolean(src);
  const canReplay = duration > 0 && currentTime > 0;

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  function attachAudio() {
    if (!src) return null;
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onended = () => {
      setStatus('paused');
      setCurrentTime(audio.duration || 0);
    };
    audio.onerror = () => {
      setStatus('error');
      setError('Audio could not be loaded. Please try again or ask admin to update the file.');
    };
    audioRef.current = audio;
    return audio;
  }

  async function play() {
    setError('');

    if (!hasNativeAudio) {
      setStatus('error');
      setError('No official audio uploaded for this letter yet.');
      return;
    }

    const audio = audioRef.current || attachAudio();
    if (!audio) return;

    setStatus('loading');
    try {
      await audio.play();
      setStatus('playing');
    } catch {
      setStatus('error');
      setError('Playback was blocked. Tap again to play audio.');
    }
  }

  function pause() {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus('paused');
    }
  }

  function replay() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    play();
  }

  return (
    <div className={`rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)] p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#d9fbe8]">{label}</p>
        <span className="text-xs text-[rgba(217,251,232,0.62)]">{formatTime(currentTime)} / {duration ? formatTime(duration) : '--:--'}</span>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[rgba(148,163,184,0.28)]">
        <div className="h-2 rounded-full bg-[#22c55e] transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {status === 'playing' ? (
          <Button variant="secondary" size="sm" onClick={pause}>
            <Pause size={14} /> Pause
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={play}>
            {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} {status === 'loading' ? 'Loading...' : 'Play'}
          </Button>
        )}

        <Button variant="ghost" size="sm" onClick={replay} disabled={!hasNativeAudio}>
          <RotateCcw size={14} /> Replay
        </Button>
      </div>

      {status === 'loading' ? <p className="mt-2 text-xs text-[rgba(217,251,232,0.62)]">Buffering audio...</p> : null}

      {error ? (
        <p className="mt-3 inline-flex items-start gap-2 rounded-xl border border-[rgba(248,113,113,0.45)] bg-[rgba(127,29,29,0.28)] px-3 py-2 text-xs text-[#fecaca]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : (
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-[rgba(217,251,232,0.5)]">
          <Volume2 size={13} /> Tap Play to listen before recording.
        </p>
      )}
    </div>
  );
}
