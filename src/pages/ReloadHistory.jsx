import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal.jsx';
import TablePagination from '../components/TablePagination.jsx';
import { getReloadHistory } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { currencyLabel, formatAmount, formatDate, formatDateTime, RELOAD_STATUSES } from '../data/reload.js';

// "Mes recharges": the top-ups of the account selected in the dashboard (useAccount), newest
// first. Paging and search are done by the API (GET /api/merchant/reload/history).

const PAGE_SIZES = [10, 25, 50];
const SEARCH_DELAY_MS = 300;

const METHODS = { mobile_money: 'Mobile Money', bank_transfer: 'Compte bancaire' };

function amountLabel(reload) {
  return `${formatAmount(reload.amount)} ${currencyLabel(reload.currency)}`;
}

function methodLabel(reload) {
  const name = reload.method === 'bank_transfer' ? reload.bankTransfer?.bankName : reload.paymentType?.name;
  return name ? `${METHODS[reload.method]} — ${name}` : (METHODS[reload.method] ?? reload.method);
}

function StatusBadge({ status }) {
  const { label, tone } = RELOAD_STATUSES[status] ?? { label: status, tone: 'info' };
  return <span className={`badge badge--${tone}`}>{label}</span>;
}

export default function ReloadHistory() {
  const { selectedBalance, loading: accountsLoading, error: accountsError } = useAccount();
  const balanceId = selectedBalance?.id;
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  // The page number belongs to one list: another account, search or page size starts at 1.
  const listKey = `${balanceId}|${search}|${pageSize}`;
  const [paging, setPaging] = useState({ key: listKey, page: 1 });
  const page = paging.key === listKey ? paging.page : 1;
  const setPage = (n) => setPaging({ key: listKey, page: n });
  // The last answer, and the request (`${listKey}|${page}`) it answers: loading until they match.
  // `result` is null until the first page arrives; it stays on screen while the next one loads.
  const [response, setResponse] = useState({ key: null, result: null, error: '' });
  const requestKey = `${listKey}|${page}`;
  const loading = Boolean(balanceId) && response.key !== requestKey;
  const { result, error: loadError } = response;
  const [viewed, setViewed] = useState(null);

  // The search is sent once typing pauses.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getReloadHistory(balanceId, { q: search, page, limit: pageSize })
      .then((data) => !cancelled && setResponse({ key: requestKey, result: data, error: '' }))
      .catch(
        (err) =>
          !cancelled &&
          setResponse((prev) => ({ ...prev, key: requestKey, error: err?.message || 'Une erreur est survenue. Veuillez réessayer.' })),
      );
    return () => {
      cancelled = true;
    };
  }, [balanceId, search, page, pageSize, requestKey]);

  const rows = loadError ? [] : (result?.items ?? []);
  const total = result?.total ?? 0;

  let emptyMessage = 'Aucune recharge pour ce compte';
  if (accountsError || loadError) emptyMessage = `Impossible de charger les recharges : ${loadError || accountsError.message}`;
  else if (accountsLoading || (loading && !result)) emptyMessage = 'Chargement…';
  else if (!selectedBalance) emptyMessage = 'Aucun compte';
  else if (search) emptyMessage = 'Aucune recharge ne correspond à votre recherche';

  return (
    <div className="card">
      <div className="card__header">
        Mes recharges
        {selectedBalance && (
          <span className="reload-history__account">
            {selectedBalance.country.name} — {selectedBalance.accountNumberFormatted}
          </span>
        )}
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
            <input type="search" placeholder="Référence, RIB, libellé…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>

        <div className={`table-scroll${loading && result ? ' reload-history--loading' : ''}`} aria-busy={loading}>
          <table className="data-table reload-history__table">
            <thead>
              <tr>
                <th>Date et Heure</th>
                <th>Numéro de téléphone / RIB</th>
                <th>Montant</th>
                <th>Moyen de recharge</th>
                <th>Compte rechargé</th>
                <th>Libellé</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="data-table__empty">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.paymentId}>
                    <td>{formatDateTime(r.dateCreation)}</td>
                    <td>{r.bankTransfer?.rib ?? r.phoneNumber ?? '—'}</td>
                    <td className="reload-history__amount">{amountLabel(r)}</td>
                    <td>{methodLabel(r)}</td>
                    <td>{r.balance?.accountNumberFormatted}</td>
                    <td>{r.bankTransfer?.label || '—'}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td>
                      <button type="button" className="link-btn" onClick={() => setViewed(r)}>
                        Voir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination page={page} pageSize={pageSize} total={total} onPage={setPage} />

        <p className="reload-history__new">
          <Link to="/dashboard/reload">Recharger mon compte</Link>
        </p>
      </div>

      {viewed && <ReloadDetails reload={viewed} onClose={() => setViewed(null)} />}
    </div>
  );
}

function ReloadDetails({ reload, onClose }) {
  const transfer = reload.bankTransfer;
  const rows = [
    ['Référence', reload.paymentId],
    ['Date et heure', formatDateTime(reload.dateCreation)],
    ['Statut', <StatusBadge key="status" status={reload.status} />],
    ['Montant', amountLabel(reload)],
    ['Compte rechargé', reload.balance?.accountNumberFormatted],
    ['Moyen de recharge', methodLabel(reload)],
  ];
  if (transfer) {
    rows.push(
      ['Compte MyPay crédité', `${transfer.bankName} — ${transfer.accountNumber}`],
      ['Zone', transfer.zone],
      ['Votre RIB', transfer.rib],
      ['Date du virement', formatDate(transfer.transferDate)],
      ['Libellé', transfer.label || '—'],
    );
    if (transfer.reviewedAt) rows.push(['Traité le', formatDateTime(transfer.reviewedAt)]);
    if (transfer.cancellationReason) rows.push(["Motif d'annulation", transfer.cancellationReason]);
  } else {
    rows.push(['Numéro de téléphone', reload.phoneNumber ?? '—']);
  }
  if (reload.status !== 'pending') rows.push(['Dernière mise à jour', formatDateTime(reload.dateUpdate)]);

  return (
    <Modal title="Détails de la recharge" onClose={onClose}>
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
