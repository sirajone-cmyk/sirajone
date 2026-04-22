import React from "react";

const PROGRAMS = [
  {
    title: "Qa'idah & Qur'an Reading",
    level: "Beginner",
    description: "Master Arabic letters, vowels, and connected reading with clean pronunciation.",
  },
  {
    title: "Tajwid Foundations",
    level: "Intermediate",
    description: "Apply Makharij and Sifaat correctly through structured Tajwid practice.",
  },
  {
    title: "Hifz Programme",
    level: "Advanced",
    description: "Memorisation with daily Sabaq, Awal Muraja'ah, and Akhir Muraja'ah cycles.",
  },
  {
    title: "Muraja'ah System",
    level: "Ongoing",
    description: "Strengthen retention with guided revision blocks and teacher follow-up.",
  },
];

const BENEFITS = [
  "Correct pronunciation from day one",
  "Grounded in classical Tajwid scholarship",
  "Structured progression with measurable milestones",
  "Suitable for children, teens, and adults",
  "Nurturing and focused environment",
  "Personal attention in every phase",
];

const STEPS = [
  {
    title: "Assessment",
    detail: "We evaluate current level and place each learner into the right starting point.",
  },
  {
    title: "Personal Plan",
    detail: "A clear lesson pathway is tailored to age, pace, and objectives.",
  },
  {
    title: "Daily Sabaq",
    detail: "Short focused lessons that build confidence through steady repetition.",
  },
  {
    title: "Muraja'ah",
    detail: "Awal and Akhir revision keeps previous lessons active and retained.",
  },
  {
    title: "Progress Tracking",
    detail: "Teacher notes and milestones are logged for consistent growth.",
  },
];

const CONTACT = [
  { label: "Location", value: "Overport, Durban, KwaZulu-Natal, South Africa" },
  { label: "Phone", value: "+27 67 634 0225" },
  { label: "Email", value: "madrasatahseenuquran@gmail.com" },
  { label: "Website", value: "tahseenulquraan.org" },
];

export default function HomePage({ setPage }) {
  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-[28px] border border-emerald-300/22 shadow-[0_30px_70px_-55px_rgba(16,185,129,0.7)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.28),rgba(2,6,23,0.9)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.93)_14%,rgba(6,95,70,0.32)_46%,rgba(2,6,23,0.88)_88%)]" />

        <div className="relative mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center">
          <p className="mb-5 rounded-full border border-emerald-300/35 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
            Durban, South Africa · Online & In-Person
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.04] text-white sm:text-6xl">
            Master Your Qur'an
            <span className="mt-1 block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              with Precision
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-8 text-slate-200">
            Structured Tajwid, correct Makharij, and guided learning for children and adults who want clear,
            confident recitation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <button
              type="button"
              onClick={() => setPage("letters")}
              className="rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-7 py-3 text-sm font-extrabold text-slate-900 shadow-[0_16px_34px_-18px_rgba(16,185,129,0.95)] transition hover:from-emerald-200 hover:to-emerald-300"
            >
              Start Learning
            </button>
            <button
              type="button"
              onClick={() => setPage("contact")}
              className="rounded-xl border border-slate-300/35 bg-slate-900/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800/65"
            >
              Book a Lesson
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="panel-base p-7">
          <p className="section-eyebrow">About the Madrasah</p>
          <h2 className="mt-3 text-[2.05rem] font-bold leading-tight text-white">Teaching the Qur'an the Right Way</h2>
          <p className="mt-4 text-[15px] leading-8 text-muted">
            SirajOne supports students on a clear path from first letters to fluent recitation and strong Tajwid
            practice. The learning journey is structured, calm, and teacher-guided.
          </p>
        </article>

        <article className="panel-base bg-emerald-500/10 p-7">
          <h3 className="text-[1.7rem] font-bold text-white">Ustadh Hashim bin Hussain</h3>
          <p className="mt-1 text-sm font-semibold text-emerald-300">Founder & Lead Teacher</p>
          <p className="mt-4 text-[15px] leading-8 text-slate-200">
            Qualified in Tajwid and Qur'anic recitation with years of dedicated teaching experience in Durban,
            South Africa.
          </p>
          <p className="mt-4 text-sm text-slate-300">+27 67 634 0225 - madrasatahseenuquran@gmail.com</p>
        </article>
      </section>

      <section className="space-y-6">
        <div className="section-head">
          <p className="section-eyebrow">Curriculum</p>
          <h2 className="section-title">Our Programs</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {PROGRAMS.map((item) => (
            <article key={item.title} className="panel-base p-6">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-[1.32rem] font-bold text-white">{item.title}</h3>
                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                  {item.level}
                </span>
              </div>
              <p className="text-[15px] leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="section-head">
          <p className="section-eyebrow">Why Join Us</p>
          <h2 className="section-title">Student Benefits</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit} className="panel-base px-4 py-3.5 text-sm leading-6 text-slate-200">
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="section-head">
          <p className="section-eyebrow">Methodology</p>
          <h2 className="section-title">How It Works</h2>
        </div>
        <div className="panel-base space-y-3 p-5">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-start gap-3 border-b border-emerald-300/10 pb-3 last:border-b-0 last:pb-0">
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-sm font-bold text-emerald-200">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-base p-6">
        <p className="section-eyebrow text-center">Contact</p>
        <h2 className="mt-2 text-center text-3xl font-bold text-white">Get In Touch</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {CONTACT.map((item) => (
            <div key={item.label} className="rounded-xl border border-emerald-300/15 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">{item.label}</p>
              <p className="mt-1 text-sm text-slate-200">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
