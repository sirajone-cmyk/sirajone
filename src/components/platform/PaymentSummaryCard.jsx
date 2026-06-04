import React from 'react';

export function PaymentSummaryCard({ icon, label, value, tone = 'text-[#dcfce7]' }) {
  return (
    <article className="rounded-2xl border border-[rgba(34,197,94,0.2)] bg-[rgba(17,26,21,0.82)] p-4">
      <div className={`inline-flex items-center gap-2 text-sm font-medium ${tone}`}>{icon}{label}</div>
      <p className="mt-2 text-4xl font-bold text-white">R {value.toLocaleString('en-ZA')}</p>
    </article>
  );
}
