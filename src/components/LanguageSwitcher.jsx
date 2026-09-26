import { LOCALES, useTranslation } from '../i18n/I18nContext.jsx';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useTranslation();

  return (
    <label className={`language-switcher ${className}`}>
      <span className="sr-only">{t('common.language')}</span>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        {Object.entries(LOCALES).map(([code, { label }]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
