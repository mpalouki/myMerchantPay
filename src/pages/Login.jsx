import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError, resendLoginCode } from '../api/client.js';
import { useTranslation } from '../i18n/I18nContext.jsx';

// 401s from POST /api/login carry an English message: wrong credentials, or myPay's
// login_throttling lockout (5 wrong passwords per 15 minutes).
function passwordError(err) {
  if (!(err instanceof ApiError)) return 'login.serverError';
  if (err.status === 401) return /too many/i.test(err.message) ? 'login.tooManyAttempts' : 'login.invalidCredentials';
  return { message: err.message };
}

// Two steps: email + password (POST /api/login emails a login code), then the code
// (POST /api/login/otp returns the JWT). See myPay's LoginOtpManager.
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Set once the password is accepted: { challenge, email (masked), codeLength, ... }.
  const [otp, setOtp] = useState(null);
  const [code, setCode] = useState('');
  // Seconds before "resend" is allowed; null when no resend is left.
  const [resendIn, setResendIn] = useState(0);
  // Translation key, [key, params], or { message } for server errors, so it re-renders on language switch.
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, verifyCode } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!resendIn) return undefined;
    const timer = setTimeout(() => setResendIn((s) => (s ? s - 1 : s)), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const backToPassword = (reason) => {
    setOtp(null);
    setCode('');
    setNotice(null);
    setError(reason);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('login.missingCredentials');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.otpRequired) {
        navigate('/dashboard');
        return;
      }
      setOtp(result);
      setCode('');
      setResendIn(result.resendAvailableIn ?? 0);
      setNotice(null);
    } catch (err) {
      setError(passwordError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== otp.codeLength) {
      setError('login.otp.incomplete');
      return;
    }

    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await verifyCode(otp.challenge, code, email);
      navigate('/dashboard');
    } catch (err) {
      const errors = err instanceof ApiError ? err.data?.errors : null;
      if (errors?.challenge) backToPassword('login.otp.expired');
      else if (errors?.code) {
        setCode('');
        setError(['login.otp.wrongCode', { count: err.data.remainingAttempts }]);
      } else setError(err instanceof ApiError && err.status === 0 ? { message: err.message } : 'login.serverError');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const result = await resendLoginCode(otp.challenge);
      setCode('');
      setResendIn(result.resendAvailableIn);
      setNotice('login.otp.resent');
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) setResendIn(err.data?.resendAvailableIn ?? 30);
      else if (err instanceof ApiError && err.data?.errors?.challenge) backToPassword('login.otp.expired');
      else setError(err instanceof ApiError && err.status !== 0 ? 'login.otp.resendFailed' : 'login.serverError');
    } finally {
      setSubmitting(false);
    }
  };

  const text = (value) => {
    if (!value) return null;
    if (value.message) return value.message;
    return Array.isArray(value) ? t(...value) : t(value);
  };

  if (otp) {
    return (
      <div className="login-page">
        <AuthHeader page="login" />
        <form className="login-card" onSubmit={handleCodeSubmit} noValidate>
          <h1>{t('login.otp.title')}</h1>
          <p className="login-card__intro">{t('login.otp.intro', { email: otp.email })}</p>

          <label className="field">
            <span className="field__label sr-only">{t('login.otp.code')}</span>
            <input
              className="login-card__code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={otp.codeLength}
              placeholder={'•'.repeat(otp.codeLength)}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, otp.codeLength))}
              disabled={submitting}
              autoFocus
            />
          </label>

          {error && <div className="login-card__error">{text(error)}</div>}
          {notice && <div className="login-card__notice">{t(notice)}</div>}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? t('login.otp.verifying') : t('login.otp.submit')}
          </button>

          <button
            type="button"
            className="login-card__link"
            onClick={handleResend}
            disabled={submitting || resendIn !== 0}
          >
            {resendIn === null
              ? t('login.otp.noResendLeft')
              : resendIn > 0
                ? t('login.otp.resendIn', { seconds: resendIn })
                : t('login.otp.resend')}
          </button>

          <button type="button" className="login-card__link" onClick={() => backToPassword(null)} disabled={submitting}>
            {t('login.otp.back')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-page">
      <AuthHeader page="login" />
      <form className="login-card" onSubmit={handlePasswordSubmit}>
        <h1>{t('login.title')}</h1>

        <label className="field">
          <span className="field__label sr-only">{t('login.email')}</span>
          <input
            type="email"
            placeholder={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={submitting}
          />
        </label>

        <label className="field">
          <span className="field__label sr-only">{t('login.password')}</span>
          <input
            type="password"
            placeholder={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={submitting}
          />
        </label>

        {error && <div className="login-card__error">{text(error)}</div>}

        <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </button>

        <a href="#forgot" className="login-card__forgot">
          {t('login.forgotPassword')}
        </a>

        <Link to="/register" className="login-card__forgot">
          {t('login.noAccount')}
        </Link>
      </form>
    </div>
  );
}
