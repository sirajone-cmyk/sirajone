import { BookOpen, ChevronLeft, ChevronRight, Mic, Play, RotateCcw, Volume2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { partTwoWorkbookLessons } from '../data/partTwoWorkbook';

export default function PartTwoWorkbook() {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeExampleId, setActiveExampleId] = useState(null);
  const [recordingExampleId, setRecordingExampleId] = useState(null);
  const [recordedExamples, setRecordedExamples] = useState({});
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentLesson = partTwoWorkbookLessons[activeLessonIndex];
  const activeExample = useMemo(
    () => currentLesson.examples.find((item) => item.id === activeExampleId) || currentLesson.examples[0],
    [activeExampleId, currentLesson.examples]
  );
  const activeRecordingUrl = activeExample ? recordedExamples[activeExample.id] : null;

  const goToLesson = (direction) => {
    setActiveLessonIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return Math.min(Math.max(nextIndex, 0), partTwoWorkbookLessons.length - 1);
    });
    setActiveExampleId(null);
    setRecordingExampleId(null);
  };

  const playExampleAudio = (example) => {
    setActiveExampleId(example.id);

    if (example.audioUrl) {
      const audio = new Audio(example.audioUrl);
      audio.play().catch(() => undefined);
    }
  };

  const startRecording = async (exampleId) => {
    if (!navigator.mediaDevices?.getUserMedia) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      setRecordedExamples((current) => ({ ...current, [exampleId]: audioUrl }));
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current = recorder;
    setRecordingExampleId(exampleId);
    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecordingExampleId(null);
  };

  const playRecording = (exampleId) => {
    const recordingUrl = recordedExamples[exampleId];
    if (!recordingUrl) return;

    const audio = new Audio(recordingUrl);
    audio.play().catch(() => undefined);
  };

  const clearRecording = (exampleId) => {
    setRecordedExamples((current) => {
      const next = { ...current };
      delete next[exampleId];
      return next;
    });
  };

  const handleExampleClick = (example) => {
    playExampleAudio(example);
  };

  return (
    <main className="min-h-screen bg-[#07170f] text-white px-3 py-6 sm:px-6">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 bg-[#121212] rounded-[2rem] border border-emerald-400/20 shadow-2xl shadow-black/30">
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
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
            Part Two Workbook
          </p>
          <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
            UNIT {currentLesson.unitNumber} <span className="block text-lg font-semibold text-emerald-200 sm:text-2xl">(The Guided Reciter)</span>
          </h1>
          <p className="mt-4 text-base font-bold uppercase tracking-[0.18em] text-slate-300 sm:text-xl">
            LESSON {currentLesson.lessonNumber} <span className="normal-case tracking-normal text-slate-400">(Towards Reading the Qur'an)</span>
          </p>
          <p className="mt-3 text-2xl font-black text-emerald-100 sm:text-3xl">{currentLesson.subtitle}</p>
        </header>

        <section className="mb-6 rounded-3xl border border-emerald-400/20 bg-[#17251d] p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">The Guided Reciter Rule</p>
              <h2 className="font-serif text-2xl font-bold text-white">{currentLesson.rule.title}</h2>
            </div>
          </div>
          <p className="text-base leading-8 text-slate-200 sm:text-lg">{currentLesson.rule.explanation}</p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#171717] p-5 sm:p-7">
          <div className="mb-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Towards Reading the Qur'an Examples</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-white">Practice Grid</h2>
            <p className="mt-2 text-sm text-slate-400">Tap any square: Listen, Record, Replay, Compare.</p>
          </div>

          <div dir="rtl" className="grid grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {currentLesson.examples.map((item) => {
              const isActive = activeExampleId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleExampleClick(item)}
                  className={`aspect-square flex flex-col items-center justify-center bg-[#1e1e1e] border border-gray-800 rounded-xl p-2 hover:border-green-500 transition-colors cursor-pointer ${
                    isActive ? 'border-green-500 ring-2 ring-green-500/20' : ''
                  }`}
                  aria-label={`Practise ${item.arabicText || item.id}`}
                >
                  <span className={`text-4xl sm:text-5xl font-bold font-arabic text-center ${item.isHighlighted ? 'text-red-500' : 'text-white'}`}>
                    {item.arabicText || '—'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-white/10 bg-[#101010] p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold text-white">Selected Practice</h3>
                <p className="text-sm text-slate-400">Use this control bar for the square you selected.</p>
              </div>
              <div className="rounded-2xl bg-black/40 px-5 py-3 font-arabic text-3xl text-white">
                {activeExample?.arabicText || '—'}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => activeExample && playExampleAudio(activeExample)}
                disabled={!activeExample}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Volume2 className="h-4 w-4" /> Listen
              </button>

              <button
                type="button"
                onClick={() => activeExample && (recordingExampleId === activeExample.id ? stopRecording() : startRecording(activeExample.id))}
                disabled={!activeExample}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  recordingExampleId === activeExample?.id ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                <Mic className="h-4 w-4" /> {recordingExampleId === activeExample?.id ? 'Stop' : 'Record'}
              </button>

              <button
                type="button"
                onClick={() => activeExample && playRecording(activeExample.id)}
                disabled={!activeRecordingUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-green-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play className="h-4 w-4" /> Replay
              </button>

              <button
                type="button"
                onClick={() => activeExample && clearRecording(activeExample.id)}
                disabled={!activeRecordingUrl}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
