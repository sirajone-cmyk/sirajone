import React, { useState } from 'react';
import { ArrowRight, BookOpen, Eye, EyeOff, HelpCircle, KeyRound, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useOnboarding } from '../onboarding/useOnboarding';
import { ROLES } from '../../lib/roles';
import { SUBJECTS } from '../../lib/subjects';
import { COUNSELLOR_CATEGORIES } from '../../lib/roles';
import {
  COUNSELLOR_AVAILABILITY_KEYS,
  COUNSELLOR_DELIVERY_MODES,
  createEmptyCounsellorApplication,
  normalizeCounsellorName,
} from '../../lib/counsellorSchema';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

const REGISTER_TYPES = {
  STUDENT:           'student',
  TEACHER:           'teacher',
  COUNSELLOR:        'counsellor',
  COUNSELLING_CLIENT:'counsellingClient',
};

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function FieldLabel({ children }) {
  return <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">{children}</label>;
}

function FormTextArea({ value, onChange, placeholder, rows = 3, disabled }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className="w-full rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(3,10,7,0.72)] px-4 py-3 text-sm text-[#ecfff4] outline-none transition placeholder:text-[rgba(217,251,232,0.38)] focus:border-[#30d986] focus:ring-2 focus:ring-[rgba(48,217,134,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function PasswordInput({ label, visible, onToggleVisible, ...props }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <Input {...props} type={visible ? 'text' : 'password'} className="pr-12" />
        <button
          type="button"
          onClick={onToggleVisible}
          disabled={props.disabled}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 text-[rgba(217,251,232,0.62)] transition hover:bg-white/8 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function TogglePill({ checked, onChange, children, disabled }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
        checked
          ? 'border-emerald-500/60 bg-emerald-500/12 text-[#7ef6bc]'
          : 'border-[rgba(34,197,94,0.18)] bg-[rgba(3,10,7,0.4)] text-[rgba(217,251,232,0.74)] hover:border-emerald-500/35'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-emerald-700 bg-transparent text-emerald-500 focus:ring-emerald-500"
      />
      {children}
    </label>
  );
}

