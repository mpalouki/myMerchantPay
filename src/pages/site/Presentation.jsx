import { CtaBanner, FeatureCard, PageHero, SectionHeading } from '../../components/site/SiteBlocks.jsx';
import Icon from '../../components/Icon.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';

// Présentation de l'application: what MyMerchantPay is, the merchant portal, how to get started.

const PILLARS = [
  { key: 'aggregate', icon: 'globe' },
  { key: 'portal', icon: 'dashboard' },
  { key: 'api', icon: 'code' },
];

const PORTAL_FEATURES = [
  { key: 'dashboard', icon: 'chart' },
  { key: 'accounts', icon: 'globe' },
  { key: 'teams', icon: 'users' },
  { key: 'applications', icon: 'api' },
  { key: 'recharge', icon: 'card' },
  { key: 'reporting', icon: 'book' },
];

const STEPS = ['signup', 'kyc', 'integrate', 'live'];

const VALUES = ['simplicity', 'transparency', 'security', 'proximity'];

export default function Presentation() {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        eyebrow={t('site.presentation.hero.eyebrow')}
        title={t('site.presentation.hero.title')}
        lead={t('site.presentation.hero.lead')}
      />

      <section className="home-section">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.presentation.pillars.eyebrow')}
            title={t('site.presentation.pillars.title')}
            subtitle={t('site.presentation.pillars.subtitle')}
          />
          <div className="home-grid home-grid--3">
            {PILLARS.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                icon={icon}
                title={t(`site.presentation.pillars.items.${key}.title`)}
                text={t(`site.presentation.pillars.items.${key}.text`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--tinted">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.presentation.portal.eyebrow')}
            title={t('site.presentation.portal.title')}
            subtitle={t('site.presentation.portal.subtitle')}
          />
          <div className="home-grid home-grid--3">
            {PORTAL_FEATURES.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                icon={icon}
                title={t(`site.presentation.portal.items.${key}.title`)}
                text={t(`site.presentation.portal.items.${key}.text`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <SectionHeading eyebrow={t('site.presentation.steps.eyebrow')} title={t('site.presentation.steps.title')} />
          <ol className="home-grid home-grid--4 home-steps">
            {STEPS.map((s, i) => (
              <li key={s} className="home-step">
                <span className="home-step__number">{i + 1}</span>
                <h3>{t(`site.presentation.steps.items.${s}.title`)}</h3>
                <p>{t(`site.presentation.steps.items.${s}.text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section home-section--dark">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow home-eyebrow--light">{t('site.presentation.mission.eyebrow')}</span>
            <h2>{t('site.presentation.mission.title')}</h2>
            <p>{t('site.presentation.mission.text')}</p>
          </div>
          <ul className="home-checklist">
            {VALUES.map((v) => (
              <li key={v}>
                <span className="home-checklist__icon">
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <strong>{t(`site.presentation.mission.values.${v}.title`)}</strong>
                  <span>{t(`site.presentation.mission.values.${v}.text`)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
