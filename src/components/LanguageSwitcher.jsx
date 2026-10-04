import { useEffect, useRef, useState } from 'react';
import Flag from './Flag.jsx';
import Icon from './Icon.jsx';
import { LOCALES, useTranslation } from '../i18n/I18nContext.jsx';

// Language picker with flags: a button showing the current language, opening a menu of the
// others (a native <select> can't show images). Escape or a click outside closes it.
// `light` styles it for light backgrounds (site header); the default suits dark ones.
export default function LanguageSwitcher({ className = '', light = false }) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LOCALES[locale];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
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

  const choose = (code) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className={`language-switcher${light ? ' language-switcher--light' : ''}${open ? ' is-open' : ''} ${className}`.trim()}
    >
      <button
        type="button"
        className="language-switcher__toggle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('common.language')} : ${current.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Flag code={current.flag} className="language-switcher__flag" />
        <span className="language-switcher__code">{locale.toUpperCase()}</span>
        <Icon name="chevronDown" size={14} className="language-switcher__arrow" />
      </button>
      {open && (
        <ul className="language-switcher__menu" role="menu">
          {Object.entries(LOCALES).map(([code, { label, flag }]) => (
            <li key={code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={code === locale}
                lang={code}
                onClick={() => choose(code)}
              >
                <Flag code={flag} className="language-switcher__flag" />
                <span>{label}</span>
                {code === locale && <Icon name="check" size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
