import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader.jsx';
import { ApiError, acceptTeamInvitation, checkTeamInvitation } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';

// Landing page of the invitation emailed to a team member (/join-team?token=…, see myPay's
// TeamInvitationManager). When the email has no portal login yet (needsPassword), the member
// chooses a password: that creates the login and signs them in. Otherwise accepting only
// activates the membership and the member signs in as usual.

// Mirrors myPay's App\Validator\PasswordPolicy; the server stays the source of truth.
function validate(password, confirm) {
  const errors = {};
  if (password.length < 10) errors.password = 'createAccount.errors.passwordTooShort';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) errors.password = 'createAccount.errors.passwordWeak';
  if (confirm !== password) errors.confirm = 'createAccount.errors.passwordMismatch';
  return errors;
}

// Translation key explaining why a link can't be used, from a 422 { errors: { token } }.
const invalidReason = (err) =>
  err instanceof ApiError && /another merchant/i.test(err.data?.errors?.token ?? '')
    ? 'joinTeam.invalid.emailTaken'
    : 'joinTeam.invalid.message';

export default function JoinTeam() {
  const { t } = useTranslation();
  const { signInWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  // null while checking, { invalid: key } for an unusable link, { joined: true } once
  // accepted without a new login, else the invitation from checkTeamInvitation().
  const [state, setState] = useState(token ? null : { invalid: 'joinTeam.invalid.message' });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  // Translation keys, or { message } for server messages, so they re-render on language switch.
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    checkTeamInvitation(token)
      .then((data) => !cancelled && setState(data))
      .catch((err) => !cancelled && setState({ invalid: invalidReason(err) }));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const invitation = state;
    if (invitation.needsPassword) {
      const errors = validate(password, confirm);
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setSubmitting(true);
    let result;
    try {
      result = await acceptTeamInvitation(
        invitation.needsPassword ? { token, password, confirmPassword: confirm } : { token },
      );
    } catch (err) {
      const serverErrors = err instanceof ApiError ? err.data?.errors : null;
      if (serverErrors?.token) setState({ invalid: invalidReason(err) });
      else if (serverErrors?.password || serverErrors?.confirm_password)
        setFieldErrors({
          password: serverErrors.password && { message: serverErrors.password },
          confirm: serverErrors.confirm_password && 'createAccount.errors.passwordMismatch',
        });
      else setError(err instanceof ApiError && err.status === 0 ? { message: err.message } : 'joinTeam.errors.failed');
      setSubmitting(false);
      return;
    }

    if (!result.loginCreated) {
      setState({ joined: true, teamName: invitation.teamName });
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

      {state === null && <div className="login-card">{t('joinTeam.checking')}</div>}

      {state?.invalid && (
        <div className="login-card register-card--done">
          <h1>{t('joinTeam.invalid.title')}</h1>
          <p>{t(state.invalid)}</p>
          <Link to="/login" className="btn btn--primary btn--block">
            {t('joinTeam.toLogin')}
          </Link>
        </div>
      )}

      {state?.joined && (
        <div className="login-card register-card--done">
          <h1>{t('joinTeam.joined.title')}</h1>
          <p>{t('joinTeam.joined.message', { team: state.teamName })}</p>
          <Link to="/login" className="btn btn--primary btn--block">
            {t('joinTeam.toLogin')}
          </Link>
        </div>
      )}

      {state?.email && (
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h1>{t('joinTeam.title', { team: state.teamName })}</h1>
          <p className="login-card__intro">
            {t('joinTeam.intro', { merchant: state.merchantName, habilitation: state.habilitation })}
          </p>

          <label className="field field--stacked">
            <span>{t('createAccount.email')}</span>
            <input type="email" value={state.email} autoComplete="username" readOnly />
          </label>

          {state.needsPassword ? (
            <>
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
            </>
          ) : (
            <p className="login-card__intro">{t('joinTeam.existingLogin')}</p>
          )}

          {error && <div className="login-card__error">{text(error)}</div>}

          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting
              ? t('joinTeam.submitting')
              : state.needsPassword
                ? t('joinTeam.submitWithPassword')
                : t('joinTeam.submit')}
          </button>
        </form>
      )}
    </div>
  );
}
