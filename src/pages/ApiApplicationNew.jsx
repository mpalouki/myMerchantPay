import { useNavigate } from 'react-router-dom';
import ApiIntegrationCard from '../components/ApiIntegrationCard.jsx';
import ApplicationForm from '../components/ApplicationForm.jsx';
import { createApplication } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { NEW_APPLICATION } from '../data/apiApplications.js';
import { readApiErrors } from '../data/teams.js';
import { useApplicationOptions } from '../hooks/useApplicationOptions.js';

// Create an application of "Intégrez notre API" (/dashboard/api-integration/new, design:
// "2- Add a Configuration-des-applications.pdf"), on the account selected in the dashboard.
// POST /api/merchant/applications generates its keys; then its details page opens.
export default function ApiApplicationNew() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { selectedBalance, loading: accountsLoading } = useAccount();
  const { options, error } = useApplicationOptions();

  const handleSubmit = async (values) => {
    const app = await createApplication(token, { ...values, balance: selectedBalance.id });
    navigate(`/dashboard/api-integration/${app.id}`, {
      state: { notice: `L'application « ${app.name} » a été créée et ses clés API ont été générées.` },
    });
  };

  let content;
  if (error) content = <div className="empty-panel">Impossible de charger le formulaire : {readApiErrors(error).message}</div>;
  else if (!accountsLoading && !selectedBalance)
    content = <div className="empty-panel">Aucun compte n&apos;est disponible pour ce marchand.</div>;
  else if (!options || !selectedBalance) content = <div className="empty-panel">Chargement…</div>;
  else
    content = (
      <>
        <p className="app-form__account">
          Compte : <strong>{selectedBalance.country.name}</strong> — {selectedBalance.accountNumberFormatted}. Changez
          de compte depuis le tableau de bord.
        </p>
        <ApplicationForm
          initial={NEW_APPLICATION}
          options={options}
          submitLabel="Générer les clés de l'API"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/api-integration')}
        />
      </>
    );

  return <ApiIntegrationCard title="Configuration d'une nouvelle application">{content}</ApiIntegrationCard>;
}
