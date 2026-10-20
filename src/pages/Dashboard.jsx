import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import Tabs from '../components/Tabs.jsx';
import Flag from '../components/Flag.jsx';
import Icon from '../components/Icon.jsx';
import { getDailyTotals, getTransactions } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { formatDateTime } from '../data/reload.js';
import { PENDING_PAYMENTS } from '../data/mockData.js';

// The dashboard answers one question: how much is on this country's account, and what moved
// this week. The balance and the week's daily flows (money in above the line, money out below)
// form one block; recent movements follow.

const TABS = [
  { key: 'transactions', label: 'Transactions récentes' },
  { key: 'pending', label: `Paiements en attente (${PENDING_PAYMENTS.length})` },
];

// "Transactions récentes": how many of the selected account's latest transactions are shown.
const RECENT_LIMIT = 10;

// Chart: the last 7 days and today. Colours match $desk-credit / $desk-debit.
const CHART_DAYS = 8;
const CHART_COLORS = { payin: '#0e7c55', payout: '#b3245a', grid: '#e6e8ef', axis: '#646a82', zero: '#16173f' };
const weekdayFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' });
const fullDateFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

const TRANSACTION_TYPES = {
  payin: { label: 'Encaissement', tone: 'in', sign: '+' },
  payout: { label: 'Décaissement', tone: 'out', sign: '−' },
};

const moneyFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 });
const integerFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

// The bars grow from the zero line on load; not for visitors who asked for less motion.
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// fr-FR separates thousands with a narrow space (U+202F) that is barely visible; use a full
// no-break space instead: 18466534 -> '18 466 534'.
function groupDigits(formatted) {
  return formatted.replace(/[\u00a0\u202f]/g, '\u00a0');
}

// XOF / XAF are shown as FCFA, the name merchants use; the ISO code stays in the tooltip.
function currencyUnit(currency) {
  return currency === 'XOF' || currency === 'XAF' ? 'FCFA' : currency;
}

// API amounts are decimal strings, e.g. '18466534.98' -> { integer: '18 466 534', fraction: '98' }.
// The fraction is dropped when it is zero (FCFA amounts are whole in practice).
function splitMoney(amount) {
  let integer = '';
  let fraction = '';
  for (const part of moneyFormat.formatToParts(Math.abs(Number(amount)))) {
    if (part.type === 'fraction') fraction = part.value;
    else if (part.type !== 'decimal') integer += part.value;
  }
  return { integer: groupDigits(integer), fraction: /^0+$/.test(fraction) ? '' : fraction };
}

// '18466534.98' -> 18 466 534,98 FCFA with the integer part large, the decimals and unit smaller.
// `sign` ('+' / '−') prefixes positive amounts, for credits and debits; a negative one shows '−'.
// `size`: 'hero' (the balance), 'figure' (the week's totals) or 'compact' (table cells).
function Money({ amount, currency, sign = '', size }) {
  const { integer, fraction } = splitMoney(amount);
  const value = Number(amount);
  const shownSign = value < 0 ? '−' : value === 0 ? '' : sign;
  return (
    <span className={`money${size ? ` money--${size}` : ''}`} title={`${shownSign}${groupDigits(moneyFormat.format(Math.abs(value)))} ${currency}`}>
      {shownSign && <span className="money__sign">{shownSign}</span>}
      <span className="money__integer">{integer}</span>
      {fraction && <span className="money__fraction">,{fraction}</span>}
      <span className="money__currency">{currencyUnit(currency)}</span>
    </span>
  );
}