export function AuthGateway({ onAuthenticated }) {
  const {
    login,
    registerStudent,
    registerCounsellingClient,
    applyAsTeacher,
    applyAsCounsellor,
    resetPassword,
  } = useAuth();
  const { startPreviewTour } = useOnboarding();
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [registerType, setRegisterType] = useState(REGISTER_TYPES.STUDENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionQualified: '',
    qualificationLevel: '',
    referenceContact: '',
    yearsOfExperience: '',
    currentWorkplace: '',
    certificationsUploadReference: '',
    bio: '',
    personalityDescription: '',
    targetSubjects: [],
    // Counselling client fields
    counsellingNotes: '',
    parentGuardianConsent: false,
  });
  const [counsellorForm, setCounsellorForm] = useState(createEmptyCounsellorApplication());

  function updateRegisterField(field, value) {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCounsellorField(field, value) {
    setCounsellorForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateCounsellorNested(section, field, value) {
    setCounsellorForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }

  function toggleTargetSubject(subjectId) {
    setRegisterForm((prev) => {
      const current = new Set(prev.targetSubjects);
      if (current.has(subjectId)) current.delete(subjectId);
      else current.add(subjectId);
      return { ...prev, targetSubjects: Array.from(current) };
    });
  }

  function toggleCounsellorCategory(category) {
    setCounsellorForm((prev) => {
      const current = new Set(prev.categories);
      if (current.has(category)) current.delete(category);
      else current.add(category);
      return { ...prev, categories: Array.from(current) };
    });
  }

  function validateLogin() {
    const email = normalizeEmail(loginForm.email);
    if (!email || !loginForm.password.trim()) {
      setError('Enter your email and password to log in.');
      return false;
    }
    return true;
  }

  function validateRegister() {
    const fullName = registerForm.fullName.trim();
    const email = normalizeEmail(registerForm.email);
    const password = registerForm.password.trim();
    const confirmPassword = registerForm.confirmPassword.trim();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Complete all registration fields before continuing.');
      return false;
    }
    if (password.length < 6) {
      setError('Use a password with at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Password and confirmation do not match.');
      return false;
    }

    if (registerType === REGISTER_TYPES.STUDENT && !registerForm.parentGuardianConsent) {
      setError('Student registration requires parent or guardian consent before continuing.');
      return false;
    }

    if (registerType === REGISTER_TYPES.TEACHER) {
      if (!registerForm.institutionQualified.trim() || !registerForm.qualificationLevel.trim()) {
        setError('Add your institution and qualification level for the teacher application.');
        return false;
      }
      if (!registerForm.referenceContact.trim() || !registerForm.bio.trim() || registerForm.targetSubjects.length === 0) {
        setError('Complete the teacher reference, bio, and target subjects.');
        return false;
      }
    }

    if (registerType === REGISTER_TYPES.COUNSELLOR) {
      if (!counsellorForm.mobileNumber.trim() || !counsellorForm.country.trim() || !counsellorForm.city.trim()) {
        setError('Add mobile number, country, and city for the support provider application.');
        return false;
      }
      if (!counsellorForm.highestQualification.trim() || !counsellorForm.institution.trim()) {
        setError('Add your Islamic qualification and institution for support provider verification.');
        return false;
      }
      if (counsellorForm.categories.length === 0) {
        setError('Choose at least one area of guidance.');
        return false;
      }
      if (!Object.values(counsellorForm.serviceDeliveryModes).some(Boolean)) {
        setError('Choose at least one service delivery mode.');
        return false;
      }
    }

    // Guidance seeker has no lesson-stage required fields — name/email/password validation above is enough.

    return true;
  }

  function resetRegisterForm() {
    setRegisterForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      institutionQualified: '',
      qualificationLevel: '',
      referenceContact: '',
      yearsOfExperience: '',
      currentWorkplace: '',
      certificationsUploadReference: '',
      bio: '',
      personalityDescription: '',
      targetSubjects: [],
      counsellingNotes: '',
      parentGuardianConsent: false,
    });
    setCounsellorForm(createEmptyCounsellorApplication());
  }

  async function handleForgotPassword(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    const email = normalizeEmail(loginForm.email);
    if (!email) {
      setError('Enter your email address first, then click Forgot password.');
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email);
      setInfo('Password reset email sent. Check your inbox and follow the secure Firebase reset link.');
    } catch (authError) {
      setError(authError.message || 'Could not send password reset email. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    if (!validateLogin()) return;
    setBusy(true);
    try {
      await login(loginForm.email, loginForm.password);
      if (typeof onAuthenticated === 'function') onAuthenticated();
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    if (!validateRegister()) return;

    const email = normalizeEmail(registerForm.email);
    const fullName = normalizeCounsellorName(registerForm.fullName.trim(), { allowTitle: false });

    setBusy(true);
    try {
      if (registerType === REGISTER_TYPES.TEACHER) {
        await applyAsTeacher(email, registerForm.password, fullName, {
          fullName,
          email,
          institutionQualified: registerForm.institutionQualified,
          qualificationLevel: registerForm.qualificationLevel,
          referenceContact: registerForm.referenceContact,
          yearsOfExperience: registerForm.yearsOfExperience,
          currentWorkplace: registerForm.currentWorkplace,
          certificationsUploadReference: registerForm.certificationsUploadReference,
          bio: registerForm.bio,
          personalityDescription: registerForm.personalityDescription,
          targetSubjects: registerForm.targetSubjects,
        });
        setInfo('Teacher application submitted. Your account is pending review.');
      } else if (registerType === REGISTER_TYPES.COUNSELLOR) {
        await applyAsCounsellor(email, registerForm.password, fullName, {
          ...counsellorForm,
          fullName,
          displayName: counsellorForm.displayName || fullName,
          email,
        });
        setInfo('Support provider application submitted. Your account is pending review.');
      } else if (registerType === REGISTER_TYPES.COUNSELLING_CLIENT) {
        await registerCounsellingClient(email, registerForm.password, fullName, registerForm.counsellingNotes);
        setInfo('Your Islamic Guidance & Support request has been submitted. An administrator will review and approve your account shortly.');
      } else {
        await registerStudent(email, registerForm.password, fullName, { parentGuardianConsent: true });
        setInfo('Student account created successfully.');
      }
      resetRegisterForm();
      if (typeof onAuthenticated === 'function') onAuthenticated();
    } catch (authError) {
      setError(authError.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050d0a] text-[#ecfff4]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] items-stretch px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[rgba(34,197,94,0.22)] bg-[linear-gradient(160deg,rgba(6,18,13,0.98),rgba(7,24,16,0.94))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:grid-cols-[1.08fr_1fr]">
          <section className="relative border-b border-[rgba(34,197,94,0.15)] p-6 sm:p-8 md:border-b-0 md:border-r md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.17),transparent_58%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#7ef6bc]">
                SirajOne Platform
              </div>
              <div className="mt-6 flex items-center gap-3 sm:mt-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(34,197,94,0.48)] bg-[rgba(34,197,94,0.14)] shadow-[0_0_18px_rgba(34,197,94,0.22)]">
                  <BookOpen size={22} className="text-[#30d986]" />
                </div>
                <div className="leading-tight">
                  <h1 className="text-[32px] font-bold text-[#f4fff9] sm:text-[38px]">SirajOne</h1>
                  <p className="text-sm font-medium text-[#30d986]">Faith. Knowledge. Action.</p>
                </div>
              </div>
              <div className="mt-8 space-y-4 sm:mt-12">
                <h2 className="max-w-[540px] text-[30px] font-semibold leading-[1.1] text-[#f4fff9] sm:text-[38px]">
                  Welcome to SirajOne
                </h2>
                <p className="max-w-[560px] text-base leading-relaxed text-[rgba(228,253,240,0.82)] sm:text-lg">
                  Your secure platform for Islamic education, Islamic guidance, mentorship, and guided learning. Sign in to continue or apply for a verified role.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(6,16,12,0.86)] p-1">
              {[{ id: AUTH_MODES.LOGIN, label: 'Log In', icon: LogIn }, { id: AUTH_MODES.REGISTER, label: 'Register', icon: UserPlus }].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMode(id);
                    setError('');
                    setInfo('');
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === id ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]' : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={startPreviewTour}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-50 transition hover:border-emerald-300/45 hover:bg-emerald-400/15"
            >
              <HelpCircle size={16} />
              First Time Here? Take a Quick Tour
            </button>

            {mode === AUTH_MODES.LOGIN ? (
              <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <Input type="email" name="username" value={loginForm.email} onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="you@example.com" autoComplete="username" disabled={busy} />
                </div>
                <PasswordInput label="Password" name="current-password" value={loginForm.password} onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Enter your password" autoComplete="current-password" disabled={busy} visible={showLoginPassword} onToggleVisible={() => setShowLoginPassword((value) => !value)} />
                <div className="flex items-center justify-between pt-1">
                  <a href="#forgot-password" onClick={handleForgotPassword} className="inline-flex items-center gap-1 text-sm text-[#83f3bd] hover:text-[#a7ffcf]">
                    <KeyRound size={14} />
                    Forgot password?
                  </a>
                </div>
                <Button type="submit" className="mt-6 w-full justify-center" disabled={busy}>{busy ? 'Logging in...' : 'Log In'}</Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} autoComplete="on">
                <div className="max-h-[80vh] space-y-4 overflow-y-auto px-1 pb-6 sm:max-h-full">
                  <div className="grid grid-cols-3 gap-2 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(6,16,12,0.72)] p-1">
                    {[
                      { id: REGISTER_TYPES.STUDENT, label: 'Student' },
                      { id: REGISTER_TYPES.COUNSELLING_CLIENT, label: 'Guidance Seeker' },
                      { id: REGISTER_TYPES.TEACHER, label: 'Teach' },
                      { id: REGISTER_TYPES.COUNSELLOR, label: 'Support Provider' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setRegisterType(option.id)}
                        disabled={busy}
                        className={`rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm ${registerType === option.id ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]' : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <FieldLabel>Full name</FieldLabel>
                    <Input type="text" name="name" value={registerForm.fullName} onBlur={() => updateRegisterField('fullName', normalizeCounsellorName(registerForm.fullName, { allowTitle: false }))} onChange={(event) => updateRegisterField('fullName', event.target.value)} placeholder="Full name" autoComplete="name" disabled={busy} />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" name="username" value={registerForm.email} onChange={(event) => updateRegisterField('email', event.target.value)} placeholder="you@example.com" autoComplete="username" disabled={busy} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <PasswordInput label="Password" name="new-password" value={registerForm.password} onChange={(event) => updateRegisterField('password', event.target.value)} placeholder="Create password" autoComplete="new-password" disabled={busy} visible={showRegisterPassword} onToggleVisible={() => setShowRegisterPassword((value) => !value)} />
                    <PasswordInput label="Confirm password" name="confirm-new-password" value={registerForm.confirmPassword} onChange={(event) => updateRegisterField('confirmPassword', event.target.value)} placeholder="Confirm password" autoComplete="new-password" disabled={busy} visible={showConfirmPassword} onToggleVisible={() => setShowConfirmPassword((value) => !value)} />
                  </div>

                  {registerType === REGISTER_TYPES.STUDENT && (
                    <label className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm leading-6 text-slate-300">
                      <input
                        type="checkbox"
                        checked={registerForm.parentGuardianConsent}
                        onChange={(event) => updateRegisterField('parentGuardianConsent', event.target.checked)}
                        disabled={busy}
                        className="mt-1 h-4 w-4 rounded border-emerald-700 bg-transparent text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>
                        I confirm that a parent or guardian has given consent for this student account, recordings, and teacher review workflow.
                      </span>
                    </label>
                  )}

                  {registerType === REGISTER_TYPES.TEACHER && (
                    <div className="max-h-[80vh] space-y-4 overflow-y-auto rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(6,16,12,0.42)] px-1 pb-6 pt-4 sm:max-h-full sm:px-4">
                      <div className="grid gap-4 px-3 sm:grid-cols-2 sm:px-0">
                        <div><FieldLabel>Institution Qualified</FieldLabel><Input value={registerForm.institutionQualified} onChange={(event) => updateRegisterField('institutionQualified', event.target.value)} placeholder="Institution name" autoComplete="organization" disabled={busy} /></div>
                        <div><FieldLabel>Qualification Level</FieldLabel><Input value={registerForm.qualificationLevel} onChange={(event) => updateRegisterField('qualificationLevel', event.target.value)} placeholder="Qualification level" disabled={busy} /></div>
                        <div><FieldLabel>Reference Contact</FieldLabel><Input value={registerForm.referenceContact} onChange={(event) => updateRegisterField('referenceContact', event.target.value)} placeholder="Name, phone, or email" disabled={busy} /></div>
                        <div><FieldLabel>Years of Experience</FieldLabel><Input type="number" min="0" value={registerForm.yearsOfExperience} onChange={(event) => updateRegisterField('yearsOfExperience', event.target.value)} placeholder="0" disabled={busy} /></div>
                        <div><FieldLabel>Current Workplace</FieldLabel><Input value={registerForm.currentWorkplace} onChange={(event) => updateRegisterField('currentWorkplace', event.target.value)} placeholder="Current workplace" autoComplete="organization" disabled={busy} /></div>
                        <div><FieldLabel>Certifications Upload Reference</FieldLabel><Input value={registerForm.certificationsUploadReference} onChange={(event) => updateRegisterField('certificationsUploadReference', event.target.value)} placeholder="Link or file reference" disabled={busy} /></div>
                      </div>
                      <div className="px-3 sm:px-0"><FieldLabel>Bio</FieldLabel><FormTextArea value={registerForm.bio} onChange={(event) => updateRegisterField('bio', event.target.value)} placeholder="Write a short public bio for students and families." disabled={busy} /></div>
                      <div className="px-3 sm:px-0"><FieldLabel>Personality Description</FieldLabel><FormTextArea value={registerForm.personalityDescription} onChange={(event) => updateRegisterField('personalityDescription', event.target.value)} placeholder="Briefly describe your teaching style and student approach." rows={2} disabled={busy} /></div>
                      <div className="px-3 sm:px-0">
                        <FieldLabel>Target Subject(s)</FieldLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {SUBJECTS.map((subject) => <TogglePill key={subject.id} checked={registerForm.targetSubjects.includes(subject.id)} onChange={() => toggleTargetSubject(subject.id)} disabled={busy}>{subject.label}</TogglePill>)}
                        </div>
                      </div>
                    </div>
                  )}

  
                {registerType === REGISTER_TYPES.COUNSELLING_CLIENT && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">Islamic Guidance & Support only</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      This registration is for Islamic guidance, mentorship, and support only. No lesson stages, workbook recordings, or Qur'an learning fields will be requested.
                    </p>
                    <div className="mt-4">
                      <FieldLabel>Optional note for the guidance team</FieldLabel>
                      <FormTextArea
                        value={registerForm.counsellingNotes}
                        onChange={(event) => updateRegisterField('counsellingNotes', event.target.value)}
                        placeholder="Share what kind of Islamic guidance or support you are looking for. Do not use this form for emergencies."
                        rows={4}
                        disabled={busy}
                      />
                    </div>
                  </div>
                )}

                {registerType === REGISTER_TYPES.COUNSELLOR && (
                    <div className="max-h-[80vh] space-y-4 overflow-y-auto rounded-2xl border border-[rgba(34,197,94,0.18)] bg-[rgba(6,16,12,0.42)] px-1 pb-6 pt-4 sm:max-h-full sm:px-4">
                      <div className="grid gap-4 px-3 sm:grid-cols-2 sm:px-0">
                        <div><FieldLabel>Display Name</FieldLabel><Input value={counsellorForm.displayName} onBlur={() => updateCounsellorField('displayName', normalizeCounsellorName(counsellorForm.displayName || registerForm.fullName, { allowTitle: true }))} onChange={(event) => updateCounsellorField('displayName', event.target.value)} placeholder="Support Provider Aisha Peer" autoComplete="name" disabled={busy} /></div>
                        <div><FieldLabel>Mobile Number</FieldLabel><Input value={counsellorForm.mobileNumber} onChange={(event) => updateCounsellorField('mobileNumber', event.target.value)} placeholder="+27 ..." autoComplete="tel" disabled={busy} /></div>
                        <div><FieldLabel>Country</FieldLabel><Input value={counsellorForm.country} onChange={(event) => updateCounsellorField('country', event.target.value)} placeholder="South Africa" autoComplete="country-name" disabled={busy} /></div>
                        <div><FieldLabel>City</FieldLabel><Input value={counsellorForm.city} onChange={(event) => updateCounsellorField('city', event.target.value)} placeholder="Durban" autoComplete="address-level2" disabled={busy} /></div>
                        <div><FieldLabel>Languages Spoken</FieldLabel><Input value={counsellorForm.languagesSpoken} onChange={(event) => updateCounsellorField('languagesSpoken', event.target.value)} placeholder="English, Urdu, Arabic" autoComplete="off" disabled={busy} /></div>
                        <div><FieldLabel>Profile Photo Reference</FieldLabel><Input value={counsellorForm.profilePhoto} onChange={(event) => updateCounsellorField('profilePhoto', event.target.value)} placeholder="Optional URL or storage reference" autoComplete="off" disabled={busy} /></div>
                        <div><FieldLabel>Highest Qualification</FieldLabel><Input value={counsellorForm.highestQualification} onChange={(event) => updateCounsellorField('highestQualification', event.target.value)} placeholder="Qualification" disabled={busy} /></div>
                        <div><FieldLabel>Institution</FieldLabel><Input value={counsellorForm.institution} onChange={(event) => updateCounsellorField('institution', event.target.value)} placeholder="Institution" autoComplete="organization" disabled={busy} /></div>
                        <div><FieldLabel>Certifications</FieldLabel><Input value={counsellorForm.certifications} onChange={(event) => updateCounsellorField('certifications', event.target.value)} placeholder="Comma separated" disabled={busy} /></div>
                        <div><FieldLabel>Years of Experience</FieldLabel><Input type="number" min="0" value={counsellorForm.yearsOfExperience} onChange={(event) => updateCounsellorField('yearsOfExperience', event.target.value)} placeholder="0" disabled={busy} /></div>
                        <div><FieldLabel>Registration Body</FieldLabel><Input value={counsellorForm.registrationBody} onChange={(event) => updateCounsellorField('registrationBody', event.target.value)} placeholder="Islamic qualification body or reference" disabled={busy} /></div>
                        <div><FieldLabel>Memberships / References</FieldLabel><Input value={counsellorForm.professionalMemberships} onChange={(event) => updateCounsellorField('professionalMemberships', event.target.value)} placeholder="Comma separated" disabled={busy} /></div>
                      </div>

                      <div className="px-3 sm:px-0"><FieldLabel>Bio</FieldLabel><FormTextArea value={counsellorForm.bio || ''} onChange={(event) => updateCounsellorField('bio', event.target.value)} placeholder="Write a short public Islamic guidance and support bio." disabled={busy} /></div>

                      <div className="px-3 sm:px-0">
                        <FieldLabel>Areas of Guidance</FieldLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {COUNSELLOR_CATEGORIES.map((category) => <TogglePill key={category} checked={counsellorForm.categories.includes(category)} onChange={() => toggleCounsellorCategory(category)} disabled={busy}>{category}</TogglePill>)}
                        </div>
                      </div>

                      <div className="grid gap-4 px-3 sm:grid-cols-2 sm:px-0">
                        <div>
                          <FieldLabel>Service Delivery</FieldLabel>
                          <div className="space-y-2">
                            {COUNSELLOR_DELIVERY_MODES.map((modeOption) => <TogglePill key={modeOption.key} checked={counsellorForm.serviceDeliveryModes[modeOption.key]} onChange={() => updateCounsellorNested('serviceDeliveryModes', modeOption.key, !counsellorForm.serviceDeliveryModes[modeOption.key])} disabled={busy}>{modeOption.label}</TogglePill>)}
                          </div>
                        </div>
                        <div>
                          <FieldLabel>Availability</FieldLabel>
                          <div className="space-y-2">
                            {COUNSELLOR_AVAILABILITY_KEYS.map((slot) => <TogglePill key={slot.key} checked={counsellorForm.availability[slot.key]} onChange={() => updateCounsellorNested('availability', slot.key, !counsellorForm.availability[slot.key])} disabled={busy}>{slot.label}</TogglePill>)}
                          </div>
                          <div className="mt-3"><FieldLabel>Time Zone</FieldLabel><Input value={counsellorForm.availability.timeZone} onChange={(event) => updateCounsellorNested('availability', 'timeZone', event.target.value)} disabled={busy} /></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="mt-8 w-full justify-center" disabled={busy}>
                    {busy ? 'Creating account...' : registerType === REGISTER_TYPES.TEACHER ? 'Submit Teacher Application' : registerType === REGISTER_TYPES.COUNSELLOR ? 'Submit Support Provider Application' : registerType === REGISTER_TYPES.COUNSELLING_CLIENT ? 'Submit Guidance Request' : 'Create Student Account'}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </form>
            )}

            {error ? <div className="mt-4 rounded-xl border border-[rgba(248,113,113,0.38)] bg-[rgba(98,25,25,0.35)] px-4 py-3 text-sm text-[#ffb4b4]">{error}</div> : null}
            {info ? <div className="mt-4 rounded-xl border border-[rgba(34,197,94,0.38)] bg-[rgba(10,56,33,0.34)] px-4 py-3 text-sm text-[#b6ffd8]">{info}</div> : null}
          </section>
        </div>
      </div>
    </div>
  );
}



