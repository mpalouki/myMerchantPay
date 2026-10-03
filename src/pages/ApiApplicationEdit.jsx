import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ApiIntegrationCard from '../components/ApiIntegrationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';
import { getApplication, updateApplication } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { readApiErrors } from '../data/teams.js';
import { useApplicationOptions } from '../hooks/useApplicationOptions.js';

// Edit an application of "Intégrez notre API" (/dashboard/api-integration/:appId/edit,
// design: "3- Edit Configuration-des-applications.pdf"), opened by "Modifier la
// configuration" on its details page. PUT /api/merchant/applications/{id}; keys are kept.
export default function ApiApplicationEdit() {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { options, error: optionsError } = useApplicationOptions();
  // null while loading, false when it can't be loaded.
  const [app, setApp] = useState(null);
  const [loadError, setLoadError] = useState('');
  const detailsPath = `/dashboard/api-integration/${appId}`;

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

  const handleSubmit = async (values) => {
    const updated = await updateApplication(token, appId, values);
    navigate(detailsPath, { state: { notice: `La configuration de « ${updated.name} » a été mise à jour.` } });
  };

  let content;
  if (app === false || optionsError)
    content = (
      <div className="empty-panel">
        {loadError || optionsError
          ? `Impossible de charger l'application : ${loadError || readApiErrors(optionsError).message}`
          : 'Cette application est introuvable.'}{' '}
        <Link to="/dashboard/api-integration" className="link-btn">
          Retour à la liste des applications
        </Link>
      </div>
    );
  else if (!app || !options) content = <div className="empty-panel">Chargement…</div>;
  else
    content = (
      <ApplicationForm
        initial={app}
        options={options}
        submitLabel="Appliquer les modifications"
        onSubmit={handleSubmit}
        onCancel={() => navigate(detailsPath)}
      />
    );

  return <ApiIntegrationCard title="Modifier la configuration de l'application">{content}</ApiIntegrationCard>;
}
