import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import DeleteApplicationDialog from '../components/DeleteApplicationDialog.jsx';
import { deleteApplication, getApplication } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SERVICE_LABELS, groupPaymentMethods } from '../data/apiApplications.js';
import { readApiErrors } from '../data/teams.js';

// "Détails" of an application of "Intégrez notre API" (/dashboard/api-integration/:appId),
// opened from the list in ApiIntegration.jsx: GET /api/merchant/applications/{id}, with its
// API keys (masked until "Afficher les clés api"). "Modifier la configuration" opens
// ApiApplicationEdit.jsx; "Supprimer la configuration" deletes it.

export default function ApiApplicationDetails() {
  const { appId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  // null while loading, false when it can't be loaded.
  const [app, setApp] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Set by the new / edit pages after saving.
  const notice = useLocation().state?.notice;

  useEffect(() => {
    let cancelled = false;
    getApplication(token, appId)
      .then((data) => !cancelled && setApp(data))
      .catch((err) => {
        if (cancelled) return;
        setApp(false);
        setLoadError(err?.status === 404 ? '' : readApiErrors(err).message);
      });
    return () => {
      cancelled = true;
    };
  }, [token, appId]);

  const handleDelete = async () => {
    await deleteApplication(token, app.id);
    navigate('/dashboard/api-integration', { state: { notice: `L'application « ${app.name} » a été supprimée.` } });
  };

  return (
    <div className="card">
      <div className="card__header">Configuration de vos Applications</div>
      <div className="card__body">
        {notice && (
          <div className="toast-inline api-apps__notice" role="status">
            {notice}
          </div>
        )}
        {app === null && <div className="empty-panel">Chargement…</div>}
        {app === false && (
          <div className="empty-panel">
            {loadError ? `Impossible de charger l'application : ${loadError}` : 'Cette application est introuvable.'}{' '}
            <Link to="/dashboard/api-integration" className="link-btn">
              Retour à la liste des applications
            </Link>
          </div>
        )}
        {app && (
          <ApplicationPanel
            app={app}
            revealed={revealed}
            onToggleReveal={() => setRevealed((v) => !v)}
            onDelete={() => setConfirmDelete(true)}
          />
        )}
      </div>

      {confirmDelete && (
        <DeleteApplicationDialog app={app} onConfirm={handleDelete} onClose={() => setConfirmDelete(false)} />
      )}
    </div>
  );
}

function Status({ on, labels = ['Activé', 'Désactivé'] }) {
  return <span className={`badge badge--${on ? 'success' : 'danger'}`}>{on ? labels[0] : labels[1]}</span>;
}

function ApplicationPanel({ app, revealed, onToggleReveal, onDelete }) {
  return (
    <>
      <div className="section-row">
        <h3 className="section-title">Informations sur l&apos;application</h3>
        <button type="button" className="btn btn--outline" onClick={onToggleReveal}>
          <Icon name="eye" size={16} /> {revealed ? 'Masquer les clés api' : 'Afficher les clés api'}
        </button>
      </div>

      <table className="kv-table">
        <tbody>
          <tr>
            <th>Nom de l&apos;application</th>
            <td>{app.name}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{app.description}</td>
          </tr>
          <tr>
            <th>URL du site Web</th>
            <td>{app.website || '—'}</td>
          </tr>
          <tr>
            <th>Compte</th>
            <td>
              {app.balance.country.name} — {app.balance.accountNumberFormatted}
            </td>
          </tr>
          <tr>
            <th>Statut de l&apos;application</th>
            <td>
              <span className={`badge badge--${app.productionMode ? 'success' : 'warning'}`}>
                {app.productionMode ? 'Mode production' : 'Mode test'}
              </span>
            </td>
          </tr>
          <tr>
            <th>Services</th>
            <td>
              {app.services.map((s) => (
                <span key={s} className="badge badge--info">
                  {SERVICE_LABELS[s] ?? s}
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <th>Envoie de Facture de paiement</th>
            <td>
              <Status on={app.invoiceEnabled} />
            </td>
          </tr>
          <tr>
            <th>Clé Principale</th>
            <td>
              <KeyField value={app.keys.master} revealed={revealed} />
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="section-title">Clés API de Test</h3>
      <div className="key-group">
        <KeyRow label="Clé Publique" value={app.keys.test.public} revealed={revealed} />
        <KeyRow label="Clé Privée" value={app.keys.test.private} revealed={revealed} />
        <KeyRow label="Token" value={app.keys.test.token} revealed={revealed} />
      </div>

      <h3 className="section-title">Clés API de Production</h3>
      <div className="key-group">
        <KeyRow label="Clé Publique" value={app.keys.live.public} revealed={revealed} />
        <KeyRow label="Clé Privée" value={app.keys.live.private} revealed={revealed} />
        <KeyRow label="Token" value={app.keys.live.token} revealed={revealed} />
      </div>

      <h3 className="section-title">Méthodes de paiement autorisées</h3>
      {app.paymentMethods.length === 0 ? (
        <span className="muted">Aucune méthode configurée</span>
      ) : (
        groupPaymentMethods(app.paymentMethods).map(({ group, methods }) => (
          <div key={group} className="pm-group">
            <div className="pm-group__label">{group}</div>
            <div className="pm-group__badges">
              {methods.map((m) => (
                <span key={m.id} className="badge badge--info">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        ))
      )}

      <h3 className="section-title">Paiement à la livraison (PAL)</h3>
      <div className="status-row">
        <span>Etat</span>
        <Status on={app.cashOnDeliveryEnabled} />
      </div>

      <h3 className="section-title">Paiement ET Redistribution (PER) / Déboursement</h3>
      <div className="status-row">
        <span>Etat</span>
        <Status on={app.disbursementEnabled} />
      </div>

      <h3 className="section-title">Instant Payment Notification (IPN)</h3>
      <div className="status-row status-row--wide">
        <span>Endpoint IPN</span>
        <span className="status-row__value">{app.ipn.endpoint || '—'}</span>
      </div>
      <div className="status-row">
        <span>Etat</span>
        <Status on={app.ipn.enabled} />
      </div>

      <h3 className="section-title">Actions</h3>
      <div className="action-row">
        <Link to={`/dashboard/api-integration/${app.id}/edit`} className="btn btn--primary">
          Modifier la configuration
        </Link>
        <button type="button" className="btn btn--danger" onClick={onDelete}>
          Supprimer la configuration
        </button>
      </div>
      <Link to="/dashboard/api-integration" className="link-btn">
        Retour à la page précédente
      </Link>
    </>
  );
}

function KeyRow({ label, value, revealed }) {
  return (
    <div className="field field--stacked key-row">
      <span>{label}</span>
      <KeyField value={value} revealed={revealed} />
    </div>
  );
}

// Masked as its prefix (pk_test_, sk_live_…) followed by dots until revealed; "Copier"
// always copies the real key.
function KeyField({ value, revealed }) {
  const [copied, setCopied] = useState(false);
  const prefix = value.match(/^[a-z]+(?:_(?:test|live))?_/)?.[0] ?? '';
  const display = revealed ? value : `${prefix}${'•'.repeat(28)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="key-field">
      <input type="text" readOnly value={display} aria-label={revealed ? undefined : 'Clé masquée'} />
      <button type="button" className="btn btn--ghost btn--sm" onClick={handleCopy}>
        <Icon name="copy" size={14} /> {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  );
}
