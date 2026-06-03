import React from 'react';
import { Clock3, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';

const CONTACT_CARDS = [
  {
    Icon: MapPin,
    label: 'Location',
    line1: 'Overport, Durban',
    line2: 'KwaZulu-Natal, South Africa',
  },
  {
    Icon: Phone,
    label: 'Phone / WhatsApp',
    line1: '+27 67 634 0225',
    line2: '',
  },
  {
    Icon: Mail,
    label: 'Email',
    line1: 'sirajone7@gmail.com',
    line2: '',
  },
  {
    Icon: Globe,
    label: 'Website',
    line1: 'sirajone.co.za',
    line2: '',
  },
];

const CLASS_TIMES = [
  { day: 'Monday - Thursday', note: 'Morning and Afternoon slots available' },
  { day: 'Saturday', note: 'Morning sessions (in-person + online)' },
  { day: 'Sunday', note: 'By appointment' },
];

export function ContactSection() {
  return (
    <Section id="contact" variant="pattern" py="py-14 md:py-20">
      <div className="text-center mb-8">
        <p className="section-eyebrow">Get In Touch</p>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Ready to begin? Have a question? We'd love to hear from you.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTACT_CARDS.map((item) => (
          <article key={item.label} className="rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)] p-5">
            <item.Icon size={20} className="text-[#34e29b]" />
            <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[rgba(219,242,230,0.42)] font-semibold">{item.label}</p>
            <p className="mt-2 text-[#f0fdf4] font-semibold">{item.line1}</p>
            {item.line2 ? <p className="text-[rgba(219,242,230,0.78)]">{item.line2}</p> : null}
          </article>
        ))}
      </div>

      <article className="mt-5 max-w-5xl mx-auto rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)] p-5">
        <h3 className="text-3xl font-bold text-white inline-flex items-center gap-2"><Clock3 size={20} className="text-[#34e29b]" /> Class Times</h3>
        <div className="mt-4 space-y-3">
          {CLASS_TIMES.map((slot, index) => (
            <div key={slot.day} className="pb-3 border-b border-[rgba(226,232,240,0.25)] last:border-b-0 last:pb-0">
              <p className="font-semibold text-[#f0fdf4]">{slot.day}</p>
              <p className="text-[rgba(219,242,230,0.62)]">{slot.note}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="mt-5 max-w-5xl mx-auto rounded-3xl border border-[rgba(34,197,94,0.35)] bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(17,26,21,0.85))] p-6 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-white">Ready to Enrol?</h3>
        <p className="mt-3 text-[rgba(219,242,230,0.86)] max-w-2xl mx-auto">
          Send us a message with your child's name, age, and current level. Ustadh Hashim will personally assess and place them in the right program.
        </p>
        <Button variant="primary" size="lg" href="https://wa.me/27676340225" target="_blank" rel="noopener noreferrer" className="mt-5 min-w-[250px] justify-center">
          Send Enrolment Request
        </Button>
      </article>

      <article className="mt-5 max-w-5xl mx-auto rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[rgba(17,26,21,0.82)] p-6">
        <div className="h-14 w-14 rounded-full border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] mb-4" />
        <h3 className="text-2xl md:text-3xl font-bold text-white">Ustadh Hashim bin Hussain</h3>
        <p className="text-[#43df9a] font-medium mt-1">Founder and Lead Teacher · SirajOne Faith. Knowledge. Action.</p>
        <p className="mt-3 text-[rgba(219,242,230,0.84)] leading-8">
          Qualified in Tajwid and Qur'anic recitation with years of dedicated teaching experience in Durban, South Africa. Known for his structured approach, patience, and genuine concern for every student's spiritual and academic development.
        </p>
      </article>
    </Section>
  );
}
