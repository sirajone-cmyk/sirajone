import React from 'react';
import { Clock3, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function SupportProfileCard({ profile }) {
  return (
    <article id="support" className="rounded-3xl border border-[rgba(34,197,94,0.28)] bg-[rgba(13,39,26,0.72)] p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.16)] text-2xl font-bold text-[#d9fbe8]">
          AP
        </div>
        <div>
          <h3 className="text-3xl md:text-4xl font-bold text-white">{profile.name}</h3>
          <p className="text-[#42e59a] font-medium">{profile.title}</p>
        </div>
      </div>

      <p className="mt-4 text-[rgba(219,242,230,0.86)] leading-7">{profile.bio}</p>

      <div className="mt-4 grid gap-2">
        {profile.highlights.map((item) => (
          <p key={item} className="inline-flex items-center gap-2 text-sm text-[rgba(219,242,230,0.82)]">
            <Sparkles size={13} className="text-[#43e39a]" /> {item}
          </p>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.12em] text-[rgba(219,242,230,0.58)] font-semibold">Session Durations</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {profile.durations.map((duration) => (
            <span key={duration.key} className="inline-flex items-center gap-2 rounded-xl border border-[rgba(34,197,94,0.24)] bg-[rgba(17,26,21,0.66)] px-3 py-2 text-sm text-[#dcfce7]">
              <Clock3 size={14} className="text-[#42e59a]" /> {duration.label}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-[rgba(219,242,230,0.55)]">Pricing is admin-managed and editable in platform settings.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="primary" size="md" href="#contact">Book Session</Button>
        <Button variant="secondary" size="md" href="#messages">Enquire Now</Button>
      </div>
    </article>
  );
}
