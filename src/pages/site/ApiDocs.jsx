import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { PageHero } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { API_BASE_URL } from '../../data/site.js';
import { CODE_SAMPLES } from './apiDocsSamples.js';

// Documentation API: a single page with a sticky table of contents. Text in site.docs.*, code in
// apiDocsSamples.js. The merchant payment API isn't public yet, so the page opens with a notice
// that it's a preview.

const SECTIONS = [
  'introduction',
  'quickstart',
  'authentication',
  'environments',
  'payments',
  'status',
  'payouts',
  'ipn',
  'methods',
  'errors',
  'practices',
];

const STATUSES = ['pending', 'succeeded', 'failed', 'cancelled', 'refunded'];

const HTTP_CODES = ['200', '201', '400', '401', '403', '404', '409', '422', '429', '500'];

const METHODS = [
  ['WAVE_SENEGAL', 'SN'],
  ['ORANGE_MONEY_SENEGAL', 'SN'],
  ['ORANGE_MONEY_CI', 'CI'],
  ['MTN_CI', 'CI'],
  ['MTN_BENIN', 'BJ'],
  ['MOOV_BENIN', 'BJ'],
  ['TMONEY_TOGO', 'TG'],
  ['MOOV_TOGO', 'TG'],
  ['CARD', '*'],
];

export default function ApiDocs() {
  const { t, tRaw } = useTranslation();
  const text = (section, key) => t(`site.docs.sections.${section}.${key}`);
  const list = (section, key) => tRaw(`site.docs.sections.${section}.${key}`) ?? [];

  return (
    <>
      <PageHero eyebrow={t('site.docs.hero.eyebrow')} title={t('site.docs.hero.title')} lead={t('site.docs.hero.lead')}>
        <div className="home-hero__ctas">
          <Link to="/register" className="btn btn--primary home-btn--lg">
            {t('site.docs.hero.getKeys')}
          </Link>
          <a href="#quickstart" className="btn home-btn--ghost-light home-btn--lg">
            {t('site.docs.hero.quickstart')}
          </a>
        </div>
      </PageHero>

      <section className="home-section">
        <div className="home-container site-with-toc">
          <nav className="site-toc" aria-label={t('site.docs.toc')}>
            {SECTIONS.map((s) => (
              <a key={s} href={`#${s}`}>
                {text(s, 'title')}
              </a>
            ))}
          </nav>

          <div className="site-prose site-docs">
            <p className="site-note site-note--warning">
              <Icon name="info" size={16} /> {t('site.docs.preview')}
            </p>

            <section id="introduction">
              <h2>{text('introduction', 'title')}</h2>
              <p>{text('introduction', 'text')}</p>
              <ul>
                {list('introduction', 'points').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="quickstart">
              <h2>{text('quickstart', 'title')}</h2>
              <ol className="site-steps-list">
                {list('quickstart', 'steps').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </section>

            <section id="authentication">
              <h2>{text('authentication', 'title')}</h2>
              <p>{text('authentication', 'text')}</p>
              <Table
                head={list('authentication', 'head')}
                rows={list('authentication', 'keys').map(({ name, prefix, use }) => [name, <code key="p">{prefix}</code>, use])}
              />
              <p className="site-note site-note--warning">
                <Icon name="lock" size={16} /> {text('authentication', 'warning')}
              </p>
              <Code code={'Authorization: Bearer sk_test_YOUR_PRIVATE_KEY'} />
            </section>

            <section id="environments">
              <h2>{text('environments', 'title')}</h2>
              <p>{text('environments', 'text')}</p>
              <Table
                head={list('environments', 'head')}
                rows={[
                  [text('environments', 'sandbox'), <code key="s">{API_BASE_URL.sandbox}</code>, <code key="k">*_test_*</code>],
                  [text('environments', 'live'), <code key="l">{API_BASE_URL.live}</code>, <code key="k">*_live_*</code>],
                ]}
              />
            </section>

            <section id="payments">
              <h2>{text('payments', 'title')}</h2>
              <p>{text('payments', 'text')}</p>
              <Endpoint method="POST" path="/payments" />
              <Code code={CODE_SAMPLES.createPayment} label={t('site.docs.request')} />
              <Table
                head={list('payments', 'head')}
                rows={list('payments', 'fields').map(({ name, type, required, description }) => [
                  <code key="n">{name}</code>,
                  type,
                  required ? t('site.docs.yes') : t('site.docs.no'),
                  description,
                ])}
              />
              <Code code={CODE_SAMPLES.paymentResponse} label={t('site.docs.response')} />
            </section>

            <section id="status">
              <h2>{text('status', 'title')}</h2>
              <p>{text('status', 'text')}</p>
              <Endpoint method="GET" path="/payments/{id}" />
              <Code code={CODE_SAMPLES.getPayment} label={t('site.docs.request')} />
              <Table
                head={list('status', 'head')}
                rows={STATUSES.map((s) => [<code key="s">{s}</code>, text('status', `statuses.${s}`)])}
              />
            </section>

            <section id="payouts">
              <h2>{text('payouts', 'title')}</h2>
              <p>{text('payouts', 'text')}</p>
              <Endpoint method="POST" path="/payouts" />
              <Code code={CODE_SAMPLES.createPayout} label={t('site.docs.request')} />
            </section>

            <section id="ipn">
              <h2>{text('ipn', 'title')}</h2>
              <p>{text('ipn', 'text')}</p>
              <Code code={CODE_SAMPLES.ipnPayload} label={t('site.docs.notification')} />
              <p>{text('ipn', 'signature')}</p>
              <Code code={CODE_SAMPLES.verifySignature} label="Node.js" />
              <ul>
                {list('ipn', 'rules').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>

            <section id="methods">
              <h2>{text('methods', 'title')}</h2>
              <p>{text('methods', 'text')}</p>
              <Table
                head={list('methods', 'head')}
                rows={METHODS.map(([code, country]) => [
                  <code key="c">{code}</code>,
                  country === '*' ? text('methods', 'allCountries') : country,
                ])}
              />
            </section>

            <section id="errors">
              <h2>{text('errors', 'title')}</h2>
              <p>{text('errors', 'text')}</p>
              <Code code={CODE_SAMPLES.error} label={t('site.docs.response')} />
              <Table
                head={list('errors', 'head')}
                rows={HTTP_CODES.map((c) => [<code key="c">{c}</code>, text('errors', `codes.${c}`)])}
              />
            </section>

            <section id="practices">
              <h2>{text('practices', 'title')}</h2>
              <ul>
                {list('practices', 'items').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p>
                {text('practices', 'help')} <Link to="/support">{t('site.nav.support')}</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

function Endpoint({ method, path }) {
  return (
    <p className="site-endpoint">
      <span className={`site-endpoint__method site-endpoint__method--${method.toLowerCase()}`}>{method}</span>
      <code>{path}</code>
    </p>
  );
}

function Code({ code, label }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable (insecure context) — nothing to do
    }
  };

  return (
    <div className="home-code site-code">
      <div className="home-code__bar">
        <span />
        <span />
        <span />
        {label && <em>{label}</em>}
        <button type="button" onClick={copy} className="site-code__copy">
          <Icon name={copied ? 'check' : 'copy'} size={14} /> {t(copied ? 'site.docs.copied' : 'site.docs.copy')}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Table({ head, rows }) {
  return (
    <div className="site-table-wrap">
      <table className="site-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i}>
              {cells.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
