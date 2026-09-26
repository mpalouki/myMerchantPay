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
import { useCountries } from '../hooks/useCountries.js';
import { TRANSACTION_SERIES, RECENT_TRANSACTIONS, PENDING_PAYMENTS } from '../data/mockData.js';

const TABS = [
  { key: 'state', label: 'Etat actuel du compte' },
  { key: 'transactions', label: 'Transactions récentes' },
  { key: 'pending', label: `Paiements dus/en attente (${PENDING_PAYMENTS.length})` },
];

export default function Dashboard() {
  const { countries, error: countriesError } = useCountries();
  const [country, setCountry] = useState(null);
  const [tab, setTab] = useState('state');
  const [hideDetails, setHideDetails] = useState(false);

  // Default to the last country once the list has loaded.
  const activeCountry = countries.find((c) => c.codeAlpha2 === country) ?? countries[countries.length - 1];

  return (
    <div className="dashboard">
      <div className="alert alert--warning">
        Pour profiter pleinement de nos services, merci de renseigner les informations de votre
        entreprise pour ce pays <strong>({activeCountry?.name})</strong>{' '}
        <a href="#company-info">en cliquer ici</a>.
      </div>

      <div className="page-header">
        <h1>Tableau de bord</h1>
        <button type="button" className="btn btn--outline-danger" onClick={() => setHideDetails((v) => !v)}>
          {hideDetails ? 'Afficher les détails du compte' : 'Cacher les détails du compte'} &#128065;
        </button>
      </div>

      <div className="country-pills">
        {countriesError && <span className="muted">Impossible de charger la liste des pays.</span>}
        {countries.map((c) => (
          <button
            key={c.codeAlpha2}
            type="button"
            className={`country-pill ${activeCountry?.codeAlpha2 === c.codeAlpha2 ? 'country-pill--active' : ''}`}
            onClick={() => setCountry(c.codeAlpha2)}
          >
            <Flag code={c.codeAlpha2} className="country-pill__flag" /> {c.name}
          </button>
        ))}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="card dashboard__panel">
        {tab === 'state' && (
          <>
            {!hideDetails ? (
              <div className="balance-grid">
                <BalanceCell label="Solde Principal" value="0.00 FCFA(XOF)" />
                <BalanceCell label="Solde Opération" value="0.00 FCFA(XOF)" />
                <BalanceCell label="Débits (7 derniers jours)" value="0.00 FCFA(XOF)" tone="danger" />
                <BalanceCell label="Crédits (7 derniers jours)" value="0.00 FCFA(XOF)" tone="success" />
              </div>
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
