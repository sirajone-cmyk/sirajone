import React from "react";

const PROGRAMS = [
  {
    title: "Qa'idah & Qur'an Reading",
    arabic: "القاعدة",
    level: "Beginner",
    duration: "3-6 months",
    description:
      "The foundation of Qur'anic learning. Students master letters, vowels, and connected reading with correct pronunciation.",
    learn: ["Arabic letters & vowels", "Connected reading", "Basic Tajwid application"],
    outcomes: ["Read script clearly", "Apply correct makhraj", "Build recitation confidence"],
    glow: "border-emerald-300/35",
  },
  {
    title: "Tajwid Foundations",
    arabic: "علم التجويد",
    level: "Intermediate",
    duration: "6-12 months",
    description:
      "A complete Tajwid track focused on Makharij, Sifaat, and practical recitation quality.",
    learn: ["Makharij articulation", "Sifaat categories", "Noon/Meem and Madd rules"],
    outcomes: ["Reduce recitation mistakes", "Recite with clarity", "Understand classical structure"],
    glow: "border-amber-300/32",
  },
  {
    title: "Hifz Programme",
    arabic: "حفظ القرآن",
    level: "Advanced",
    duration: "Ongoing",
    description:
      "Structured memorisation with daily Sabaq, Awal Muraja'ah, and Akhir Muraja'ah built into each cycle.",
    learn: ["Daily memorisation plan", "Revision rhythm", "Retention correction"],
    outcomes: ["Retain memorisation strongly", "Maintain Tajwid during Hifz", "Build consistency"],
    glow: "border-indigo-300/35",
  },
  {
    title: "Muraja'ah System",
    arabic: "المراجعة",
    level: "Huffaz",
    duration: "Ongoing",
    description:
      "A rigorous revision framework for students who completed Hifz and want stable long-term fluency.",
    learn: ["Revision cycles", "Weak/strong juz tracking", "Teacher correction loop"],
    outcomes: ["Stronger retention", "Confident revision rhythm", "Ijazah pathway readiness"],
    glow: "border-sky-300/35",
  },
];

export default function ProgramsPage({ setPage }) {
  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Curriculum</p>
        <h1 className="section-title">Our Programs</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Structured Qur'anic education from first letters to memorisation and revision mastery.
        </p>
      </div>

      <div className="space-y-5">
        {PROGRAMS.map((program) => (
          <article key={program.title} className={`panel-base border p-6 ${program.glow}`}>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h2 className="text-[1.75rem] font-bold text-white">{program.title}</h2>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">{program.level}</span>
              <span className="text-sm text-slate-400">{program.duration}</span>
            </div>
            <p className="text-2xl font-semibold text-slate-300">{program.arabic}</p>
            <p className="mt-3 text-[15px] leading-7 text-muted">{program.description}</p>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">What You'll Learn</h3>
                <ul className="space-y-1.5 text-sm text-slate-200">
                  {program.learn.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">Outcomes</h3>
                <ul className="space-y-1.5 text-sm text-slate-200">
                  {program.outcomes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPage("enroll")}
              className="mt-6 rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-5 py-2.5 text-sm font-extrabold text-slate-900 shadow-[0_16px_34px_-18px_rgba(16,185,129,0.95)]"
            >
              Enrol Now
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
