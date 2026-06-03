import React from "react";

const CONTACT_CARDS = [
  { label: "Location", value: "Overport, Durban, KwaZulu-Natal, South Africa" },
  { label: "Phone / WhatsApp", value: "+27 67 634 0225" },
  { label: "Email", value: "sirajone7@gmail.com" },
  { label: "Website", value: "sirajone.co.za" },
];

const CLASS_TIMES = [
  { day: "Monday - Thursday", slots: "Morning & Afternoon slots available" },
  { day: "Saturday", slots: "Morning sessions (in-person + online)" },
  { day: "Sunday", slots: "By appointment" },
];

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="section-head">
        <p className="section-eyebrow">Get In Touch</p>
        <h1 className="section-title">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Ready to begin? Reach out for assessment, enrollment, and personal lesson support.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {CONTACT_CARDS.map((card) => (
          <article key={card.label} className="panel-base p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">{card.label}</p>
            <p className="mt-2 text-sm text-slate-100">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="panel-base p-6">
        <h2 className="text-2xl font-bold text-white">Class Times</h2>
        <div className="mt-4 space-y-3">
          {CLASS_TIMES.map((row) => (
            <div key={row.day} className="flex flex-col justify-between gap-2 border-b border-emerald-300/10 pb-3 text-sm text-slate-200 last:border-b-0 last:pb-0 md:flex-row md:items-center">
              <span>{row.day}</span>
              <span className="text-emerald-200">{row.slots}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel-base border-emerald-300/30 bg-emerald-500/10 p-6 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to Enrol?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-200">
          Send your child's name, age, and current level. We will assess and place them in the right program.
        </p>
        <button className="mt-5 rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-6 py-2.5 text-sm font-extrabold text-slate-900">
          Send Enrollment Request
        </button>
      </section>

      <section className="panel-base p-6">
        <h2 className="text-2xl font-bold text-white">Ustadh Hashim bin Hussain</h2>
        <p className="mt-2 text-sm font-semibold text-emerald-300">Founder & Lead Teacher - SirajOne</p>
        <p className="mt-3 text-sm leading-7 text-muted">
          Qualified in Tajwid and Qur'anic recitation, with a structured teaching approach and personal attention for
          every student.
        </p>
      </section>
    </div>
  );
}
