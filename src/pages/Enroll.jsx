import { useState } from 'react';
import Navbar from '../components/Navbar';
import { SUBJECTS_DATA, TEACHERS_DATA } from '../lib/subjectsData';
import { CheckCircle, Users, User, ArrowRight, X, Clock } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function EnrollModal({ subject, onClose }) {
  const [step, setStep] = useState(1);
  const [lessonType, setLessonType] = useState('Group');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [payRef, setPayRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState(null);

  const price = lessonType === 'Group' ? subject.price.group : subject.price.private;
  const teachers = TEACHERS_DATA.filter(t => subject.teacherIds.includes(t.id));

  const submitEnrollment = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      const ref = await addDoc(collection(db, 'enrollments'), {
        student_name: form.name,
        student_email: form.email,
        phone: form.phone,
        subject: subject.title,
        lesson_type: lessonType,
        amount: price,
        payment_status: 'pending',
        notes: form.notes,
        active: false,
        created_at: serverTimestamp(),
      });
      setEnrollmentId(ref.id);
      setStep(2);
    } catch (e) {
      alert('Error submitting enrollment. Please try again.');
    }
    setSubmitting(false);
  };

  const submitPayment = async () => {
    setSubmitting(true);
    try {
      const month = new Date().toISOString().slice(0, 7);
      await addDoc(collection(db, 'payments'), {
        enrollment_id: enrollmentId,
        student_email: form.email,
        student_name: form.name,
        subject: subject.title,
        amount: price,
        month,
        status: 'pending',
        payment_method: 'EFT',
        payment_reference: payRef,
        created_at: serverTimestamp(),
      });
      setStep(3);
    } catch (e) {
      alert('Error submitting payment. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0f2318] border border-emerald-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-emerald-950/60 border-b border-emerald-900 p-5 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-lg">{subject.title}</div>
            <div className="text-emerald-400 text-sm">{subject.arabic}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2 block">Lesson Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Group', 'Private'].map(t => (
                    <button key={t} onClick={() => setLessonType(t)}
                      className={`py-3 rounded-xl border text-sm font-semibold flex flex-col items-center gap-1 transition-all ${lessonType === t ? 'bg-emerald-900/60 border-emerald-600 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}>
                      {t === 'Group' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      {t} Lesson
                      <span className="text-xs font-bold">R {t === 'Group' ? subject.price.group : subject.price.private}/mo</span>
                    </button>
                  ))}
                </div>
              </div>

              {teachers.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2 block">Available Teachers</label>
                  <div className="space-y-2">
                    {teachers.map(t => (
                      <div key={t.id} className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl p-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-400">{t.name[0]}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{t.name}</div>
                          <div className="text-xs text-slate-500">{t.title} · {t.audience}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name *" className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email Address *" type="email" className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone / WhatsApp (optional)" className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any notes or questions (optional)" rows={2} className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
              </div>

              <div className="bg-white/5 border border-white/8 rounded-xl p-3 flex items-center justify-between">
                <span className="text-slate-400 text-sm">Monthly Fee</span>
                <span className="text-white font-bold text-lg">R {price}</span>
              </div>

              <button onClick={submitEnrollment} disabled={!form.name || !form.email || submitting}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                {submitting ? 'Processing...' : <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-3">Payment Instructions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Account Name</span><span className="text-white font-semibold">Madrassatu Taḥsīnil Qur'ān</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Amount</span><span className="text-emerald-400 font-bold text-lg">R {price}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reference</span><span className="text-white font-semibold">{form.name.split(' ')[0]}-{subject.id}</span></div>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2 block">Your Payment Reference</label>
                <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Enter your EFT reference number"
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-3 text-amber-300 text-xs">
                Admin will verify your payment and activate your enrollment within 24 hours.
              </div>
              <button onClick={submitPayment} disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                {submitting ? 'Submitting...' : <>Submit Payment Confirmation <CheckCircle className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-900/60 border border-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Enrollment Submitted!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your enrollment for <strong className="text-white">{subject.title}</strong> has been received. Admin will verify and activate within 24 hours.
              </p>
              <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-all">Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Enroll() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [filter, setFilter] = useState('all');

  const displayed = filter === 'available' ? SUBJECTS_DATA.filter(s => !s.comingSoon)
    : filter === 'coming' ? SUBJECTS_DATA.filter(s => s.comingSoon)
    : SUBJECTS_DATA;

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      {selectedSubject && <EnrollModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}

      <div className="text-center py-14 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Enroll Now</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Choose a Subject</h1>
        <p className="text-slate-400 max-w-lg mx-auto">Select the subject you'd like to enroll in. Each subject is taught by qualified teachers.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mb-8 flex gap-2 justify-center flex-wrap">
        {[['all', 'All Subjects'], ['available', 'Enrollable Now'], ['coming', 'Coming Soon']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === val ? 'bg-emerald-700 text-white' : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(subject => {
            const teachers = TEACHERS_DATA.filter(t => subject.teacherIds.includes(t.id));
            return (
              <div key={subject.id} className={`border ${subject.color} rounded-3xl p-6 flex flex-col`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{subject.title}</h3>
                    <div className="text-slate-500 text-sm">{subject.arabic}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${subject.badge}`}>{subject.level}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">{subject.desc}</p>

                {!subject.comingSoon && (
                  <div className="mb-4 flex gap-2">
                    <div className="flex-1 bg-white/5 border border-white/8 rounded-xl p-2.5 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">Group</div>
                      <div className="font-bold text-white text-sm">R {subject.price.group}<span className="text-slate-500 font-normal">/mo</span></div>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/8 rounded-xl p-2.5 text-center">
                      <div className="text-xs text-slate-500 mb-0.5">Private</div>
                      <div className="font-bold text-white text-sm">R {subject.price.private}<span className="text-slate-500 font-normal">/mo</span></div>
                    </div>
                  </div>
                )}

                {teachers.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Teachers</div>
                    <div className="flex flex-wrap gap-1.5">
                      {teachers.map(t => (
                        <div key={t.id} className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
                          <div className="w-4 h-4 rounded-full bg-emerald-900 flex items-center justify-center text-[10px] font-bold text-emerald-400">{t.name[0]}</div>
                          <span className="text-xs text-slate-300">{t.name.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subject.comingSoon ? (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/8 text-amber-400 text-sm font-semibold">
                    <Clock className="w-4 h-4" /> Coming Soon
                  </div>
                ) : (
                  <button onClick={() => setSelectedSubject(subject)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all">
                    Enroll Now <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
