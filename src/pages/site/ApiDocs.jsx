import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { PageHero } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { API_BASE_URL } from '../../data/site.js';
import { CODE_LANGUAGES, CODE_SAMPLES, REQUESTS, SIGNATURE_SAMPLES, WEBHOOK_SIGNATURE_SAMPLES } from './apiDocsSamples.js';

// Documentation API: a single page with a sticky table of contents. Text in site.docs.*, code in
// apiDocsSamples.js. The merchant payment API isn't public yet, so the page opens with a notice
// that it's a preview. Requests come in several languages (cURL, PHP, Node.js, Python): the
// language picked in one code block applies to all of them.

const SECTIONS = [
  'introduction',
  'quickstart',
  'authentication',
  'environments',
  'conventions',
  'overview',
  'hosted',
  'checkout',
  'intents',
  'paymentMethods',
  'payments',
  'status',
  'payouts',
  'transfers',
  'lists',
  'webhooks',
  'ipn',
  'methods',
  'errors',
  'practices',
];

const STATUSES = ['pending', 'succeeded', 'failed', 'cancelled'];

const INTENT_STATUSES = ['requires_payment_method', 'requires_action', 'processing', 'succeeded', 'canceled'];

// [method, path, description key, keys accepted]: `pk` means the publishable key works too.
const ENDPOINTS = [
  ['POST', '/checkout/sessions', 'createSession', 'sk'],
  ['GET', '/checkout/sessions', 'listSessions', 'sk'],
  ['GET', '/checkout/sessions/{id}', 'getSession', 'sk'],
  ['GET', '/checkout/sessions/{id}/line_items', 'sessionLineItems', 'sk'],
  ['POST', '/checkout/sessions/{id}/expire', 'expireSession', 'sk'],
  ['POST', '/payment_intents', 'createIntent', 'sk'],
  ['GET', '/payment_intents', 'listIntents', 'sk'],
  ['GET', '/payment_intents/{id}', 'getIntent', 'pk'],
  ['POST', '/payment_intents/{id}', 'updateIntent', 'sk'],
  ['POST', '/payment_intents/{id}/confirm', 'confirmIntent', 'pk'],
  ['POST', '/payment_intents/{id}/cancel', 'cancelIntent', 'sk'],
  ['GET', '/payment_methods', 'listMethods', 'pk'],
  ['POST', '/payin', 'createPayment', 'sk'],
  ['GET', '/payin/{id}', 'getPayment', 'sk'],
  ['GET', '/payins', 'listPayments', 'sk'],
  ['POST', '/payout', 'createPayout', 'sk'],
  ['GET', '/payout/{id}', 'getPayout', 'sk'],
  ['GET', '/payouts', 'listPayouts', 'sk'],
  ['POST', '/transfer', 'createTransfer', 'sk'],
  ['GET', '/transfer/{id}', 'getTransfer', 'sk'],
  ['GET', '/transfers', 'listTransfers', 'sk'],
  ['GET', '/events', 'listEvents', 'sk'],
  ['GET', '/events/{id}', 'getEvent', 'sk'],
  ['POST', '/webhook_endpoints', 'createWebhook', 'sk'],
  ['GET', '/webhook_endpoints', 'listWebhooks', 'sk'],
  ['GET', '/webhook_endpoints/{id}', 'getWebhook', 'sk'],
  ['POST', '/webhook_endpoints/{id}', 'updateWebhook', 'sk'],
  ['POST', '/webhook_endpoints/{id}/rotate_secret', 'rotateWebhook', 'sk'],
  ['DELETE', '/webhook_endpoints/{id}', 'deleteWebhook', 'sk'],
];

const EVENTS = ['payment.succeeded', 'payment.failed', 'payment.cancelled', 'payout.succeeded', 'payout.failed'];

// The event types of webhook endpoints (myPay ApiEvents::TYPES, less transfer.created, not sent yet).
const EVENT_TYPES = [
  'checkout.session.created',
  'checkout.session.completed',
  'checkout.session.expired',
  'payment_intent.created',
  'payment_intent.requires_action',
  'payment_intent.processing',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'payin.succeeded',
  'payin.failed',
  'payin.cancelled',
  'payout.succeeded',
  'payout.failed',
  'payout.cancelled',
];

