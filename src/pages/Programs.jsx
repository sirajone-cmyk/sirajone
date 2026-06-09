import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { BookOpen, Mic, Star, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const programs = [
  {
    icon: BookOpen,
    title: "Qā'idah & Qur'ān Reading",
    arabic: "القاعدة",
    level: "Beginner",
    duration: "3–6 months",
    color: "border-emerald-800 bg-emerald-950/30",
    badge: "bg-emerald-900 text-emerald-300",
    parts: ["Part 1: Arabic letters & vowels", "Part 2: Connected reading & basic words", "Introduction to simple Tajwīd rules"],
    desc: "The foundation of all Qur'ānic learning. Students master the Arabic alphabet, vowel marks, and begin reading connected text with correct pronunciation.",
    outcomes: ["Read Arabic script clearly", "Understand short and long vowels", "Apply basic Tajwīd rules from day one"],
  },
  {
    icon: Mic,
    title: "Tajwīd Foundations",
    arabic: "علم التجويد",
    level: "Intermediate",
    duration: "6–12 months",
    color: "border-amber-800 bg-amber-950/30",
    badge: "bg-amber-900 text-amber-300",
    parts: ["Makhārij — articulation points", "Sifāt — letter qualities", "Noon & Meem rules", "Madd — elongation rules"],
    desc: "A complete, structured Tajwīd program based on classical methodology. Students learn every rule with practical application in Qur'ānic recitation.",
    outcomes: ["Apply Tajwīd rules correctly in recitation", "Identify and correct common errors", "Recite with confidence and beauty"],
  },
  {
    icon: Star,
    title: "Ḥifẓ Programme",
    arabic: "حفظ القرآن",
    level: "Advanced",
    duration: "Ongoing",
    color: "border-violet-800 bg-violet-950/30",
    badge: "bg-violet-900 text-violet-300",
    parts: ["Daily Sabaq (new memorisation)", "Awal Murājaʿah (recent revision)", "Ākhir Murājaʿah (full cycle revision)", "Teacher assessment & correction"],
    desc: "A structured memorisation program with built-in revision cycles. Every student follows a personal plan designed by Ustādh Hāshim.",
    outcomes: ["Memorise Qur'ān with correct Tajwīd", "Maintain strong retention through revision", "Build a lifelong relationship with the Qur'ān"],
  },
  {
    icon: TrendingUp,
    title: "Murājaʿah System",
    arabic: "المراجعة",
    level: "Ḥuffāẓ",
    duration: "Ongoing",
    color: "border-sky-800 bg-sky-950/30",
    badge: "bg-sky-900 text-sky-300",
    parts: ["Structured revision cycles", "Strong and weak Juz identification", "Speed and fluency development", "Sanad connection and Ijāzah pathway"],
    desc: "For students who have completed their Ḥifẓ. A rigorous revision program to maintain, strengthen, and perfect memorisation of the entire Qur'ān.",
    outcomes: ["Maintain all 30 Juz confidently", "Recite fluently at appropriate speed", "Progress towards Ijāzah (certification)"],
  },
];

export default function Programs() {
  useEffect(() => { document.title = `Programmes | SirajOne — Qur’an, Tajwid & Ḥifẓ`; }, []);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="text-center py-16 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Curriculum</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Our Programs</h1>
        <p className="text-slate-400 max-w-xl mx-auto">Structured Qur'ānic education for every level — from first letters to complete Ḥifẓ.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-8">
        {programs.map((p) => (
          <div key={p.title} className={`border ${p.color} rounded-3xl p-7`}>
            <div className="flex items-start gap-5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center flex-shrink-0">
                <p.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="text-xl font-bold">{p.title}</h2>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${p.badge}`}>{p.level}</span>
                  <span className="text-xs text-slate-500">{p.duration}</span>
                </div>
                <p className="text-2xl text-slate-500">{p.arabic}</p>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-5">{p.desc}</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What You'll Learn</h3>
                <ul className="space-y-1.5">
                  {p.parts.map(part => (
                    <li key={part} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      {part}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Outcomes</h3>
                <ul className="space-y-1.5">
                  {p.outcomes.map(o => (
                    <li key={o} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/8">
              <Link to="/enroll" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all">
                Enrol Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <Link to="/enroll" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all text-lg">
          View All Subjects & Enrol <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
