import { Link } from 'react-router-dom';
import Flag from '../../components/Flag.jsx';
import { CtaBanner, FeatureCard, PageHero, SectionHeading } from '../../components/site/SiteBlocks.jsx';
import { useCountries } from '../../hooks/useCountries.js';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { OPERATORS } from '../../data/site.js';

// Partenaires, Marchands/Clients: the payment operators we connect to, the countries covered
// (live list from the API), the kinds of merchants we serve, and how to become a partner.

const SEGMENTS = [
  { key: 'ecommerce', icon: 'shop' },
  { key: 'retail', icon: 'store' },
  { key: 'services', icon: 'settings' },
  { key: 'gaming', icon: 'chart' },
  { key: 'ngo', icon: 'users' },
  { key: 'enterprise', icon: 'globe' },
];

const PARTNER_TYPES = ['operators', 'banks', 'integrators'];

export default function Partners() {
  const { t } = useTranslation();
  const { countries } = useCountries();

  return (
    <>
      <PageHero
        eyebrow={t('site.partners.hero.eyebrow')}
        title={t('site.partners.hero.title')}
        lead={t('site.partners.hero.lead')}
      />

      <section className="home-section">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.partners.operators.eyebrow')}
            title={t('site.partners.operators.title')}
            subtitle={t('site.partners.operators.subtitle')}
          />
          <ul className="site-logos">
            {OPERATORS.map((op) => (
              <li key={op}>{op}</li>
            ))}
          </ul>
          {countries.length > 0 && (
            <>
              <h3 className="site-subtitle">{t('site.partners.operators.countries')}</h3>
              <ul className="home-countries">
                {countries.map((c) => (
                  <li key={c.codeAlpha2} className="home-country">
                    <Flag code={c.codeAlpha2} className="home-country__flag" />
                    <div>
                      <strong>{c.name}</strong>
                      <span>
                        {c.callingCode} · {c.currency}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.partners.merchants.eyebrow')}
            title={t('site.partners.merchants.title')}
            subtitle={t('site.partners.merchants.subtitle')}
          />
          <div className="home-grid home-grid--3">
            {SEGMENTS.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                icon={icon}
                title={t(`site.partners.merchants.items.${key}.title`)}
                text={t(`site.partners.merchants.items.${key}.text`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow">{t('site.partners.join.eyebrow')}</span>
            <h2>{t('site.partners.join.title')}</h2>
            <p className="home-lead">{t('site.partners.join.text')}</p>
            <Link to="/contact?subject=partnership" className="btn btn--primary home-btn--lg site-gap-top">
              {t('site.partners.join.button')}
            </Link>
          </div>
          <ul className="site-highlights">
            {PARTNER_TYPES.map((key) => (
              <li key={key}>
                <strong>{t(`site.partners.join.types.${key}.title`)}</strong>
                <span>{t(`site.partners.join.types.${key}.text`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
