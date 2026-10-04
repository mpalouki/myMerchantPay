import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Tabs from '../components/Tabs.jsx';
import Icon from '../components/Icon.jsx';
import DeleteApplicationDialog from '../components/DeleteApplicationDialog.jsx';
import { deleteApplication, getApplications } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { API_INTEGRATION_TABS, formatCreatedAt } from '../data/apiApplications.js';
import { readApiErrors } from '../data/teams.js';

// "Intégrez notre API" (design: "1- List of applications - API Keys.pdf"): the applications
// of the account selected in the dashboard (GET /api/merchant/applications?balance=…), each
// with its own API keys. "Détails" opens ApiApplicationDetails.jsx.

// No developer guide exists yet: set VITE_DEVELOPER_GUIDE_URL once it does.
const DEVELOPER_GUIDE_URL = import.meta.env.VITE_DEVELOPER_GUIDE_URL || '/#developers';

export default function ApiIntegration() {
  // Other pages link back to a given tab, or with a notice, through navigate(…, { state }).
  const { state } = useLocation();
  const [tab, setTab] = useState(state?.tab ?? 'apps');
  const { selectedBalance } = useAccount();

  return (
    <div className="card">
      <div className="card__header">
        <Icon name="settings" size={16} className="card__header-icon" /> Configuration de vos Applications
        {selectedBalance && (
          <div className="card__subheader">
            Compte {selectedBalance.country.name} — {selectedBalance.accountNumberFormatted}. Changez de compte depuis
            le tableau de bord.
          </div>
        )}
      </div>
      <div className="card__body">
        <p className="api-intro">Intégrer notre API au sein de vos applications en générant vos clés API ici.</p>
        <Tabs tabs={API_INTEGRATION_TABS} active={tab} onChange={setTab} />

        <div className="tab-panel">
          {tab === 'apps' && <ApplicationsList initialNotice={state?.notice ?? ''} />}
          {tab === 'clients' && <EmptyPanel label="Aucun client fictif configuré." />}
          {tab === 'data' && <EmptyPanel label="Aucune donnée interne fictive disponible." />}
        </div>
      </div>
    </div>
  );
}

function ApplicationsList({ initialNotice }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { selectedBalance, loading: accountsLoading, error: accountsError } = useAccount();
  const balanceId = selectedBalance?.id;
  // null while loading.
  const [applications, setApplications] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(initialNotice);

  // Reloads when the account selected in the dashboard changes.
  useEffect(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getApplications(token, balanceId)
      .then((data) => {
        if (cancelled) return;
        setApplications(Array.isArray(data) ? data : []);
        setLoadError('');
      })
      .catch((err) => !cancelled && setLoadError(readApiErrors(err).message));
    return () => {
      cancelled = true;
    };
  }, [token, balanceId]);

  const confirmDelete = async () => {
    await deleteApplication(token, toDelete.id);
    setApplications((list) => list.filter((a) => a.id !== toDelete.id));
    setNotice(`L'application « ${toDelete.name} » a été supprimée.`);
    setToDelete(null);
  };

  const noAccount = !accountsLoading && !selectedBalance;
  let placeholder = null;
  if (loadError || accountsError)
    placeholder = `Impossible de charger les applications : ${loadError || readApiErrors(accountsError).message}`;
  else if (noAccount) placeholder = "Aucun compte n'est disponible pour ce marchand.";
  else if (applications === null) placeholder = 'Chargement des applications…';
  else if (applications.length === 0)
    placeholder = 'Aucune application configurée sur ce compte. Configurez-en une pour obtenir vos clés API.';

  return (
    <>
      {notice && (
        <div className="toast-inline api-apps__notice" role="status">
          {notice}
        </div>
      )}

      <div className="table-scroll">
        <table className="data-table data-table--bordered api-apps__table">
          <thead>
            <tr>
              <th>Date de création</th>
              <th>Nom de l&apos;application</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {placeholder ? (
              <tr>
                <td colSpan={4} className="data-table__empty">
                  {placeholder}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{formatCreatedAt(app.createdAt)}</td>
                  <td>{app.name}</td>
                  <td>{app.description || '—'}</td>
                  <td className="api-apps__actions">
                    <Link to={`/dashboard/api-integration/${app.id}`} className="link-btn">
                      Détails
                    </Link>
                    <span aria-hidden="true"> | </span>
                    <button type="button" className="link-btn" onClick={() => setToDelete(app)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="api-apps__buttons">
        <button
          type="button"
          className="btn btn--teal"
          onClick={() => navigate('/dashboard/api-integration/new')}
          disabled={noAccount}
        >
          Configurer une nouvelle application
        </button>
        <a href={DEVELOPER_GUIDE_URL} className="btn btn--danger" target="_blank" rel="noreferrer">
          <Icon name="book" size={16} /> Voir le Guide des développeurs
        </a>
      </div>

      {toDelete && <DeleteApplicationDialog app={toDelete} onConfirm={confirmDelete} onClose={() => setToDelete(null)} />}
    </>
  );
}

function EmptyPanel({ label }) {
  return <div className="empty-panel">{label}</div>;
}
