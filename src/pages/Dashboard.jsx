import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Tabs from '../components/Tabs.jsx';
import Flag from '../components/Flag.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { TRANSACTION_SERIES, RECENT_TRANSACTIONS, PENDING_PAYMENTS } from '../data/mockData.js';

const TABS = [
  { key: 'state', label: 'Etat actuel du compte' },
  { key: 'transactions', label: 'Transactions récentes' },
  { key: 'pending', label: `Paiements dus/en attente (${PENDING_PAYMENTS.length})` },
];

const moneyFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// API amounts are decimal strings, e.g. '18466534.98' -> '18 466 534,98 FCFA(XOF)'.
function formatMoney(amount, currency) {
  const value = moneyFormat.format(Number(amount));
  return currency === 'XOF' ? `${value} FCFA(XOF)` : `${value} ${currency}`;
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
                    value={activeBalance ? formatMoney(activeBalance.accountBalance, activeBalance.currency) : '—'}
                  />
                  {/* No backend concept for this yet. */}
                  <BalanceCell label="Solde Opération" value="—" />
                  <BalanceCell
                    label="Débits (7 derniers jours)"
                    value={activeBalance ? formatMoney(activeBalance.last7Days.debits, activeBalance.currency) : '—'}
                    tone="danger"
                  />
                  <BalanceCell
                    label="Crédits (7 derniers jours)"
                    value={activeBalance ? formatMoney(activeBalance.last7Days.credits, activeBalance.currency) : '—'}
                    tone="success"
                  />
                </div>
              </>
            ) : (
              <div className="balance-grid balance-grid--hidden">Détails du compte masqués.</div>
            )}

            <h3 className="dashboard__chart-title">Vos récentes transactions</h3>
            <div className="dashboard__chart">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={TRANSACTION_SERIES} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#eee" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={{ stroke: '#ddd' }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Montant Total (XOF)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#c0392b" strokeWidth={2} dot={{ r: 4, fill: '#c0392b' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === 'transactions' && (
          <EmptyTable
            columns={['Date', 'Référence', 'Type', 'Montant', 'Statut']}
            rows={RECENT_TRANSACTIONS}
          />
        )}

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
