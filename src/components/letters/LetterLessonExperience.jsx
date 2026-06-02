import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Search,
  Square,
  Trash2,
  Volume2,
  Waves,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { usePlatform } from '../../state/PlatformContext';
import {
  DEFAULT_LETTER_LESSON_ID,
  LETTER_LESSONS,
  LETTER_LESSON_TABS,
} from '../../data/letterLessons';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function useOfficialAudio(lesson, uploadedSrc) {
  const audioRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Tap Play to listen before recording.');
  const source = uploadedSrc || '';

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setStatusMessage('Tap Play to listen before recording.');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [lesson.id, source]);

  function stopCurrentPlayback() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }

  function startFallbackSpeech() {
    if (!('speechSynthesis' in window)) {
      setStatusMessage(
        'No uploaded audio is available yet, and browser speech playback is unsupported here.'
      );
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson.practiceFallbackText);
    utterance.rate = 0.72;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    const fallbackDurationSeconds = Math.ceil(
      (lesson.practiceFallbackDurationMs || 2200) / 1000
    );
    setDuration(fallbackDurationSeconds);
    setCurrentTime(0);
    setStatusMessage('Using browser fallback pronunciation.');
    setIsPlaying(true);

    const startedAt = Date.now();
    fallbackTimerRef.current = window.setInterval(() => {
      const elapsedSeconds = (Date.now() - startedAt) / 1000;
      if (elapsedSeconds >= fallbackDurationSeconds) {
        setCurrentTime(fallbackDurationSeconds);
        return;
      }
      setCurrentTime(elapsedSeconds);
    }, 100);

    utterance.onend = () => {
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      setCurrentTime(fallbackDurationSeconds);
      setIsPlaying(false);
      setStatusMessage('Fallback model pronunciation played successfully.');
    };

    utterance.onerror = () => {
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      setIsPlaying(false);
      setStatusMessage('Browser speech playback was blocked. Try Play again.');
    };

    window.speechSynthesis.speak(utterance);
  }

  async function play() {
    stopCurrentPlayback();

    if (source) {
      const audio = new Audio(source);
      audio.preload = 'auto';
      audioRef.current = audio;
      audio.onloadedmetadata = () => {
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime || 0);
      };
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(audio.duration || 0);
        setStatusMessage('Official audio played successfully.');
      };
      audio.onerror = () => {
        startFallbackSpeech();
      };

      try {
        setIsPlaying(true);
        setStatusMessage('Playing official audio...');
        await audio.play();
      } catch {
        startFallbackSpeech();
      }
      return;
    }

    startFallbackSpeech();
  }

  function pause() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setIsPlaying(false);
    setStatusMessage('Playback paused.');
  }

  function replay() {
    setCurrentTime(0);
    play();
  }

  return {
    isPlaying,
    currentTime,
    duration,
    statusMessage,
    hasUploadedAudio: Boolean(source),
    play,
    pause,
    replay,
  };
}

function LessonOfficialAudioCard({ lesson, uploadedSrc }) {
  const {
    isPlaying,
    currentTime,
    duration,
    statusMessage,
    hasUploadedAudio,
    play,
    pause,
    replay,
  } = useOfficialAudio(lesson, uploadedSrc);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <article className="letter-lesson-practice-card">
      <div className="letter-lesson-practice-top">
        <div>
          <h4>{lesson.practiceAudioLabel}</h4>
          <p className="letter-lesson-practice-meta">
            {hasUploadedAudio
              ? 'Uploaded model audio available'
              : 'Using browser fallback if no upload exists'}
          </p>
        </div>
        <span className="letter-lesson-practice-clock">
          {formatClock(currentTime)} / {duration ? formatClock(duration) : '--:--'}
        </span>
      </div>

      <div className="letter-lesson-progress-bar" aria-hidden="true">
        <div className="letter-lesson-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="letter-lesson-practice-actions">
        <Button variant="primary" size="sm" onClick={isPlaying ? pause : play}>
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="secondary" size="sm" onClick={replay}>
          <RotateCcw size={15} /> Replay
        </Button>
      </div>

      <p className="letter-lesson-practice-helper">
        <Volume2 size={14} /> Tap Play to listen before recording.
      </p>
      <p className="letter-lesson-practice-status">{statusMessage}</p>
    </article>
  );
}

