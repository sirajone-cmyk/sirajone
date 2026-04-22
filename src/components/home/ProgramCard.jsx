import React from "react";

export default function ProgramCard({ icon, title, description, level }) {
  return (
    <article className="soft-green-glow rounded-2xl border border-emerald-300/20 bg-rahla-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-300/15 text-2xl text-emerald-200">
          {icon}
        </div>
        <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
          {level}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-rahla-textSoft">{description}</p>
    </article>
  );
}
