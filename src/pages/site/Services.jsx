import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { CtaBanner, PageHero, SectionHeading, Ticks } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';

// Présentation des services et produits: one detailed block per service, then the products
// (merchant portal, API, payment links) that deliver them.

const SERVICES = [
  { key: 'collect', icon: 'collect' },
  { key: 'disburse', icon: 'disburse' },
  { key: 'send', icon: 'send' },
  { key: 'paymentLinks', icon: 'qr' },
  { key: 'accounts', icon: 'globe' },
  { key: 'recharge', icon: 'withdraw' },
];

const PRODUCTS = [
  { key: 'portal', icon: 'dashboard', to: '/login' },
  { key: 'api', icon: 'code', to: '/docs' },
  { key: 'links', icon: 'link', to: '/register' },
];

export default function Services() {
  const { t, tRaw } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t('site.services.hero.eyebrow')}
        title={t('site.services.hero.title')}
        lead={t('site.services.hero.lead')}
      >
        <nav className="site-chips" aria-label={t('site.services.hero.eyebrow')}>
          {SERVICES.map(({ key }) => (
            <a key={key} href={`#${key}`}>
              {t(`site.services.items.${key}.title`)}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="home-section">
        <div className="home-container site-rows">
          {SERVICES.map(({ key, icon }, i) => (
            <article key={key} id={key} className={`site-row${i % 2 ? ' site-row--reverse' : ''}`}>
              <div className="site-row__visual" aria-hidden="true">
                <Icon name={icon} size={56} />
              </div>
              <div>
                <h2>{t(`site.services.items.${key}.title`)}</h2>
                <p className="home-lead">{t(`site.services.items.${key}.text`)}</p>
                <Ticks items={tRaw(`site.services.items.${key}.points`) ?? []} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.services.products.eyebrow')}
            title={t('site.services.products.title')}
            subtitle={t('site.services.products.subtitle')}
          />
          <div className="home-grid home-grid--3">
            {PRODUCTS.map(({ key, icon, to }) => (
              <article key={key} className="home-card">
                <span className="home-card__icon">
                  <Icon name={icon} size={22} />
                </span>
                <h3>{t(`site.services.products.items.${key}.title`)}</h3>
                <p>{t(`site.services.products.items.${key}.text`)}</p>
                <Link to={to} className="site-more">
                  {t(`site.services.products.items.${key}.link`)} <Icon name="chevronRight" size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
