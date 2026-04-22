import React from "react";
import { TEACHERS } from "../data/platformSeed";

export default function TeachersPage({ setPage }) {
  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Our Faculty</p>
        <h1 className="section-title">Our Teachers</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Qualified, experienced, and dedicated to your Qur'anic growth with calm and structured guidance.
        </p>
      </div>

      {TEACHERS.filter((teacher) => teacher.featured).map((teacher) => (
        <article key={teacher.name} className="panel-base border-emerald-300/35 bg-emerald-500/10 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-white">{teacher.name}</h2>
            <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200">Founder</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-200">Founder & Lead Teacher</p>
          <p className="mt-4 text-[15px] leading-8 text-slate-200">{teacher.bio}</p>
          <p className="mt-4 text-sm text-slate-300">+27 67 634 0225 - madrasatahseenuquran@gmail.com</p>
        </article>
      ))}

      <section className="grid gap-4 md:grid-cols-2">
        {TEACHERS.filter((teacher) => !teacher.featured).map((teacher) => (
          <article key={teacher.name} className="panel-base p-4">
            <h3 className="text-lg font-bold text-white">{teacher.name}</h3>
            <p className="mt-1 text-sm text-emerald-200">{teacher.experience} - {teacher.audience}</p>
            <p className="mt-2 text-sm text-slate-300">{teacher.subjects}</p>
            <p className="mt-3 text-sm leading-7 text-muted">{teacher.bio}</p>
          </article>
        ))}
      </section>

      <section className="panel-base p-6 text-center">
        <h2 className="text-3xl font-bold text-white">Book a Personal Lesson</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
          Contact Ustadh Hashim to be matched with the right teacher for your level and goals.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-6 py-2.5 text-sm font-extrabold text-slate-900"
          >
            WhatsApp Us
          </button>
          <button
            type="button"
            onClick={() => setPage("contact")}
            className="rounded-xl border border-slate-500/45 bg-slate-900/65 px-6 py-2.5 text-sm font-semibold text-slate-200"
          >
            Email Request
          </button>
        </div>
      </section>
    </div>
  );
}
