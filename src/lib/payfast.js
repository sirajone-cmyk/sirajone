const PAYFAST_MODE = import.meta.env.VITE_PAYFAST_MODE || 'sandbox';

export const PAYFAST_CONFIG = {
  mode: PAYFAST_MODE,
  checkoutUrl:
    PAYFAST_MODE === 'production'
      ? 'https://www.payfast.co.za/eng/process'
      : 'https://sandbox.payfast.co.za/eng/process',
  merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
};

const formatAmount = (value) => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Payfast checkout requires a valid amount.');
  }
  return amount.toFixed(2);
};

const createPaymentId = (studentId, programId, enrollmentId) => {
  const timestamp = Date.now();
  return [studentId, programId, enrollmentId || timestamp].filter(Boolean).join('_');
};

export function initiatePayfastCheckout(studentData, programData) {
  if (!studentData?.studentId) {
    throw new Error('Payfast checkout requires a student ID.');
  }

  if (!programData?.programId) {
    throw new Error('Payfast checkout requires a program ID.');
  }

  const origin = window.location.origin;
  const paymentId = createPaymentId(studentData.studentId, programData.programId, programData.enrollmentId);

  const fields = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: `${origin}/dashboard?payment=success`,
    cancel_url: `${origin}/dashboard?payment=cancelled`,
    amount: formatAmount(programData.price_zar),
    item_name: programData.title,
    m_payment_id: paymentId,
    name_first: studentData.fullName || studentData.name || 'SirajOne Student',
    email_address: studentData.email || '',
    custom_str1: studentData.studentId,
    custom_str2: programData.programId,
    custom_str3: programData.enrollmentId || '',
  };

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = PAYFAST_CONFIG.checkoutUrl;
  form.style.display = 'none';

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value ?? '');
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}