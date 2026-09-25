export const TRANSACTION_SERIES = [
  { day: 'Lun', total: 0 },
  { day: 'Mar', total: 0 },
  { day: 'Mer', total: 0 },
  { day: 'Jeu', total: 0 },
  { day: 'Ven', total: 0 },
  { day: 'Sam', total: 0 },
  { day: 'Dim', total: 0 },
  { day: 'Auj.', total: 0 },
]

export const RECENT_TRANSACTIONS = []

export const PENDING_PAYMENTS = []

export const PAYMENT_METHODS_BY_COUNTRY = {
  'Carte Bancaire': ['CARD'],
  Sénégal: ['ORANGE MONEY SENEGAL', 'EXPRESSO SN', 'FREE MONEY SENEGAL', 'WAVE SENEGAL'],
  Bénin: ['MOOV BENIN', 'MTN BENIN'],
  'Burkina Faso': ['ORANGE MONEY BURKINA', 'MOOV BURKINA FASO'],
  "Cote d'ivoire": ['ORANGE MONEY CI', 'MTN CI', 'MOOV CI', 'Wave CI'],
  Mali: ['ORANGE MONEY MALI'],
  Togo: ['T MONEY TOGO', 'MOOV TOGO'],
  Cameroun: [],
}

export const APPLICATION_INFO = {
  name: 'Paytogo',
  description: 'Paytogo for money transfer',
  website: '',
  status: 'Mode test',
  services: ['Payin', 'Payout'],
  invoiceEnabled: true,
}

function maskKey() {
  return '*'.repeat(28)
}

export const API_KEYS = {
  main: maskKey(),
  test: { public: maskKey(), private: maskKey(), token: maskKey() },
  production: { public: maskKey(), private: maskKey(), token: maskKey() },
}

export const BANK_ACCOUNTS = [
  { id: 'eco-ci', label: 'Ecobank (CI059 01056 122506607001 55)' },
  { id: 'uba-ci', label: 'UBA (CI142 01234 987654321001 12)' },
  { id: 'sgb-ci', label: "Société Générale (CI010 01102 555001234001 88)" },
]

export const ZONES = ['UEMOA', 'CEMAC', 'International']

export const RECHARGE_HISTORY = [
  {
    id: 1,
    date: '2026-08-14 10:32',
    phoneOrRib: 'CI059 01056 122506607001 55',
    amount: '250 000 FCFA',
    method: 'Compte bancaire',
    account: 'Solde Principal CI',
    label: 'Approvisionnement août',
    status: 'Validé',
  },
  {
    id: 2,
    date: '2026-08-05 16:04',
    phoneOrRib: '+225 07 00 00 00 00',
    amount: '75 000 FCFA',
    method: 'Mobile Money',
    account: 'Solde Opération CI',
    label: '',
    status: 'En attente',
  },
  {
    id: 3,
    date: '2026-07-28 09:15',
    phoneOrRib: 'CI059 01056 122506607001 55',
    amount: '500 000 FCFA',
    method: 'Compte bancaire',
    account: 'Solde Principal CI',
    label: 'Réapprovisionnement',
    status: 'Rejeté',
  },
]

export const SIDEBAR_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard', path: '/dashboard' },
  { key: 'send', label: "Envoyer de l'argent", icon: 'send', path: '/dashboard/send-money' },
  { key: 'request', label: 'Demander un paiement', icon: 'request', path: '/dashboard/request-payment' },
  { key: 'collect', label: 'Collecter des paiements', icon: 'collect', path: '/dashboard/collect-payments' },
  { key: 'disburse', label: 'Débourser des paiements', icon: 'disburse', path: '/dashboard/disburse-payments' },
  { key: 'api', label: 'Intégrez notre API', icon: 'api', path: '/dashboard/api-integration' },
  { key: 'roles', label: 'Gestion des rôles', icon: 'roles', path: '/dashboard/roles' },
]

export const RECHARGE_SUBMENU = [
  { key: 'recharge', label: 'Recharger mon compte', path: '/dashboard/recharge' },
  { key: 'recharge-history', label: 'Mes recharges', path: '/dashboard/recharge/history' },
]

export const WITHDRAW_ITEM = {
  key: 'withdraw',
  label: "Retirer de l'argent",
  icon: 'withdraw',
  path: '/dashboard/withdraw',
}
