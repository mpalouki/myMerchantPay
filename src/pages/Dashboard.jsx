import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Tabs from '../components/Tabs.jsx';
import Flag from '../components/Flag.jsx';
import { getDailyTotals, getTransactions } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { formatDateTime } from '../data/reload.js';
import { PENDING_PAYMENTS } from '../data/mockData.js';

const TABS = [
  { key: 'state', label: 'Etat actuel du compte' },
  { key: 'transactions', label: 'Transactions récentes' },
  { key: 'pending', label: `Paiements dus/en attente (${PENDING_PAYMENTS.length})` },
];

// "Transactions récentes": how many of the selected account's latest transactions are shown.
const RECENT_LIMIT = 10;

// Chart: the last 7 days and today.
const CHART_DAYS = 8;
const CHART_COLORS = { payin: '#2e7d32', payout: '#e74c3c' };
const weekdayFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' });
const fullDateFormat = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

const TRANSACTION_TYPES = {
  payin: { label: 'Encaissement', tone: 'success', sign: '+' },
  payout: { label: 'Décaissement', tone: 'danger', sign: '−' },
};

const moneyFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compactFormat = new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 });
const integerFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

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
function Money({ amount, currency, sign = '', compact = false }) {
  const { integer, fraction } = splitMoney(amount);
  const value = Number(amount);
  const shownSign = value < 0 ? '−' : value === 0 ? '' : sign;
  return (
    <span className={`money${compact ? ' money--compact' : ''}`} title={`${shownSign}${groupDigits(moneyFormat.format(Math.abs(value)))} ${currency}`}>
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
  const [tab, setTab] = useState('state');
  const [hideDetails, setHideDetails] = useState(false);

  return (
    <div className="dashboard">
      {activeBalance && (
        <div className="alert alert--warning">
          Pour profiter pleinement de nos services, merci de renseigner les informations de votre
          entreprise pour ce pays <strong>({activeBalance.country.name})</strong>{' '}
          <a href="#company-info">en cliquer ici</a>.
        </div>
      )}

      <div className="page-header">
        <h1>Tableau de bord</h1>
        <button type="button" className="btn btn--outline-danger" onClick={() => setHideDetails((v) => !v)}>
          {hideDetails ? 'Afficher les détails du compte' : 'Cacher les détails du compte'} &#128065;
        </button>
      </div>

      <div className="country-pills">
        {balancesLoading && <span className="muted">Chargement de vos comptes…</span>}
        {balancesError && <span className="muted">Impossible de charger vos comptes.</span>}
        {!balancesLoading && !balancesError && balances.length === 0 && (
          <span className="muted">Aucun compte n&apos;est encore ouvert.</span>
        )}
        {balances.map((b) => (
          <button
            key={b.id}
            type="button"
            className={`country-pill ${activeBalance?.id === b.id ? 'country-pill--active' : ''}`}
            onClick={() => selectCountry(b.country.codeAlpha2)}
          >
            <Flag code={b.country.codeAlpha2} className="country-pill__flag" /> {b.country.name}
          </button>
        ))}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="card dashboard__panel">
        {tab === 'state' && (
          <>
            {!hideDetails ? (
              <>
                {activeBalance && (
                  <div className="dashboard__account">
                    Compte n° <strong>{activeBalance.accountNumberFormatted}</strong>
                    {!activeBalance.status && <span className="badge badge--danger">Bloqué</span>}
                  </div>
                )}
                <div className="balance-grid">
                  <BalanceCell
                    label="Solde Principal"
                    value={activeBalance ? <Money amount={activeBalance.accountBalance} currency={activeBalance.currency} /> : '—'}
                  />
                  {/* No backend concept for this yet. */}
                  <BalanceCell label="Solde Opération" value="—" />
                  <BalanceCell
                    label="Débits (7 derniers jours)"
                    value={activeBalance ? <Money amount={activeBalance.last7Days.debits} currency={activeBalance.currency} sign="−" /> : '—'}
                    tone="danger"
                  />
                  <BalanceCell
                    label="Crédits (7 derniers jours)"
                    value={activeBalance ? <Money amount={activeBalance.last7Days.credits} currency={activeBalance.currency} sign="+" /> : '—'}
                    tone="success"
                  />
                </div>
              </>
            ) : (
              <div className="balance-grid balance-grid--hidden">Détails du compte masqués.</div>
            )}

            {/* Its amounts are account details too. */}
            {!hideDetails && <TransactionsChart balance={activeBalance} />}
          </>
        )}

        {tab === 'transactions' && <RecentTransactions balance={activeBalance} />}

        {tab === 'pending' && (
          <EmptyTable columns={['Date', 'Bénéficiaire', 'Montant', 'Statut']} rows={PENDING_PAYMENTS} />
        )}
      </div>
    </div>
  );
}

function BalanceCell({ label, value, tone }) {
  return (
    <div className="balance-cell">
      <div className="balance-cell__label">{label}</div>
      <div className={`balance-cell__value ${tone ? `balance-cell__value--${tone}` : ''}`}>{value}</div>
    </div>
  );
}

// Credits (payins) and debits (payouts) of the selected account per day, over the last
// CHART_DAYS days (GET /api/merchant/dashboard/daily). Days are UTC, like the API's.
function TransactionsChart({ balance }) {
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
      payout: Number(d.payout),
      count: d.count,
    };
  });
  const empty = data.every((d) => d.count === 0);
  const unit = balance ? currencyUnit(balance.currency) : 'FCFA';

  let message = '';
  if (!balance) message = 'Aucun compte';
  else if (loading) message = 'Chargement…';
  else if (response.error) message = `Impossible de charger le graphique : ${response.error}`;
  else if (empty) message = 'Aucune transaction ces 7 derniers jours';

  return (
    <>
      <h3 className="dashboard__chart-title">Vos récentes transactions</h3>
      <div className="dashboard__chart">
        {message && <p className="dashboard__chart-message">{message}</p>}
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={{ stroke: '#ddd' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={70}
              allowDecimals={false}
              tickFormatter={(v) => groupDigits(compactFormat.format(v))}
              label={{ value: `Montant (${unit})`, angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <Tooltip
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload;
                return point ? `${point.fullDate} — ${point.count} transaction${point.count > 1 ? 's' : ''}` : '';
              }}
              formatter={(v, name) => [`${groupDigits(integerFormat.format(v))} ${unit}`, name]}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
            <Line
              type="monotone"
              dataKey="payin"
              name="Crédits"
              stroke={CHART_COLORS.payin}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLORS.payin }}
            />
            <Line
              type="monotone"
              dataKey="payout"
              name="Débits"
              stroke={CHART_COLORS.payout}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLORS.payout }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
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
  let emptyMessage = 'Aucune transaction sur ce compte';
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
                const type = TRANSACTION_TYPES[t.type] ?? { label: t.type, tone: 'info', sign: '' };
                return (
                  <tr key={t.id}>
                    <td>{formatDateTime(t.createdAt)}</td>
                    <td className="recent-transactions__reference">{t.reference ?? `#${t.id}`}</td>
                    <td>
                      <span className={`badge badge--${type.tone}`}>{type.label}</span>
                    </td>
                    <td className={`recent-transactions__number recent-transactions__amount--${type.tone}`}>
                      <Money amount={t.amount} currency={balance.currency} sign={type.sign} compact />
                    </td>
                    <td className="recent-transactions__number">
                      <Money amount={t.commission} currency={balance.currency} compact />
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

function EmptyTable({ columns, rows }) {
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
              Aucune donnée disponible
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
