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

  const activeLesson = partTwoWorkbookLessons[activeLessonIndex];
  const progress = useMemo(
    () => Math.round(((activeLessonIndex + 1) / partTwoWorkbookLessons.length) * 100),
    [activeLessonIndex]
  );

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

  return (
    <main className="min-h-screen bg-[#07170f] text-white px-4 py-8 md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-[#102319] p-6 shadow-2xl shadow-black/20 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <aside className="rounded-3xl border border-white/10 bg-black/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
                Part Two
              </p>
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight md:text-4xl">
                Reading Workbook
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Unit rules and lesson drills stay together so students can see how The Guided Reciter connects to Towards Reading the Qur'an.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-[#07170f]/70 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Workbook progress</span>
                  <span className="font-bold text-emerald-300">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-6 max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                {partTwoWorkbookLessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setActiveLessonIndex(index)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      index === activeLessonIndex
                        ? 'border-emerald-400/60 bg-emerald-500/15'
                        : 'border-white/10 bg-white/[0.03] hover:border-emerald-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === activeLessonIndex ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'
                      }`}>
                        {lesson.unitNumber}
                      </span>
                      <div>
                        <p className="font-semibold text-white">Unit {lesson.unitNumber} / Lesson {lesson.lessonNumber}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{lesson.subtitle}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#142a1e] p-6 md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
                      Unit {activeLesson.unitNumber} / Lesson {activeLesson.lessonNumber} of {partTwoWorkbookLessons.length}
                    </p>
                    <div className="mt-3 space-y-3">
                      <h2 className="font-serif text-3xl font-bold leading-tight md:text-5xl">
                        UNIT {activeLesson.unitNumber} <span className="text-xl font-semibold text-emerald-200 md:text-2xl">(The Guided Reciter)</span>
                      </h2>
                      <p className="text-lg font-bold uppercase tracking-[0.18em] text-slate-300 md:text-xl">
                        LESSON {activeLesson.lessonNumber} <span className="normal-case tracking-normal text-slate-400">(Towards Reading the Qur'an)</span>
                      </p>
                      <p className="text-2xl font-black text-emerald-100 md:text-3xl">{activeLesson.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => goToLesson(-1)}
                      disabled={activeLessonIndex === 0}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous Unit
                    </button>
                    <button
                      type="button"
                      onClick={() => goToLesson(1)}
                      disabled={activeLessonIndex === partTwoWorkbookLessons.length - 1}
                      className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next Unit <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-400/20 bg-[#102319] p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">The Guided Reciter Rule</p>
                    <h3 className="font-serif text-2xl font-bold text-white">{activeLesson.rule.title}</h3>
                  </div>
                </div>
                <p className="max-w-3xl text-lg leading-8 text-slate-200">{activeLesson.rule.explanation}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#102319] p-6 md:p-8">
                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">Towards Reading the Qur'an Examples</p>
                    <h3 className="mt-2 font-serif text-3xl font-bold text-white">Practice Word Drills</h3>
                  </div>
                  <p className="text-sm text-slate-400">Flow: Listen, Record, Replay, Compare.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {activeLesson.examples.map((example) => {
                    const isActive = activeExampleId === example.id;
                    const isRecording = recordingExampleId === example.id;
                    const hasRecording = Boolean(recordedExamples[example.id]);

                    return (
                      <article
                        key={example.id}
                        className={`rounded-3xl border p-5 transition ${
                          isActive ? 'border-emerald-400/70 bg-emerald-500/10' : 'border-white/10 bg-[#07170f]/70'
                        }`}
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
                            {example.id.replace('ex-', 'Example ')}
                          </span>
                          <button
                            type="button"
                            onClick={() => playExampleAudio(example)}
                            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-emerald-300"
                            aria-label="Listen to example"
                          >
                            <Volume2 className="h-5 w-5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => playExampleAudio(example)}
                          className="w-full rounded-2xl bg-black/35 px-4 py-8 text-center font-arabic text-5xl leading-none text-white transition hover:bg-black/50"
                        >
                          {example.arabicText}
                        </button>

                        <div className="mt-5 space-y-3">
                          <button
                            type="button"
                            onClick={() => (isRecording ? stopRecording() : startRecording(example.id))}
                            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                              isRecording ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-emerald-500 text-black hover:bg-emerald-400'
                            }`}
                          >
                            <Mic className="h-4 w-4" /> {isRecording ? 'Stop Recording' : 'Start Recording'}
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => playRecording(example.id)}
                              disabled={!hasRecording}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-emerald-300/50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Play className="h-3.5 w-3.5" /> Replay
                            </button>
                            <button
                              type="button"
                              onClick={() => clearRecording(example.id)}
                              disabled={!hasRecording}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-red-300/50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <RotateCcw className="h-3.5 w-3.5" /> Retry
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}