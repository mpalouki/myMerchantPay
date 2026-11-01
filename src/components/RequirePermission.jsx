import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import usePermissions from '../hooks/usePermissions.js';
import { useAccount } from '../context/AccountContext.jsx';

// Shows the page only when the login has `permission` (on the selected account for an
// account-scoped one), else a "no access" panel — saying when another account allows it.
export default function RequirePermission({ permission, children }) {
  const { can, canAnywhere } = usePermissions();
  const { loading } = useAccount();

  if (loading || can(permission)) return children;

  const elsewhere = canAnywhere(permission);
  return (
    <div className="card no-access">
      <div className="card__body no-access__body">
        <span className="no-access__icon">
          <Icon name="lock" size={26} />
        </span>
        <h2>Accès non autorisé</h2>
        <p>
          {elsewhere
            ? 'Vos rôles ne vous donnent pas accès à cette page pour ce compte. Choisissez un autre compte depuis le tableau de bord.'
            : 'Vos rôles ne vous donnent pas accès à cette page. Demandez l’accès à un administrateur de votre équipe.'}
        </p>
        <Link to="/dashboard/settings" className="btn btn--outline">
          Mon compte
        </Link>
      </div>
    </div>
  );
}
