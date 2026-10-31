import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import AlertDialog from '../components/AlertDialog.jsx';
import Icon from '../components/Icon.jsx';
import PaymentLinkQr from '../components/PaymentLinkQr.jsx';
import TablePagination from '../components/TablePagination.jsx';
import { getPaymentLink, getPaymentLinkPayments, setPaymentLinkActive } from '../api/client.js';
import { formatDateTime } from '../data/reload.js';
import { formatMoney } from '../data/transfer.js';
import { SUBMIT_TYPES, URL_PARAMETERS, linkPrice, shareTargets, urlWithParameters } from '../data/paymentLinks.js';

// A payment link: share it (copy, apps, QR code, URL parameters for tracking), what it sells and
// does after the payment, activate or deactivate it, and the payments it received.

const PAGE_SIZE = 10;

export default function PaymentLinkDetails() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { state: navState } = useLocation();
  const [state, setState] = useState({ id: null, link: null, error: '' });
  const link = state.id === linkId ? state.link : null;
  const loadError = state.id === linkId ? state.error : '';
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');

  useEffect(() => {
    let cancelled = false;
    getPaymentLink(linkId)
      .then((data) => !cancelled && setState({ id: linkId, link: data, error: '' }))
      .catch((err) => !cancelled && setState({ id: linkId, link: null, error: err?.status === 404 ? 'Ce lien est introuvable.' : err?.message || 'Une erreur est survenue.' }));
    return () => {
      cancelled = true;
    };
  }, [linkId]);

  const toggle = async () => {
    setBusy(true);
    try {
      const updated = await setPaymentLinkActive(link.id, !link.active);
      setState({ id: linkId, link: updated, error: '' });
      setConfirming(false);
    } catch (err) {
      setConfirming(false);
      setFailure(err?.message || 'Une erreur est survenue.');
    } finally {
      setBusy(false);
    }
  };

  if (!link) {
    return (
      <div className="card plink-page">
        <div className="card__header">
          <Link to="/dashboard/payment-links" className="plink-page__back" aria-label="Retour aux liens de paiement">
            ←
          </Link>
          Lien de paiement
        </div>
        <div className="card__body">
          <p className="reload__empty">{loadError || 'Chargement…'}</p>
        </div>
      </div>
    );
  }

  const exhausted = link.maxPayments !== null && link.paymentsCount >= link.maxPayments;

  return (
    <>
      <div className="card plink-page">
        <div className="card__header plink-page__header">
          <Link to="/dashboard/payment-links" className="plink-page__back" aria-label="Retour aux liens de paiement">
            ←
          </Link>
          <span className="plink-page__title">{link.name}</span>
          <span className={`badge ${link.active ? 'badge--success' : 'badge--danger'}`}>{link.active ? 'Actif' : 'Désactivé'}</span>
          {!link.livemode && <span className="badge badge--warning">Mode test</span>}
          <span className="plink-page__actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate(`/dashboard/payment-links/${link.id}/edit`)}>
              <Icon name="edit" size={14} /> Modifier
            </button>
            <button type="button" className={`btn btn--sm ${link.active ? 'btn--outline-danger' : 'btn--primary'}`} onClick={() => (link.active ? setConfirming(true) : toggle())} disabled={busy || (!link.active && exhausted)} title={!link.active && exhausted ? 'Augmentez d’abord la limite de paiements' : undefined}>
              {link.active ? 'Désactiver' : 'Activer'}
            </button>
          </span>
        </div>
        <div className="card__body">
          {navState?.created && (
            <div className="toast-inline plinks__notice" role="status">
              Votre lien est prêt : partagez-le à vos clients.
            </div>
          )}
          {navState?.notice && (
            <div className="toast-inline plinks__notice" role="status">
              {navState.notice}
            </div>
          )}
          {!link.active && (
            <p className="plink-page__inactive">
              {exhausted
                ? `Ce lien a atteint sa limite de ${link.maxPayments} paiement${link.maxPayments > 1 ? 's' : ''} et a été désactivé. Augmentez la limite (Modifier) pour le réactiver.`
                : 'Ce lien est désactivé : ceux qui l’ouvrent voient une page « lien indisponible ».'}
            </p>
          )}

          <SharePanel link={link} />

          <div className="plink-page__facts">
            <Fact label="Prix" value={linkPrice(link)} detail={link.type === 'fixed' ? `${link.lineItems.length} produit${link.lineItems.length > 1 ? 's' : ''}` : customBounds(link)} />
            <Fact label="Paiements reçus" value={`${link.paymentsCount}${link.maxPayments !== null ? ` / ${link.maxPayments}` : ''}`} detail={formatMoney(link.amountCollected, link.currency)} />
            <Fact label="Après le paiement" value={link.afterCompletion.type === 'redirect' ? 'Redirection' : 'Page de confirmation'} detail={link.afterCompletion.type === 'redirect' ? link.afterCompletion.url : link.afterCompletion.message || 'Message par défaut'} />
            <Fact label="Application" value={link.application.name} detail={`Bouton « ${SUBMIT_TYPES.find((s) => s.value === link.submitType)?.button ?? 'Payer'} » · créé le ${formatDateTime(link.createdAt)}`} />
          </div>

          {link.type === 'fixed' && (
            <ul className="plink-page__items">
              {link.lineItems.map((item, index) => (
                <li key={index}>
                  {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span className="plink-preview__thumb">{item.name.charAt(0).toUpperCase()}</span>}
                  <span className="plink-page__item-name">
                    {item.name}
                    {item.description && <small>{item.description}</small>}
                  </span>
                  <span>
                    {item.quantity > 1 && `${item.quantity} × `}
                    {formatMoney(item.unitAmount, link.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Payments link={link} />

      {confirming && (
        <AlertDialog
          title="Désactiver ce lien ?"
          message="Ceux qui l’ouvrent (QR code compris) verront une page « lien indisponible ». Vous pourrez le réactiver à tout moment."
          onClose={() => !busy && setConfirming(false)}
          onConfirm={toggle}
          confirmLabel="Désactiver"
          cancelLabel="Annuler"
          busy={busy}
        />
      )}
      {failure && <AlertDialog variant="error" title="Ooups !" message={failure} onClose={() => setFailure('')} />}
    </>
  );
}

function customBounds(link) {
  const { minimum, maximum } = link.customAmount ?? {};
  return `De ${formatMoney(minimum, link.currency)} à ${formatMoney(maximum, link.currency)}`;
}

function Fact({ label, value, detail }) {
  return (
    <div className="plink-fact">
      <span className="plink-fact__label">{label}</span>
      <strong className="plink-fact__value">{value}</strong>
      {detail && <span className="plink-fact__detail">{detail}</span>}
    </div>
  );
}

function CopyButton({ text, label = 'Copier' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard refused: the field stays selectable.
    }
  };
  return (
    <button type="button" className="btn btn--primary btn--sm plink-share__copy" onClick={copy}>
      <Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copié' : label}
    </button>
  );
}

function SharePanel({ link }) {
  const [params, setParams] = useState({});
  const [paramsOpen, setParamsOpen] = useState(false);
  const shareUrl = urlWithParameters(link.url, params);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <section className="plink-share" aria-label="Partager le lien">
      <div className="plink-share__main">
        <h3>Partager le lien</h3>
        <div className="plink-share__url">
          <input readOnly value={shareUrl} onFocus={(e) => e.target.select()} aria-label="Adresse du lien" />
          <CopyButton text={shareUrl} />
        </div>
        <div className="plink-share__targets">
          {shareTargets(shareUrl, link.name).map((target) => (
            <a key={target.key} className={`plink-share__target plink-share__target--${target.key}`} href={target.href} target="_blank" rel="noreferrer">
              {target.label}
            </a>
          ))}
          {canShare && (
            <button type="button" className="plink-share__target" onClick={() => navigator.share({ title: link.name, url: shareUrl }).catch(() => {})}>
              Autre…
            </button>
          )}
          <a className="plink-share__target" href={shareUrl} target="_blank" rel="noreferrer">
            <Icon name="eye" size={14} /> Ouvrir
          </a>
        </div>

        <button type="button" className="link-btn plink-share__toggle" onClick={() => setParamsOpen((v) => !v)} aria-expanded={paramsOpen}>
          <Icon name={paramsOpen ? 'chevronDown' : 'chevronRight'} size={14} /> Paramètres d’URL (suivi des campagnes, référence client)
        </button>
        {paramsOpen && (
          <div className="plink-share__params">
            <p className="plink-share__hint">Ajoutés au lien, ils sont enregistrés avec chaque paiement : vous retrouvez la référence et la source dans la liste des paiements. Ne mettez pas d’information sensible : le lien peut circuler.</p>
            <div className="plink-form__grid">
              {URL_PARAMETERS.map((p) => (
                <label key={p.name} className="field field--stacked">
                  <span>{p.label}</span>
                  <input value={params[p.name] ?? ''} maxLength={p.name === 'client_reference_id' ? 200 : 150} onChange={(e) => setParams((v) => ({ ...v, [p.name]: e.target.value }))} />
                  <small>{p.hint}</small>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <PaymentLinkQr url={shareUrl} fileName={`lien-paiement-${link.code}`} />
    </section>
  );
}

function Payments({ link }) {
  const [page, setPage] = useState(1);
  const requestKey = `${link.id}|${page}`;
  const [response, setResponse] = useState({ key: null, result: null, error: '' });
  const loading = response.key !== requestKey;

  useEffect(() => {
    let cancelled = false;
    getPaymentLinkPayments(link.id, { page, limit: PAGE_SIZE })
      .then((result) => !cancelled && setResponse({ key: requestKey, result, error: '' }))
      .catch((err) => !cancelled && setResponse((prev) => ({ ...prev, key: requestKey, error: err?.message || 'Une erreur est survenue.' })));
    return () => {
      cancelled = true;
    };
  }, [link.id, page, requestKey]);

  const { result, error } = response;
  const rows = error ? [] : (result?.items ?? []);
  let empty = null;
  if (error) empty = `Impossible de charger les paiements : ${error}`;
  else if (loading && !result) empty = 'Chargement…';
  else if (rows.length === 0) empty = 'Aucun paiement reçu par ce lien pour le moment.';

  return (
    <div className="card">
      <div className="card__header">Paiements reçus</div>
      <div className="card__body">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Moyen de paiement</th>
                <th>Référence client</th>
                <th>Source</th>
                <th>N° de paiement</th>
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
                rows.map((p) => (
                  <tr key={p.session}>
                    <td>{formatDateTime(p.completedAt)}</td>
                    <td className="plinks__price">{formatMoney(p.amount, p.currency)}</td>
                    <td>
                      {p.method ?? '—'}
                      {p.phone && <small className="plinks__collected">{p.phone}</small>}
                    </td>
                    <td>{p.clientReferenceId ?? '—'}</td>
                    <td>{p.utm ? Object.values(p.utm).join(' · ') : '—'}</td>
                    <td className="plinks__mono">{p.paymentId ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination page={page} pageSize={PAGE_SIZE} total={error ? 0 : (result?.total ?? 0)} onPage={setPage} />
      </div>
    </div>
  );
}
