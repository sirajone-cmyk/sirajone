import React from 'react';
import { BookOpen, Mic, Star, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Section, SectionHeading } from '../layout/Section';
import { Button } from '../ui/Button';

const PROGRAMS = [
  {
    id: 'qaidah',
    title: "Qa'idah & Qur'ān Reading",
    arabic: 'القاعدة',
    subtitle: 'Part 1 & Part 2',
    level: 'Beginner',
    duration: '3-6 months',
    description:
      "The foundation of all Qur'ānic learning. Students master the Arabic alphabet, vowel marks (Harakāt), and begin reading connected text with correct pronunciation.",
    learn: ['Part 1: Arabic letters & vowels', 'Part 2: Connected reading & basic words', 'Introduction to simple Tajwid rules'],
    outcomes: ['Read Arabic script clearly', 'Understand short vowels and long vowels', 'Apply basic Tajwid rules from day one'],
    Icon: BookOpen,
    tone: 'border-[rgba(34,197,94,0.34)] from-[rgba(16,185,129,0.14)] to-[rgba(6,95,70,0.08)]',
    badgeTone: 'bg-[rgba(34,197,94,0.24)] text-[#bbf7d0]',
  },
  {
    id: 'tajwid',
    title: 'Tajwid Foundations',
    arabic: 'علم التجويد',
    subtitle: 'Rules & Application',
    level: 'Intermediate',
    duration: '6-12 months',
    description:
      "A complete, structured Tajwid program based on classical methodology. Students learn every rule with practical application in Qur'ānic recitation.",
    learn: ['Makhārij — articulation points', 'Sifāt — letter qualities', 'Noon & Meem rules', 'Madd — elongation rules'],
    outcomes: ['Apply Tajwid rules correctly in recitation', 'Identify and correct common errors', 'Recite with confidence and beauty'],
    Icon: Mic,
    tone: 'border-[rgba(249,115,22,0.38)] from-[rgba(120,53,15,0.14)] to-[rgba(69,26,3,0.08)]',
    badgeTone: 'bg-[rgba(249,115,22,0.24)] text-[#fdba74]',
  },
  {
    id: 'hifz',
    title: 'Hifz Programme',
    arabic: 'حفظ القرآن',
    subtitle: "Memorisation · Murāja'ah",
    level: 'Advanced',
    duration: 'Ongoing',
    description:
      "A structured memorisation program with built-in revision cycles. Every student follows a personal plan designed by Ustādh Hāshim to ensure retention.",
    learn: ["Daily Sabaq (new memorisation)", "Awal Murāja'ah (recent revision)", "Ākhir Murāja'ah (full cycle revision)", 'Teacher assessment & correction'],
    outcomes: ['Memorise Qurān with correct Tajwid', 'Maintain strong retention through revision', 'Build a lifelong relationship with the Qurān'],
    Icon: Star,
    tone: 'border-[rgba(99,102,241,0.42)] from-[rgba(49,46,129,0.14)] to-[rgba(30,27,75,0.08)]',
    badgeTone: 'bg-[rgba(99,102,241,0.24)] text-[#c7d2fe]',
  },
  {
    id: 'murajaa',
    title: "Murāja'ah System",
    arabic: 'المراجعة',
    subtitle: 'Revision & Retention',
    level: 'Huffāz',
    duration: 'Ongoing',
    description:
      "For students who have completed their Hifz. A rigorous, structured revision program to maintain, strengthen, and perfect the memorisation of the entire Qur'ān.",
    learn: ['Structured revision cycles', 'Strong and weak Juz identification', 'Speed and fluency development', 'Sanad connection and ijāzah pathway'],
    outcomes: ['Maintain all 30 Juz confidently', 'Recite fluently and at appropriate speed', 'Progress towards ijāzah (certification)'],
    Icon: TrendingUp,
    tone: 'border-[rgba(14,165,233,0.36)] from-[rgba(8,47,73,0.14)] to-[rgba(12,74,110,0.08)]',
    badgeTone: 'bg-[rgba(14,165,233,0.24)] text-[#7dd3fc]',
  },
];

function ProgramCard({ program }) {
  const { title, arabic, subtitle, level, duration, description, learn, outcomes, Icon, tone, badgeTone } = program;

  return (
    <article className={`rounded-3xl border bg-gradient-to-b ${tone} bg-[rgba(17,26,21,0.88)] px-5 py-6 md:px-7 md:py-7 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.8)]`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-9 w-9 rounded-xl border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
            <Icon size={18} className="text-[#2fe08d]" />
          </div>
          <div>
            <h3 className="text-2xl md:text-[1.72rem] font-bold text-[#f0fdf4] leading-tight">{title}</h3>
            <p className="text-xs md:text-sm text-[rgba(210,240,225,0.65)] mt-0.5">{subtitle}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTone}`}>{level}</span>
              <span className="text-xs text-[rgba(210,240,225,0.55)]">{duration}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[#8b95a7] text-[2rem] leading-none" style={{ fontFamily: "'Amiri', serif" }} dir="rtl" lang="ar">
        {arabic}
      </p>

      <p className="mt-3 text-[rgba(226,244,235,0.88)] text-base leading-8">{description}</p>

      <div className="mt-5">
        <h4 className="text-xs font-bold tracking-[0.12em] uppercase text-[rgba(215,237,226,0.75)]">What You'll Learn</h4>
        <ul className="mt-2 space-y-1.5">
          {learn.map((item) => (
            <li key={item} className="text-[rgba(220,244,232,0.88)] text-[0.98rem] flex items-start gap-2">
              <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h4 className="text-xs font-bold tracking-[0.12em] uppercase text-[rgba(215,237,226,0.75)]">Outcomes</h4>
        <ul className="mt-2 space-y-1.5">
          {outcomes.map((item) => (
            <li key={item} className="text-[rgba(220,244,232,0.88)] text-[0.98rem] flex items-start gap-2">
              <CheckCircle2 size={17} className="mt-[2px] shrink-0 text-[#22c55e]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-[rgba(230,245,236,0.22)] pt-5">
        <Button variant="primary" size="md" href="#enroll" className="min-w-[150px] justify-center">
          Enrol Now <ArrowRight size={16} />
        </Button>
      </div>
    </article>
  );
}

export function ProgramsSection() {
  return (
    <Section id="programs" variant="alt" className="pattern-subtle" py="py-16 md:py-20">
      <SectionHeading
        eyebrow="Curriculum"
        title="Our Programs"
        subtitle="Structured Qur'ānic education for every level — from first letters to complete Hifz."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button variant="primary" size="lg" href="#library" className="min-w-[280px] justify-center">
          View All Subjects & Enrol <ArrowRight size={18} />
        </Button>
      </div>
    </Section>
  );
}
