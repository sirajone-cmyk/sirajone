import Navbar from '../components/Navbar';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { TEACHERS_DATA } from '../lib/subjectsData';

export default function Teachers() {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="text-center py-14 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Our Faculty</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Our Teachers</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Qualified, experienced, and dedicated to your Qur'ānic education.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-5">
        {TEACHERS_DATA.filter(t => t.featured).map(t => (
          <div key={t.name} className="bg-emerald-950/60 border border-emerald-800 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900 border border-emerald-700 flex items-center justify-center flex-shrink-0 text-2xl">🎓</div>
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white">{t.name}</h2>
                    <p className="text-emerald-400 text-sm">{t.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{t.experience} · {t.audience}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-900/60 border border-amber-800 text-amber-400 text-xs font-semibold">Founder</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mt-3 mb-4">{t.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.subjects.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-800 text-emerald-300">{s}</span>
                  ))}
                </div>
                {t.contact && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`tel:${t.contact.phone.replace(/\s/g,'')}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                      <Phone className="w-4 h-4" /> {t.contact.phone}
                    </a>
                    <a href={`mailto:${t.contact.email}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                      <Mail className="w-4 h-4" /> {t.contact.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="grid sm:grid-cols-2 gap-4">
          {TEACHERS_DATA.filter(t => !t.featured).map(t => (
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
              <div className="flex gap-4 items-start mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">📖</div>
                <div>
                  <h3 className="font-bold text-white text-sm">{t.name}</h3>
                  <p className="text-emerald-400 text-xs">{t.title}</p>
                  <p className="text-slate-500 text-xs">{t.experience} · {t.audience}</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3">{t.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {t.subjects.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-900 text-emerald-400">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center">
          <h2 className="text-2xl font-bold mb-3">Book a Personal Lesson</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Contact Ustādh Hāshim to be matched with the right teacher for your level, age, and goals.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/27676340225" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all">
              WhatsApp Us <ArrowRight className="w-4 h-4" />
            </a>
            <a href="mailto:sirajone7@gmail.com?subject=Teacher Booking Request" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all">
              Email Request
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
