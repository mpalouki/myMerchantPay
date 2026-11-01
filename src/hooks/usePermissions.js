import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAccount } from '../context/AccountContext.jsx';
import { hasPermission } from '../data/permissions.js';

// can(permission, balanceId?) for the logged-in login; account-scoped permissions are checked on
// the account selected in the dashboard unless another balance id (or null: any account) is given.
export default function usePermissions() {
  const { permissions } = useAuth();
  const { selectedBalance } = useAccount();
  const selectedId = selectedBalance?.id ?? null;

  const can = useCallback(
    (permission, balanceId = selectedId) => hasPermission(permissions, permission, balanceId),
    [permissions, selectedId],
  );

  return { can, canAnywhere: (permission) => hasPermission(permissions, permission, null) };
}