function LessonRecorderCard() {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPlaybackRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [message, setMessage] = useState('Flow: Listen, Record, Play, Compare, Repeat.');

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
        audioPlaybackRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMessage(
        'Recording is not supported in this browser. You can still use the official audio model.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        const nextUrl = URL.createObjectURL(blob);
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        setAudioUrl(nextUrl);
        setStatus('ready');
        setMessage('Great work today. Your recording is ready to review.');
        chunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setStatus('recording');
      setRecordingTime(0);
      setMessage('Recording in progress...');
      timerRef.current = window.setInterval(() => {
        setRecordingTime((previous) => previous + 1);
      }, 1000);
    } catch {
      setStatus('idle');
      setMessage('Microphone permission was denied. Please allow mic access and try again.');
    }
  }

  function stopRecording() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }

  function playRecording() {
    if (!audioUrl) return;
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioPlaybackRef.current = audio;
    setStatus('playing');
    setMessage('Playing your recording back now.');
    audio.onended = () => {
      setStatus('ready');
      setMessage('Review your recording, compare it, and try again if needed.');
    };
    audio.play().catch(() => {
      setStatus('ready');
      setMessage('Unable to play your recording. Please try again.');
    });
  }

  function resetRecording() {
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
      audioPlaybackRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl('');
    setStatus('idle');
    setRecordingTime(0);
    setMessage('Recording cleared. Try again whenever you are ready.');
  }

  return (
    <article className="letter-lesson-practice-card">
      <div className="letter-lesson-practice-top">
        <div>
          <h4>Student Recording</h4>
          <p className="letter-lesson-practice-meta">Use this to record your recitation.</p>
        </div>
        <span className="letter-lesson-practice-clock">{formatClock(recordingTime)}</span>
      </div>

      <div className="letter-lesson-practice-actions">
        {status === 'recording' ? (
          <Button variant="danger" size="sm" onClick={stopRecording}>
            <Square size={15} /> Stop Recording
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={startRecording}>
            <Mic size={15} /> Start Recording
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={playRecording}
          disabled={!audioUrl || status === 'recording'}
        >
          <Play size={15} /> Play Recording
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetRecording}
          disabled={!audioUrl && status === 'idle'}
        >
          <Trash2 size={15} /> Delete / Try Again
        </Button>
      </div>

      <p className="letter-lesson-practice-status">{message}</p>
      <p className="letter-lesson-practice-helper">Flow: Listen, Record, Play, Compare, Repeat.</p>
    </article>
  );
}

function LessonDiagramViewer({ lesson }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  function zoomIn() {
    setScale((previous) => Math.min(3, Number((previous + 0.2).toFixed(2))));
  }

  function zoomOut() {
    setScale((previous) => Math.max(0.8, Number((previous - 0.2).toFixed(2))));
  }

  function resetZoom() {
    setScale(1);
  }

  function fitToFrame() {
    setScale(1);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="letter-lesson-tab-panel">
      <div className="letter-lesson-view-head">
        <h3 className="letter-lesson-view-title">Diagram Area</h3>
        <div className="letter-lesson-diagram-controls">
          <button type="button" className="letter-lesson-chip-btn focus-ring" onClick={fitToFrame}>
            <Search size={13} /> Fit to Frame
          </button>
          <button type="button" className="letter-lesson-chip-btn focus-ring" onClick={zoomIn}>
            <ZoomIn size={13} /> Zoom In
          </button>
          <button type="button" className="letter-lesson-chip-btn focus-ring" onClick={zoomOut}>
            <ZoomOut size={13} /> Zoom Out
          </button>
          <button type="button" className="letter-lesson-chip-btn focus-ring" onClick={resetZoom}>
            <RotateCcw size={13} /> Reset Zoom
          </button>
        </div>
      </div>

      <div className="letter-lesson-diagram-shell">
        <p className="letter-lesson-diagram-label">{lesson.diagramLabel}</p>
        <div ref={containerRef} className="letter-lesson-diagram-stage">
          <img
            src={lesson.diagramSrc}
            alt={lesson.diagramAlt}
            className="letter-lesson-diagram-image"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </div>
  );
}

