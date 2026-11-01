export const PENDING_PAYMENTS = [];

export const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard', path: '/dashboard', permission: 'balances.view' },
  { key: 'payment-links', label: 'Liens de paiement', icon: 'link', path: '/dashboard/payment-links', permission: 'payment_links.view' },
  { key: 'api', label: 'Intégrez notre API', icon: 'api', path: '/dashboard/api-integration', permission: 'applications.view' },
  { key: 'team', label: 'Équipe et sécurité', icon: 'users', path: '/dashboard/team', permission: 'team.view' },
];

export const RELOAD_SUBMENU = [
  { key: 'reload', label: 'Recharger mon compte', path: '/dashboard/reload', permission: 'reloads.create' },
  { key: 'reload-history', label: 'Mes recharges', path: '/dashboard/reload/history', permission: 'reloads.view' },
];

export const WITHDRAW_ITEM = {
  key: 'withdraw',
  label: "Retirer de l'argent",
  icon: 'withdraw',
  path: '/dashboard/withdraw',
  permission: 'withdrawals.view',
};

export const TRANSFER_ITEM = {
  key: 'transfer',
  label: 'Transférer entre mes comptes',
  icon: 'disburse',
  path: '/dashboard/transfer',
  permission: 'transfers.view',
};
