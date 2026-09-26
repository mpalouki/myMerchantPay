import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Icon from '../components/Icon.jsx'
import Flag from '../components/Flag.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCountries } from '../hooks/useCountries.js'
import { useTranslation } from '../i18n/I18nContext.jsx'

const FEATURES = [
  { key: 'collect', icon: 'collect' },
  { key: 'disburse', icon: 'disburse' },
  { key: 'send', icon: 'send' },
  { key: 'request', icon: 'qr' },
]

const OPERATORS = ['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave', 'T-Money', 'Free Money', 'Visa', 'Mastercard']

const STEPS = ['signup', 'kyc', 'integrate']

const SECURITY_POINTS = ['encryption', 'kyc', 'monitoring', 'keys']

// Illustrative request only — the key is a placeholder, never a real credential.
const CODE_SAMPLE = `curl -X POST https://api.mymerchantpay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "country": "SN",
    "method": "WAVE_SENEGAL",
    "reference": "CMD-10482"
  }'`

export default function Home() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const { countries } = useCountries()

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-container home-header__inner">
          <Link to="/" className="home-header__brand" aria-label="MyMerchantPay">
            <Logo size={24} />
          </Link>
          <nav className="home-header__nav">
            <a href="#features">{t('home.nav.features')}</a>
            <a href="#countries">{t('home.nav.countries')}</a>
            <a href="#developers">{t('home.nav.developers')}</a>
            <a href="#security">{t('home.nav.security')}</a>
          </nav>
          <div className="home-header__actions">
            <LanguageSwitcher className="home-header__language" />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn--primary">
                {t('home.nav.dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn home-btn--outline">
                  {t('home.nav.login')}
                </Link>
                <Link to="/register" className="btn btn--primary home-header__signup">
                  {t('home.nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-container home-hero__inner">
            <div className="home-hero__copy">
              <span className="home-eyebrow home-eyebrow--light">{t('home.hero.eyebrow')}</span>
              <h1>{t('home.hero.title')}</h1>
              <p>{t('home.hero.subtitle')}</p>
              <div className="home-hero__ctas">
                <Link to="/register" className="btn btn--primary home-btn--lg">
                  {t('home.hero.primaryCta')}
                </Link>
                <a href="#developers" className="btn home-btn--ghost-light home-btn--lg">
                  {t('home.hero.secondaryCta')}
                </a>
              </div>
              <p className="home-hero__note">{t('home.hero.note')}</p>
            </div>

            <div className="home-hero__visual" aria-hidden="true">
              <div className="home-mock">
                <div className="home-mock__header">
                  <span>{t('home.mock.balance')}</span>
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
                  <strong>{t('home.mock.toastTitle')}</strong>
                  <span>+25 000 FCFA · Wave</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="home-section">
          <div className="home-container">
            <SectionHeading eyebrow={t('home.features.eyebrow')} title={t('home.features.title')} />
            <div className="home-grid home-grid--4">
              {FEATURES.map((f) => (
                <article key={f.key} className="home-card">
                  <span className="home-card__icon">
                    <Icon name={f.icon} size={22} />
                  </span>
                  <h3>{t(`home.features.items.${f.key}.title`)}</h3>
                  <p>{t(`home.features.items.${f.key}.text`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="countries" className="home-section home-section--tinted">
          <div className="home-container">
            <SectionHeading
              eyebrow={t('home.countries.eyebrow')}
              title={t('home.countries.title')}
              subtitle={t('home.countries.subtitle')}
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
          </div>
        </section>

        <section className="home-section">
          <div className="home-container">
            <SectionHeading eyebrow={t('home.steps.eyebrow')} title={t('home.steps.title')} />
            <ol className="home-grid home-grid--3 home-steps">
              {STEPS.map((s, i) => (
                <li key={s} className="home-step">
                  <span className="home-step__number">{i + 1}</span>
                  <h3>{t(`home.steps.items.${s}.title`)}</h3>
                  <p>{t(`home.steps.items.${s}.text`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="security" className="home-section home-section--dark">
          <div className="home-container home-split">
            <div>
              <span className="home-eyebrow home-eyebrow--light">{t('home.security.eyebrow')}</span>
              <h2>{t('home.security.title')}</h2>
              <p>{t('home.security.text')}</p>
            </div>
            <ul className="home-checklist">
              {SECURITY_POINTS.map((p) => (
                <li key={p}>
                  <span className="home-checklist__icon">
                    <Icon name="shield" size={18} />
                  </span>
                  <div>
                    <strong>{t(`home.security.points.${p}.title`)}</strong>
                    <span>{t(`home.security.points.${p}.text`)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="developers" className="home-section">
          <div className="home-container home-split">
            <div>
              <span className="home-eyebrow">{t('home.developers.eyebrow')}</span>
              <h2>{t('home.developers.title')}</h2>
              <p className="home-lead">{t('home.developers.text')}</p>
              <ul className="home-ticks">
                <li>
                  <Icon name="check" size={16} /> {t('home.developers.points.sandbox')}
                </li>
                <li>
                  <Icon name="check" size={16} /> {t('home.developers.points.webhooks')}
                </li>
                <li>
                  <Icon name="check" size={16} /> {t('home.developers.points.oneApi')}
                </li>
              </ul>
            </div>
            <div className="home-code">
              <div className="home-code__bar">
                <span />
                <span />
                <span />
                <em>{t('home.developers.codeLabel')}</em>
              </div>
              <pre>
                <code>{CODE_SAMPLE}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="home-section home-section--tight">
          <div className="home-container">
            <div className="home-cta">
              <div>
                <h2>{t('home.cta.title')}</h2>
                <p>{t('home.cta.text')}</p>
              </div>
              <Link to="/register" className="btn home-btn--white home-btn--lg">
                {t('home.cta.button')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-container">
          <div className="home-footer__top">
            <div className="home-footer__brand">
              <Logo variant="white" size={22} />
              <p>{t('home.footer.tagline')}</p>
            </div>
            <FooterColumn
              title={t('home.footer.product')}
              links={[
                ['#features', t('home.nav.features')],
                ['#countries', t('home.nav.countries')],
                ['#security', t('home.nav.security')],
              ]}
            />
            <FooterColumn
              title={t('home.footer.developers')}
              links={[
                ['#developers', t('home.footer.apiDocs')],
                ['#developers', t('home.footer.sandbox')],
              ]}
            />
            <FooterColumn
              title={t('home.footer.account')}
              links={[
                ['/login', t('home.nav.login')],
                ['/register', t('home.nav.signup')],
              ]}
            />
          </div>
          <div className="home-footer__bottom">
            <span>© {new Date().getFullYear()} MyMerchantPay</span>
            <span>{t('home.footer.legal')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="home-heading">
      <span className="home-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {subtitle && <p className="home-lead">{subtitle}</p>}
    </div>
  )
}

function MockRow({ flag, label, amount, negative = false }) {
  return (
    <li className="home-mock__row">
      <Flag code={flag} className="home-mock__flag" />
      <span>{label}</span>
      <strong className={negative ? 'is-negative' : 'is-positive'}>{amount} FCFA</strong>
    </li>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div className="home-footer__col">
      <h4>{title}</h4>
      <ul>
        {links.map(([href, label]) => (
          <li key={label}>
            {href.startsWith('/') ? <Link to={href}>{label}</Link> : <a href={href}>{label}</a>}
          </li>
        ))}
      </ul>
    </div>
  )
}
