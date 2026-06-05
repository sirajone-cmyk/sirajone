import { ArrowLeft, ChevronLeft, ChevronRight, Mic, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useMemo, useRef, useState } from 'react';
import { partTwoWorkbookLessons } from '../data/partTwoWorkbook';

export default function PartTwoWorkbook() {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeCellId, setActiveCellId] = useState(null);
  const [recordingCellId, setRecordingCellId] = useState(null);
  const [recordedCells, setRecordedCells] = useState({});
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentLesson = partTwoWorkbookLessons[activeLessonIndex];
  const gridItems = currentLesson.gridItems || currentLesson.examples || [];

  const activeCell = useMemo(
    () => gridItems.find((item) => item.id === activeCellId) || gridItems[0] || null,
    [activeCellId, gridItems]
  );

  const activeRecordingUrl = activeCell ? recordedCells[activeCell.id] : null;

  const goToLesson = (direction) => {
    setActiveLessonIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), partTwoWorkbookLessons.length - 1);
    });
    setActiveCellId(null);
    setRecordingCellId(null);
  };

  const selectCell = (item) => {
    setActiveCellId(item.id);
  };

  const playMasterAudio = (item = activeCell) => {
    if (!item) return;
    setActiveCellId(item.id);

    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play().catch(() => undefined);
    }
  };

  const startRecording = async () => {
    if (!activeCell || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      setRecordedCells((current) => ({ ...current, [activeCell.id]: audioUrl }));
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current = recorder;
    setRecordingCellId(activeCell.id);
    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecordingCellId(null);
  };

  const playRecording = () => {
    if (!activeRecordingUrl) return;

    const audio = new Audio(activeRecordingUrl);
    audio.play().catch(() => undefined);
  };

  const clearRecording = () => {
    if (!activeCell) return;

    setRecordedCells((current) => {
      const next = { ...current };
      delete next[activeCell.id];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#07170f] text-white">
      <Navbar />
      <main className="px-3 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-400/20 bg-[#121212] px-4 py-6 shadow-2xl shadow-black/30 sm:px-6">

        {/* ← Back to Dashboard */}
        <div className="mb-5 px-1">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-3 sm:p-4">
          <button
            type="button"
            onClick={() => goToLesson(-1)}
            disabled={activeLessonIndex === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Previous Unit/Lesson
          </button>

          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">
            Progress: Unit {currentLesson.unitNumber} / {partTwoWorkbookLessons.length}
          </p>

          <button
            type="button"
            onClick={() => goToLesson(1)}
            disabled={activeLessonIndex === partTwoWorkbookLessons.length - 1}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            Next Unit/Lesson <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <header className="mb-6 rounded-3xl border border-white/10 bg-[#18231d] p-5 text-center sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Part Two</p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
            {currentLesson.title}
          </h1>
          <p className="mt-3 text-xl font-black uppercase tracking-[0.12em] text-emerald-100 sm:text-2xl">
            {currentLesson.subtitle}
          </p>
          <div className="mt-5 grid gap-2 text-sm font-bold text-slate-300 sm:grid-cols-2">
            <span className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              UNIT {currentLesson.unitNumber} (The Guided Reciter)
            </span>
            <span className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              LESSON {currentLesson.lessonNumber} (Towards Reading the Qur'an)
            </span>
          </div>
        </header>

        <section className="mb-6 rounded-3xl border-l-4 border-l-[#ffb000] border-y border-r border-emerald-400/20 bg-[#17251d] p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">The Guided Reciter Rule</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">{currentLesson.rule.title}</h2>
          <p className="mt-5 text-base leading-8 text-slate-200 sm:text-lg">{currentLesson.rule.explanation}</p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#171717] p-5 sm:p-7">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
              Towards Reading the Qur'an Examples
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white">Practice Grid</h2>
            <p className="mt-2 text-sm text-slate-400">Tap a square, then use Listen, Record, and Replay below.</p>
          </div>

          <div dir="rtl" className="mx-auto grid max-w-2xl grid-cols-4 gap-3 sm:gap-4">
            {gridItems.map((item) => {
              const isActive = activeCellId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCell(item)}
                  className={`aspect-square flex items-center justify-center rounded-xl border border-gray-800 bg-[#1e1e1e] p-2 text-center font-arabic text-4xl font-bold transition-colors hover:border-green-500 sm:text-5xl ${
                    isActive ? 'border-green-500 ring-2 ring-green-500/20' : ''
                  }`}
                  aria-label={`Practise ${item.arabicText || item.id}`}
                >
                  <span className={item.isHighlighted ? 'text-[#ff2447]' : 'text-white'}>{item.arabicText || '-'}</span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-white/10 bg-[#101010] p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-white">Selected Practice</h3>
                <p className="text-sm text-slate-400">Listen to the master audio, record yourself, then replay.</p>
              </div>
              <div className="rounded-2xl bg-black/40 px-5 py-3 font-arabic text-3xl text-white">
                {activeCell?.arabicText || '-'}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => playMasterAudio()}
                disabled={!activeCell}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Volume2 className="h-4 w-4" /> Listen Master
              </button>

              <button
                type="button"
                onClick={recordingCellId === activeCell?.id ? stopRecording : startRecording}
                disabled={!activeCell}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  recordingCellId === activeCell?.id
                    ? 'bg-red-500 text-white hover:bg-red-400'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                {recordingCellId === activeCell?.id ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {recordingCellId === activeCell?.id ? 'Stop Recording' : 'Record Your Recitation'}
              </button>

              <button
                type="button"
                onClick={playRecording}
                disabled={!activeRecordingUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-4 w-4" /> Replay Playback
              </button>

              <button
                type="button"
                onClick={clearRecording}
                disabled={!activeRecordingUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-[#ff2447] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>
        </section>
      </section>
      </main>
    </div>
  );
}
