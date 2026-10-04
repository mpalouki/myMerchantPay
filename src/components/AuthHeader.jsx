import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import SiteNav, { MenuBurger } from './site/SiteNav.jsx';
import { useMobileMenu } from './site/useMobileMenu.js';
import { useTranslation } from '../i18n/I18nContext.jsx';

// Top menu for the login/register pages, on their dark background: the showcase site's menu
// (Product ▾, Pricing, API documentation, Help ▾), shown as a panel under 980px.
// `page` is the current auth page, so the call-to-action points to the other one.
export default function AuthHeader({ page }) {
  const { t } = useTranslation();
  const menu = useMobileMenu();

  return (
    <header className={`auth-header${menu.open ? ' is-menu-open' : ''}`}>
      <Link to="/" className="auth-header__brand" aria-label={t('site.nav.home')}>
        <Logo variant="white" size={26} />
      </Link>
      <SiteNav id="auth-menu" className="auth-header__nav" />
      <div className="auth-header__actions">
        <LanguageSwitcher />
        {page === 'login' ? (
          <Link to="/register" className="btn auth-header__cta">
            {t('site.nav.signup')}
          </Link>
        ) : (
          <Link to="/login" className="btn auth-header__cta">
            {t('site.nav.login')}
          </Link>
        )}
        <MenuBurger menuId="auth-menu" open={menu.open} onToggle={menu.toggle} dark />
      </div>
    </header>
  );
}
