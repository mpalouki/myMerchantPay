export const PENDING_PAYMENTS = [];

export const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard', path: '/dashboard' },
  { key: 'payment-links', label: 'Liens de paiement', icon: 'link', path: '/dashboard/payment-links' },
  { key: 'api', label: 'Intégrez notre API', icon: 'api', path: '/dashboard/api-integration' },
  { key: 'roles', label: 'Gestion des rôles', icon: 'roles', path: '/dashboard/roles' },
];

export const RELOAD_SUBMENU = [
  { key: 'reload', label: 'Recharger mon compte', path: '/dashboard/reload' },
  { key: 'reload-history', label: 'Mes recharges', path: '/dashboard/reload/history' },
];

export const WITHDRAW_ITEM = {
  key: 'withdraw',
  label: "Retirer de l'argent",
  icon: 'withdraw',
  path: '/dashboard/withdraw',
};

export const TRANSFER_ITEM = {
  key: 'transfer',
  label: 'Transférer entre mes comptes',
  icon: 'disburse',
  path: '/dashboard/transfer',
};
