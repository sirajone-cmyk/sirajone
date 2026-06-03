import Navbar from '../components/Navbar';
import { MapPin, Phone, Mail, Globe, Clock, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="text-center py-16 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Get in Touch</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Contact Us</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Ready to begin? Have a question? Reach out via any of the channels below.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { icon: MapPin, label: 'Location', val: 'Overport, Durban\nKwaZulu-Natal, South Africa', link: null },
            { icon: Phone, label: 'Phone / WhatsApp', val: '+27 67 634 0225', link: 'tel:+27676340225' },
            { icon: Mail, label: 'Email', val: 'sirajone7@gmail.com', link: 'mailto:sirajone7@gmail.com' },
            { icon: Globe, label: 'Website', val: 'sirajone.co.za', link: 'https://sirajone.co.za' },
          ].map(c => (
            <div key={c.label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <c.icon className="w-6 h-6 text-emerald-400 mb-3" />
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{c.label}</div>
              {c.link ? (
                <a href={c.link} target="_blank" rel="noreferrer" className="text-white font-medium text-sm hover:text-emerald-400 transition-colors whitespace-pre-line leading-relaxed">{c.val}</a>
              ) : (
                <p className="text-white font-medium text-sm whitespace-pre-line leading-relaxed">{c.val}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-emerald-400" />
            <h2 className="font-bold text-lg">Class Times</h2>
          </div>
          <div className="space-y-3">
            {[
              { day: 'Monday – Thursday', time: 'Morning & Afternoon slots available' },
              { day: 'Saturday', time: 'Morning sessions (in-person + online)' },
              { day: 'Sunday', time: 'By appointment' },
            ].map(t => (
              <div key={t.day} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/8 pb-3 last:border-0 last:pb-0">
                <span className="font-semibold text-white text-sm">{t.day}</span>
                <span className="text-slate-400 text-sm">{t.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-950/60 border border-emerald-900 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Enrol?</h2>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Send us a message with your child's name, age, and current level. Ustādh Hāshim will personally assess and place them in the right program.
          </p>
          <a href="mailto:sirajone7@gmail.com?subject=Enrolment Enquiry"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all">
            Send Enrolment Request <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center flex-shrink-0 text-2xl">👤</div>
          <div>
            <h3 className="font-bold text-xl mb-0.5">Ustādh Hāshim bin Ḥussain</h3>
            <p className="text-emerald-400 text-sm mb-3">Founder & Lead Teacher · SirajOne</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Qualified in Tajwīd and Qur'ānic recitation with years of dedicated teaching experience in Durban, South Africa. Known for his structured approach, patience, and genuine concern for every student's spiritual and academic development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
