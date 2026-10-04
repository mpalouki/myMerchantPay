import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { MAIN_NAV, ROUTES } from './siteNav.js';

// The showcase site's menu (MAIN_NAV: links and dropdown groups), shared by the site header
// (SiteLayout) and the login/register header (AuthHeader). Each header styles it and shows it
// as a panel on narrow screens, toggled by <MenuBurger>.
export default function SiteNav({ id, className }) {
  const { t } = useTranslation();

  return (
    <nav id={id} className={className} aria-label={t('site.nav.label')}>
      {MAIN_NAV.map(({ key, items }) =>
        items ? (
          <NavDropdown key={key} id={`${id}-${key}`} group={key} items={items} />
        ) : (
          <NavLink key={key} to={ROUTES[key]}>
            {t(`site.nav.${key}`)}
          </NavLink>
        ),
      )}
    </nav>
  );
}

// Hamburger button opening a header's menu panel (see useMobileMenu).
export function MenuBurger({ menuId, open, onToggle, dark = false }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={`site-burger${dark ? ' site-burger--dark' : ''}${open ? ' is-open' : ''}`}
      aria-expanded={open}
      aria-controls={menuId}
      aria-label={t(open ? 'site.nav.closeMenu' : 'site.nav.openMenu')}
      onClick={onToggle}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

// A menu group ("Product", "Help"): a button with a dropdown arrow opening its links.
// Opens on hover with a mouse, on click/tap otherwise; Escape, a click outside or navigating
// closes it. In a header's mobile panel the links are always listed under the label.
function NavDropdown({ id, group, items }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const ref = useRef(null);
  // Remembers the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const active = items.some((key) => ROUTES[key] === pathname);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpenOn(null);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenOn(null);
        ref.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const hover = (next) => (e) => {
    if (e.pointerType === 'mouse') setOpenOn(next ? pathname : null);
  };

  return (
    <div
      ref={ref}
      className={`site-dropdown${open ? ' is-open' : ''}`}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
    >
      <button
        type="button"
        className={`site-dropdown__toggle${active ? ' active' : ''}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpenOn(open ? null : pathname)}
      >
        {t(`site.nav.${group}`)}
        <Icon name="chevronDown" size={16} className="site-dropdown__arrow" />
      </button>
      <ul id={id} className="site-dropdown__menu">
        {items.map((key) => (
          <li key={key}>
            <NavLink to={ROUTES[key]}>{t(`site.nav.${key}`)}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
