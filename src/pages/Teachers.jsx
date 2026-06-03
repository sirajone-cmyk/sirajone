import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { ArrowRight, BookOpen, Loader2, Users } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FOUNDER_TEACHER_PROFILE } from '@/lib/teacherSchema';
import { getSubjectLabel, SUBJECTS } from '@/lib/subjects';

const APPROVED_PROFILE_STATUS = 'approved';

const FILTERS = Object.freeze([
  { id: 'all', label: 'All Teachers' },
  ...SUBJECTS,
]);

function toPublicTeacher(docId, data = {}, options = {}) {
  const profile = data.publicProfile || data;

  return {
    id: docId,
    name: profile.name || profile.fullName || 'Unnamed Teacher',
    bio: profile.bio || '',
    personalityDescription: profile.personalityDescription || '',
    assignedSubjects: Array.isArray(profile.assignedSubjects) ? profile.assignedSubjects : [],
    profileStatus: profile.profileStatus || 'pending',
    isFallback: Boolean(options.isFallback),
  };
}

function founderFallbackTeacher() {
  return toPublicTeacher(
    FOUNDER_TEACHER_PROFILE.uid || FOUNDER_TEACHER_PROFILE.id,
    FOUNDER_TEACHER_PROFILE,
    { isFallback: true }
  );
}

function TeacherCard({ teacher, featured = false }) {
  const subjectLabels = teacher.assignedSubjects.map(getSubjectLabel);

  return (
    <article
      className={
        featured
          ? 'bg-emerald-950/60 border border-emerald-800 rounded-3xl p-6 sm:p-8'
          : 'bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all'
      }
    >
      <div className={featured ? 'flex flex-col sm:flex-row gap-5 items-start' : 'flex gap-4 items-start mb-3'}>
        <div
          className={
            featured
              ? 'w-16 h-16 rounded-2xl bg-emerald-900 border border-emerald-700 flex items-center justify-center flex-shrink-0'
              : 'w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0'
          }
        >
          <BookOpen className={featured ? 'w-7 h-7 text-emerald-300' : 'w-5 h-5 text-emerald-400'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <h2 className={featured ? 'text-xl font-bold text-white' : 'font-bold text-white text-sm'}>
              {teacher.name}
            </h2>
            {teacher.isFallback ? (
              <span className="px-3 py-1 rounded-full bg-amber-900/60 border border-amber-800 text-amber-400 text-xs font-semibold">
                Founder
              </span>
            ) : null}
          </div>

          {teacher.bio ? (
            <p className={featured ? 'text-slate-400 text-sm leading-relaxed mt-3 mb-4' : 'text-slate-400 text-xs leading-relaxed mt-3 mb-3'}>
              {teacher.bio}
            </p>
          ) : null}

          {teacher.personalityDescription ? (
            <p className="mb-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs leading-relaxed text-slate-300">
              {teacher.personalityDescription}
            </p>
          ) : null}

          {subjectLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {subjectLabels.map((subject) => (
                <span
                  key={subject}
                  className={
                    featured
                      ? 'text-xs px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-800 text-emerald-300'
                      : 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/40 border border-emerald-900 text-emerald-400'
                  }
                >
                  {subject}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeSubject, setActiveSubject] = useState('all');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'teachers'),
      (snapshot) => {
        if (snapshot.empty) {
          setTeachers([founderFallbackTeacher()]);
        } else {
          setTeachers(snapshot.docs.map((doc) => toPublicTeacher(doc.id, doc.data())));
        }

        setLoadError('');
        setHasLoaded(true);
      },
      (error) => {
        console.error('Error loading teacher profiles:', error);
        setLoadError('Unable to load teacher profiles right now. Showing the founder profile until the live list is available.');
        setTeachers([founderFallbackTeacher()]);
        setHasLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  const approvedTeachers = useMemo(
    () => teachers.filter((teacher) => teacher.profileStatus === APPROVED_PROFILE_STATUS),
    [teachers]
  );

  const filteredTeachers = useMemo(() => {
    if (activeSubject === 'all') return approvedTeachers;
    return approvedTeachers.filter((teacher) => teacher.assignedSubjects.includes(activeSubject));
  }, [activeSubject, approvedTeachers]);

  const featuredTeacher = filteredTeachers[0];
  const remainingTeachers = filteredTeachers.slice(1);

  return (
    <div className="min-h-screen bg-[#0b1a12] text-white">
      <Navbar />
      <div className="text-center py-14 px-4">
        <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Our Faculty</span>
        <h1 className="text-4xl font-bold mt-3 mb-3">Our Teachers</h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Approved SirajOne teachers for Qur'an learning, Islamic studies, and guided student development.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-5">
        <div className="flex flex-wrap justify-center gap-2">
          {FILTERS.map((subject) => (
            <button
              key={subject.id}
              type="button"
              onClick={() => setActiveSubject(subject.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                activeSubject === subject.id
                  ? 'border-emerald-500 bg-emerald-700 text-white shadow-lg shadow-emerald-950/30'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:border-emerald-700 hover:text-white'
              }`}
            >
              {subject.label}
            </button>
          ))}
        </div>

        {!hasLoaded ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-400" />
            Loading teacher profiles...
          </div>
        ) : null}

        {loadError ? (
          <div className="rounded-2xl border border-amber-800 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-300">
            {loadError}
          </div>
        ) : null}

        {hasLoaded && filteredTeachers.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-500" />
            <h2 className="text-xl font-bold text-white">No approved teachers found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              There are no approved teacher profiles for this category yet. Please check back soon or contact SirajOne for guidance.
            </p>
          </div>
        ) : null}

        {featuredTeacher ? <TeacherCard teacher={featuredTeacher} featured /> : null}

        {remainingTeachers.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {remainingTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : null}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 text-center">
          <h2 className="text-2xl font-bold mb-3">Find the Right Teacher</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Contact SirajOne to be matched with the right teacher for your level, age, and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/27676340225"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all"
            >
              WhatsApp Us <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:sirajone7@gmail.com?subject=Teacher Booking Request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm rounded-xl transition-all"
            >
              Email Request
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}