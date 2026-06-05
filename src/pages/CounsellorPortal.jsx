import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { BookOpen, CalendarDays, CheckCircle, ClipboardList, FileText, HeartHandshake, Loader2, MessageCircle, UserRound } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { isAdminRole, isCounsellorRole } from '@/lib/roles';
import { COUNSELLOR_DELIVERY_MODES, normalizeCounsellorName } from '@/lib/counsellorSchema';

const sections = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'requests', label: 'Counselling Requests', icon: ClipboardList },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'availability', label: 'Availability', icon: CalendarDays },
  { id: 'resources', label: 'Resources', icon: BookOpen },
];

function EmptyState({ icon: Icon, title, body, cta }) {
  return (
    <div className="rounded-3xl border border-dashed border-emerald-800/60 bg-white/[0.03] px-6 py-12 text-center">
      <Icon className="mx-auto mb-4 h-10 w-10 text-emerald-500/80" />
      <h3 className="font-serif text-2xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">{body}</p>
      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}

function Badge({ children, tone = 'emerald' }) {
  const tones = {
    emerald: 'border-emerald-700/60 bg-emerald-950/50 text-emerald-300',
    amber: 'border-amber-700/60 bg-amber-950/40 text-amber-300',
    slate: 'border-slate-700 bg-slate-900 text-slate-300',
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

function Detail({ label, value }) {
  const display = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">{display || 'Not provided'}</p>
    </div>
  );
}

function ProfileView({ profile, privateData }) {
  if (!profile) {
    return <EmptyState icon={UserRound} title="No counsellor profile found" body="Your counsellor profile will appear here after your registration is submitted and stored in Firestore." />;
  }

  const delivery = COUNSELLOR_DELIVERY_MODES.filter((mode) => profile.serviceDeliveryModes?.[mode.key]).map((mode) => mode.label);
  const name = normalizeCounsellorName(profile.displayName || profile.fullName || 'SirajOne Counsellor', { allowTitle: true });

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-[#102018] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Verification Profile</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{name}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{profile.bio || 'No public bio has been added yet.'}</p>
          </div>
          <Badge tone={profile.profileStatus === 'approved' ? 'emerald' : 'amber'}>{profile.profileStatus || 'pending'}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Detail label="Email" value={profile.email} />
        <Detail label="Mobile Number" value={profile.mobileNumber} />
        <Detail label="Location" value={[profile.city, profile.country].filter(Boolean).join(', ')} />
        <Detail label="Languages Spoken" value={profile.languagesSpoken} />
        <Detail label="Counselling Categories" value={profile.categories} />
        <Detail label="Service Delivery" value={delivery} />
        <Detail label="Highest Qualification" value={privateData?.highestQualification} />
        <Detail label="Institution" value={privateData?.institution} />
        <Detail label="Years of Experience" value={privateData?.yearsOfExperience ? `${privateData.yearsOfExperience} years` : ''} />
        <Detail label="Registration Body" value={privateData?.registrationBody} />
        <Detail label="Certifications" value={privateData?.certifications} />
        <Detail label="Professional Memberships" value={privateData?.professionalMemberships} />
      </div>
    </div>
  );
}

function RequestsView({ requests, onUpdate }) {
  if (requests.length === 0) {
    return <EmptyState icon={ClipboardList} title="No counselling requests yet" body="Incoming student assistance cases will appear here once students request support." />;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <article key={request.id} className="rounded-3xl border border-white/10 bg-[#102018] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-white">{request.studentName || 'Student Request'}</h3>
              <p className="mt-1 text-xs text-slate-500">{request.studentEmail || 'No email listed'}</p>
            </div>
            <Badge tone={request.status === 'pending' ? 'amber' : 'emerald'}>{request.status || 'pending'}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(request.categories || []).map((category) => <Badge key={category}>{category}</Badge>)}
          </div>
          {request.note && <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{request.note}</p>}
          <p className="mt-3 text-xs text-slate-500">Preferred contact: {request.preferredContact || 'Not listed'}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {request.status === 'pending' && (
              <>
                <button type="button" onClick={() => onUpdate(request.id, 'accepted')} className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600">Accept</button>
                <button type="button" onClick={() => onUpdate(request.id, 'declined')} className="rounded-xl border border-red-700/50 bg-red-950/30 px-4 py-2 text-xs font-bold text-red-200 hover:bg-red-900/40">Decline</button>
              </>
            )}
            {request.status === 'accepted' && (
              <button type="button" onClick={() => onUpdate(request.id, 'completed')} className="rounded-xl border border-sky-700/50 bg-sky-950/30 px-4 py-2 text-xs font-bold text-sky-200 hover:bg-sky-900/40">Mark Complete</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function AvailabilityView({ profile }) {
  const availability = profile?.availability || {};
  const hasAvailability = availability.weekdays || availability.weekends || availability.evenings || availability.timeZone;

  if (!hasAvailability) {
    return <EmptyState icon={CalendarDays} title="No availability published" body="Availability slots will appear here once they are configured." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Detail label="Weekdays" value={availability.weekdays ? 'Available' : 'Not listed'} />
      <Detail label="Weekends" value={availability.weekends ? 'Available' : 'Not listed'} />
      <Detail label="Evenings" value={availability.evenings ? 'Available' : 'Not listed'} />
      <Detail label="Time Zone" value={availability.timeZone} />
    </div>
  );
}

export default function CounsellorPortal() {
  const { user } = useAuth();
  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [privateData, setPrivateData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = isAdminRole(user?.role);
  const isCounsellor = isCounsellorRole(user?.role);

  useEffect(() => {
    if (!user?.uid) return undefined;

    const unsubscribers = [];

    if (isCounsellor) {
      unsubscribers.push(onSnapshot(doc(db, 'counsellors', user.uid), (snapshot) => {
        setProfile(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
        setLoading(false);
      }, (error) => {
        console.error(error);
        setLoading(false);
      }));

      getDoc(doc(db, 'counsellors', user.uid, 'private_data', 'verification'))
        .then((snapshot) => setPrivateData(snapshot.exists() ? snapshot.data() : null))
        .catch(console.error);
    } else {
      setLoading(false);
    }

    unsubscribers.push(onSnapshot(collection(db, 'counsellingRequests'), (snapshot) => {
      const rows = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
      setRequests(isAdmin ? rows : rows.filter((request) => request.counsellorId === user.uid));
    }, console.error));

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [user?.uid, isAdmin, isCounsellor]);

  const pendingCount = useMemo(() => requests.filter((request) => request.status === 'pending').length, [requests]);

  const updateRequest = async (requestId, status) => {
    await updateDoc(doc(db, 'counsellingRequests', requestId), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  const renderActive = () => {
    if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-emerald-400" /></div>;
    if (active === 'profile') return <ProfileView profile={profile} privateData={privateData} />;
    if (active === 'requests') return <RequestsView requests={requests} onUpdate={updateRequest} />;
    if (active === 'messages') return <EmptyState icon={MessageCircle} title="Messages" body="Secure counselling conversations will appear here through the SirajOne messaging layer." cta={<a href="/messages" className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">Open Messages</a>} />;
    if (active === 'availability') return <AvailabilityView profile={profile} />;
    return <EmptyState icon={FileText} title="No resources yet" body="Shared documentation templates and counselling resources will appear here when added." />;
  };

  return (
    <div className="min-h-screen bg-[#07150d] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-400">Counsellor Dashboard</p>
          <h1 className="mt-2 font-serif text-4xl font-black text-white">Counsellor Workspace</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Manage your profile, incoming requests, messaging, availability, and resources.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-[#102018] p-3">
            <nav className="space-y-1">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActive(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${active === id ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{label}</span>
                  {id === 'requests' && pendingCount > 0 && <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] text-black">{pendingCount}</span>}
                </button>
              ))}
            </nav>
          </aside>

          <section>{renderActive()}</section>
        </div>
      </main>
    </div>
  );
}