// Signature samples: the languages notifications are usually received in.
const SIGNATURE_LANGUAGES = CODE_LANGUAGES.filter((l) => l.key in SIGNATURE_SAMPLES);
const WEBHOOK_SIGNATURE_LANGUAGES = CODE_LANGUAGES.filter((l) => l.key in WEBHOOK_SIGNATURE_SAMPLES);

const HTTP_CODES = ['200', '201', '400', '401', '403', '404', '405', '409', '422', '429', '500'];

// Examples only: a method's code is its payment type reference in capitals (myPay back office),
// shown to merchants on their application's page. Cards have no country.
const METHODS = [
  ['CARD', null],
  ['WAVE_SN', 'SN'],
  ['ORANGE_MONEY_SN', 'SN'],
  ['ORANGE_MONEY_CI', 'CI'],
  ['MTN_CI', 'CI'],
  ['MTN_BJ', 'BJ'],
  ['MOOV_BJ', 'BJ'],
  ['TMONEY_TG', 'TG'],
  ['MOOV_TG', 'TG'],
];

export default function ApiDocs() {
  const { t, tRaw } = useTranslation();
  const text = (section, key) => t(`site.docs.sections.${section}.${key}`);
  const list = (section, key) => tRaw(`site.docs.sections.${section}.${key}`) ?? [];
  // The language of every code block with tabs.
  const [language, setLanguage] = useState(CODE_LANGUAGES[0].key);
  const tabs = { language, onLanguage: setLanguage };
  const bullets = (section, key) => (
    <ul>
      {list(section, key).map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
  const fieldRows = (section, key = 'fields') =>
    list(section, key).map(({ name, type, required, description }) => [
      <code key="n">{name}</code>,
      type,
      required ? t('site.docs.yes') : t('site.docs.no'),
      description,
    ]);

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
              <p>{text('authentication', 'publishable')}</p>
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
              <p>{text('environments', 'testText')}</p>
              <Table
                head={list('environments', 'testHead')}
                rows={list('environments', 'testNumbers').map(({ suffix, result }) => [<code key="s">{suffix}</code>, result])}
              />
              <p>{text('environments', 'testCard')}</p>
            </section>

            <section id="conventions">
              <h2>{text('conventions', 'title')}</h2>
              <p>{text('conventions', 'text')}</p>
              <Table
                head={list('conventions', 'head')}
                rows={list('conventions', 'headers').map(({ name, description }) => [<code key="n">{name}</code>, description])}
              />
              <h3>{text('conventions', 'idempotencyTitle')}</h3>
              <p>{text('conventions', 'idempotency')}</p>
              <h3>{text('conventions', 'metadataTitle')}</h3>
              <p>{text('conventions', 'metadata')}</p>
            </section>

            <section id="overview">
              <h2>{text('overview', 'title')}</h2>
              <p>{text('overview', 'text')}</p>
              <Table
                head={list('overview', 'head')}
                rows={ENDPOINTS.map(([method, path, key, keys]) => [
                  <span key="m" className={`site-endpoint__method site-endpoint__method--${method.toLowerCase()}`}>
                    {method}
                  </span>,
                  <code key="p">{path}</code>,
                  text('overview', `endpoints.${key}`),
                  <code key="k" className="site-nowrap">
                    {keys === 'pk' ? 'sk_ / pk_' : 'sk_'}
                  </code>,
                ])}
              />
              <p>{text('overview', 'plural')}</p>
            </section>

            <section id="hosted">
              <h2>{text('hosted', 'title')}</h2>
              <p>{text('hosted', 'text')}</p>
              <ol className="site-steps-list">
                {list('hosted', 'steps').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
              <Endpoint method="POST" path="/checkout/sessions" />
              <CodeTabs samples={REQUESTS.createSession} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('hosted')} />
              <Code code={CODE_SAMPLES.sessionResponse} label={t('site.docs.response')} />
              <h3>{text('hosted', 'openTitle')}</h3>
              <Table
                head={list('hosted', 'modesHead')}
                rows={list('hosted', 'modes').map(({ name, description }) => [<code key="n">{name}</code>, description])}
              />
              <Code code={CODE_SAMPLES.checkoutRedirect} label="Node.js" />
              <Code code={CODE_SAMPLES.openCheckout} label="HTML" />
              <h3>{text('hosted', 'afterTitle')}</h3>
              {bullets('hosted', 'after')}
              <p className="site-note site-note--warning">
                <Icon name="info" size={16} /> {text('hosted', 'origins')}
              </p>
            </section>

            <section id="checkout">
              <h2>{text('checkout', 'title')}</h2>
              <p>{text('checkout', 'text')}</p>
              <ol className="site-steps-list">
                {list('checkout', 'steps').map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
              <h3>{text('checkout', 'installTitle')}</h3>
              <Code code={'npm install @gamapay/gamapay-js   # browser\nnpm install gamapay                # Node.js server'} />
              <p>{text('checkout', 'cdn')}</p>
              <Code code={'<script src="https://unpkg.com/@gamapay/gamapay-js@0.1.0/dist/gamapay.js"></script>'} />
              <h3>{text('checkout', 'serverTitle')}</h3>
              <Code code={CODE_SAMPLES.checkoutServer} label="Node.js" />
              <h3>{text('checkout', 'pageTitle')}</h3>
              <Code code={CODE_SAMPLES.checkoutPage} label="HTML" />
              <h3>{text('checkout', 'elementTitle')}</h3>
              {bullets('checkout', 'element')}
              <h3>{text('checkout', 'optionsTitle')}</h3>
              <Table
                head={list('checkout', 'optionsHead')}
                rows={list('checkout', 'options').map(({ name, description }) => [<code key="n">{name}</code>, description])}
              />
              <p className="site-note site-note--warning">
                <Icon name="info" size={16} /> {text('checkout', 'fulfil')}
              </p>
            </section>

            <section id="intents">
              <h2>{text('intents', 'title')}</h2>
              <p>{text('intents', 'text')}</p>
              <Endpoint method="POST" path="/payment_intents" />
              <CodeTabs samples={REQUESTS.createIntent} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('intents')} />
              <Code code={CODE_SAMPLES.intentResponse} label={t('site.docs.response')} />
              <p>{text('intents', 'statusText')}</p>
              <Table
                head={list('status', 'head')}
                rows={INTENT_STATUSES.map((s) => [<code key="s">{s}</code>, text('intents', `statuses.${s}`)])}
              />
              <h3>{text('intents', 'confirmTitle')}</h3>
              <Endpoint method="POST" path="/payment_intents/{id}/confirm" />
              <p>{text('intents', 'confirm')}</p>
              <Table head={list('payments', 'head')} rows={fieldRows('intents', 'confirmFields')} />
              <p>{text('intents', 'payer')}</p>
              <h3>{text('intents', 'manageTitle')}</h3>
              {bullets('intents', 'manage')}
            </section>

            <section id="paymentMethods">
              <h2>{text('paymentMethods', 'title')}</h2>
              <p>{text('paymentMethods', 'text')}</p>
              <Endpoint method="GET" path="/payment_methods" />
              <Code code={CODE_SAMPLES.paymentMethodsResponse} label={t('site.docs.response')} />
              {bullets('paymentMethods', 'points')}
            </section>

            <section id="payments">
              <h2>{text('payments', 'title')}</h2>
              <p>{text('payments', 'text')}</p>
              <Endpoint method="POST" path="/payin" />
              <CodeTabs samples={REQUESTS.createPayment} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('payments')} />
              <Code code={CODE_SAMPLES.paymentResponse} label={t('site.docs.response')} />
            </section>

            <section id="status">
              <h2>{text('status', 'title')}</h2>
              <p>{text('status', 'text')}</p>
              <Endpoint method="GET" path="/payin/{id}" />
              <CodeTabs samples={REQUESTS.getPayment} label={t('site.docs.request')} {...tabs} />
              <Code code={CODE_SAMPLES.getPaymentResponse} label={t('site.docs.response')} />
              <Table
                head={list('status', 'head')}
                rows={STATUSES.map((s) => [<code key="s">{s}</code>, text('status', `statuses.${s}`)])}
              />
            </section>

            <section id="payouts">
              <h2>{text('payouts', 'title')}</h2>
              <p>{text('payouts', 'text')}</p>
              <Endpoint method="POST" path="/payout" />
              <CodeTabs samples={REQUESTS.createPayout} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('payouts')} />
              <Code code={CODE_SAMPLES.payoutResponse} label={t('site.docs.response')} />
              <p>{text('payouts', 'follow')}</p>
            </section>

            <section id="transfers">
              <h2>{text('transfers', 'title')}</h2>
              <p>{text('transfers', 'text')}</p>
              <Endpoint method="POST" path="/transfer" />
              <CodeTabs samples={REQUESTS.createTransfer} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('transfers')} />
              <Code code={CODE_SAMPLES.transferResponse} label={t('site.docs.response')} />
              <p>{text('transfers', 'follow')}</p>
              <Endpoint method="GET" path="/transfer/{id}" />
            </section>

            <section id="lists">
              <h2>{text('lists', 'title')}</h2>
              <p>{text('lists', 'text')}</p>
              <CodeTabs samples={REQUESTS.listPayins} label={t('site.docs.request')} {...tabs} />
              <Code code={CODE_SAMPLES.listResponse} label={t('site.docs.response')} />
              <Table
                head={list('lists', 'head')}
                rows={list('lists', 'params').map(({ name, description }) => [<code key="n">{name}</code>, description])}
              />
            </section>

            <section id="webhooks">
              <h2>{text('webhooks', 'title')}</h2>
              <p>{text('webhooks', 'text')}</p>
              <Endpoint method="POST" path="/webhook_endpoints" />
              <CodeTabs samples={REQUESTS.createWebhook} label={t('site.docs.request')} {...tabs} />
              <Table head={list('payments', 'head')} rows={fieldRows('webhooks')} />
              <Code code={CODE_SAMPLES.webhookResponse} label={t('site.docs.response')} />
              <p>{text('webhooks', 'secret')}</p>
              <h3>{text('webhooks', 'eventsTitle')}</h3>
              <p>{text('webhooks', 'eventsText')}</p>
              <Code code={CODE_SAMPLES.eventPayload} label={t('site.docs.notification')} />
              <Table
                head={list('ipn', 'eventsHead')}
                rows={EVENT_TYPES.map((event) => [<code key="e">{event}</code>, tRaw('site.docs.sections.webhooks.events')?.[event]])}
              />
              <h3>{text('webhooks', 'signatureTitle')}</h3>
              <p>{text('webhooks', 'signature')}</p>
              <CodeTabs samples={WEBHOOK_SIGNATURE_SAMPLES} languages={WEBHOOK_SIGNATURE_LANGUAGES} {...tabs} />
              {bullets('webhooks', 'rules')}
            </section>

            <section id="ipn">
              <h2>{text('ipn', 'title')}</h2>
              <p>{text('ipn', 'text')}</p>
              <Code code={CODE_SAMPLES.ipnPayload} label={t('site.docs.notification')} />
              <p>{text('ipn', 'eventsText')}</p>
              <Table
                head={list('ipn', 'eventsHead')}
                rows={EVENTS.map((event) => [<code key="e">{event}</code>, tRaw('site.docs.sections.ipn.events')?.[event]])}
              />
              <p>{text('ipn', 'signature')}</p>
              <CodeTabs samples={SIGNATURE_SAMPLES} languages={SIGNATURE_LANGUAGES} {...tabs} />
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
                rows={METHODS.map(([code, country]) => [<code key="c">{code}</code>, country ?? text('methods', 'anyCountry')])}
              />
            </section>

            <section id="errors">
              <h2>{text('errors', 'title')}</h2>
              <p>{text('errors', 'text')}</p>
              <Code code={CODE_SAMPLES.error} label={t('site.docs.response')} />
              <p>{text('errors', 'type')}</p>
              <Table
                head={list('errors', 'head')}
                rows={HTTP_CODES.map((c) => [<code key="c">{c}</code>, text('errors', `codes.${c}`)])}
              />
              <p>{text('errors', 'errorCodesText')}</p>
              <Table
                head={list('errors', 'errorCodesHead')}
                rows={list('errors', 'errorCodes').map(({ code, http, meaning }) => [<code key="c">{code}</code>, http, meaning])}
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

// A code block with one tab per language. The language is shared by the page (`language`); a
// block without the chosen language shows its first one.
function CodeTabs({ samples, label, language, onLanguage, languages = CODE_LANGUAGES }) {
  const { t } = useTranslation();
  const available = languages.filter((l) => samples[l.key]);
  const current = available.find((l) => l.key === language) ?? available[0];

  return (
    <div className="site-code-tabs">
      <div className="site-code-tabs__list" role="tablist" aria-label={t('site.docs.language')}>
        {available.map((l) => (
          <button
            key={l.key}
            type="button"
            role="tab"
            aria-selected={l.key === current.key}
            className={`site-code-tabs__tab${l.key === current.key ? ' is-active' : ''}`}
            onClick={() => onLanguage(l.key)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <Code code={samples[current.key]} label={label ?? current.label} />
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
