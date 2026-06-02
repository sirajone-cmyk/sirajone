import React, { useState } from 'react';
import { BookMarked, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

const RULE_SECTIONS = [
  {
    title: 'Conduct and adab',
    points: [
      'Attend with honesty, punctuality, and respect for your teacher, fellow students, and support staff.',
      'Use the platform for learning, support, and approved communication only.',
      'Keep private teacher chat focused on lessons, revision, and learning support.',
    ],
  },
  {
    title: 'Learning standards',
    points: [
      'Students start with foundations, then move into guided tajwid only after the teacher confirms readiness.',
      'Progress is recorded only from real lessons, teacher feedback, and completed work.',
      'Letter, makharij, and sifaat training should be reviewed consistently before higher tajwid application.',
    ],
  },
  {
    title: 'Support and safeguarding',
    points: [
      'General support remains available even before active study begins.',
      'Counsellor Aisha Peer access is structured, visible to the platform workflow, and handled respectfully.',
      'Admin retains oversight over platform communication for safety, intervention, and service continuity.',
    ],
  },
];

const JAZARIYYAH_REFERENCES = [
  'Makharij: articulation must be learned from its correct point of origin.',
  'Sifaat: letter qualities must be preserved so pronunciation does not collapse into approximation.',
  'Tajwid discipline: correct recitation is built through rule awareness, repetition, and teacher correction.',
];

export default function RulesPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-7">
      <div className="section-head">
        <p className="section-eyebrow">Rules and Standards</p>
        <h1 className="section-title">Read the platform rules clearly</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          This is a usable rules section, not a decorative image. Open it, read it, and use it as
          the shared standard for study, conduct, and support workflows.
        </p>
      </div>

      <section className="panel-base overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-3 border-b border-emerald-300/12 bg-[linear-gradient(160deg,rgba(6,18,13,0.96),rgba(9,27,18,0.92))] px-6 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-emerald-300">Open rules</p>
              <h2 className="text-2xl font-bold text-white">SirajOne student and platform rules</h2>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`text-emerald-200 transition ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open ? (
          <div className="space-y-6 p-6">
            {RULE_SECTIONS.map((section) => (
              <article key={section.title} className="rounded-2xl border border-emerald-300/12 bg-slate-900/45 p-5">
                <h3 className="text-lg font-bold text-white">{section.title}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="panel-base p-6">
          <div className="flex items-center gap-3">
            <BookMarked size={18} className="text-emerald-300" />
            <h2 className="text-xl font-bold text-white">
              Cross-reference: Al-Muqaddimah al-Jazariyyah
            </h2>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            SirajOne’s learning and conduct workflow respects the classical tajwid tradition. These
            references help frame the app’s educational and quality standards respectfully and
            practically.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
            {JAZARIYYAH_REFERENCES.map((reference) => (
              <li key={reference} className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-emerald-300" />
                <span>{reference}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel-base p-6">
          <h2 className="text-xl font-bold text-white">How to use this section</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Students should read the rules before active lessons begin, revisit them when messaging
            or support access is used, and keep them in view as part of the learning standard.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
              Open full rules
            </Button>
            <a
              href="https://en.wikipedia.org/wiki/Ibn_al-Jazari"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-500/10"
            >
              <ExternalLink size={14} />
              Read background reference
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
