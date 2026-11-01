import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import TablePagination from '../components/TablePagination.jsx';
import { getPaymentLinks } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import usePermissions from '../hooks/usePermissions.js';
import { formatDateTime } from '../data/reload.js';
import { formatMoney } from '../data/transfer.js';
import { linkPrice } from '../data/paymentLinks.js';

// "Liens de paiement": the selected account's payment links (GET /api/merchant/payment-links),
// searched and paged by the API, each with its URL to copy, its status and what it collected.
// "Nouveau lien" opens PaymentLinkNew.jsx, a row PaymentLinkDetails.jsx.

const PAGE_SIZES = [10, 25, 50];
const SEARCH_DELAY_MS = 300;
const STATUSES = [
  { value: '', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Désactivés' },
];

export default function PaymentLinks() {
  const canManage = usePermissions().can('payment_links.manage');
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedBalance: account, loading: accountsLoading, error: accountsError } = useAccount();
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const listKey = `${account?.id}|${search}|${status}|${pageSize}`;
  const [paging, setPaging] = useState({ key: listKey, page: 1 });
  const page = paging.key === listKey ? paging.page : 1;
  const requestKey = `${listKey}|${page}`;
  const [response, setResponse] = useState({ key: null, result: null, error: '' });
  const loading = response.key !== requestKey;
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!account) return undefined;
    let cancelled = false;
    getPaymentLinks(account.id, { q: search, status, page, limit: pageSize })
      .then((result) => !cancelled && setResponse({ key: requestKey, result, error: '' }))
      .catch((err) => !cancelled && setResponse((prev) => ({ ...prev, key: requestKey, error: err?.message || 'Une erreur est survenue.' })));
    return () => {
      cancelled = true;
    };
  }, [account, search, status, page, pageSize, requestKey]);

  const copy = async (link) => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(link.id);
      setTimeout(() => setCopied((id) => (id === link.id ? null : id)), 1800);
    } catch {
      // Clipboard refused (insecure context): the URL stays selectable in the row.
    }
  };

  const { result, error } = response;
  const rows = error ? [] : (result?.items ?? []);
  const total = error ? 0 : (result?.total ?? 0);

  let empty = null;
  if (accountsError) empty = `Impossible de charger vos comptes : ${accountsError.message}`;
  else if (!accountsLoading && !account) empty = "Vous n'avez encore aucun compte.";
  else if (error) empty = `Impossible de charger les liens : ${error}`;
  else if (loading && !result) empty = 'Chargement…';
  else if (rows.length === 0) empty = search || status ? 'Aucun lien ne correspond à votre recherche.' : null;

  return (
    <div className="card plinks">
      <div className="card__header">
        Liens de paiement
        <div className="card__subheader">
          Créez une page de paiement sans site web ni code, et partagez-la par message, sur les réseaux sociaux ou par QR code.
          {account && ` Compte ${account.country.name} — ${account.accountNumberFormatted}.`}
        </div>
      </div>
      <div className="card__body">
        {state?.notice && (
          <div className="toast-inline plinks__notice" role="status">
            {state.notice}
          </div>
        )}

        {!loading && !error && rows.length === 0 && !search && !status && account ? (
          <div className="plinks__intro">
            <span className="plinks__intro-icon">
              <Icon name="link" size={26} />
            </span>
            <h2>Encaissez avec un simple lien</h2>
            <p>Un lien pour un produit, un service ou un don : vos clients paient par mobile money ou carte bancaire, sur une page sécurisée par GamaPay.</p>
            {canManage && (
              <button type="button" className="btn btn--primary" onClick={() => navigate('/dashboard/payment-links/new')}>
                <Icon name="plus" size={16} /> Créer un lien de paiement
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-toolbar plinks__toolbar">
              <div className="plinks__filters" role="radiogroup" aria-label="Statut">
                {STATUSES.map((s) => (
                  <button key={s.value} type="button" role="radio" aria-checked={status === s.value} className={`plinks__filter${status === s.value ? ' is-active' : ''}`} onClick={() => setStatus(s.value)}>
                    {s.label}
                  </button>
                ))}
              </div>
              <input type="search" className="plinks__search" placeholder="Rechercher un lien" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher un lien" />
              {canManage && (
                <button type="button" className="btn btn--primary" onClick={() => navigate('/dashboard/payment-links/new')} disabled={!account}>
                  <Icon name="plus" size={16} /> Nouveau lien
                </button>
              )}
            </div>

            <div className="table-scroll">
              <table className="data-table plinks__table">
                <thead>
                  <tr>
                    <th>Lien</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Paiements</th>
                    <th>Créé le</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {empty ? (
                    <tr>
                      <td colSpan={6} className="data-table__empty">
                        {empty}
                      </td>
                    </tr>
                  ) : (
                    rows.map((link) => (
                      <tr key={link.id}>
                        <td>
                          <Link to={`/dashboard/payment-links/${link.id}`} className="plinks__name">
                            {link.name}
                          </Link>
                          <span className="plinks__url">
                            <span>{link.url.replace(/^https?:\/\//, '')}</span>
                            <button type="button" className="plinks__copy" onClick={() => copy(link)} aria-label="Copier le lien" title="Copier le lien">
                              <Icon name={copied === link.id ? 'check' : 'copy'} size={14} />
                            </button>
                          </span>
                        </td>
                        <td className="plinks__price">{linkPrice(link)}</td>
                        <td>
                          <span className={`badge ${link.active ? 'badge--success' : 'badge--danger'}`}>{link.active ? 'Actif' : 'Désactivé'}</span>
                          {!link.livemode && <span className="badge badge--warning plinks__mode">Test</span>}
                        </td>
                        <td>
                          {link.paymentsCount}
                          {link.maxPayments !== null && ` / ${link.maxPayments}`}
                          {link.paymentsCount > 0 && <small className="plinks__collected">{formatMoney(link.amountCollected, link.currency)}</small>}
                        </td>
                        <td>{formatDateTime(link.createdAt)}</td>
                        <td>
                          <Link to={`/dashboard/payment-links/${link.id}`} className="link-btn">
                            Détails
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="plinks__footer">
              <label className="table-toolbar__pagesize">
                Afficher par
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <TablePagination page={page} pageSize={pageSize} total={total} onPage={(n) => setPaging({ key: listKey, page: n })} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
