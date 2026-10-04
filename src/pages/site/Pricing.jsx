import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { CtaBanner, PageHero, SectionHeading, Ticks } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { PRICING } from '../../data/site.js';

// Tarifs: what's free, the fee per service (figures in data/site.js), volume pricing.

const INCLUDED = ['account', 'portal', 'sandbox', 'support', 'reporting', 'teams'];

export default function Pricing() {
  const { t, tRaw, locale } = useTranslation();
  const number = (value, options) => new Intl.NumberFormat(locale, options).format(value);

  const fee = ({ rate, fixed }) => {
    if (rate !== undefined) return number(rate / 100, { style: 'percent', maximumFractionDigits: 2 });
    if (fixed !== undefined) return `${number(fixed)} FCFA`;
    return t('site.pricing.free');
  };

  return (
    <>
      <PageHero
        eyebrow={t('site.pricing.hero.eyebrow')}
        title={t('site.pricing.hero.title')}
        lead={t('site.pricing.hero.lead')}
      />

      <section className="home-section">
        <div className="home-container">
          <div className="site-pricing">
            {PRICING.map((row) => (
              <article key={row.key} className={`site-price${row.rate === undefined && row.fixed === undefined ? ' site-price--free' : ''}`}>
                <h3>{t(`site.pricing.items.${row.key}.title`)}</h3>
                <p className="site-price__fee">
                  {fee(row)}
                  {row.rate !== undefined && <small>{t('site.pricing.perTransaction')}</small>}
                  {row.fixed !== undefined && <small>{t('site.pricing.perOperation')}</small>}
                </p>
                <p>{t(`site.pricing.items.${row.key}.text`)}</p>
              </article>
            ))}
          </div>
          <p className="site-note">
            <Icon name="info" size={16} /> {t('site.pricing.note')}
          </p>
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow">{t('site.pricing.included.eyebrow')}</span>
            <h2>{t('site.pricing.included.title')}</h2>
            <Ticks items={INCLUDED.map((k) => t(`site.pricing.included.items.${k}`))} />
          </div>
          <div className="site-band site-band--column">
            <h3>{t('site.pricing.volume.title')}</h3>
            <p className="home-lead">{t('site.pricing.volume.text')}</p>
            <Link to="/contact?subject=sales" className="btn btn--primary home-btn--lg">
              {t('site.pricing.volume.button')}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container site-narrow">
          <SectionHeading title={t('site.pricing.questions.title')} />
          <div className="site-faq">
            {(tRaw('site.pricing.questions.items') ?? []).map(({ q, a }) => (
              <details key={q} className="site-faq__item">
                <summary>
                  {q}
                  <Icon name="chevronDown" size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
