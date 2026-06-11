import { ROLES, USER_STATUS, COUNSELLOR_CATEGORIES } from './roles';

export const COUNSELLOR_DELIVERY_MODES = Object.freeze([
  { key: 'online', label: 'Online' },
  { key: 'inPerson', label: 'In-Person' },
  { key: 'phone', label: 'Phone' },
  { key: 'whatsApp', label: 'WhatsApp' },
  { key: 'groupSessions', label: 'Group Guidance' },
]);

export const COUNSELLOR_AVAILABILITY_KEYS = Object.freeze([
  { key: 'weekdays', label: 'Weekdays' },
  { key: 'weekends', label: 'Weekends' },
  { key: 'evenings', label: 'Evenings' },
]);

export function defaultTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Johannesburg';
}

export function normalizeCounsellorName(value = '', { allowTitle = true } = {}) {
  let cleaned = String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^dr\.?\s+/i, '')
    .replace(/\bPierre\b/gi, 'Peer');

  if (/^aisha peer$/i.test(cleaned)) {
    return allowTitle ? 'Support Provider Aisha Peer' : 'Aisha Peer';
  }

  if (/^(counsellor|support provider)\s+aisha\s+peer$/i.test(cleaned)) {
    return allowTitle ? 'Support Provider Aisha Peer' : 'Aisha Peer';
  }

  return cleaned;
}

export function listFromInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || '')
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeCounsellorCategories(categories = []) {
  const allowed = new Set(COUNSELLOR_CATEGORIES);
  return listFromInput(categories).filter((category) => allowed.has(category));
}

export function createEmptyCounsellorApplication() {
  return {
    fullName: '',
    displayName: '',
    email: '',
    mobileNumber: '',
    country: '',
    city: '',
    languagesSpoken: '',
    profilePhoto: '',
    categories: [],
    highestQualification: '',
    institution: '',
    certifications: '',
    yearsOfExperience: '',
    registrationBody: '',
    professionalMemberships: '',
    serviceDeliveryModes: {
      online: false,
      inPerson: false,
      phone: false,
      whatsApp: false,
      groupSessions: false,
    },
    availability: {
      weekdays: false,
      weekends: false,
      evenings: false,
      timeZone: defaultTimeZone(),
    },
  };
}

export function buildCounsellorApplicationPayload(application = {}) {
  const fullName = normalizeCounsellorName(application.fullName, { allowTitle: false });
  const displayName = normalizeCounsellorName(application.displayName || application.fullName, { allowTitle: true });
  const categories = normalizeCounsellorCategories(application.categories);
  const serviceDeliveryModes = {
    online: Boolean(application.serviceDeliveryModes?.online),
    inPerson: Boolean(application.serviceDeliveryModes?.inPerson),
    phone: Boolean(application.serviceDeliveryModes?.phone),
    whatsApp: Boolean(application.serviceDeliveryModes?.whatsApp),
    groupSessions: Boolean(application.serviceDeliveryModes?.groupSessions),
  };

  return {
    publicProfile: {
      fullName,
      displayName,
      email: String(application.email || '').trim().toLowerCase(),
      mobileNumber: String(application.mobileNumber || '').trim(),
      country: String(application.country || '').trim(),
      city: String(application.city || '').trim(),
      languagesSpoken: listFromInput(application.languagesSpoken),
      profilePhoto: String(application.profilePhoto || '').trim(),
      bio: String(application.bio || '').trim(),
      categories,
      serviceDeliveryModes,
      availability: {
        weekdays: Boolean(application.availability?.weekdays),
        weekends: Boolean(application.availability?.weekends),
        evenings: Boolean(application.availability?.evenings),
        timeZone: String(application.availability?.timeZone || defaultTimeZone()).trim(),
      },
      role: ROLES.COUNSELLOR,
      profileStatus: USER_STATUS.PENDING,
    },
    privateData: {
      highestQualification: String(application.highestQualification || '').trim(),
      institution: String(application.institution || '').trim(),
      certifications: listFromInput(application.certifications),
      yearsOfExperience: Number(application.yearsOfExperience || 0),
      registrationBody: String(application.registrationBody || '').trim(),
      professionalMemberships: listFromInput(application.professionalMemberships),
    },
  };
}


