import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  BookOpen, Mic, Star, ArrowRight, CheckCircle,
  Award, MapPin, Mail, Globe, Phone,
  TrendingUp, Users, Shield, Heart
} from 'lucide-react';

const programs = [
  { icon: BookOpen, title: "Qā'idah & Qur'ān Reading", parts: 'Part 1 & Part 2', desc: "Master Arabic letters, vowels, and basic connected reading.", level: 'Beginner', color: 'border-emerald-700/60 bg-emerald-950/40', badge: 'bg-emerald-900 text-emerald-300' },
  { icon: Mic, title: 'Tajwīd Foundations', parts: 'Rules & Application', desc: "Learn Makhārij, Sifāt, Ghunnah, Madd and all core Tajwīd rules.", level: 'Intermediate', color: 'border-amber-700/60 bg-amber-950/40', badge: 'bg-amber-900 text-amber-300' },
  { icon: Star, title: 'Ḥifẓ Programme', parts: 'Memorisation + Murājaʿah', desc: 'Structured Ḥifẓ with daily Sabaq, Awal and Ākhir Murājaʿah cycles.', level: 'Advanced', color: 'border-violet-700/60 bg-violet-950/40', badge: 'bg-violet-900 text-violet-300' },
  { icon: TrendingUp, title: 'Murājaʿah System', parts: 'Revision & Retention', desc: 'A structured cycle to maintain, strengthen, and perfect memorisation.', level: 'Ḥuffāẓ', color: 'border-sky-700/60 bg-sky-950/40', badge: 'bg-sky-900 text-sky-300' },
];

const benefits = [
  { icon: CheckCircle, text: 'Correct pronunciation from day one' },
  { icon: Shield, text: 'Grounded in classical Tajwīd scholarship' },
  { icon: Users, text: 'Personal attention — small class sizes' },
  { icon: Heart, text: 'Nurturing, encouraging environment' },
  { icon: TrendingUp, text: 'Structured progression with measurable milestones' },
  { icon: BookOpen, text: 'Suitable for all ages — children and adults' },
];

const testimonials = [
  { name: 'Sister Aisha', role: 'Parent · Durban', text: "My son's recitation improved dramatically in just 3 months. Alḥamdulillāh." },
  { name: 'Brother Yusuf', role: 'Student', text: "I never understood Tajwīd properly until I joined. Highly recommended." },
  { name: 'Sister Fatima', role: 'Parent · Pietermaritzburg', text: "Online classes are professional and my daughter looks forward to every session." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-white font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative text-center pt-28 pb-24 px-4 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1400&q=80')" }} />
        <div className="absolute inset-0 bg-[#0b1a12]/80" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-700 bg-emerald-950/60 text-emerald-400 text-sm font-medium mb-8">
            <MapPin className="w-3.5 h-3.5" /> Durban, South Africa · Online & In-Person
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Master Your Qur'ān<br />
            <span className="text-emerald-400">with Precision</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Structured Tajwīd, Correct Makhārij, and Guided Learning — for children and adults.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all">
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/27676340225" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold rounded-xl transition-all">
              Book a Lesson
            </a>
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
        <p>© 2026 Madrassatu Taḥsīnil Qur'ān · Durban, South Africa</p>
        <p className="mt-1 text-xs">Built with care for the sake of Allāh</p>
      </footer>
    </div>
  );
}
