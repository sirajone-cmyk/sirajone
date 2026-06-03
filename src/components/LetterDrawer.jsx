import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, GraduationCap, MapPin, Sparkles, X } from 'lucide-react';

function defaultColorForSifah() {
  return 'bg-white/10 text-slate-200';
}

function sifahName(item) {
  return (item.name || '').split('—')[0].trim();
}

export default function LetterDrawer({ letter, onClose, colorForSifah = defaultColorForSifah }) {
  useEffect(() => {
    const handler = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {letter && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0b1a12] shadow-2xl shadow-black/50"
          >
            <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1a12]/95 p-5 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="font-arabic text-6xl font-bold leading-none text-white" dir="rtl" lang="ar">
                    {letter.arabic}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                      Letter {letter.num} of 28
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">{letter.name}</h2>
                    <p className="mt-1 text-sm text-slate-400">Master Your Makhraj lesson note</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close letter details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="space-y-5 p-5 sm:p-6">
              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                <div className="mb-3 flex items-center gap-2 text-emerald-300">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Makhraj — Articulation Point</h3>
                </div>
                <p className="text-base leading-8 text-slate-100">{letter.makhraj?.desc}</p>

                {letter.makhraj?.how?.length ? (
                  <div className="mt-5">
                    <h4 className="mb-3 text-sm font-bold text-white">It is made by:</h4>
                    <div className="space-y-2">
                      {letter.makhraj.how.map((item) => (
                        <p key={item} className="flex gap-2 rounded-2xl border border-white/10 bg-black/10 p-3 text-sm leading-6 text-slate-300">
                          <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-300" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}

                {letter.makhraj?.notes?.length ? (
                  <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-400/10 p-4">
                    <h4 className="text-sm font-bold text-emerald-100">Teacher Notes</h4>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-emerald-50/80">
                      {letter.makhraj.notes.map((note) => (
                        <li key={note}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                <div className="mb-4 flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Sifaat — Qualities</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {letter.sifaat.map((item) => {
                    const name = sifahName(item);
                    return (
                      <article key={`${letter.num}-${item.name}`} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${colorForSifah(name)}`}>
                            {name}
                          </span>
                          <span className="font-arabic text-lg text-emerald-100" dir="rtl" lang="ar">
                            {item.arabic}
                          </span>
                        </div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.exp}</p>
                      </article>
                    );
                  })}
                </div>
              </section>

              {letter.steps?.length ? (
                <section className="rounded-3xl border border-white/10 bg-white/[0.045] p-5">
                  <div className="mb-4 flex items-center gap-2 text-emerald-300">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Step-by-Step Placement Guide</h3>
                  </div>
                  <div className="space-y-3">
                    {letter.steps.map((step, index) => (
                      <article key={`${step.label}-${index}`} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                          Step {index + 1}
                        </p>
                        <h4 className="mt-1 font-bold text-white">{step.label}</h4>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{step.desc}</p>
                        {step.note ? <p className="mt-2 text-sm leading-6 text-emerald-100">{step.note}</p> : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="rounded-3xl border border-emerald-300/15 bg-emerald-400/10 p-5">
                <div className="mb-3 flex items-center gap-2 text-emerald-100">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Book Method Reminder</h3>
                </div>
                <p className="text-sm leading-7 text-emerald-50/80">
                  Read the makhraj carefully, place the tongue or lips as described, listen to a teacher demonstrate it, then practise the letter with vowels. This app page is a companion to oral correction.
                </p>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