export default function Dashboard() {
  // Selected account lives in AccountContext (defaults to the merchant's home country),
  // so it's shared with the sidebar and kept across navigation.
  const {
    balances,
    loading: balancesLoading,
    error: balancesError,
    selectedBalance: activeBalance,
    selectCountry,
  } = useAccount();
  const [tab, setTab] = useState('transactions');
  // Hides every amount on the page (balance, week totals, chart), e.g. when sharing a screen.
  const [hideAmounts, setHideAmounts] = useState(false);
  const currency = activeBalance?.currency;

  return (
    <div className="dashboard">
      {activeBalance && (
        <p className="dashboard__notice">
          <Icon name="info" size={16} />
          <span>
            Pour utiliser tous nos services dans ce pays ({activeBalance.country.name}), renseignez les
            informations de votre entreprise. <a href="#company-info">Renseigner les informations</a>
          </span>
        </p>
      )}

      <div className="dashboard__head">
        <h1>Tableau de bord</h1>
        <button
          type="button"
          className="dashboard__privacy"
          onClick={() => setHideAmounts((v) => !v)}
          aria-pressed={hideAmounts}
        >
          <Icon name={hideAmounts ? 'eye' : 'eyeOff'} size={16} />
          {hideAmounts ? 'Afficher les montants' : 'Masquer les montants'}
        </button>
      </div>

      {/* One account per country: picking one changes every logged-in page. */}
      <div className="account-switch" role="group" aria-label="Compte affiché">
        {balancesLoading && <span className="muted">Chargement de vos comptes…</span>}
        {balancesError && <span className="muted">Impossible de charger vos comptes. Rechargez la page.</span>}
        {!balancesLoading && !balancesError && balances.length === 0 && (
          <span className="muted">Aucun compte n&apos;est encore ouvert.</span>
        )}
        {balances.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`account-switch__item${activeBalance?.id === b.id ? ' account-switch__item--active' : ''}`}
            onClick={() => selectCountry(b.country.codeAlpha2)}
            aria-pressed={activeBalance?.id === b.id}
          >
            <Flag code={b.country.codeAlpha2} className="account-switch__flag" />
            <span className="account-switch__country">{b.country.name}</span>
            <span className="account-switch__number">{b.accountNumberFormatted}</span>
          </button>
        ))}
      </div>

      {activeBalance && (
        <section className="balance-desk" aria-label={`Compte ${activeBalance.country.name}`}>
          <div className="balance-desk__summary">
            <div className="balance-desk__balance">
              <p className="balance-desk__caption">
                Solde du compte {activeBalance.country.name}
                {!activeBalance.status && <span className="balance-desk__blocked">Compte bloqué</span>}
              </p>
              {hideAmounts ? (
                <Masked size="hero" currency={currency} />
              ) : (
                <Money amount={activeBalance.accountBalance} currency={currency} size="hero" />
              )}
            </div>

            <dl className="balance-desk__week">
              <div className="balance-desk__flow balance-desk__flow--in">
                <dt>Entrées sur 7 jours</dt>
                <dd>
                  {hideAmounts ? (
                    <Masked size="figure" currency={currency} />
                  ) : (
                    <Money amount={activeBalance.last7Days.credits} currency={currency} sign="+" size="figure" />
                  )}
                </dd>
              </div>
              <div className="balance-desk__flow balance-desk__flow--out">
                <dt>Sorties sur 7 jours</dt>
                <dd>
                  {hideAmounts ? (
                    <Masked size="figure" currency={currency} />
                  ) : (
                    <Money amount={activeBalance.last7Days.debits} currency={currency} sign="−" size="figure" />
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Its amounts are account details too. */}
          {!hideAmounts && <FlowChart balance={activeBalance} />}
        </section>
      )}

      <section className="movements">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="movements__panel">
          {tab === 'transactions' && <RecentTransactions balance={activeBalance} />}
          {tab === 'pending' && (
            <EmptyTable
              columns={['Date', 'Bénéficiaire', 'Montant', 'Statut']}
              rows={PENDING_PAYMENTS}
              emptyMessage="Aucun paiement en attente."
            />
          )}
        </div>
      </section>
    </div>
  );
}

// An amount hidden by "Masquer les montants", the same size as the one it replaces.
function Masked({ size, currency }) {
  return (
    <span className={`money money--${size} money--masked`} aria-label="Montant masqué">
      <span className="money__integer">••••••</span>
      <span className="money__currency">{currencyUnit(currency)}</span>
    </span>
  );
}

