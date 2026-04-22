import React from "react";

const SUMMARY = [
  { label: "Current Program", value: "Tajwid Foundations", sub: "Intermediate track" },
  { label: "Progress", value: "45%", sub: "18 of 40 lessons" },
  { label: "Day Streak", value: "7 days", sub: "Keep it going" },
  { label: "Next Class", value: "Tomorrow", sub: "10:00 AM" },
];

const LESSON_PLAN = [
  {
    title: "Sabaq: Lesson 19",
    details: "Learn Ikhfa rules and apply them with Noon Sakinah and Tanween drills.",
  },
  {
    title: "Awal Muraja'ah: Lessons 10-15",
    details: "Revise idgham with and without ghunnah. Keep transitions smooth.",
  },
  {
    title: "Akhir Muraja'ah: Lessons 1-9",
    details: "Full review of foundational Makharij groups and key Sifaat pairs.",
  },
];

const TAJWID_TRACKER = [
  { topic: "Noon Sakinah & Tanween", status: "Completed" },
  { topic: "Meem Sakinah", status: "Completed" },
  { topic: "Madd Types", status: "In Progress" },
  { topic: "Qalqalah", status: "Pending" },
  { topic: "Lam Rules", status: "Pending" },
  { topic: "Ra Rules", status: "Pending" },
];

const FEEDBACK = [
  {
    date: "2 Apr 2026",
    note: "Excellent progress on Idgham. Pay attention to Meem Mushaddadah shortening.",
  },
  {
    date: "30 Mar 2026",
    note: "Sabaq completed well. Awal Muraja'ah needs more work; revise lessons 7-9 before next class.",
  },
  {
    date: "28 Mar 2026",
    note: "Strong session today. Tajwid rules are being applied correctly. Keep up consistency.",
  },
];

const TOOLS = ["Letter Guide", "Sifaat Reference", "Knowledge Quiz", "Stats"];

function statusClass(status) {
  if (status === "Completed") return "bg-emerald-500/20 text-emerald-200";
  if (status === "In Progress") return "bg-amber-500/20 text-amber-200";
  return "bg-slate-700/60 text-slate-300";
}

export default function DashboardPage({ setPage }) {
  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-[2.25rem] font-extrabold text-white">السَّلامُ عَلَيْكُمْ, Ahmad</h1>
        <p className="mt-2 text-muted">Here is your learning plan for today. Consistency is the key to success.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {SUMMARY.map((item) => (
          <article key={item.label} className="panel-base p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-slate-300">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="panel-base p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Overall Progress</h2>
          <span className="text-sm font-semibold text-emerald-200">45%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-800">
          <div className="h-3 w-[45%] rounded-full bg-gradient-to-r from-emerald-300 to-emerald-500" />
        </div>
        <p className="mt-2 text-sm text-slate-300">18 lessons completed out of 40.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="panel-base p-5">
          <h2 className="mb-4 text-xl font-bold text-white">Today's Lesson Plan</h2>
          <div className="space-y-3">
            {LESSON_PLAN.map((item) => (
              <div key={item.title} className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.details}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-base p-5">
          <h2 className="mb-4 text-xl font-bold text-white">Tajwid Topics Tracker</h2>
          <div className="space-y-3">
            {TAJWID_TRACKER.map((item) => (
              <div key={item.topic} className="flex items-center justify-between rounded-lg border border-emerald-300/10 px-3 py-2">
                <span className="text-sm text-slate-200">{item.topic}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-base p-5">
        <h2 className="mb-4 text-xl font-bold text-white">Teacher Feedback</h2>
        <div className="space-y-3">
          {FEEDBACK.map((item) => (
            <div key={item.date} className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">{item.date} · Ustadh Hashim</p>
              <p className="mt-2 text-sm text-slate-200">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-base p-5">
        <h2 className="mb-4 text-xl font-bold text-white">Learning Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <button
              key={tool}
              type="button"
              onClick={() => (tool === "Letter Guide" || tool === "Sifaat Reference" ? setPage("letters") : null)}
              className="rounded-xl border border-emerald-300/15 bg-slate-900/65 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-300/45"
            >
              {tool}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
