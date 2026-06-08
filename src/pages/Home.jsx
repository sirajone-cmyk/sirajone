import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import {
  BookOpen, Mic, Star, ArrowRight, CheckCircle,
  Award, MapPin, CalendarDays,
  TrendingUp, Users, Shield, Heart, Layers
} from 'lucide-react';

const programs = [
  { icon: BookOpen, title: "Qa'idah & Qur'an Reading", parts: 'Part 1 & Part 2', desc: "Master Arabic letters, vowels, and basic connected reading.", level: 'Beginner', color: 'border-emerald-700/60 bg-emerald-950/40', badge: 'bg-emerald-900 text-emerald-300' },
  { icon: Mic, title: 'Tajwid Foundations', parts: 'Rules & Application', desc: "Learn Makharij, Sifat, Ghunnah, Madd and all core Tajwid rules.", level: 'Intermediate', color: 'border-amber-700/60 bg-amber-950/40', badge: 'bg-amber-900 text-amber-300' },
  { icon: Star, title: 'Ḥifẓ Programme', parts: 'Memorisation + Murājaʿah', desc: 'Structured Ḥifẓ with daily Sabaq, Awal and Akhir Murājaʿah cycles.', level: 'Advanced', color: 'border-violet-700/60 bg-violet-950/40', badge: 'bg-violet-900 text-violet-300' },
  { icon: TrendingUp, title: 'Murājaʿah System', parts: 'Revision & Retention', desc: 'A structured cycle to maintain, strengthen, and perfect memorisation.', level: 'Ḥuffāẓ', color: 'border-sky-700/60 bg-sky-950/40', badge: 'bg-sky-900 text-sky-300' },
];

const learningPath = [
  {
    icon: BookOpen,
    title: 'Letter Guide',
    desc: 'Begin with the Arabic letters, sounds, makharij foundations, and guided listening practice.',
    status: 'Start Here',
    to: '/letters',
    active: true,
  },
  {
    icon: Mic,
    title: 'Practical Workbook',
    desc: 'Move from letters into structured drills with listen, record, replay, and correction practice.',
    status: 'Next Step',
    to: '/practice-workbook',
    active: true,
  },
  {
    icon: Layers,
    title: 'Part Two',
    desc: 'A bridge into rule-based Tajwid learning with examples and applied reading practice.',
    status: 'Continue',
    to: '/part-two-workbook',
    active: true,
  },
  {
    icon: Award,
    title: 'Tajwid Kitaab (Coming Soon)',
    desc: 'The full Tajwid kitaab pathway will work together with Part Two for deeper study.',
    status: 'Coming Soon',
    active: false,
  },
];

const benefits = [
  { icon: CheckCircle, text: 'Correct pronunciation from day one' },
  { icon: Shield, text: 'Grounded in classical Tajwid scholarship' },
  { icon: Users, text: 'Personal attention — small class sizes' },
  { icon: Heart, text: 'Nurturing, encouraging environment' },
  { icon: TrendingUp, text: 'Structured progression with measurable milestones' },
  { icon: BookOpen, text: 'Suitable for all ages — children and adults' },
];

