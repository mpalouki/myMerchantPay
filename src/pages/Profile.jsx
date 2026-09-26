import { useAuth } from '../context/AuthContext.jsx';

const STATUS_TONE = {
  authorized: 'success',
  pending: 'warning',
  suspended: 'danger',
  rejected: 'danger',
};

function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(
      new Date(isoString),
    );
  } catch {
    return isoString;
  }
}

export default function Profile() {
  const { user, merchant } = useAuth();

  const rows = [
    ['Nom du marchand', merchant?.name ?? '—'],
    ['Identifiant marchand', merchant?.id ?? '—'],
    ['Email du marchand', merchant?.email ?? '—'],
    ['Email de connexion', user?.email ?? '—'],
    ["Secteur d'activité", merchant?.sector ?? '—'],
    ['Pays', merchant?.country ?? '—'],
    ['Date de création', formatDate(merchant?.createdAt)],
  ];

  return (
    <div className="card">
      <div className="card__header">
        <Icon /> Profil du marchand
      </div>
      <div className="card__body">
        <h2 className="section-title">Profil du marchand</h2>
        <table className="kv-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
            <tr>
              <th>Statut</th>
              <td>
                <span className={`badge badge--${STATUS_TONE[merchant?.status] || 'info'}`}>
                  {merchant?.status ?? '—'}
                </span>
              </td>
            </tr>
            <tr>
              <th>Sous surveillance</th>
              <td>
                <span className={`badge badge--${merchant?.underSurveillance ? 'warning' : 'success'}`}>
                  {merchant?.underSurveillance ? 'Oui' : 'Non'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Icon() {
  return <span className="card__header-icon">&#9881;</span>;
}
