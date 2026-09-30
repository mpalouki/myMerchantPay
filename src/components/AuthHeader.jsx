import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useTranslation } from '../i18n/I18nContext.jsx';

const SECTIONS = ['features', 'countries', 'developers', 'security'];

// Top menu for the login/register pages: links back to the homepage and its sections.
// `page` is the current auth page, so the call-to-action points to the other one.
export default function AuthHeader({ page }) {
  const { t } = useTranslation();

  return (
    <header className="auth-header">
      <Link to="/" className="auth-header__brand" aria-label={t('home.nav.home')}>
        <Logo variant="white" size={26} />
      </Link>
      <nav className="auth-header__nav">
        <Link to="/">{t('home.nav.home')}</Link>
        {SECTIONS.map((s) => (
          <Link key={s} to={`/#${s}`} className="auth-header__section">
            {t(`home.nav.${s}`)}
          </Link>
        ))}
      </nav>
      <div className="auth-header__actions">
        <LanguageSwitcher />
        {page === 'login' ? (
          <Link to="/register" className="btn auth-header__cta">
            {t('home.nav.signup')}
          </Link>
        ) : (
          <Link to="/login" className="btn auth-header__cta">
            {t('home.nav.login')}
          </Link>
        )}
      </div>
    </header>
  );
}