const testimonials = [
  { name: 'Sister Aisha', role: 'Parent · Durban', text: "My son's recitation improved dramatically in just 3 months. Alḥamdulillah." },
  { name: 'Brother Yusuf', role: 'Student', text: "I never understood Tajwid properly until I joined. Highly recommended." },
  { name: 'Sister Fatima', role: 'Parent · Pietermaritzburg', text: "Online classes are professional and my daughter looks forward to every session." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-white font-sans">
      <Helmet>
        <title>SirajOne | Islamic Learning — Qur'an, Tajwid & Makharij</title>
        <meta name="description" content="Learn Qur'an recitation, Tajwid rules, and Makharij al-Huruf with SirajOne — a structured Islamic learning pathway for all ages." />
        <meta property="og:title" content="SirajOne | Islamic Learning — Qur'an, Tajwid & Makharij" />
        <meta property="og:description" content="Structured Islamic learning: Qa'idah, Tajwid, Ḥifẓ, and Murājaʿah. Faith. Knowledge. Action." />
        <meta property="og:url" content="https://sirajone.co.za/" />
        <link rel="canonical" href="https://sirajone.co.za/" />
      </Helmet>
      <Navbar />

      {/* HERO — Premium Islamic manuscript hero */}
      <section className="relative isolate overflow-hidden flex flex-col justify-center" style={{ minHeight: '100vh', paddingTop: '68px' }}>

        {/* Layer 0 — Quran manuscript background, sharpened */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1585036156171-384164a8c675?w=2400&q=95&auto=format&fit=crop')",
            filter: 'contrast(1.06) saturate(1.08) brightness(0.96)',
          }}
        />

        {/* Layer 1 — Cinematic base tint, preserves manuscript warmth */}
        <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(5, 12, 8, 0.58)' }} />

        {/* Layer 2 — Radial spotlight behind text for maximum readability */}
        <div className="absolute inset-0 z-[2]" style={{
          background: 'radial-gradient(ellipse 90% 75% at 50% 48%, rgba(3, 9, 5, 0.82) 0%, rgba(3, 9, 5, 0.60) 55%, rgba(3, 9, 5, 0.18) 85%, transparent 100%)',
        }} />

        {/* Layer 3 — Bottom brand-colour fade */}
        <div className="absolute bottom-0 inset-x-0 z-[3]" style={{
          height: '38%',
          background: 'linear-gradient(to top, #0b1a12 0%, transparent 100%)',
        }} />

        {/* Layer 4 — Subtle left/right edge vignette */}
        <div className="absolute inset-0 z-[4]" style={{
          background: 'linear-gradient(to right, rgba(5,12,8,0.30) 0%, transparent 25%, transparent 75%, rgba(5,12,8,0.30) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10 text-center py-24 sm:py-32">

          {/* Location badge */}
          <div className="flex justify-center mb-10">
            <span
              className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium tracking-wide"
              style={{
                padding: '9px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(120, 185, 145, 0.30)',
                background: 'rgba(8, 22, 14, 0.70)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                color: '#96C9AB',
                letterSpacing: '0.035em',
                boxShadow: '0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <MapPin size={13} style={{ color: '#72B08A', flexShrink: 0 }} />
              Durban, South Africa • In-Person &amp; Online Learning
            </span>
          </div>

          {/* Main heading — luxury serif */}
          <h1
            className="text-white"
            style={{
              fontFamily: "'Georgia', 'Cambria', 'Times New Roman', serif",
              fontSize: 'clamp(2.6rem, 6.8vw, 5.6rem)',
              fontWeight: 700,
              lineHeight: 1.07,
              letterSpacing: '-0.02em',
              marginBottom: '1.4rem',
              textShadow: '0 2px 40px rgba(0,0,0,0.9), 0 1px 10px rgba(0,0,0,0.95)',
            }}
          >
            Faith. Knowledge. Action.
          </h1>

          {/* Decorative rule */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div style={{ width: '48px', height: '1px', background: 'rgba(130, 185, 152, 0.38)' }} />
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="none" stroke="rgba(130,185,152,0.48)" strokeWidth="0.9"/>
              <circle cx="10" cy="10" r="2.6" fill="rgba(130,185,152,0.36)"/>
            </svg>
            <div style={{ width: '48px', height: '1px', background: 'rgba(130, 185, 152, 0.38)' }} />
          </div>

          {/* Subtitle */}
          <p
            className="mx-auto mb-12"
            style={{
              maxWidth: '680px',
              fontSize: 'clamp(1rem, 1.9vw, 1.2rem)',
              lineHeight: 1.72,
              color: 'rgba(215, 235, 223, 0.86)',
              textShadow: '0 1px 10px rgba(0,0,0,0.65)',
              fontWeight: 400,
              letterSpacing: '0.008em',
            }}
          >
            Authentic Islamic learning, Qur'an studies, Seerah, and structured programs for
            children, adults, families, and communities.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            {/* Primary — forest green */}
            <Link
              to="/programs"
              className="group inline-flex items-center justify-center gap-3 font-semibold"
              style={{
                minWidth: '220px',
                padding: '15px 36px',
                borderRadius: '14px',
                background: 'linear-gradient(145deg, #1d7048 0%, #145534 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                letterSpacing: '0.012em',
                border: '1px solid rgba(55, 160, 100, 0.45)',
                boxShadow: '0 6px 28px rgba(16, 72, 40, 0.60), 0 1px 0 rgba(255,255,255,0.08) inset',
                textDecoration: 'none',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 36px rgba(16,72,40,0.70), 0 1px 0 rgba(255,255,255,0.10) inset';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(16,72,40,0.60), 0 1px 0 rgba(255,255,255,0.08) inset';
              }}
            >
              Explore Programs
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary — glassmorphism */}
            <a
              href="https://wa.me/27676340225"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 font-semibold"
              style={{
                minWidth: '220px',
                padding: '15px 36px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                color: 'rgba(238, 250, 243, 0.90)',
                fontSize: '1rem',
                letterSpacing: '0.012em',
                border: '1px solid rgba(200, 225, 212, 0.22)',
                boxShadow: '0 6px 28px rgba(0,0,0,0.32), 0 1px 0 rgba(255,255,255,0.06) inset',
                textDecoration: 'none',
                transition: 'transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.11)';
                e.currentTarget.style.boxShadow = '0 10px 36px rgba(0,0,0,0.40), 0 1px 0 rgba(255,255,255,0.08) inset';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.32), 0 1px 0 rgba(255,255,255,0.06) inset';
              }}
            >
              <CalendarDays size={17} />
              Join a Class
            </a>
          </div>

          {/* Trust bar */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['Certified Scholars', 'All Ages Welcome', 'In-Person & Online'].map((label, i) => (
              <span
                key={i}
                className="flex items-center gap-2"
                style={{ color: 'rgba(148, 190, 165, 0.62)', fontSize: '13px', letterSpacing: '0.04em' }}
              >
                <span style={{ color: 'rgba(110, 175, 138, 0.55)', fontSize: '7px' }}>◆</span>
                {label}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="bg-[#0b1a12] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Beginning Learning</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3">Learning Path</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              A clear step-by-step route from letters, to practical recitation, then into the next stage of Tajwid study.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {learningPath.map((step, index) => {
              const CardTag = step.active ? Link : 'div';
              const cardProps = step.active ? { to: step.to } : {};

              return (
                <CardTag
                  key={step.title}
                  {...cardProps}
                  className={`group relative overflow-hidden rounded-3xl border p-6 transition-all ${
                    step.active
                      ? 'border-emerald-700/60 bg-emerald-950/35 hover:border-emerald-400/80 hover:bg-emerald-950/55'
                      : 'border-white/10 bg-white/5 opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 border border-white/10">
                      <step.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${
                      step.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-slate-500">
                    Step {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>

                  {step.active && (
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 group-hover:text-emerald-200">
                      Open section <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>
      {/* PROGRAMS */}
      <section className="bg-white/3 border-y border-white/8 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Curriculum</span>
            <h2 className="text-3xl font-bold mt-3">Our Programs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {programs.map(p => (
              <div key={p.title} className={`border ${p.color} rounded-3xl p-6`}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0">
                    <p.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-white">{p.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.badge}`}>{p.level}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{p.parts}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white/3 border-y border-white/8 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Why Join Us</span>
            <h2 className="text-3xl font-bold mt-3">Student Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {benefits.map(b => (
              <div key={b.text} className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-2xl p-4">
                <b.icon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Testimonials</span>
          <h2 className="text-3xl font-bold mt-3">What Parents & Students Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
              <div>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-6 px-4 text-center text-slate-600 text-sm">
        <p>© 2026 SirajOne · Durban, South Africa</p>
        <p className="mt-1 text-xs">Built with care for the sake of Allah</p>
      </footer>
    </div>
  );
}
