import React from "react";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1900&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-hero-overlay" />

      <div className="relative mx-auto flex min-h-[72vh] w-full max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Master Your Qur&apos;an with Precision
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Structured Tajwid, clear Makharij training, and a guided learning pathway designed for steady confidence
            in Qur&apos;an recitation.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Start Learning
            </button>
            <button
              type="button"
              className="rounded-xl border border-slate-300/35 bg-slate-900/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800/50"
            >
              Book a Lesson
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