// Credits (payins) and debits (payouts) of the selected account per day, over the last
// CHART_DAYS days (GET /api/merchant/dashboard/daily). Days are UTC, like the API's. Money in
// rises above the zero line and money out drops below it, so a day's balance of flows reads at
// a glance.
function FlowChart({ balance }) {
  const balanceId = balance?.id;
  const [response, setResponse] = useState({ balanceId: null, days: null, error: '' });
  const loading = Boolean(balanceId) && response.balanceId !== balanceId;

  useEffect(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getDailyTotals(balanceId, CHART_DAYS)
      .then((days) => !cancelled && setResponse({ balanceId, days, error: '' }))
      .catch(
        (err) =>
          !cancelled &&
          setResponse({ balanceId, days: null, error: err?.message || 'Une erreur est survenue. Veuillez réessayer.' }),
      );
    return () => {
      cancelled = true;
    };
  }, [balanceId]);

  const days = loading ? [] : (response.days ?? []);
  const today = new Date().toISOString().slice(0, 10);
  const data = days.map((d) => {
    const date = new Date(`${d.date}T00:00:00Z`);
    const weekday = weekdayFormat.format(date).replace('.', '');
    return {
      day: d.date === today ? 'Auj.' : weekday.charAt(0).toUpperCase() + weekday.slice(1),
      fullDate: fullDateFormat.format(date),
      payin: Number(d.payin),
      // Drawn below the line.
      payout: -Number(d.payout),
      count: d.count,
    };
  });
  const empty = data.every((d) => d.count === 0);
  const unit = currencyUnit(balance.currency);

  let message = '';
  if (loading) message = 'Chargement…';
  else if (response.error) message = `Impossible de charger le graphique : ${response.error}`;
  else if (empty) message = 'Aucune entrée ni sortie ces 7 derniers jours.';

  return (
    <figure className="flow-chart">
      <figcaption className="flow-chart__caption">
        <span>Entrées et sorties par jour</span>
        <span className="flow-chart__legend">
          <span className="flow-chart__key flow-chart__key--in">Entrées</span>
          <span className="flow-chart__key flow-chart__key--out">Sorties</span>
        </span>
      </figcaption>
      <div className="flow-chart__plot">
        {message && <p className="flow-chart__message">{message}</p>}
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} stackOffset="sign" margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
              axisLine={false}
              tickLine={false}
              width={56}
              allowDecimals={false}
              tickFormatter={(v) => groupDigits(compactFormat.format(Math.abs(v)))}
            />
            <ReferenceLine y={0} stroke={CHART_COLORS.zero} strokeWidth={1.5} />
            <Tooltip
              cursor={{ fill: 'rgba(22, 23, 63, 0.05)' }}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload;
                return point ? `${point.fullDate}, ${point.count} transaction${point.count > 1 ? 's' : ''}` : '';
              }}
              formatter={(v, name) => [`${groupDigits(integerFormat.format(Math.abs(v)))} ${unit}`, name]}
            />
            <Bar
              dataKey="payin"
              name="Entrées"
              stackId="flow"
              fill={CHART_COLORS.payin}
              radius={[3, 3, 0, 0]}
              maxBarSize={40}
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            />
            <Bar
              dataKey="payout"
              name="Sorties"
              stackId="flow"
              fill={CHART_COLORS.payout}
              radius={[0, 0, 3, 3]}
              maxBarSize={40}
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

// The selected account's latest transactions (GET /api/merchant/transactions?balance=…), fetched
// each time the tab is opened or the account changes.
function RecentTransactions({ balance }) {
  const balanceId = balance?.id;
  // The answer and the account it belongs to: loading until it is the selected one.
  const [response, setResponse] = useState({ balanceId: null, data: null, error: '' });
  const loading = Boolean(balanceId) && response.balanceId !== balanceId;

  useEffect(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getTransactions({ balance: balanceId, limit: RECENT_LIMIT })
      .then((data) => !cancelled && setResponse({ balanceId, data, error: '' }))
      .catch(
        (err) =>
          !cancelled &&
          setResponse({ balanceId, data: null, error: err?.message || 'Une erreur est survenue. Veuillez réessayer.' }),
      );
    return () => {
      cancelled = true;
    };
  }, [balanceId]);

  const rows = loading ? [] : (response.data?.items ?? []);
  const total = loading ? 0 : (response.data?.total ?? 0);
  let emptyMessage = 'Aucune transaction sur ce compte pour le moment.';
  if (!balance) emptyMessage = 'Aucun compte';
  else if (loading) emptyMessage = 'Chargement…';
  else if (response.error) emptyMessage = `Impossible de charger les transactions : ${response.error}`;

  return (
    <div className="recent-transactions">
      <div className="table-scroll">
        <table className="data-table recent-transactions__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Référence</th>
              <th>Type</th>
              <th className="recent-transactions__number">Montant</th>
              <th className="recent-transactions__number">Commission</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="data-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const type = TRANSACTION_TYPES[t.type] ?? { label: t.type, tone: 'other', sign: '' };
                return (
                  <tr key={t.id}>
                    <td>{formatDateTime(t.createdAt)}</td>
                    <td className="recent-transactions__reference">{t.reference ?? `#${t.id}`}</td>
                    <td>
                      <span className={`flow-tag flow-tag--${type.tone}`}>{type.label}</span>
                    </td>
                    <td className={`recent-transactions__number recent-transactions__amount--${type.tone}`}>
                      <Money amount={t.amount} currency={balance.currency} sign={type.sign} size="compact" />
                    </td>
                    <td className="recent-transactions__number">
                      <Money amount={t.commission} currency={balance.currency} size="compact" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <p className="recent-transactions__footer">
          {total > rows.length ? `Les ${rows.length} dernières transactions sur ${total}` : `${total} transaction${total > 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
}

function EmptyTable({ columns, rows, emptyMessage }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="data-table__empty">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c}>{r[c]}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
