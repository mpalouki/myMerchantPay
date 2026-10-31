import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaymentLinkForm from '../components/PaymentLinkForm.jsx';
import { createPaymentLink, getApplications } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { emptyForm } from '../data/paymentLinks.js';

// "Créer un lien de paiement": the form on the selected account. A link takes the payments of one
// of the account's applications (its active payment methods), so the account needs one.
export default function PaymentLinkNew() {
  const navigate = useNavigate();
  const { merchant } = useAuth();
  const { selectedBalance: account } = useAccount();
  const [response, setResponse] = useState({ key: null, applications: null, error: '' });
  const applications = response.key === account?.id ? response.applications : null;
  const error = response.key === account?.id ? response.error : '';

  useEffect(() => {
    if (!account) return undefined;
    let cancelled = false;
    getApplications(account.id)
      .then((data) => !cancelled && setResponse({ key: account.id, applications: Array.isArray(data) ? data : [], error: '' }))
      .catch((err) => !cancelled && setResponse({ key: account.id, applications: null, error: err?.message || 'Une erreur est survenue.' }));
    return () => {
      cancelled = true;
    };
  }, [account]);

  const create = async (body) => {
    const link = await createPaymentLink(body);
    navigate(`/dashboard/payment-links/${link.id}`, { state: { created: true } });
  };

  let message = null;
  if (!account) message = 'Chargement de vos comptes…';
  else if (error) message = `Impossible de charger vos applications : ${error}`;
  else if (applications === null) message = 'Chargement…';

  return (
    <div className="card plink-page">
      <div className="card__header">
        <Link to="/dashboard/payment-links" className="plink-page__back" aria-label="Retour aux liens de paiement">
          ←
        </Link>
        Créer un lien de paiement
        {account && (
          <div className="card__subheader">
            Compte {account.country.name} — {account.accountNumberFormatted}. Changez de compte depuis le tableau de bord.
          </div>
        )}
      </div>
      <div className="card__body">
        {message && <p className="reload__empty">{message}</p>}
        {applications?.length === 0 && (
          <div className="plinks__intro">
            <h2>Configurez d’abord une application</h2>
            <p>Un lien de paiement encaisse sur une de vos applications, avec ses moyens de paiement actifs. Ce compte n’en a pas encore.</p>
            <Link to="/dashboard/api-integration/new" className="btn btn--primary">
              Configurer une application
            </Link>
          </div>
        )}
        {applications?.length > 0 && (
          <PaymentLinkForm
            key={account.id}
            initial={emptyForm(applications[0].id)}
            applications={applications}
            currency={account.currency}
            merchantName={merchant?.name ?? 'Votre entreprise'}
            submitLabel="Créer le lien"
            onSubmit={create}
            onCancel={() => navigate('/dashboard/payment-links')}
          />
        )}
      </div>
    </div>
  );
}
