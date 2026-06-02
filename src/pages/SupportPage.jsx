import React, { useMemo, useState } from 'react';
import { BusFront, CalendarClock, LifeBuoy, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePlatform } from '../state/PlatformContext';

const COUNSELLING_OPTIONS = [
  { key: '30m', label: '30 minute guidance session' },
  { key: '45m', label: '45 minute support session' },
  { key: '60m', label: '60 minute deeper review session' },
];

export default function SupportPage({ setPage }) {
  const {
    currentUser,
    state,
    counselorProfile,
    startSupportConversation,
    bookCounseling,
    submitTransportRequest,
  } = usePlatform();
  const [notice, setNotice] = useState('');
  const [counsellingForm, setCounsellingForm] = useState({
    durationKey: '30m',
    start: '',
    notes: '',
  });
  const [transportForm, setTransportForm] = useState({
    pickupArea: '',
    destination: '',
    preferredPickupTime: '',
    requiredDays: [],
    affordability: 'paid',
    notes: '',
  });

  const myTransportRequests = useMemo(
    () =>
      (state.transportRequests || []).filter(
        (request) => request.requesterId === currentUser?.id
      ),
    [state.transportRequests, currentUser]
  );

  const myCounsellingSessions = useMemo(
    () =>
      (state.sessions || []).filter(
        (session) =>
          session.studentId === currentUser?.id && session.serviceType === 'counseling'
      ),
    [state.sessions, currentUser]
  );

  function toggleDay(day) {
    setTransportForm((prev) => ({
      ...prev,
      requiredDays: prev.requiredDays.includes(day)
        ? prev.requiredDays.filter((item) => item !== day)
        : [...prev.requiredDays, day],
    }));
  }

  function onOpenSupportMessages() {
    startSupportConversation();
    setNotice('Support chat is ready in the Messages area.');
    setPage('messages');
  }

  function onBookCounselling(event) {
    event.preventDefault();
    try {
      bookCounseling(counsellingForm);
      setCounsellingForm({
        durationKey: '30m',
        start: '',
        notes: '',
      });
      setNotice('Counselling request saved. It is now visible in the admin workflow.');
    } catch (error) {
      setNotice(error.message || 'Could not save the counselling request.');
    }
  }

  function onSubmitTransport(event) {
    event.preventDefault();
    try {
      submitTransportRequest({
        firstName: currentUser?.name?.split(' ')[0] || '',
        surname: currentUser?.name?.split(' ').slice(1).join(' ') || '',
        email: currentUser?.email || '',
        contactNumber: '',
        ageGroup: 'student',
        madrasaOrMasjidName: 'SirajOne',
        ...transportForm,
      });
      setTransportForm({
        pickupArea: '',
        destination: '',
        preferredPickupTime: '',
        requiredDays: [],
        affordability: 'paid',
        notes: '',
      });
      setNotice('Transport request submitted. Admin can now review your route needs.');
    } catch (error) {
      setNotice(error.message || 'Could not submit your transport request.');
    }
  }

  return (
    <div className="space-y-7">
      <div className="section-head">
        <p className="section-eyebrow">Support and Access</p>
        <h1 className="section-title">Support, counselling, and transport</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Free-tier students can request support, book access to Counsellor Aisha Peer, and submit
          transport needs through a real in-app workflow.
        </p>
      </div>

      {notice ? (
        <div className="rounded-2xl border border-emerald-300/22 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      ) : null}

      <section className="grid gap-5 xl:grid-cols-3">
        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <MessageCircle size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">General support</h2>
              <p className="text-sm text-slate-300">
                Contact admin even if you have not started studying yet.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            Use this channel for account help, onboarding, timetable questions, access issues, and
            general platform support.
          </p>
          <div className="mt-5">
            <Button variant="primary" size="sm" onClick={onOpenSupportMessages}>
              Open support messages
            </Button>
          </div>
        </article>

        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <LifeBuoy size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">{counselorProfile.name}</h2>
              <p className="text-sm text-slate-300">{counselorProfile.title}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-200">{counselorProfile.bio}</p>

          <form onSubmit={onBookCounselling} className="mt-5 space-y-3">
            <select
              value={counsellingForm.durationKey}
              onChange={(event) =>
                setCounsellingForm((prev) => ({
                  ...prev,
                  durationKey: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
            >
              {COUNSELLING_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={counsellingForm.start}
              onChange={(event) =>
                setCounsellingForm((prev) => ({
                  ...prev,
                  start: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
            />
            <textarea
              value={counsellingForm.notes}
              onChange={(event) =>
                setCounsellingForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              rows={3}
              placeholder="What would you like support with?"
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <Button type="submit" variant="secondary" size="sm">
              <CalendarClock size={15} />
              Request counselling
            </Button>
          </form>
        </article>

        <article className="panel-base p-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-500/10 text-emerald-200">
              <BusFront size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">Transport request</h2>
              <p className="text-sm text-slate-300">
                Request a ride to madrasa, masjid, or your learning point.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmitTransport} className="mt-5 space-y-3">
            <input
              value={transportForm.pickupArea}
              onChange={(event) =>
                setTransportForm((prev) => ({
                  ...prev,
                  pickupArea: event.target.value,
                }))
              }
              placeholder="Pickup area"
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <input
              value={transportForm.destination}
              onChange={(event) =>
                setTransportForm((prev) => ({
                  ...prev,
                  destination: event.target.value,
                }))
              }
              placeholder="Destination"
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <input
              type="time"
              value={transportForm.preferredPickupTime}
              onChange={(event) =>
                setTransportForm((prev) => ({
                  ...prev,
                  preferredPickupTime: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
            />

            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    transportForm.requiredDays.includes(day)
                      ? 'bg-emerald-300 text-slate-900'
                      : 'border border-emerald-300/20 bg-slate-950 text-slate-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <textarea
              value={transportForm.notes}
              onChange={(event) =>
                setTransportForm((prev) => ({
                  ...prev,
                  notes: event.target.value,
                }))
              }
              rows={3}
              placeholder="Extra route notes"
              className="w-full rounded-2xl border border-emerald-300/20 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            />
            <Button type="submit" variant="secondary" size="sm">
              Submit transport request
            </Button>
          </form>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="panel-base p-5">
          <h2 className="text-xl font-bold text-white">Your transport requests</h2>
          <div className="mt-4 space-y-3">
            {myTransportRequests.length === 0 ? (
              <p className="text-sm text-slate-300">No transport requests submitted yet.</p>
            ) : (
              myTransportRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-emerald-300/15 bg-slate-900/50 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {request.pickupArea} → {request.destination}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-emerald-300">
                    {request.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Preferred time: {request.preferredPickupTime || 'Not set'}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel-base p-5">
          <h2 className="text-xl font-bold text-white">Your counselling requests</h2>
          <div className="mt-4 space-y-3">
            {myCounsellingSessions.length === 0 ? (
              <p className="text-sm text-slate-300">
                No counselling bookings yet. When you request one, it will appear here.
              </p>
            ) : (
              myCounsellingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-emerald-300/15 bg-slate-900/50 p-4"
                >
                  <p className="text-sm font-semibold text-white">{session.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-emerald-300">
                    {session.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    {new Date(session.start).toLocaleString('en-ZA', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
