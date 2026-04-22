import React from "react";

const MAIN_LINKS = [
  { id: "home", label: "Home" },
  { id: "programs", label: "Programs" },
  { id: "enroll", label: "Enroll" },
  { id: "library", label: "Library" },
  { id: "teachers", label: "Teachers" },
  { id: "dashboard", label: "Dashboard" },
  { id: "contact", label: "Contact" },
  { id: "messages", label: "Messages" },
];

function NavButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
        active
          ? "bg-emerald-400/20 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.28)]"
          : "text-slate-300 hover:bg-emerald-400/10 hover:text-emerald-100"
      }`}
    >
      {label}
    </button>
  );
}

export function Navigation({ page, onNavigate }) {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-300/12 bg-slate-950/78 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 text-left transition hover:bg-emerald-400/8"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/38 bg-emerald-400/10 text-sm font-bold text-emerald-200">
            S
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200/90">SirajOne</span>
            <span className="block text-xs font-bold text-emerald-100 sm:text-sm">Community • Learning • Service</span>
          </span>
        </button>

        <nav className="hidden items-center gap-0.5 rounded-xl border border-emerald-300/10 bg-slate-900/40 px-1 py-1 lg:flex">
          {MAIN_LINKS.map((item) => (
            <NavButton key={item.id} active={page === item.id} label={item.label} onClick={() => onNavigate(item.id)} />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => onNavigate("letters")}
          className="rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-3.5 py-2 text-xs font-extrabold text-slate-900 shadow-[0_12px_30px_-14px_rgba(16,185,129,0.85)] transition hover:from-emerald-200 hover:to-emerald-300"
        >
          Letter Guide
        </button>
      </div>
    </header>
  );
}
