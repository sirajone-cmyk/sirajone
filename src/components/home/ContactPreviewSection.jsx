import React from "react";

const CONTACT_ITEMS = [
  { label: "Location", value: "Overport, Durban, KwaZulu-Natal, South Africa" },
  { label: "Phone", value: "+27 67 634 0225" },
  { label: "Email", value: "madrasatahseenuquran@gmail.com" },
  { label: "Website", value: "https://tahseenulquraan.org" },
];

export default function ContactPreviewSection() {
  return (
    <section className="bg-slate-950 py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="soft-green-glow rounded-2xl border border-emerald-300/20 bg-rahla-panelAlt p-6 sm:p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Contact</p>
          <h2 className="mb-6 text-2xl font-semibold text-white">Get in Touch</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="rounded-xl border border-emerald-400/10 bg-slate-900/45 p-4">
                <p className="mb-1 text-xs uppercase tracking-[0.14em] text-emerald-200">{item.label}</p>
                <p className="text-sm text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
