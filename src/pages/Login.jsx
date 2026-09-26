import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError } from '../api/client.js';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Translation key, or { message } for server errors, so it re-renders on language switch.
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('login.missingCredentials');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? { message: err.message } : 'login.serverError');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__logo">
        <Logo variant="white" size={32} />
      </div>
      <LanguageSwitcher className="login-page__language" />
      <form className="login-card" onSubmit={handleSubmit}>
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

        {error && <div className="login-card__error">{error.message || t(error)}</div>}

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
