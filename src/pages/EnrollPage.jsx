import React from "react";

const COURSES = [
  {
    title: "Qira'at",
    arabic: "القراءات",
    level: "Advanced",
    pricing: "Group: R 450/mo · Private: R 700/mo",
    description: "Advanced recitation modes for dedicated students of the Qur'an.",
    comingSoon: false,
    glow: "border-rose-300/30",
  },
  {
    title: "Fiqh",
    arabic: "الفقه",
    level: "All Levels",
    pricing: "Pricing on request",
    description: "Practical Islamic law for everyday worship, transactions, and conduct.",
    comingSoon: true,
    glow: "border-indigo-300/30",
  },
  {
    title: "Hadith Studies",
    arabic: "الحديث",
    level: "Intermediate",
    pricing: "Pricing on request",
    description: "Study sayings of the Prophet with context, chain, and explanation.",
    comingSoon: true,
    glow: "border-cyan-300/30",
  },
  {
    title: "Tafsir",
    arabic: "التفسير",
    level: "Intermediate",
    pricing: "Pricing on request",
    description: "Deep understanding of Qur'anic verses, meanings, and scholarly insights.",
    comingSoon: true,
    glow: "border-violet-300/30",
  },
  {
    title: "Cupping Course",
    arabic: "الحجامة",
    level: "All Levels",
    pricing: "Pricing on request",
    description: "Learn Sunnah Hijama principles with practical and ethical foundations.",
    comingSoon: true,
    glow: "border-orange-300/30",
  },
];

export default function EnrollPage({ setPage }) {
  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Enrollment</p>
        <h1 className="section-title">Specialized Courses</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Expanding Islamic learning beyond Tajwid through carefully structured courses.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {COURSES.map((course) => (
          <article key={course.title} className={`panel-base border p-5 ${course.glow}`}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-white">{course.title}</h2>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">{course.level}</span>
            </div>
            <p className="text-sm font-semibold text-slate-300">{course.arabic}</p>
            <p className="mt-3 text-[15px] leading-7 text-muted">{course.description}</p>
            <p className="mt-4 text-sm font-semibold text-emerald-200">{course.pricing}</p>
            <button
              type="button"
              disabled={course.comingSoon}
              onClick={() => setPage("contact")}
              className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                course.comingSoon
                  ? "cursor-not-allowed bg-slate-800 text-amber-300"
                  : "bg-gradient-to-b from-emerald-300 to-emerald-400 text-slate-900"
              }`}
            >
              {course.comingSoon ? "Coming Soon" : "Enroll Now"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
