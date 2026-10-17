import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import TablePagination from './TablePagination.jsx';
import { getWithdrawals } from '../api/client.js';
import { currencyLabel, formatAmount, formatDateTime } from '../data/reload.js';

// "Historique des retraits" (pages/Withdraw.jsx): an account's withdrawals, newest first.
// Paging and search are done by the API (GET /api/merchant/withdrawals). Mount it keyed by the
// account, so another account starts on page 1 with an empty search.

const PAGE_SIZES = [10, 25, 50];
const SEARCH_DELAY_MS = 300;

const STATUSES = {
  pending: { label: 'En cours', tone: 'warning' },
  success: { label: 'Effectué', tone: 'success' },
  failed: { label: 'Échoué', tone: 'danger' },
  cancelled: { label: 'Annulé', tone: 'danger' },
};

function StatusBadge({ status }) {
  const { label, tone } = STATUSES[status] ?? { label: status, tone: 'info' };
  return <span className={`badge badge--${tone}`}>{label}</span>;
}

function amountLabel(w) {
  return `${formatAmount(w.amount)} ${currencyLabel(w.currency)}`;
}

// Where the money went: "Wave Senegal" + "+221701234567", or "CBAO — MELBET SARL" + the RIB.
function destination(w) {
  const account = w.withdrawalAccount;
  if (!account) return { title: w.paymentType?.name ?? '—', detail: w.phoneNumber ?? '' };
  return account.method === 'mobile_money'
    ? { title: account.walletName ?? 'Mobile money', detail: account.phoneNumber ?? '' }
    : { title: `${account.bankName} — ${account.accountName}`, detail: account.rib ?? '' };
}

export default function WithdrawalHistory({ account }) {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  // The page number belongs to one list: another search or page size starts at 1.
  const listKey = `${search}|${pageSize}`;
  const [paging, setPaging] = useState({ key: listKey, page: 1 });
  const page = paging.key === listKey ? paging.page : 1;
  const setPage = (n) => setPaging({ key: listKey, page: n });
  // The last answer and the request it answers: loading until they match. The previous page
  // stays on screen meanwhile.
  const [response, setResponse] = useState({ key: null, result: null, error: '' });
  const requestKey = `${listKey}|${page}`;
  const loading = response.key !== requestKey;
  const [viewed, setViewed] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    getWithdrawals(account.id, { q: search, page, limit: pageSize })
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

  let emptyMessage = 'Aucun retrait pour ce compte';
  if (error) emptyMessage = `Impossible de charger les retraits : ${error}`;
  else if (loading && !result) emptyMessage = 'Chargement…';
  else if (search) emptyMessage = 'Aucun retrait ne correspond à votre recherche';

  return (
    <div className="card withdraw__history">
      <div className="card__header">
        Historique des retraits
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
            <input type="search" placeholder="Référence, RIB, numéro…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        <div className={`table-scroll${loading && result ? ' reload-history--loading' : ''}`} aria-busy={loading}>
          <table className="data-table withdraw__history-table">
            <thead>
              <tr>
                <th>Date et Heure</th>
                <th>Référence</th>
                <th>Compte de retrait</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="data-table__empty">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((w) => {
                  const { title, detail } = destination(w);
                  return (
                    <tr key={w.paymentId}>
                      <td>{formatDateTime(w.dateCreation)}</td>
                      <td className="recent-transactions__reference">{w.paymentId}</td>
                      <td>
                        <div className="withdraw__history-destination">
                          <strong>{title}</strong>
                          <span>{detail}</span>
                        </div>
                      </td>
                      <td className="reload-history__amount">{amountLabel(w)}</td>
                      <td>
                        <StatusBadge status={w.status} />
                      </td>
                      <td>
                        <button type="button" className="link-btn" onClick={() => setViewed(w)}>
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

      {viewed && <WithdrawalDetails withdrawal={viewed} onClose={() => setViewed(null)} />}
    </div>
  );
}

function WithdrawalDetails({ withdrawal, onClose }) {
  const account = withdrawal.withdrawalAccount;
  const rows = [
    ['Référence', withdrawal.paymentId],
    ['Date et heure', formatDateTime(withdrawal.dateCreation)],
    ['Statut', <StatusBadge key="status" status={withdrawal.status} />],
    ['Montant', amountLabel(withdrawal)],
  ];
  if (account?.method === 'bank_account') {
    rows.push(['Banque', account.bankName], ['Intitulé du compte', account.accountName], ['RIB', account.rib]);
  } else {
    rows.push(['Mobile money', account?.walletName ?? withdrawal.paymentType?.name ?? '—'], ['Numéro de téléphone', account?.phoneNumber ?? withdrawal.phoneNumber ?? '—']);
  }
  if (account?.removed) rows.push(['Compte de retrait', 'Supprimé depuis']);
  if (withdrawal.status !== 'pending') rows.push(['Dernière mise à jour', formatDateTime(withdrawal.dateUpdate)]);

  return (
    <Modal title="Détails du retrait" onClose={onClose}>
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
