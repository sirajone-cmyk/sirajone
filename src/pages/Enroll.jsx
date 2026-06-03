import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { SUBJECTS_DATA, TEACHERS_DATA } from '../lib/subjectsData';
import { CheckCircle, Users, User, ArrowRight, X, Clock, AlertCircle } from 'lucide-react';
import { collection, doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { initiatePayfastCheckout } from '@/lib/payfast';

const inputClass = 'bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500';

const getProgramPrice = (program, subject, lessonType) => {
  if (Number(program?.price_zar) > 0) return Number(program.price_zar);
  return lessonType === 'Group' ? subject.price.group : subject.price.private;
};

function useProgramAvailability(programId) {
  const [state, setState] = useState({ loading: true, program: null, error: '', full: false });

  useEffect(() => {
    let active = true;

    const loadProgram = async () => {
      setState({ loading: true, program: null, error: '', full: false });
      try {
        const snap = await getDoc(doc(db, 'programs', programId));
        if (!active) return;

        if (!snap.exists()) {
          setState({
            loading: false,
            program: null,
            error: 'Program setup required before enrollment opens.',
            full: false,
          });
          return;
        }

        const program = { id: snap.id, ...snap.data() };
        const seatsTaken = Number(program.seats_taken || 0);
        const maxSeats = Number(program.max_seats || 0);
        setState({
          loading: false,
          program,
          error: '',
          full: maxSeats > 0 && seatsTaken >= maxSeats,
        });
      } catch (error) {
        if (!active) return;
        console.error(error);
        setState({ loading: false, program: null, error: 'Unable to check class seats.', full: false });
      }
    };

    loadProgram();
    return () => {
      active = false;
    };
  }, [programId]);

  return state;
}

function EnrollModal({ subject, program, onClose }) {
  const { user } = useAuth();
  const [lessonType, setLessonType] = useState('Group');
  const [form, setForm] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  const price = getProgramPrice(program, subject, lessonType);
  const teachers = TEACHERS_DATA.filter(t => subject.teacherIds.includes(t.id));

  const submitEnrollment = async () => {
    if (!form.name || !form.email || !user?.uid) return;
    setSubmitting(true);
    setError('');

    try {
      const programRef = doc(db, 'programs', subject.id);
      const enrollmentRef = doc(collection(db, 'enrollments'));
      const mPaymentId = [user.uid, subject.id, enrollmentRef.id].join('_');

      await runTransaction(db, async (transaction) => {
        const programSnap = await transaction.get(programRef);
        if (!programSnap.exists()) {
          throw new Error('This program is not ready for enrollment yet.');
        }

        const latestProgram = programSnap.data();
        const seatsTaken = Number(latestProgram.seats_taken || 0);
        const maxSeats = Number(latestProgram.max_seats || 0);

        if (maxSeats > 0 && seatsTaken >= maxSeats) {
          throw new Error('Class Full - Joined Waitlist');
        }

        const amount = getProgramPrice(latestProgram, subject, lessonType);

        transaction.update(programRef, {
          seats_taken: seatsTaken + 1,
          updated_at: serverTimestamp(),
        });

        transaction.set(enrollmentRef, {
          student_id: user.uid,
          student_name: form.name,
          student_email: form.email,
          phone: form.phone,
          program_id: subject.id,
          program_title: latestProgram.title || subject.title,
          subject: subject.title,
          lesson_type: lessonType,
          amount,
          price_zar: amount,
          status: 'pending_payment',
          payment_status: 'pending_payment',
          payment_provider: 'Payfast',
          m_payment_id: mPaymentId,
          notes: form.notes,
          seats_reserved: true,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      });

      setRedirecting(true);
      initiatePayfastCheckout(
        {
          studentId: user.uid,
          fullName: form.name,
          email: form.email,
        },
        {
          programId: subject.id,
          enrollmentId: enrollmentRef.id,
          title: program?.title || subject.title,
          price_zar: price,
        }
      );
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error submitting enrollment. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-900 bg-[#0f2318] shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-emerald-900 bg-emerald-950/60 p-5">
          <div>
            <div className="text-lg font-bold text-white">{subject.title}</div>
            <div className="text-sm text-emerald-400">{subject.arabic}</div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {redirecting ? (
            <div className="space-y-4 py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-700 bg-emerald-900/60">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Redirecting to Payfast</h3>
              <p className="text-sm leading-relaxed text-slate-400">Your seat has been reserved while payment is pending. Complete checkout securely on Payfast.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">Lesson Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Group', 'Private'].map(t => (
                    <button key={t} onClick={() => setLessonType(t)}
                      className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-sm font-semibold transition-all ${lessonType === t ? 'border-emerald-600 bg-emerald-900/60 text-emerald-400' : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'}`}>
                      {t === 'Group' ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      {t} Lesson
                      <span className="text-xs font-bold">R {getProgramPrice(program, subject, t)}/mo</span>
                    </button>
                  ))}
                </div>
              </div>

              {teachers.length > 0 && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">Available Teachers</label>
                  <div className="space-y-2">
                    {teachers.map(t => (
                      <div key={t.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-800 bg-emerald-900/60 text-xs font-bold text-emerald-400">{t.name[0]}</div>
                        <div>
                          <div className="text-sm font-semibold text-white">{t.name}</div>
                          <div className="text-xs text-slate-500">{t.title} - {t.audience}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className={inputClass} />
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email Address *" type="email" className={inputClass} />
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp (optional)" className={inputClass} />
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes or questions (optional)" rows={2} className={`${inputClass} resize-none`} />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 p-3">
                <span className="text-sm text-slate-400">Monthly Fee</span>
                <span className="text-lg font-bold text-white">R {price}</span>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-800/70 bg-red-950/40 p-3 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button onClick={submitEnrollment} disabled={!form.name || !form.email || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40">
                {submitting ? 'Reserving Seat...' : <>Reserve Seat & Pay with Payfast <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubjectCard({ subject, onOpen }) {
  const { loading, program, error, full } = useProgramAvailability(subject.id);
  const teachers = TEACHERS_DATA.filter(t => subject.teacherIds.includes(t.id));
  const groupPrice = getProgramPrice(program, subject, 'Group');
  const privatePrice = getProgramPrice(program, subject, 'Private');
  const seatsTaken = Number(program?.seats_taken || 0);
  const maxSeats = Number(program?.max_seats || 0);

  return (
    <div className={`flex flex-col rounded-3xl border p-6 ${subject.color}`}>
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{subject.title}</h3>
          <div className="text-sm text-slate-500">{subject.arabic}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subject.badge}`}>{subject.level}</span>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-400">{subject.desc}</p>

      {!subject.comingSoon && (
        <div className="mb-4 flex gap-2">
          <div className="flex-1 rounded-xl border border-white/8 bg-white/5 p-2.5 text-center">
            <div className="mb-0.5 text-xs text-slate-500">Group</div>
            <div className="text-sm font-bold text-white">R {groupPrice}<span className="font-normal text-slate-500">/mo</span></div>
          </div>
          <div className="flex-1 rounded-xl border border-white/8 bg-white/5 p-2.5 text-center">
            <div className="mb-0.5 text-xs text-slate-500">Private</div>
            <div className="text-sm font-bold text-white">R {privatePrice}<span className="font-normal text-slate-500">/mo</span></div>
          </div>
        </div>
      )}

      {program && maxSeats > 0 && (
        <div className="mb-4 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-slate-400">
          Seats: <span className="font-semibold text-white">{seatsTaken}</span> / {maxSeats}
        </div>
      )}

      {teachers.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 text-xs uppercase tracking-widest text-slate-500">Teachers</div>
          <div className="flex flex-wrap gap-1.5">
            {teachers.map(t => (
              <div key={t.id} className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-2.5 py-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-900 text-[10px] font-bold text-emerald-400">{t.name[0]}</div>
                <span className="text-xs text-slate-300">{t.name.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {subject.comingSoon ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 py-3 text-sm font-semibold text-amber-400">
          <Clock className="h-4 w-4" /> Coming Soon
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 py-3 text-sm font-semibold text-slate-400">
          Checking Seats...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 px-3 py-3 text-center text-xs font-semibold text-amber-300">
          {error}
        </div>
      ) : full ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-center text-sm font-semibold text-slate-300">
          Class Full - Joined Waitlist
        </div>
      ) : (
        <button onClick={() => onOpen(subject, program)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500">
          Enroll Now <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function Enroll() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const displayed = filter === 'available' ? SUBJECTS_DATA.filter(s => !s.comingSoon)
    : filter === 'coming' ? SUBJECTS_DATA.filter(s => s.comingSoon)
    : SUBJECTS_DATA;

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      {selected && <EnrollModal subject={selected.subject} program={selected.program} onClose={() => setSelected(null)} />}

      <div className="px-4 py-14 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">Enroll Now</span>
        <h1 className="mb-3 mt-3 text-4xl font-bold">Choose a Subject</h1>
        <p className="mx-auto max-w-lg text-slate-400">Select the subject you would like to enroll in. Seats are checked live before payment.</p>
      </div>

      <div className="mx-auto mb-8 flex max-w-5xl flex-wrap justify-center gap-2 px-4">
        {['all', 'available', 'coming'].map((val) => {
          const label = val === 'all' ? 'All Subjects' : val === 'available' ? 'Enrollable Now' : 'Coming Soon';
          return (
            <button key={val} onClick={() => setFilter(val)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${filter === val ? 'bg-emerald-700 text-white' : 'border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
              {label}
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map(subject => (
            <SubjectCard key={subject.id} subject={subject} onOpen={(selectedSubject, program) => setSelected({ subject: selectedSubject, program })} />
          ))}
        </div>
      </div>
    </div>
  );
}