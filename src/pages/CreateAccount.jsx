import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader.jsx';
import { ApiError, acceptInvitation, checkInvitation } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';

// Landing page of the account creation link sent from myPay's KYC review to merchants who
// registered through the contact form (/create-account?token=…). Creating the login signs
// the merchant in; DashboardLayout then sends them to KYC validation.

// Mirrors myPay's App\Validator\PasswordPolicy; the server stays the source of truth.
function validate(password, confirm) {
  const errors = {};
  if (password.length < 10) errors.password = 'createAccount.errors.passwordTooShort';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) errors.password = 'createAccount.errors.passwordWeak';
  if (confirm !== password) errors.confirm = 'createAccount.errors.passwordMismatch';
  return errors;
}

export default function CreateAccount() {
  const { t } = useTranslation();
  const { signInWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  // null while checking, false for an unusable link, else { email, merchantName }.
  const [invitation, setInvitation] = useState(token ? null : false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  // Translation keys, or { message } for server messages, so they re-render on language switch.
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    checkInvitation(token)
      .then((data) => {
        if (!cancelled) setInvitation(data);
      })
      .catch(() => {
        if (!cancelled) setInvitation(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const errors = validate(password, confirm);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    let result;
    try {
      result = await acceptInvitation({ token, password, confirmPassword: confirm });
    } catch (err) {
      const serverErrors = err instanceof ApiError ? err.data?.errors : null;
      if (serverErrors?.token) setInvitation(false);
      else if (serverErrors?.password || serverErrors?.confirm_password)
        setFieldErrors({
          password: serverErrors.password && { message: serverErrors.password },
          confirm: serverErrors.confirm_password && 'createAccount.errors.passwordMismatch',
        });
      else setError(err instanceof ApiError && err.status === 0 ? { message: err.message } : 'createAccount.errors.failed');
      setSubmitting(false);
      return;
    }

    try {
      await signInWithToken(result.token, invitation.email);
      navigate('/dashboard');
    } catch {
      // The login exists; only the automatic sign-in failed.
      navigate('/login');
    }
  };

  const text = (value) => value && (value.message || t(value));

  return (
    <div className="login-page">
      <AuthHeader page="register" />

      {invitation === null && <div className="login-card">{t('createAccount.checking')}</div>}

      {invitation === false && (
        <div className="login-card register-card--done">
          <h1>{t('createAccount.invalid.title')}</h1>
          <p>{t('createAccount.invalid.message')}</p>
          <Link to="/login" className="btn btn--primary btn--block">
            {t('createAccount.invalid.toLogin')}
          </Link>
        </div>
      )}

      {invitation && (
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h1>{t('createAccount.title')}</h1>
          <p className="login-card__intro">{t('createAccount.intro', { merchant: invitation.merchantName })}</p>

          <label className="field field--stacked">
            <span>{t('createAccount.email')}</span>
            <input type="email" value={invitation.email} autoComplete="username" readOnly />
          </label>

          <label className="field field--stacked">
            <span>{t('createAccount.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!fieldErrors.password}
            />
            <small className={fieldErrors.password ? 'field__error' : undefined}>
              {text(fieldErrors.password) || t('createAccount.passwordHint')}
            </small>
          </label>

          <label className="field field--stacked">
            <span>{t('createAccount.confirm')}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!fieldErrors.confirm}
            />
            {fieldErrors.confirm && <small className="field__error">{text(fieldErrors.confirm)}</small>}
          </label>

          {error && <div className="login-card__error">{text(error)}</div>}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? t('createAccount.submitting') : t('createAccount.submit')}
          </button>
        </form>
      )}
    </div>
  );
}
