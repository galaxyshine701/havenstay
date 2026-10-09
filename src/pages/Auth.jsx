import { useId, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import FormField from '../components/FormField';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';
import { btnPrimary, cardClass, containerClass, fieldProps, inputClass } from '../lib/ui';
import { safeNextPath, validateAuth } from '../lib/validators';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const next = safeNextPath(searchParams.get('next'));
  const { user, loading, signIn, signUp } = useAuth();
  const baseId = useId();
  const ids = {
    fullName: `${baseId}-name`,
    email: `${baseId}-email`,
    password: `${baseId}-password`,
  };

  const [mode, setMode] = useState('signin');
  const [values, setValues] = useState({ fullName: '', email: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | error | confirm
  const [message, setMessage] = useState('');

  usePageTitle(mode === 'signin' ? 'Sign in' : 'Create account');

  // Already signed in (or just signed in): go back to where the visitor came from.
  if (!loading && user) return <Navigate to={next} replace />;

  const errors = submitted ? validateAuth({ mode, ...values }) : {};
  const isSignIn = mode === 'signin';

  const setValue = (name) => (event) => setValues((prev) => ({ ...prev, [name]: event.target.value }));

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setSubmitted(false);
    setStatus('idle');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (status === 'submitting') return;

    const found = validateAuth({ mode, ...values });
    const firstInvalid = ['fullName', 'email', 'password'].find((name) => found[name]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    setStatus('submitting');
    setMessage('');
    const email = values.email.trim();

    if (isSignIn) {
      const { error } = await signIn(email, values.password);
      if (error) {
        setStatus('error');
        setMessage(error.message);
      }
      // On success the session updates and <Navigate> above takes over.
      return;
    }

    const { error, needsConfirmation } = await signUp({
      email,
      password: values.password,
      fullName: values.fullName.trim(),
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else if (needsConfirmation) {
      setStatus('confirm');
      setMessage(`We sent a confirmation link to ${email}. Open it, then come back and sign in.`);
    }
  };

  return (
    <div className={`${containerClass} py-12`}>
      <div className={`${cardClass} mx-auto max-w-md p-6 md:p-8`}>
        <h1 className="text-3xl font-semibold text-haven-900">
          {isSignIn ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-2 text-base text-ink-500">
          {isSignIn
            ? 'Sign in to book your stay and see your confirmation.'
            : 'An account keeps your bookings private and saves you retyping your details.'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          {!isSignIn && (
            <FormField id={ids.fullName} label="Full name" error={errors.fullName}>
              <input
                {...fieldProps(ids.fullName, errors.fullName)}
                type="text"
                autoComplete="name"
                value={values.fullName}
                onChange={setValue('fullName')}
                className={inputClass(errors.fullName)}
              />
            </FormField>
          )}

          <FormField id={ids.email} label="Email" error={errors.email}>
            <input
              {...fieldProps(ids.email, errors.email)}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={setValue('email')}
              className={inputClass(errors.email)}
            />
          </FormField>

          <FormField id={ids.password} label="Password" error={errors.password}>
            <input
              {...fieldProps(ids.password, errors.password)}
              type="password"
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              value={values.password}
              onChange={setValue('password')}
              className={inputClass(errors.password)}
            />
          </FormField>

          {status === 'error' && (
            <p role="alert" className="rounded-xl border border-danger/40 p-4 text-sm text-danger">
              {message}
            </p>
          )}
          {status === 'confirm' && (
            <p role="status" className="rounded-xl bg-haven-50 p-4 text-sm text-ink-900">
              {message}
            </p>
          )}

          <button type="submit" disabled={status === 'submitting'} className={`${btnPrimary} w-full`}>
            {status === 'submitting' && <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />}
            {status === 'submitting' ? 'Please wait…' : isSignIn ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {isSignIn ? 'New to HavenStay?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(isSignIn ? 'signup' : 'signin')}
            className="min-h-[44px] rounded font-semibold text-haven-700 underline underline-offset-4 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            {isSignIn ? 'Create an account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