function LessonWorkspaceBody({ lesson }) {
  const { state } = usePlatform();
  const [activeTab, setActiveTab] = useState('makhraj');
  const activeAudioSource = state.audioByLetter?.[lesson.audioKey] || '';

  useEffect(() => {
    setActiveTab('makhraj');
  }, [lesson.id]);

  return (
    <div className="letter-lesson-workspace-shell">
      <header className="letter-lesson-workspace-hero">
        <span className="letter-lesson-hero-letter" aria-hidden="true">
          {lesson.letter}
        </span>
        <p className="letter-lesson-hero-meta">
          Letter {lesson.lessonNumber} of {lesson.totalLetters}
        </p>
        <h3>{lesson.englishName}</h3>
        <p className="letter-lesson-hero-arabic" dir="rtl" lang="ar">
          {lesson.arabicName}
        </p>
      </header>

      <nav className="letter-lesson-tab-nav" aria-label={`${lesson.englishName} lesson tabs`}>
        {LETTER_LESSON_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`letter-lesson-tab-btn focus-ring ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.key === 'makhraj' ? <Play size={14} /> : null}
            {tab.key === 'diagram' ? <Waves size={14} /> : null}
            {tab.key === 'practice' ? <Mic size={14} /> : null}
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="letter-lesson-workspace-content">
        {activeTab === 'makhraj' ? (
          <div className="letter-lesson-tab-panel">
            <h3 className="letter-lesson-view-title">{lesson.makhrajTitle}</h3>
            <div className="letter-lesson-info-card">
              {lesson.makhrajParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'sifaat' ? (
          <div className="letter-lesson-tab-panel">
            <h3 className="letter-lesson-view-title">{lesson.sifaatTitle}</h3>
            <div className="letter-lesson-sifaat-grid">
              {lesson.sifaat.map((item) => (
                <article key={item.heading} className="letter-lesson-sifah-card">
                  <h4>{item.heading}</h4>
                  <p className="letter-lesson-sifah-meaning">Simple meaning:</p>
                  <p>{item.simpleMeaning}</p>
                  <p>{item.explanation}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'steps' ? (
          <div className="letter-lesson-tab-panel">
            <h3 className="letter-lesson-view-title">{lesson.stepsTitle}</h3>
            <div className="letter-lesson-step-flow">
              {lesson.steps.map((step) => (
                <article key={step.title} className="letter-lesson-step-card">
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'diagram' ? <LessonDiagramViewer lesson={lesson} /> : null}

        {activeTab === 'practice' ? (
          <div className="letter-lesson-tab-panel">
            <h3 className="letter-lesson-view-title">Practice</h3>
            <div className="letter-lesson-practice-shell">
              <p>{lesson.practicePrompt}</p>
              <p>{lesson.practiceLoopNote}</p>
              <div className="letter-lesson-practice-grid">
                <LessonOfficialAudioCard lesson={lesson} uploadedSrc={activeAudioSource} />
                <LessonRecorderCard />
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function LessonWorkspaceModal({ open, onClose, activeLessonId, onChangeLessonId }) {
  const activeIndex = Math.max(
    LETTER_LESSONS.findIndex((lesson) => lesson.id === activeLessonId),
    0
  );
  const activeLesson = LETTER_LESSONS[activeIndex] || LETTER_LESSONS[0];

  function move(direction) {
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= LETTER_LESSONS.length) return;
    onChangeLessonId(LETTER_LESSONS[nextIndex].id);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={activeLesson.modalTitle}
      className="letter-lesson-modal"
    >
      <div className="letter-lesson-modal-inner">
        <LessonWorkspaceBody lesson={activeLesson} />

        <div className="letter-lesson-workspace-footer">
          <button
            type="button"
            className="letter-lesson-nav-btn focus-ring"
            onClick={() => move(-1)}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={15} /> Previous Letter
          </button>

          <button
            type="button"
            className="letter-lesson-nav-btn focus-ring"
            onClick={() => move(1)}
            disabled={activeIndex === LETTER_LESSONS.length - 1}
          >
            Next Letter <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function LetterLessonExperience({
  eyebrow = 'Interactive Guide',
  title = 'Letter Lessons',
  subtitle = 'Only completed lessons are shown right now. Hamzah and Bā’ are available to open and practise.',
  sectionId,
  mode = 'section',
}) {
  const [open, setOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(DEFAULT_LETTER_LESSON_ID);

  function openLesson(lessonId) {
    setActiveLessonId(lessonId);
    setOpen(true);
  }

  const content = (
    <div className={`letter-lesson-experience ${mode === 'admin' ? 'is-admin' : ''}`}>
      <div className="letter-lesson-head">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      <div className="letter-lesson-card-grid">
        {LETTER_LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            type="button"
            className="letter-lesson-card focus-ring"
            onClick={() => openLesson(lesson.id)}
          >
            <div className="letter-lesson-card-main">
              <span className="letter-lesson-card-letter" aria-hidden="true">
                {lesson.letter}
              </span>
              <div>
                <p className="letter-lesson-card-kicker">
                  Letter {lesson.lessonNumber} of {lesson.totalLetters}
                </p>
                <h3>{lesson.englishName}</h3>
                <p className="letter-lesson-card-arabic" dir="rtl" lang="ar">
                  {lesson.arabicName}
                </p>
              </div>
            </div>

            <span className="letter-lesson-open-btn">
              <BookOpen size={18} /> {lesson.openLabel}
            </span>
          </button>
        ))}
      </div>

      <LessonWorkspaceModal
        open={open}
        onClose={() => setOpen(false)}
        activeLessonId={activeLessonId}
        onChangeLessonId={setActiveLessonId}
      />
    </div>
  );

  if (mode === 'section') {
    return (
      <section id={sectionId} className="letter-lesson-section">
        {content}
      </section>
    );
  }

  return content;
}
