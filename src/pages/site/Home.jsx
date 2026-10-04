import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import Flag from '../../components/Flag.jsx';
import { CtaBanner, FeatureCard, SectionHeading, Ticks } from '../../components/site/SiteBlocks.jsx';
import { useCountries } from '../../hooks/useCountries.js';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { OPERATORS } from '../../data/site.js';
import { CODE_SAMPLES } from './apiDocsSamples.js';

// Showcase home page: a hero, then one teaser per page of the site, each linking to it.

const SERVICES = [
  { key: 'collect', icon: 'collect' },
  { key: 'disburse', icon: 'disburse' },
  { key: 'send', icon: 'send' },
  { key: 'paymentLinks', icon: 'qr' },
];

const HIGHLIGHTS = ['oneAccount', 'oneApi', 'realTime', 'verified'];

const SECURITY_POINTS = ['encryption', 'kyc', 'monitoring', 'keys'];

export default function Home() {
  const { t, tRaw } = useTranslation();
  const { countries } = useCountries();
  const faq = (tRaw('site.faq.groups') ?? []).flatMap((group) => group.items).slice(0, 3);

  return (
    <>
      <section className="home-hero">
        <div className="home-container home-hero__inner">
          <div className="home-hero__copy">
            <span className="home-eyebrow home-eyebrow--light">{t('site.home.hero.eyebrow')}</span>
            <h1>{t('site.home.hero.title')}</h1>
            <p>{t('site.home.hero.subtitle')}</p>
            <div className="home-hero__ctas">
              <Link to="/register" className="btn btn--primary home-btn--lg">
                {t('site.home.hero.primaryCta')}
              </Link>
              <Link to="/presentation" className="btn home-btn--ghost-light home-btn--lg">
                {t('site.home.hero.secondaryCta')}
              </Link>
            </div>
            <p className="home-hero__note">{t('site.home.hero.note')}</p>
          </div>

          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-mock">
              <div className="home-mock__header">
                <span>{t('site.home.mock.balance')}</span>
                <strong>1 250 400 FCFA</strong>
              </div>
              <ul className="home-mock__list">
                <MockRow flag="sn" label="Wave Sénégal" amount="+25 000" />
                <MockRow flag="ci" label="Orange Money CI" amount="+12 500" />
                <MockRow flag="tg" label="T-Money Togo" amount="+8 000" />
                <MockRow flag="bj" label="MTN Bénin" amount="-40 000" negative />
              </ul>
            </div>
            <div className="home-mock-toast">
              <Icon name="check" size={16} />
              <div>
                <strong>{t('site.home.mock.toastTitle')}</strong>
                <span>+25 000 FCFA · Wave</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presentation */}
      <section className="home-section">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow">{t('site.home.presentation.eyebrow')}</span>
            <h2>{t('site.home.presentation.title')}</h2>
            <p className="home-lead">{t('site.home.presentation.text')}</p>
            <Link to="/presentation" className="site-more site-more--lg">
              {t('site.home.presentation.link')} <Icon name="chevronRight" size={16} />
            </Link>
          </div>
          <ul className="site-highlights">
            {HIGHLIGHTS.map((key) => (
              <li key={key}>
                <strong>{t(`site.home.presentation.highlights.${key}.title`)}</strong>
                <span>{t(`site.home.presentation.highlights.${key}.text`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="home-section home-section--tinted">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.home.services.eyebrow')}
            title={t('site.home.services.title')}
            subtitle={t('site.home.services.subtitle')}
          />
          <div className="home-grid home-grid--4">
            {SERVICES.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                icon={icon}
                title={t(`site.services.items.${key}.title`)}
                text={t(`site.services.items.${key}.summary`)}
              />
            ))}
          </div>
          <div className="site-center">
            <Link to="/services" className="btn btn--primary home-btn--lg">
              {t('site.home.services.link')}
            </Link>
          </div>
        </div>
      </section>

      {/* Partners & coverage */}
      <section className="home-section">
        <div className="home-container">
          <SectionHeading
            eyebrow={t('site.home.partners.eyebrow')}
            title={t('site.home.partners.title')}
            subtitle={t('site.home.partners.subtitle')}
          />
          {countries.length > 0 && (
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
          )}
          <div className="home-operators">
            {OPERATORS.map((op) => (
              <span key={op} className="home-operator">
                {op}
              </span>
            ))}
          </div>
          <div className="site-center">
            <Link to="/partners" className="site-more site-more--lg">
              {t('site.home.partners.link')} <Icon name="chevronRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="home-section home-section--tight">
        <div className="home-container">
          <div className="site-band">
            <div>
              <span className="home-eyebrow">{t('site.home.pricing.eyebrow')}</span>
              <h2>{t('site.home.pricing.title')}</h2>
              <p className="home-lead">{t('site.home.pricing.text')}</p>
            </div>
            <Link to="/pricing" className="btn btn--primary home-btn--lg">
              {t('site.home.pricing.link')}
            </Link>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="home-section home-section--dark">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow home-eyebrow--light">{t('site.home.security.eyebrow')}</span>
            <h2>{t('site.home.security.title')}</h2>
            <p>{t('site.home.security.text')}</p>
            <Link to="/legal" className="site-more site-more--light site-more--lg">
              {t('site.home.security.link')} <Icon name="chevronRight" size={16} />
            </Link>
          </div>
          <ul className="home-checklist">
            {SECURITY_POINTS.map((p) => (
              <li key={p}>
                <span className="home-checklist__icon">
                  <Icon name="shield" size={18} />
                </span>
                <div>
                  <strong>{t(`site.home.security.points.${p}.title`)}</strong>
                  <span>{t(`site.home.security.points.${p}.text`)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Developers */}
      <section className="home-section">
        <div className="home-container home-split">
          <div>
            <span className="home-eyebrow">{t('site.home.developers.eyebrow')}</span>
            <h2>{t('site.home.developers.title')}</h2>
            <p className="home-lead">{t('site.home.developers.text')}</p>
            <Ticks items={['sandbox', 'webhooks', 'oneApi'].map((k) => t(`site.home.developers.points.${k}`))} />
            <Link to="/docs" className="site-more site-more--lg">
              {t('site.home.developers.link')} <Icon name="chevronRight" size={16} />
            </Link>
          </div>
          <div className="home-code">
            <div className="home-code__bar">
              <span />
              <span />
              <span />
              <em>{t('site.home.developers.codeLabel')}</em>
            </div>
            <pre>
              <code>{CODE_SAMPLES.createPayment}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section home-section--tinted">
        <div className="home-container site-narrow">
          <SectionHeading eyebrow={t('site.home.faq.eyebrow')} title={t('site.home.faq.title')} />
          <div className="site-faq">
            {faq.map(({ q, a }) => (
              <details key={q} className="site-faq__item">
                <summary>
                  {q}
                  <Icon name="chevronDown" size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <div className="site-center">
            <Link to="/faq" className="site-more site-more--lg">
              {t('site.home.faq.link')} <Icon name="chevronRight" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

function MockRow({ flag, label, amount, negative = false }) {
  return (
    <li className="home-mock__row">
      <Flag code={flag} className="home-mock__flag" />
      <span>{label}</span>
      <strong className={negative ? 'is-negative' : 'is-positive'}>{amount} FCFA</strong>
    </li>
  );
}
