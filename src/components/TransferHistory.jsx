import { useEffect, useState } from 'react';
import Flag from './Flag.jsx';
import Modal from './Modal.jsx';
import TablePagination from './TablePagination.jsx';
import { getTransfers } from '../api/client.js';
import { formatDateTime } from '../data/reload.js';
import { formatMoney, formatRate } from '../data/transfer.js';

// "Historique des transferts" (pages/Transfer.jsx): transfers into or out of an account, newest
// first, paged and searched by the API (GET /api/merchant/transfers). Mount it keyed by the
// account; `refreshKey` changes after a new transfer, to load it.

const PAGE_SIZES = [10, 25, 50];
const SEARCH_DELAY_MS = 300;

// Seen from the listed account: what left it (amount + fee), or what arrived.
function movement(t) {
  return t.direction === 'out'
    ? { sign: '−', tone: 'out', amount: formatMoney(t.from.total, t.from.currency), other: t.to.balance, verb: 'Envoyé vers' }
    : { sign: '+', tone: 'in', amount: formatMoney(t.to.amount, t.to.currency), other: t.from.balance, verb: 'Reçu de' };
}

export default function TransferHistory({ account, refreshKey }) {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const listKey = `${search}|${pageSize}`;
  const [paging, setPaging] = useState({ key: listKey, page: 1 });
  const page = paging.key === listKey ? paging.page : 1;
  const setPage = (n) => setPaging({ key: listKey, page: n });
  // The last answer and the request it answers: loading until they match.
  const [response, setResponse] = useState({ key: null, result: null, error: '' });
  const requestKey = `${listKey}|${page}|${refreshKey}`;
  const loading = response.key !== requestKey;
  const [viewed, setViewed] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    getTransfers(account.id, { q: search, page, limit: pageSize })
      .then((result) => !cancelled && setResponse({ key: requestKey, result, error: '' }))
      .catch(
        (err) =>
          !cancelled &&
          setResponse((prev) => ({ ...prev, key: requestKey, error: err?.message || 'Une erreur est survenue. Veuillez réessayer.' })),
      );
    return () => {
      cancelled = true;
    };
  }, [account.id, search, page, pageSize, requestKey]);

  const { result, error } = response;
  const rows = error ? [] : (result?.items ?? []);
  const total = error ? 0 : (result?.total ?? 0);

  let emptyMessage = 'Aucun transfert sur ce compte pour le moment';
  if (error) emptyMessage = `Impossible de charger les transferts : ${error}`;
  else if (loading && !result) emptyMessage = 'Chargement…';
  else if (search) emptyMessage = 'Aucun transfert ne correspond à votre recherche';

  return (
    <div className="card transfer-history">
      <div className="card__header">
        Historique des transferts
        <span className="reload-history__account">
          {account.country.name} — {account.accountNumberFormatted}
        </span>
      </div>
      <div className="card__body">
        <div className="table-toolbar">
          <label className="table-toolbar__pagesize">
            Afficher par
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            entrées
          </label>
          <label className="table-toolbar__search">
            Rechercher:
            <input type="search" placeholder="Référence, compte, description…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        <div className={`table-scroll${loading && result ? ' reload-history--loading' : ''}`} aria-busy={loading}>
          <table className="data-table transfer-history__table">
            <thead>
              <tr>
                <th>Date et Heure</th>
                <th>Référence</th>
                <th>Compte</th>
                <th className="transfer-history__number">Montant</th>
                <th>Actions</th>
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
                  const m = movement(t);
                  return (
                    <tr key={t.paymentId}>
                      <td>{formatDateTime(t.createdAt)}</td>
                      <td className="recent-transactions__reference">{t.paymentId}</td>
                      <td>
                        <div className="transfer-history__other">
                          <span>{m.verb}</span>
                          <strong>
                            <Flag code={m.other.country.codeAlpha2} /> {m.other.country.name}
                          </strong>
                          {t.description && <em>{t.description}</em>}
                        </div>
                      </td>
                      <td className={`transfer-history__number transfer-history__amount--${m.tone}`}>
                        {m.sign}
                        {m.amount}
                      </td>
                      <td>
                        <button type="button" className="link-btn" onClick={() => setViewed(t)}>
                          Voir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination page={page} pageSize={pageSize} total={total} onPage={setPage} />
      </div>

      {viewed && <TransferDetails transfer={viewed} onClose={() => setViewed(null)} />}
    </div>
  );
}

function accountLabel(balance) {
  return `${balance.country.name} — ${balance.accountNumberFormatted}`;
}

function TransferDetails({ transfer, onClose }) {
  const rows = [
    ['Référence', transfer.paymentId],
    ['Date et heure', formatDateTime(transfer.createdAt)],
    ['Compte débité', accountLabel(transfer.from.balance)],
    ['Montant débité', formatMoney(transfer.from.total, transfer.from.currency)],
    ['Compte crédité', accountLabel(transfer.to.balance)],
    ['Montant crédité', formatMoney(transfer.to.amount, transfer.to.currency)],
  ];
  if (Number(transfer.from.fee) > 0) rows.push(['Frais', formatMoney(transfer.from.fee, transfer.from.currency)]);
  if (transfer.crossCurrency) rows.push(['Taux appliqué', `1 ${transfer.from.currency} = ${formatRate(transfer.rate)} ${transfer.to.currency}`]);
  if (transfer.description) rows.push(['Description', transfer.description]);

  return (
    <Modal title="Détails du transfert" onClose={onClose}>
      <table className="kv-table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
