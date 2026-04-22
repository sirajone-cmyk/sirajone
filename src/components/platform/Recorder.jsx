import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, Mic, Square, Trash2, Volume2 } from 'lucide-react';
import { Button } from '../ui/Button';

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function Recorder({ className = '' }) {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const [status, setStatus] = useState('idle'); // idle|recording|ready|playing
  const [permission, setPermission] = useState('unknown'); // unknown|granted|denied
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');

  const hasRecording = Boolean(audioUrl);

  const recordingText = useMemo(() => {
    if (status === 'recording') return `Recording... ${formatDuration(seconds)}`;
    if (status === 'ready') return 'Recording saved. You can play or retry.';
    if (status === 'playing') return 'Playing your recording...';
    return 'Use this to record your recitation.';
  }, [status, seconds]);

  async function requestMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission('granted');
      return stream;
    } catch {
      setPermission('denied');
      setError('Microphone permission was denied. Please allow mic access in browser settings.');
      return null;
    }
  }

  async function startRecording() {
    setError('');
    const stream = await requestMic();
    if (!stream) return;

    streamRef.current = stream;
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus('ready');
      chunksRef.current = [];

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    recorder.start();
    setStatus('recording');
    setSeconds(0);
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function playRecording() {
    if (!audioUrl) return;
    setStatus('playing');
    const audio = new Audio(audioUrl);
    audio.onended = () => setStatus('ready');
    audio.play().catch(() => {
      setStatus('ready');
      setError('Unable to play your recording. Please try again.');
    });
  }

  function clearRecording() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl('');
    setStatus('idle');
    setSeconds(0);
    setError('');
  }

  return (
    <div className={`rounded-2xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)] p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#d9fbe8]">Student Recording</p>
        <span className="text-xs text-[rgba(217,251,232,0.62)]">{formatDuration(seconds)}</span>
      </div>

      <p className="mt-2 text-xs text-[rgba(217,251,232,0.7)]">{recordingText}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {status !== 'recording' ? (
          <Button variant="primary" size="sm" onClick={startRecording}>
            <Mic size={14} /> Start Recording
          </Button>
        ) : (
          <Button variant="danger" size="sm" onClick={stopRecording}>
            <Square size={14} /> Stop Recording
          </Button>
        )}

        <Button variant="secondary" size="sm" onClick={playRecording} disabled={!hasRecording || status === 'recording'}>
          <Volume2 size={14} /> Play Recording
        </Button>

        <Button variant="ghost" size="sm" onClick={clearRecording} disabled={!hasRecording}>
          <Trash2 size={14} /> Delete / Try Again
        </Button>
      </div>

      {permission === 'denied' ? (
        <p className="mt-3 inline-flex items-start gap-2 rounded-xl border border-[rgba(248,113,113,0.45)] bg-[rgba(127,29,29,0.28)] px-3 py-2 text-xs text-[#fecaca]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Microphone permission denied. Enable mic access and retry.
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs text-[#fecaca]">{error}</p>
      ) : (
        <p className="mt-3 text-xs text-[rgba(217,251,232,0.5)]">Flow: Listen, Record, Play, Compare, Repeat.</p>
      )}
    </div>
  );
}
