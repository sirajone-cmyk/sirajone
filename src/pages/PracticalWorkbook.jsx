import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Recorder } from '../components/platform/Recorder';
import { PRACTICAL_WORKBOOK_META, PRACTICAL_WORKBOOK_UNITS } from '../data/practicalWorkbook';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Headphones,
  Mic,
  PlayCircle,
  RotateCcw,
  Volume2,
} from 'lucide-react';

function useArabicSpeech() {
  const [speakingId, setSpeakingId] = useState(null);

  const speak = useCallback((text, id) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (speakingId === id) {
      setSpeakingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.58;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  }, [speakingId]);

  return { speak, speakingId };
}

function ProgressRail({ units, activeUnitId, completedUnits, onSelect }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 lg:sticky lg:top-24 lg:self-start">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Beginning Learning</p>
      <div className="space-y-2">
        {units.map((unit, index) => {
          const active = unit.id === activeUnitId;
          const done = completedUnits[unit.id];
          return (
            <button
              key={unit.id}
              type="button"
              onClick={() => onSelect(unit.id)}
              className={`w-full rounded-2xl border p-3 text-left transition ${active ? 'border-emerald-300/50 bg-emerald-400/12' : 'border-white/10 bg-black/10 hover:border-emerald-300/25 hover:bg-white/[0.06]'}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${done ? 'bg-emerald-400 text-emerald-950' : active ? 'bg-emerald-700 text-white' : 'bg-white/8 text-slate-400'}`}>
                  {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">{unit.title}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-slate-500">{unit.focus}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function TeacherCorrectionPanel() {
  return (
    <div className="rounded-3xl border border-amber-300/15 bg-amber-400/10 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-amber-300/15 p-3 text-amber-100">
          <ClipboardCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Teacher Correction</p>
          <h3 className="mt-2 text-xl font-black text-white">Correction audio space</h3>
          <p className="mt-2 text-sm leading-7 text-amber-50/80">
            After a teacher reviews the student's recitation, their correction audio or note can appear here. For now, students can listen, record, replay, compare, and repeat safely on this page.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-amber-200/15 bg-black/10 px-4 py-2 text-sm font-bold text-amber-100/45"
          >
            <PlayCircle className="h-4 w-4" />
            No correction uploaded yet
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticalWorkbook() {
  const [activeUnitId, setActiveUnitId] = useState(PRACTICAL_WORKBOOK_UNITS[0]?.id);
  const [completedUnits, setCompletedUnits] = useState({});
  const { speak, speakingId } = useArabicSpeech();

  const activeUnit = useMemo(() => {
    return PRACTICAL_WORKBOOK_UNITS.find((unit) => unit.id === activeUnitId) || PRACTICAL_WORKBOOK_UNITS[0];
  }, [activeUnitId]);

  const progress = Math.round((Object.values(completedUnits).filter(Boolean).length / PRACTICAL_WORKBOOK_UNITS.length) * 100);

  const playFullUnit = () => {
    const text = activeUnit.drills.map((drill) => drill.arabic).join('. ');
    speak(text, `${activeUnit.id}-full`);
  };

  const markComplete = () => {
    setCompletedUnits((current) => ({ ...current, [activeUnit.id]: !current[activeUnit.id] }));
  };

  const resetUnit = () => {
    window.speechSynthesis?.cancel();
    setCompletedUnits((current) => ({ ...current, [activeUnit.id]: false }));
  };

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.045] to-emerald-950/50 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
          <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-emerald-200">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">{PRACTICAL_WORKBOOK_META.subtitle}</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {PRACTICAL_WORKBOOK_META.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                A practical bridge after the alphabet: students listen to the correct reading, practise short drills, record their own recitation, replay it, and prepare for teacher correction.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={playFullUnit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500"
                >
                  <Headphones className="h-4 w-4" />
                  Listen to Current Unit
                </button>
                <button
                  type="button"
                  onClick={markComplete}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {completedUnits[activeUnit.id] ? 'Marked Complete' : 'Mark Unit Complete'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-400">Workbook progress</span>
                <span className="font-bold text-emerald-300">{progress}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Complete each unit after listening, recording, replaying, and correcting one point.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <ProgressRail
            units={PRACTICAL_WORKBOOK_UNITS}
            activeUnitId={activeUnit.id}
            completedUnits={completedUnits}
            onSelect={setActiveUnitId}
          />

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Practice Unit</p>
                  <h2 className="mt-2 text-3xl font-black text-white">{activeUnit.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">{activeUnit.subtitle}</p>
                </div>
                <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_0.82fr]">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Student Steps</p>
                  <ol className="space-y-2 text-sm leading-6 text-slate-300">
                    {activeUnit.instructions.map((instruction, index) => (
                      <li key={instruction} className="flex gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Teacher Listening Focus</p>
                  <p className="text-sm leading-7 text-slate-300">{activeUnit.teacherNote}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                    <Mic className="h-3.5 w-3.5" />
                    Record after listening
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
              {activeUnit.drills.map((drill, index) => {
                const drillId = `${activeUnit.id}-${index}`;
                const isSpeaking = speakingId === drillId;
                return (
                  <article key={drillId} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-emerald-300/30 hover:bg-emerald-400/10">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Drill {index + 1}</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-200">{drill.transliteration}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => speak(drill.arabic, drillId)}
                        className={`rounded-xl p-2 transition ${isSpeaking ? 'bg-emerald-700 text-white' : 'bg-white/8 text-slate-300 hover:bg-emerald-700 hover:text-white'}`}
                        title="Listen to this drill"
                      >
                        <Volume2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#07120d] p-5 text-center">
                      <div className="font-arabic text-4xl font-bold leading-[1.8] text-white sm:text-5xl" dir="rtl" lang="ar">
                        {drill.arabic}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">{drill.note}</p>
                  </article>
                );
              })}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Student Voice Check</p>
                    <h3 className="mt-2 text-2xl font-black text-white">Record this unit</h3>
                  </div>
                  <button
                    type="button"
                    onClick={resetUnit}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    title="Reset this unit completion"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                <p className="mb-4 text-sm leading-7 text-slate-400">
                  Read the selected unit aloud after listening. Replay your own voice, compare it with the model, then repeat until it becomes clearer.
                </p>
                <Recorder />
              </div>

              <TeacherCorrectionPanel />
            </section>

            <section className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Source Note</p>
              <p className="mt-2 text-sm leading-7 text-emerald-50/80">
                {PRACTICAL_WORKBOOK_META.source} This page is not a PDF viewer; it is an editable, interactive workbook built for listening, recording, replay, and teacher-guided correction.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}