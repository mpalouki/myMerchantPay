import { useState } from 'react';
import Tabs from '../components/Tabs.jsx';
import Icon from '../components/Icon.jsx';
import { APPLICATION_INFO, API_KEYS, PAYMENT_METHODS_BY_COUNTRY } from '../data/mockData.js';

const TABS = [
  { key: 'apps', label: 'Applications' },
  { key: 'clients', label: 'Clients fictifs' },
  { key: 'data', label: 'Données internes fictives' },
];

const FAKE_KEY = 'fake_demo_7f8a7d6c0b4e3e0d1c0c9a8f5e6d5c4f';

export default function ApiIntegration() {
  const [tab, setTab] = useState('apps');
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="card">
      <div className="card__header">Configuration de vos Applications</div>
      <div className="card__body">
        <p className="muted">
          Intégrer notre API au sein de vos applications en générant vos clés API ici.
        </p>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />

        <div className="tab-panel">
          {tab === 'apps' && (
            <ApplicationsPanel revealed={revealed} onToggleReveal={() => setRevealed((v) => !v)} />
          )}
          {tab === 'clients' && <EmptyPanel label="Aucun client fictif configuré." />}
          {tab === 'data' && <EmptyPanel label="Aucune donnée interne fictive disponible." />}
        </div>
      </div>
    </div>
  );
}

function ApplicationsPanel({ revealed, onToggleReveal }) {
  return (
    <>
      <div className="section-row">
        <h3 className="section-title">Informations sur l'application</h3>
        <button type="button" className="btn btn--outline" onClick={onToggleReveal}>
          <Icon name="eye" size={16} /> {revealed ? 'Masquer les clés api' : 'Afficher les clés api'}
        </button>
      </div>

      <table className="kv-table">
        <tbody>
          <tr>
            <th>Nom de l'application</th>
            <td>{APPLICATION_INFO.name}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{APPLICATION_INFO.description}</td>
          </tr>
          <tr>
            <th>URL du site Web</th>
            <td>{APPLICATION_INFO.website || '—'}</td>
          </tr>
          <tr>
            <th>Statut de l'application</th>
            <td>
              <span className="badge badge--danger">{APPLICATION_INFO.status}</span>
            </td>
          </tr>
          <tr>
            <th>Services</th>
            <td>
              {APPLICATION_INFO.services.map((s) => (
                <span key={s} className="badge badge--info">
                  {s}
                </span>
              ))}
            </td>
          </tr>
          <tr>
            <th>Envoie de Facture de paiement</th>
            <td>
              <span className="badge badge--success">
                {APPLICATION_INFO.invoiceEnabled ? 'Activé' : 'Désactivé'}
              </span>
            </td>
          </tr>
          <tr>
            <th>Clé Principale</th>
            <td>
              <KeyField value={API_KEYS.main} revealed={revealed} />
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="section-title">Clés API de Test</h3>
      <div className="key-group">
        <KeyRow label="Clé Publique" value={API_KEYS.test.public} revealed={revealed} />
        <KeyRow label="Clé Privée" value={API_KEYS.test.private} revealed={revealed} />
        <KeyRow label="Token" value={API_KEYS.test.token} revealed={revealed} />
      </div>

      <h3 className="section-title">Clés API de Production</h3>
      <div className="key-group">
        <KeyRow label="Clé Publique" value={API_KEYS.production.public} revealed={revealed} />
        <KeyRow label="Clé Privée" value={API_KEYS.production.private} revealed={revealed} />
        <KeyRow label="Token" value={API_KEYS.production.token} revealed={revealed} />
      </div>

      <h3 className="section-title">Méthodes de paiement autorisées</h3>
      {Object.entries(PAYMENT_METHODS_BY_COUNTRY).map(([country, methods]) => (
        <div key={country} className="pm-group">
          <div className="pm-group__label">{country}</div>
          <div className="pm-group__badges">
            {methods.length === 0 ? (
              <span className="muted">Aucune méthode configurée</span>
            ) : (
              methods.map((m) => (
                <span key={m} className="badge badge--info">
                  {m}
                </span>
              ))
            )}
          </div>
        </div>
      ))}

      <h3 className="section-title">Paiement à la livraison (PAL)</h3>
      <div className="status-row">
        <span>Etat</span>
        <span className="badge badge--danger">Désactivé</span>
      </div>

      <h3 className="section-title">Paiement ET Redistribution (PER) / Déboursement</h3>
      <div className="status-row">
        <span>Etat</span>
        <span className="badge badge--success">Activé</span>
      </div>

      <h3 className="section-title">Instant Payment Notification (IPN)</h3>
      <div className="status-row">
        <span>Endpoint IPN</span>
      </div>
      <div className="status-row">
        <span>Etat</span>
        <span className="badge badge--danger">Désactivé</span>
      </div>

      <h3 className="section-title">Actions</h3>
      <div className="action-row">
        <button type="button" className="btn btn--primary">
          Modifier la configuration
        </button>
        <button type="button" className="btn btn--danger">
          Supprimer la configuration
        </button>
      </div>
      <a href="#back" className="link-btn">
        Retour à la page précédente
      </a>
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

function KeyField({ value, revealed }) {
  const [copied, setCopied] = useState(false);
  const display = revealed ? FAKE_KEY : value;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FAKE_KEY);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="key-field">
      <input type="text" readOnly value={display} />
      <button type="button" className="btn btn--ghost btn--sm" onClick={handleCopy}>
        <Icon name="copy" size={14} /> {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  );
}

function EmptyPanel({ label }) {
  return <div className="empty-panel">{label}</div>;
}
