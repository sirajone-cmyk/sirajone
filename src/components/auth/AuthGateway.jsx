import React, { useState } from 'react';
import { ArrowRight, BookOpen, KeyRound, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register',
};

const REGISTER_TYPES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
};

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function AuthGateway({ onAuthenticated }) {
  const { login, registerStudent, applyAsTeacher } = useAuth();
  const [mode, setMode] = useState(AUTH_MODES.LOGIN);
  const [registerType, setRegisterType] = useState(REGISTER_TYPES.STUDENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    teachingExperience: '',
  });

  const hasAdmin = true; // Firebase handles admin via Firestore roles

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
    return true;
  }

  function resetRegisterForm() {
    setRegisterForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      teachingExperience: '',
    });
  }

  function handleForgotPassword(event) {
    event.preventDefault();
    setError('');
    setInfo(
      'Password reset is handled by the admin. Contact support to reset your account securely.'
    );
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setInfo('');
    if (!validateLogin()) return;

    setBusy(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (authError) {
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
    const fullName = registerForm.fullName.trim();

    setBusy(true);
    try {
      if (registerType === REGISTER_TYPES.TEACHER) {
        await applyAsTeacher(email, registerForm.password, fullName, {
          teaching_experience: registerForm.teachingExperience.trim(),
          source: 'auth_gateway',
        });
        setInfo('Teacher application submitted. Your account is pending review.');
      } else {
        await registerStudent(email, registerForm.password, fullName);
        setInfo('Student account created successfully.');
      }
      resetRegisterForm();
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
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#7ef6bc]">
                Authentication Gateway
              </div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(34,197,94,0.48)] bg-[rgba(34,197,94,0.14)] shadow-[0_0_18px_rgba(34,197,94,0.22)]">
                  <BookOpen size={22} className="text-[#30d986]" />
                </div>
                <div className="leading-tight">
                  <h1 className="text-[32px] font-bold text-[#f4fff9] sm:text-[38px]">SirajOne</h1>
                  <p className="text-sm font-medium text-[#30d986]">Faith. Knowledge. Action.</p>
                </div>
              </div>

              <h2 className="max-w-[540px] text-[30px] font-semibold leading-[1.1] text-[#f4fff9] sm:text-[38px]">
                Secure entry for students, teachers, and families.
              </h2>
              <p className="mt-5 max-w-[560px] text-base leading-relaxed text-[rgba(228,253,240,0.82)] sm:text-lg">
                Access learning, counselling, transport, and community services through one protected platform.
                Sign in to continue, or register a new account for admin approval.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(6,16,12,0.86)] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode(AUTH_MODES.LOGIN);
                  setError('');
                  setInfo('');
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === AUTH_MODES.LOGIN
                    ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]'
                    : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'
                }`}
              >
                <LogIn size={15} />
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode(AUTH_MODES.REGISTER);
                  setError('');
                  setInfo('');
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === AUTH_MODES.REGISTER
                    ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]'
                    : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'
                }`}
              >
                <UserPlus size={15} />
                Register
              </button>
            </div>

            {mode === AUTH_MODES.LOGIN ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={busy}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href="#forgot-password"
                    onClick={handleForgotPassword}
                    className="inline-flex items-center gap-1 text-sm text-[#83f3bd] hover:text-[#a7ffcf]"
                  >
                    <KeyRound size={14} />
                    Forgot password?
                  </a>
                </div>

                <Button type="submit" className="mt-1 w-full justify-center" disabled={busy}>
                  {busy ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-[rgba(34,197,94,0.2)] bg-[rgba(6,16,12,0.72)] p-1">
                  <button
                    type="button"
                    onClick={() => setRegisterType(REGISTER_TYPES.STUDENT)}
                    disabled={busy}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      registerType === REGISTER_TYPES.STUDENT
                        ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]'
                        : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegisterType(REGISTER_TYPES.TEACHER)}
                    disabled={busy}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      registerType === REGISTER_TYPES.TEACHER
                        ? 'bg-[rgba(34,197,94,0.18)] text-[#6ef0b3]'
                        : 'text-[rgba(217,251,232,0.72)] hover:bg-[rgba(34,197,94,0.08)]'
                    }`}
                  >
                    Applying to Teach
                  </button>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                    Full name
                  </label>
                  <Input
                    type="text"
                    value={registerForm.fullName}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                    placeholder="Full name"
                    autoComplete="name"
                    disabled={busy}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={busy}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                      }
                      placeholder="Create password"
                      autoComplete="new-password"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                      Confirm password
                    </label>
                    <Input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      disabled={busy}
                    />
                  </div>
                </div>

                {registerType === REGISTER_TYPES.TEACHER ? (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[rgba(223,253,238,0.86)]">
                      Teaching background
                    </label>
                    <textarea
                      value={registerForm.teachingExperience}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          teachingExperience: event.target.value,
                        }))
                      }
                      placeholder="Briefly mention what you teach or your teaching experience."
                      disabled={busy}
                      rows={3}
                      className="w-full rounded-xl border border-[rgba(34,197,94,0.22)] bg-[rgba(3,10,7,0.72)] px-4 py-3 text-sm text-[#ecfff4] outline-none transition placeholder:text-[rgba(217,251,232,0.38)] focus:border-[#30d986] focus:ring-2 focus:ring-[rgba(48,217,134,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    <p className="mt-2 text-xs leading-relaxed text-[rgba(217,251,232,0.62)]">
                      Teacher applications stay pending until an administrator approves the account.
                    </p>
                  </div>
                ) : null}

                <Button type="submit" className="mt-1 w-full justify-center" disabled={busy}>
                  {busy
                    ? 'Creating account...'
                    : registerType === REGISTER_TYPES.TEACHER
                      ? 'Submit Teacher Application'
                      : hasAdmin
                        ? 'Create Student Account'
                        : 'Create Admin Account'}
                  <ArrowRight size={16} />
                </Button>
              </form>
            )}

            {error ? (
              <div className="mt-4 rounded-xl border border-[rgba(248,113,113,0.38)] bg-[rgba(98,25,25,0.35)] px-4 py-3 text-sm text-[#ffb4b4]">
                {error}
              </div>
            ) : null}

            {info ? (
              <div className="mt-4 rounded-xl border border-[rgba(34,197,94,0.38)] bg-[rgba(10,56,33,0.34)] px-4 py-3 text-sm text-[#b6ffd8]">
                {info}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
