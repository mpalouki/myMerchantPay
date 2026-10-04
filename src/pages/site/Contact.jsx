import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { PageHero } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { CONTACT } from '../../data/site.js';

// Contacts: the ways to reach us (from data/site.js; unset ones are hidden) and a message form.
// There's no contact endpoint in myPay yet, so the form opens the visitor's email app with the
// message filled in, addressed to support for support requests and to the contact address
// otherwise. `?subject=` preselects the topic (e.g. /contact?subject=partnership).

const SUBJECTS = ['sales', 'partnership', 'support', 'other'];

export default function Contact() {
  const { t, locale } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialSubject = SUBJECTS.includes(searchParams.get('subject')) ? searchParams.get('subject') : 'sales';
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', subject: initialSubject, message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'site.contact.form.errors.required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'site.contact.form.errors.email';
    if (form.message.trim().length < 10) next.message = 'site.contact.form.errors.message';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const to = form.subject === 'support' ? CONTACT.supportEmail : CONTACT.email;
    const subject = `[${t(`site.contact.form.subjects.${form.subject}`)}] ${form.company || form.name}`;
    const body = [
      form.message.trim(),
      '',
      '—',
      `${t('site.contact.form.name')} : ${form.name}`,
      form.company && `${t('site.contact.form.company')} : ${form.company}`,
      `${t('site.contact.form.email')} : ${form.email}`,
      form.phone && `${t('site.contact.form.phone')} : ${form.phone}`,
    ]
      .filter((line) => line !== false && line !== '')
      .join('\n');
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const channels = [
    { key: 'email', icon: 'mail', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { key: 'support', icon: 'help', value: CONTACT.supportEmail, href: `mailto:${CONTACT.supportEmail}` },
    CONTACT.phone && { key: 'phone', icon: 'phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    CONTACT.whatsapp && {
      key: 'whatsapp',
      icon: 'phone',
      value: CONTACT.whatsapp,
      href: `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}`,
    },
    CONTACT.address && { key: 'address', icon: 'pin', value: CONTACT.address },
    { key: 'hours', icon: 'clock', value: CONTACT.hours[locale] ?? CONTACT.hours.fr },
  ].filter(Boolean);

  const fieldError = (field) => errors[field] && <small className="field__error">{t(errors[field])}</small>;

  return (
    <>
      <PageHero
        eyebrow={t('site.contact.hero.eyebrow')}
        title={t('site.contact.hero.title')}
        lead={t('site.contact.hero.lead')}
      />

      <section className="home-section">
        <div className="home-container site-contact">
          <aside className="site-contact__channels">
            <h2>{t('site.contact.channels.title')}</h2>
            <ul>
              {channels.map(({ key, icon, value, href }) => (
                <li key={key}>
                  <span className="home-card__icon">
                    <Icon name={icon} size={20} />
                  </span>
                  <div>
                    <strong>{t(`site.contact.channels.${key}`)}</strong>
                    {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                  </div>
                </li>
              ))}
            </ul>
            <p className="site-contact__help">
              {t('site.contact.channels.helpPrefix')} <Link to="/faq">{t('site.nav.faq')}</Link> ·{' '}
              <Link to="/support">{t('site.nav.support')}</Link>
            </p>
          </aside>

          <form className="site-form" onSubmit={handleSubmit} noValidate>
            <h2>{t('site.contact.form.title')}</h2>
            <div className="site-form__grid">
              <label className="field field--stacked">
                <span>{t('site.contact.form.name')} *</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                {fieldError('name')}
              </label>
              <label className="field field--stacked">
                <span>{t('site.contact.form.company')}</span>
                <input value={form.company} onChange={set('company')} autoComplete="organization" />
              </label>
              <label className="field field--stacked">
                <span>{t('site.contact.form.email')} *</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                {fieldError('email')}
              </label>
              <label className="field field--stacked">
                <span>{t('site.contact.form.phone')}</span>
                <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </label>
            </div>
            <label className="field field--stacked">
              <span>{t('site.contact.form.subject')}</span>
              <select value={form.subject} onChange={set('subject')}>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {t(`site.contact.form.subjects.${s}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field field--stacked">
              <span>{t('site.contact.form.message')} *</span>
              <textarea rows={6} value={form.message} onChange={set('message')} aria-invalid={!!errors.message} />
              {fieldError('message')}
            </label>
            {sent && <p className="site-form__notice">{t('site.contact.form.sent', { email: form.subject === 'support' ? CONTACT.supportEmail : CONTACT.email })}</p>}
            <button type="submit" className="btn btn--primary home-btn--lg">
              {t('site.contact.form.submit')}
            </button>
            <p className="site-form__hint">{t('site.contact.form.hint')}</p>
          </form>
        </div>
      </section>
    </>
  );
}
