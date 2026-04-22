import React from "react";
import ProgramCard from "./ProgramCard";

const PROGRAMS = [
  {
    icon: "📘",
    title: "Qa'idah & Qur'an Reading",
    description: "Build script fluency and accurate pronunciation with a guided reading progression.",
    level: "Beginner",
  },
  {
    icon: "🧭",
    title: "Tajwid Foundations",
    description: "Learn core rules with practical recitation habits for correct, confident delivery.",
    level: "Core",
  },
  {
    icon: "🕋",
    title: "Hifz Programme",
    description: "Memorise with structure, daily rhythm, and consistent revision methodology.",
    level: "Advanced",
  },
  {
    icon: "🔁",
    title: "Muraja'ah Track",
    description: "Preserve memorisation quality through focused revision cycles and steady supervision.",
    level: "Ongoing",
  },
];

export default function ProgramsPreviewSection() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Programs Preview</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Structured Learning Paths</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.title} {...program} />
          ))}
        </div>
      </div>
    </section>
  );
}
