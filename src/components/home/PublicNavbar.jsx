import React from "react";

const LINKS = ["Home", "Programs", "Enroll", "Library", "Teachers", "Dashboard", "Contact", "Messages"];

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-400/15 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-300/30 bg-emerald-400/10 text-emerald-200">
            <span className="text-sm font-semibold">S</span>
          </div>
          <p className="text-lg font-semibold tracking-wide text-white">SirajOne</p>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link}
              className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-emerald-400/10 hover:text-emerald-100"
              type="button"
            >
              {link}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-xl border border-emerald-300/40 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/30"
        >
          Letter Guide
        </button>
      </div>
    </header>
  );
}
