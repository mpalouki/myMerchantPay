import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { PageHero, SectionHeading } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { CONTACT } from '../../data/site.js';

// Support: self-service resources first, then how to reach the support team, what to include
// in a request, and the response targets by priority.

const RESOURCES = [
  { key: 'faq', icon: 'help', to: '/faq' },
  { key: 'docs', icon: 'book', to: '/docs' },
  { key: 'portal', icon: 'dashboard', to: '/login' },
  { key: 'contact', icon: 'mail', to: '/contact?subject=support' },
];

const PRIORITIES = ['critical', 'high', 'normal'];

export default function Support() {
  const { t, tRaw, locale } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t('site.support.hero.eyebrow')}
        title={t('site.support.hero.title')}
        lead={t('site.support.hero.lead')}
      />

      <section className="home-section">
        <div className="home-container">
          <div className="home-grid home-grid--4">
            {RESOURCES.map(({ key, icon, to }) => (
              <Link key={key} to={to} className="home-card site-card-link">
                <span className="home-card__icon">
                  <Icon name={icon} size={22} />
                </span>
                <h3>{t(`site.support.resources.${key}.title`)}</h3>
                <p>{t(`site.support.resources.${key}.text`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="home-container home-split home-split--top">
          <div>
            <span className="home-eyebrow">{t('site.support.request.eyebrow')}</span>
            <h2>{t('site.support.request.title')}</h2>
            <p className="home-lead">{t('site.support.request.text')}</p>
            <ol className="site-steps-list">
              {(tRaw('site.support.request.checklist') ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
          <div className="site-band site-band--column">
            <h3>{t('site.support.contact.title')}</h3>
            <p>
              <Icon name="mail" size={16} /> <a href={`mailto:${CONTACT.supportEmail}`}>{CONTACT.supportEmail}</a>
            </p>
            {CONTACT.phone && (
              <p>
                <Icon name="phone" size={16} /> <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
              </p>
            )}
            <p>
              <Icon name="clock" size={16} /> {CONTACT.hours[locale] ?? CONTACT.hours.fr}
            </p>
            <p className="site-note">{t('site.support.contact.never')}</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container site-narrow">
          <SectionHeading title={t('site.support.priorities.title')} subtitle={t('site.support.priorities.subtitle')} />
          <div className="site-table-wrap">
            <table className="site-table">
              <thead>
                <tr>
                  <th>{t('site.support.priorities.level')}</th>
                  <th>{t('site.support.priorities.examples')}</th>
                  <th>{t('site.support.priorities.target')}</th>
                </tr>
              </thead>
              <tbody>
                {PRIORITIES.map((p) => (
                  <tr key={p}>
                    <td>
                      <span className={`site-pill site-pill--${p}`}>{t(`site.support.priorities.items.${p}.label`)}</span>
                    </td>
                    <td>{t(`site.support.priorities.items.${p}.examples`)}</td>
                    <td>{t(`site.support.priorities.items.${p}.target`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
