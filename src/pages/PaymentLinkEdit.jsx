import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PaymentLinkForm from '../components/PaymentLinkForm.jsx';
import { getPaymentLink, updatePaymentLink } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formFromLink } from '../data/paymentLinks.js';

// "Modifier le lien": same form, same URL; the application and the mode stay. Payments already
// under way keep what they had.
export default function PaymentLinkEdit() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { merchant } = useAuth();
  const [state, setState] = useState({ id: null, link: null, error: '' });
  const link = state.id === linkId ? state.link : null;
  const error = state.id === linkId ? state.error : '';

  useEffect(() => {
    let cancelled = false;
    getPaymentLink(linkId)
      .then((data) => !cancelled && setState({ id: linkId, link: data, error: '' }))
      .catch((err) => !cancelled && setState({ id: linkId, link: null, error: err?.status === 404 ? 'Ce lien est introuvable.' : err?.message || 'Une erreur est survenue.' }));
    return () => {
      cancelled = true;
    };
  }, [linkId]);

  const save = async (body) => {
    await updatePaymentLink(linkId, body);
    navigate(`/dashboard/payment-links/${linkId}`, { state: { notice: 'Le lien a été modifié.' } });
  };

  return (
    <div className="card plink-page">
      <div className="card__header">
        <Link to={`/dashboard/payment-links/${linkId}`} className="plink-page__back" aria-label="Retour au lien">
          ←
        </Link>
        Modifier le lien de paiement
        {link && <div className="card__subheader">{link.url}</div>}
      </div>
      <div className="card__body">
        {!link && <p className="reload__empty">{error || 'Chargement…'}</p>}
        {link && (
          <PaymentLinkForm
            initial={formFromLink(link)}
            currency={link.currency}
            merchantName={merchant?.name ?? 'Votre entreprise'}
            submitLabel="Enregistrer"
            onSubmit={save}
            onCancel={() => navigate(`/dashboard/payment-links/${linkId}`)}
          />
        )}
      </div>
    </div>
  );
}
