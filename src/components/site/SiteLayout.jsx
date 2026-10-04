import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../Logo.jsx';
import LanguageSwitcher from '../LanguageSwitcher.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { FOOTER_NAV, ROUTES } from './siteNav.js';
import SiteNav, { MenuBurger } from './SiteNav.jsx';
import { useMobileMenu } from './useMobileMenu.js';

// Shell of the public showcase pages (home, presentation, services, … legal): sticky header with
// the site menu (a toggled panel on narrow screens) and the footer. Pages render in <Outlet />.
export default function SiteLayout() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { pathname, hash } = useLocation();
  const menu = useMobileMenu();

  // A new page starts at the top, or at its #anchor.
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="home">
      <header className={`home-header${menu.open ? ' is-menu-open' : ''}`}>
        <div className="home-container home-header__inner">
          <Link to="/" className="home-header__brand" aria-label={t('site.nav.home')}>
            <Logo size={24} />
          </Link>

          <SiteNav id="site-menu" className="home-header__nav" />

          <div className="home-header__actions">
            <LanguageSwitcher className="home-header__language" light />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn--primary">
                {t('site.nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn home-btn--outline home-header__login">
                  {t('site.nav.login')}
                </Link>
                <Link to="/register" className="btn btn--primary home-header__signup">
                  {t('site.nav.signup')}
                </Link>
              </>
            )}
            <MenuBurger menuId="site-menu" open={menu.open} onToggle={menu.toggle} />
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="home-footer">
        <div className="home-container">
          <div className="home-footer__top">
            <div className="home-footer__brand">
              <Logo variant="white" size={22} />
              <p>{t('site.footer.tagline')}</p>
            </div>
            {FOOTER_NAV.map(({ title, links }) => (
              <div key={title} className="home-footer__col">
                <h4>{t(`site.footer.${title}`)}</h4>
                <ul>
                  {links.map((key) => (
                    <li key={key}>
                      <Link to={ROUTES[key]}>{t(`site.nav.${key}`)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="home-footer__bottom">
            <span>© {new Date().getFullYear()} MyMerchantPay</span>
            <span>{t('site.footer.rights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
